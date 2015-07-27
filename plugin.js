/**
 * Plugin.js file, set configs, routes, hooks and events here
 *
 * see http://wejs.org/docs/we/extend.plugin
 */
module.exports = function loadPlugin(projectPath, Plugin) {
  var plugin = new Plugin(__dirname);
  // set plugin configs
  // plugin.setConfigs({
  // });
  // ser plugin routes
  // plugin.setRoutes({
  // });

  plugin.setResource({
    parent: 'conference',
    name: 'cfwork',
    namespace: '/user/:userId([0-9]+)'
  });

  plugin.setResource({
    parent: 'conference',
    namespace: '/admin',

    name: 'cfwork',
    namePrefix: 'admin.',

    templateFolderPrefix: 'conference/admin/',
    findLayout: 'conferenceAdmin',
    findOneLayout: 'conferenceAdmin',
    editLayout: 'conferenceAdmin',
    createLayout: 'conferenceAdmin',
    deleteLayout: 'conferenceAdmin',
    findPermission: 'manage_conference',
    editPermission: 'manage_conference',
    deletePermission: 'manage_conference',
    createPermisson: 'manage_conference'
  });

  plugin.setRoutes({
    'get /conference/:conferenceId([0-9]+)/works': {
      name          :  'cfwork.accepted',
      titleHandler  : 'i18n',
      titleI18n: 'cfwork.accepted',
      controller    : 'cfwork',
      action        : 'find',
      model         : 'cfwork',
      permission    : 'find_conference',
      template      : 'cfwork/accepted',
      onlyAccepted  : true
    },
    'get /conference/:conferenceId([0-9]+)/admin/cfwork/:cfworkId([0-9]+)/change-status/:status': {
      name          :  'cfwork.changeStatus',
      titleHandler  : 'i18n',
      titleI18n: 'cfwork.changeStatus',
      controller    : 'cfwork',
      action        : 'changeStatus',
      model         : 'cfwork',
      permission    : 'manage_conference'
    }
  });

  return plugin;
};