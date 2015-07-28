/**
 * CF work Model
 *
 * @module      :: Model
 * @description :: cfwork model
 *
 */

module.exports = function Model(we) {
  // set sequelize model define and options
  var model = {
    definition: {
      title: { type: we.db.Sequelize.STRING(1500), allowNull: false },
      author: { type: we.db.Sequelize.STRING(1500), allowNull: false },

      organization: { type: we.db.Sequelize.STRING(1500), allowNull: false },

      partners: {
        type: we.db.Sequelize.TEXT,
        formFieldType: 'html',
        formFieldHeight: 150,
      },
      objective: {
        type: we.db.Sequelize.TEXT,
        formFieldType: 'html',
        formFieldHeight: 200,
        allowNull: false
      },
      context: {
        type: we.db.Sequelize.TEXT,
        formFieldType: 'html',
        formFieldHeight: 150,
      },
      achievements: {
        type: we.db.Sequelize.TEXT,
        formFieldType: 'html',
        formFieldHeight: 200,
      },
      prospects: {
        type: we.db.Sequelize.TEXT,
        formFieldType: 'html',
        formFieldHeight: 150,
        allowNull: false
      },
      status: {
        type: we.db.Sequelize.STRING(10),
        defaultValue: 'send',
        formFieldType: null,
        fieldOptions: {
          send: 'conference.cfsession.status.send',
          'in_review': 'conference.cfsession.status.in_review',
          'need_update': 'conference.cfsession.status.need_update',
          accepted: 'conference.cfsession.status.accepted',
          discarded: 'conference.cfsession.status.discarded'
        }
      },

      conferenceId: { type: we.db.Sequelize.BIGINT, formFieldType: null }
    },
    associations: {
      creator: { type: 'belongsTo', model: 'user' }
    },
    options: {
      titleField: 'title',
      fileFields: {
        file: { formFieldMultiple: false }
      }
    }
  }

  return model;
}