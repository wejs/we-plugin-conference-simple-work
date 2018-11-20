/**
 * Event simple work plugin main file
 *
 * see http://wejs.org/docs/we/extend.plugin
 */
module.exports = function (projectPath, Plugin) {
  const plugin = new Plugin(__dirname);

  plugin.setConfigs({

  });

  plugin.setResource({
    parent: 'event',
    name: 'cfwork',
    namespace: '/user/:userId([0-9]+)'
  });

  plugin.setResource({
    parent: 'event',
    namespace: '/admin',
    name: 'cfwork',
    namePrefix: 'admin.',
    templateFolderPrefix: 'event/admin/',
    layoutName: 'eventAdmin'
  });

  plugin.setRoutes({
    'get /event/:eventId([0-9]+)/works': {
      name          :  'cfwork.accepted',
      titleHandler  : 'i18n',
      titleI18n: 'cfwork.accepted',
      controller    : 'cfwork',
      action        : 'find',
      model         : 'cfwork',
      permission    : 'find_event',
      template      : 'cfwork/accepted',
      onlyAccepted  : true
    },

    'get /event/:eventId([0-9]+)/admin/cfwork-exports.csv': {
      layoutName    : 'eventAdmin',
      controller    : 'cfwork',
      action        : 'exportAll',
      model         : 'cfwork',
      permission    : 'manage_event',
      responseType  : 'cvs'
    },

    'get /event/:eventId([0-9]+)/admin/cfwork/:cfworkId([0-9]+)/change-status/:status': {
      name          :  'cfwork.changeStatus',
      titleHandler  : 'i18n',
      titleI18n: 'cfwork.changeStatus',
      controller    : 'cfwork',
      action        : 'changeStatus',
      model         : 'cfwork',
      permission    : 'manage_event'
    }
  });

  return plugin;
};