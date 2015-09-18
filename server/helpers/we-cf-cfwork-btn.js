/**
 * Helper to render cfwork registration
 *
 * usage:  {{we-cf-cfwork-btn event=event}}
 */
module.exports = function(we) {
  return function cfWorkBTNHelper(opts) {
    if (
      !opts.hash.event ||
      opts.hash.event.sendWorkStatus != 'open'
    ) {
      return '';
    }

    var __ = (opts.hash.__ || we.i18n.__);

    var ctx = {
      btnClass: (opts.hash.class || ' btn btn-default ') + ' btn-cfwork ',
      href: '/login?redirectTo=/event/'+opts.hash.event.id,
      text: __('cfwork.btn.text'),
      event: opts.hash.event,
      userId: opts.hash.userId
    };

    if (opts.hash.userId)
      ctx.href =  '/event/'+opts.hash.event.id+'/user/'+opts.hash.userId+'/cfwork';

    return new we.hbs.SafeString(we.view.renderTemplate(
      'cfwork/we-cf-cfwork-btn',
      (opts.hash.theme || this.theme),
      ctx
    ));
  }
}