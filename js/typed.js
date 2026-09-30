/* ============================================
   TYPED CONTROLLER — Hero role animation
   ============================================
   Cycles through the role strings defined in App.config.roles.

   Exposed as: window.AyushLink.typed
   ============================================ */
(function (App) {
  'use strict';

  /**
   * Start the Typed.js instance on #typed-output.
   * No-ops when the Typed library failed to load.
   *
   * @returns {void}
   */
  function init() {
    if (typeof Typed === 'undefined') return;

    new Typed('#typed-output', {
      strings: App.config.roles,
      typeSpeed: 55,
      backSpeed: 30,
      backDelay: 2000,
      startDelay: 600,
      loop: true,
      showCursor: true,
      cursorChar: '|',
      smartBackspace: true
    });
  }

  App.typed = { init: init };

})(window.AyushLink = window.AyushLink || {});
