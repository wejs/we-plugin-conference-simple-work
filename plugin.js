/**
 * Event simple work plugin main file
 *
 * see http://wejs.org/docs/we/extend.plugin
 */
module.exports = function (projectPath, Plugin) {
  const plugin = new Plugin(__dirname);

  plugin.setConfigs({
    emailTypes: {
      CFAcceptWorkCreator: {
        label: 'E-mail de aviso de trabalho aprovado',
        defaultSubject: `O seu trabalho foi aprovado no evento {{eventTitle}}`,
        defaultHTML: `<p>Prezado autor,</p>

<p>Informamos que o trabalho <strong>{{cfwordTitle}}</strong> foi aprovado para apresentação no {{eventTitle}}</p>

<p>Lista com todos os trabalhos aprovados: {{cfworksUrl}}</p>

<p>Atenciosamente,<br>
Comitê organizador<br>
{{eventTitle}}<br>
{{siteUrl}}/event/{{eventId}}
</p>`,
        defaultText: `Prezado autor,

Informamos que o trabalho "{{cfwordTitle}}" foi aprovado para apresentação no {{eventTitle}}

Lista com todos os trabalhos aprovados: {{cfworksUrl}}


Atenciosamente,
Comitê organizador
{{eventTitle}}
{{siteUrl}}/event/{{eventId}}`,
        templateVariables: {
          name: {
            example: 'Alberto Souza',
            description: 'Nome da pessoa ou organização que está entrando em contato'
          },
          email: {
            example: 'contact@linkysysytems.com',
            description: 'Email da pessoa ou organização que está entrando em contato'
          },
          eventId: {
            example: '01',
            description: 'Id do evento / seminário'
          },
          eventTitle: {
            example: 'Seminário saúde e cultura',
            description: 'Título do evento / seminário'
          },
          eventAbbreviation: {
            example: '#saúdecultura',
            description: 'Abreviação ou sigla do nome do evento'
          },
          cfworkTitle: {
            example: 'Artigo, saúde e educação',
            description: 'Título do trabalho'
          },
          cfworksUrl: {
            example: 'http://...',
            description: 'Url para os trabalhos aceitos'
          },
          cfworkUrl: {
            example: 'http://...',
            description: 'Url para o trabalho'
          },
          cfworkAdminUrl: {
            example: 'http://...',
            description: 'Url para o trabalho no admin do evento'
          },
          siteName: {
            example: 'Site Name',
            description: 'Nome deste site'
          },
          siteUrl: {
            example: '/#example',
            description: 'Endereço deste site'
          }
        }
      },
      CFNewWorkAdminSuccess: {
        label: 'E-mail de aviso de novo trabalho enviado para os gerentes do evento',
        defaultSubject: `Novo trabalho enviado no evento {{eventTitle}}`,
        defaultHTML: `<p>Prezado organizador da conferência {{eventTitle}},</p>
<p>O trabalho {{cfworkTitle}} foi enviado.</p>

<p>Para visualizar o trabalho clique no link: <a href="{{siteUrl}}{{cfworkAdminUrl}}">{{siteUrl}}{{cfworkAdminUrl}}
  </a>
</p>`,
        defaultText: `Prezado organizador da conferência {{eventTitle}},

O trabalho {{cfworkTitle}} foi enviado.

Para visualizar o trabalho clique no link: {{siteUrl}}{{cfworkAdminUrl}}`,
        templateVariables: {
          name: {
            example: 'Alberto Souza',
            description: 'Nome da pessoa ou organização que está entrando em contato'
          },
          email: {
            example: 'contact@linkysysytems.com',
            description: 'Email da pessoa ou organização que está entrando em contato'
          },
          eventId: {
            example: '01',
            description: 'Id do evento / seminário'
          },
          eventTitle: {
            example: 'Seminário saúde e cultura',
            description: 'Título do evento / seminário'
          },
          eventAbbreviation: {
            example: '#saúdecultura',
            description: 'Abreviação ou sigla do nome do evento'
          },
          cfworkTitle: {
            example: 'Artigo, saúde e educação',
            description: 'Título do trabalho'
          },
          cfworkUrl: {
            example: 'http://...',
            description: 'Url para o trabalho'
          },
          cfworkAdminUrl: {
            example: 'http://...',
            description: 'Url para o trabalho no admin do evento'
          },
          siteName: {
            example: 'Site Name',
            description: 'Nome deste site'
          },
          siteUrl: {
            example: '/#example',
            description: 'Endereço deste site'
          }
        }
      },
      CFNewWorkCreatorSuccess: {
        label: 'E-mail de aviso trabalho enviado para o autor',
        defaultSubject: `Trabalho enviado no evento {{eventTitle}}`,
        defaultHTML: `<p>Prezado autor,</p>

<p>Informamos que seu trabalho {{cfworkTitle}} foi recebido e será avaliado pela Comissão Científica. Se o trabalho for aprovado, em breve você receberá um e-mail de confirmação.<br>
No site constará a lista de todos os trabalhos aprovados.
</p>

<p>Bom evento!<br>
Comissão Organizadora<br>
{{eventTitle}}
</p>`,
        defaultText: `Prezado autor,

Informamos que seu trabalho "{{cfworkTitle}}" foi recebido e será avaliado pela Comissão Científica. Se o trabalho for aprovado, em breve você receberá um e-mail de confirmação.

No site constará a lista de todos os trabalhos aprovados.


Bom evento!
Comissão Organizadora
{{eventTitle}}`,
        templateVariables: {
          name: {
            example: 'Alberto Souza',
            description: 'Nome da pessoa ou organização que está entrando em contato'
          },
          email: {
            example: 'contact@linkysysytems.com',
            description: 'Email da pessoa ou organização que está entrando em contato'
          },
          eventId: {
            example: '01',
            description: 'Id do evento / seminário'
          },
          eventTitle: {
            example: 'Seminário saúde e cultura',
            description: 'Título do evento / seminário'
          },
          eventAbbreviation: {
            example: '#saúdecultura',
            description: 'Abreviação ou sigla do nome do evento'
          },
          cfworkTitle: {
            example: 'Artigo, saúde e educação',
            description: 'Título do trabalho'
          },
          cfworkUrl: {
            example: 'http://...',
            description: 'Url para o trabalho'
          },
          cfworkAdminUrl: {
            example: 'http://...',
            description: 'Url para o trabalho no admin do evento'
          },
          siteName: {
            example: 'Site Name',
            description: 'Nome deste site'
          },
          siteUrl: {
            example: '/#example',
            description: 'Endereço deste site'
          }
        }
      }
    }
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