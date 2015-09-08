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
        allowNull: false
      },
      achievements: {
        type: we.db.Sequelize.TEXT,
        formFieldType: 'html',
        formFieldHeight: 200,
        allowNull: false
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
          send: 'event.cfsession.status.send',
          'in_review': 'event.cfsession.status.in_review',
          'need_update': 'event.cfsession.status.need_update',
          accepted: 'event.cfsession.status.accepted',
          discarded: 'event.cfsession.status.discarded'
        }
      },

      eventId: { type: we.db.Sequelize.BIGINT, formFieldType: null }
    },
    associations: {
      creator: { type: 'belongsTo', model: 'user' }
    },
    options: {
      titleField: 'title',
      fileFields: {
        file: {
          formFieldMultiple: false,
          allowNull: false
        }
      }
    }
  }

  return model;
}