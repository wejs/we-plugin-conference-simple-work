module.exports = {
  find(req, res, next) {
    if (req.params.userId) {
      if (!req.isAuthenticated()) return res.forbidden();
      res.locals.query.where.creatorId = req.user.id;
    } else if (res.locals.onlyAccepted) {
      res.locals.query.where.status = 'accepted';
    }

    res.locals.query.where.eventId = res.locals.event.id;

    return res.locals.Model
    .findAndCountAll(res.locals.query)
    .then(function afterFindAndContAll(record) {
      if (!record) return next();

      res.locals.metadata.count = record.count;
      res.locals.data = record.rows;

      return res.ok();
    })
    .catch(res.queryError);
  },
  create(req, res) {
    if (!req.isAuthenticated()) return res.forbidden();
    if (!res.locals.data) res.locals.data = {};

    const we = req.we;

    req.body.eventId = res.locals.event.id;

    if (req.method === 'POST') {
      if (req.isAuthenticated()) req.body.creatorId = req.user.id;
      // set temp record for use in validation errors
      res.locals.data = req.query;
      we.utils._.merge(res.locals.record, req.body);

      req.body.status = 'send';

      return res.locals.Model
      .create(req.body)
      .then(function afterCreate(record) {
        res.locals.data = record;
        const user = req.user;

        let appName = we.config.appName;

        if (we.systemSettings && we.systemSettings.siteName) {
          appName = we.systemSettings.siteName;
        }

        let templateVariables = {
          name: user.displayName || user.fullName,
          email: user.email,

          eventId: res.locals.event.id,
          eventTitle: res.locals.event.title,
          eventAbbreviation: res.locals.event.abbreviation,

          siteName: appName,
          siteUrl: we.config.hostname,
          cfworkTitle: record.title,

          cfworkUrl: we.router.urlTo(
            'cfwork.findOne', [
              res.locals.event.id,
              record.creatorId,
              record.id
            ], we
          ),
          cfworkAdminUrl: we.router.urlTo(
            'admin.cfwork.findOne', [
              res.locals.event.id,
              record.id
            ], we
          ),

          user: user,
          event: res.locals.event,
          cfwork: record
        };

        // - send emails
        we.email.sendEmail('CFNewWorkCreatorSuccess', {
          email: req.user.email,
          replyTo: res.locals.event.title + ' <'+res.locals.event.email+'>'
        }, templateVariables, function (err , emailResp){
          if (err) we.log.error(err, emailResp);
        });

        we.email.sendEmail('CFNewWorkAdminSuccess', {
          email: res.locals.event.registrationManagerEmail,
          replyTo: res.locals.event.title + ' <'+res.locals.event.email+'>'
        }, templateVariables, function (err, emailResp) {
          if (err) return we.log.error(err, emailResp);
        });

        // continue with response ...
        return res.created();
      })
      .catch(res.queryError);
    } else {
      res.locals.data = req.query;
      res.ok();
    }
  },
  changeStatus(req, res) {
    const we = req.getWe();

    we.db.models.cfwork
    .findOne({
      where: {
        id: req.params.cfworkId,
        eventId: res.locals.event.id
      }
    })
    .then(function (record) {
      if (!record) return res.notFound();

      res.locals.data = record;

      req.paramsArray.push(record.id);

      if (!res.locals.redirectTo) {
        res.locals.redirectTo = we.router.urlTo('admin.cfwork.find', req.paramsArray);
      }

      if (record.status == req.params.status)
        return res.redirect(res.locals.redirectTo);

      return record.updateAttributes({
        status: req.params.status
      })
      .then(function() {
        if (req.params.status !='accepted') return res.updated();

        let user = req.user.toJSON();

        let appName = we.config.appName;

        if (we.systemSettings && we.systemSettings.siteName) {
          appName = we.systemSettings.siteName;
        }

        let templateVariables = {
          name: user.displayName || user.fullName,
          email: user.email,

          eventId: res.locals.event.id,
          eventTitle: res.locals.event.title,
          eventAbbreviation: res.locals.event.abbreviation,

          siteName: appName,
          siteUrl: we.config.hostname,
          cfworkTitle: record.title,
          cfworksUrl: we.config.hostname + we.router.urlTo(
            'cfwork.accepted', [ res.locals.event.id ], we
          ),
          cfworkUrl: we.config.hostname + we.router.urlTo(
            'cfwork.findOne', [
              res.locals.event.id,
              record.creatorId,
              record.id
            ], we
          ),
          cfworkAdminUrl: we.config.hostname + we.router.urlTo(
            'admin.cfwork.findOne', [
              res.locals.event.id,
              record.id
            ], we
          ),

          user: user,
          event: res.locals.event,
          cfwork: record
        };

        we.email.sendEmail('CFAcceptWorkCreator', {
          email: req.user.email,
          replyTo: res.locals.event.title + ' <'+res.locals.event.email+'>'
        }, templateVariables, function (err, emailResp){
          if (err) we.log.error(err, emailResp);
        });

        res.updated();
      })
    })
    .catch(res.queryError);
  },
  exportAll(req, res) {
    if (!res.locals.event) return res.notFound();

    res.locals.Model
    .findAll({
      where: { eventId: res.locals.event.id },
      include: [{ all: true, required: false }]
    })
    .then(function (r) {
      if (!r) return res.notFound();

      let cfworks = r.map(function (r) {
        r.displayName = r.creator.displayName;
        if (r.file[0]) {
          r.fileUrl = r.file[0].urls.original
        }

        return r;
      });

      req.we.csv.stringify(cfworks, {
        header: true,
        quotedString: true,
        columns: {
          id: 'id',
          title: 'title',
          author: 'author',
          organization: 'organization',
          partners: 'partners',
          objective: 'objective',
          context: 'context',
          achievements: 'achievements',
          prospects: 'prospects',
          status: 'status',
          eventId: 'eventId',
          displayName: 'displayName',
          fileUrl: 'fileUrl'
        }
      }, function (err, data) {
        if (err) return res.serverError(err);
        let fileName = 'cfworks-export-' +
          res.locals.event.id + '-'+
          new Date().getTime() + '.csv';

        res.setHeader('Content-disposition', 'attachment; filename='+fileName);
        res.set('Content-Type', 'application/octet-stream');
        res.send(data);
      });
    })
    .catch(res.queryError);
  }
};