module.exports = {
  find: function findAll(req, res, next) {
    if (req.params.userId) {
      if (!req.isAuthenticated()) return res.forbidden();
      res.locals.query.where.creatorId = req.user.id;
    } else if (res.locals.onlyAccepted) {
      res.locals.query.where.status = 'accepted';
    }

    return res.locals.Model.findAndCountAll(res.locals.query)
    .then(function (record) {
      if (!record) return next();

      res.locals.metadata.count = record.count;
      res.locals.record = record.rows;

      return res.ok();
    });
  },
  create: function create(req, res) {
    if (!req.isAuthenticated()) return res.forbidden();
    if (!res.locals.record) res.locals.record = {};

    var we = req.getWe();

    if (req.method === 'POST') {
      if (req.isAuthenticated()) req.body.creatorId = req.user.id;
      // set temp record for use in validation errors
      res.locals.record = req.query;
      we.utils._.merge(res.locals.record, req.body);

      req.body.status = 'send';

      return res.locals.Model.create(req.body)
      .then(function (record) {
        res.locals.record = record;

        var user = req.user.toJSON();
        var templateVariables = {
          user: user,
          conference: res.locals.conference,
          cfwork: record,
          site: {
            name: we.config.appName,
            url: we.config.hostname
          },
          cfworkUrl: we.router.urlTo(
            'cfwork.findOne', [
              res.locals.conference.id,
              record.creatorId,
              record.id
            ], we
          ),
          cfworkAdminUrl: we.router.urlTo(
            'admin.cfwork.findOne', [
              res.locals.conference.id,
              record.id
            ], we
          ),
        };

        we.utils.async.parallel([
          function notifyCreator(done) {
            var options = {
              email: req.user.email,
              subject: req.__('conference.cfwork.success.email') + ' - ' + res.locals.conference.abbreviation,
              from: res.locals.conference.title + ' <'+res.locals.conference.email+'>'
            };
            we.email.sendEmail('CFNewWorkCreatorSuccess', options, templateVariables, function (err , emailResp){
              if (err) return done(err);
              return done(null, emailResp);
            });
          },
          function notifyCFAdmin(done) {
            var options = {
              email: res.locals.conference.registrationManagerEmail,
              subject: req.__('conference.cfwork.success.admin.email') + ' - ' + res.locals.conference.abbreviation,
              from: res.locals.conference.title + ' <'+res.locals.conference.email+'>'
            };
            we.email.sendEmail('CFNewWorkAdminSuccess', options, templateVariables, function (err, emailResp){
              if (err) return done(err);
              return done(null, emailResp);
            });
          },
        ], function(err){
          if (err) return res.serverError(err);
          res.created();
        });
      }).catch(res.queryError);
    } else {
      res.locals.record = req.query;
      res.ok();
    }
  },
  changeStatus: function changeStatus(req, res) {
    var we = req.getWe();

    we.db.models.cfwork.findById(req.params.cfworkId)
    .then(function (record){
      if (!record) return res.notFound();

      res.locals.record = record;

      req.paramsArray.push(record.id);

      if (!res.locals.redirectTo) {
        res.locals.redirectTo = we.router.urlTo('admin.cfwork.find', req.paramsArray);
      }

      if (record.status == req.params.status)
        return res.redirect(res.locals.redirectTo);

      record.updateAttributes({
        status: req.params.status
      }).then(function() {
        if (req.params.status !='accepted') return res.updated();

        var user = req.user.toJSON();
        var templateVariables = {
          user: user,
          conference: res.locals.conference,
          cfwork: record,
          site: {
            name: we.config.appName,
            url: we.config.hostname
          },
          cfworksUrl: we.config.hostname + we.router.urlTo(
            'cfwork.accepted', [ res.locals.conference.id ], we
          ),
          cfworkUrl: we.config.hostname + we.router.urlTo(
            'cfwork.findOne', [
              res.locals.conference.id,
              record.creatorId,
              record.id
            ], we
          ),
          cfworkAdminUrl: we.config.hostname + we.router.urlTo(
            'admin.cfwork.findOne', [
              res.locals.conference.id,
              record.id
            ], we
          ),
        };

        var options = {
          email: req.user.email,
          subject: req.__('conference.cfwork.accepted.email') + ' - ' + res.locals.conference.abbreviation,
          from: res.locals.conference.title + ' <'+res.locals.conference.email+'>'
        };
        we.email.sendEmail('CFAcceptWorkCreator', options, templateVariables, function (err){
          if (err) return res.serverError(err);
          return res.updated();
        });
      }).catch(res.queryError);

    }).catch(res.queryError);
  }
};