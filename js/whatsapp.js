/* ============================================
   WHATSAPP CONTROLLER — Pre-filled message
   ============================================
   Rewrites the WhatsApp link's href with a pre-written intro pulled from
   App.config, so the number and message live in exactly one place.

   Exposed as: window.AyushLink.whatsapp
   ============================================ */
(function (App) {
  'use strict';

  /**
   * Point the WhatsApp button at wa.me with the configured message.
   *
   * @returns {void}
   */
  function init() {
    var waBtn = App.utils.$('#whatsappBtn');
    if (!waBtn) return;

    waBtn.href = 'https://wa.me/' + App.config.whatsapp.number +
      '?text=' + encodeURIComponent(App.config.whatsapp.message);
  }

  App.whatsapp = { init: init };

})(window.AyushLink = window.AyushLink || {});
