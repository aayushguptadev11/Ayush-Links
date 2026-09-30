/* ============================================
   BOOT — Composition root
   ============================================
   This file contains no feature logic. It only starts the controllers in the
   order they depend on.

   Load order (index.html) must stay:
     config.js → utils.js → controllers… → init.js

   Exposed as: the side effect of calling window.AyushLink.* init methods.
   ============================================ */
(function (App) {
  'use strict';

  /**
   * Start every controller.
   *
   * @returns {void}
   */
  function boot() {
    App.theme.init();
    App.email.init();
    App.whatsapp.init();
    App.entrance.runEntrance();
    App.typed.init();
    App.interactions.init();
    App.touch.init();
    App.stars.init();

    // Release touch canvas resources on unload.
    window.addEventListener('beforeunload', function () {
      App.touch.destroy();
    });
  }

  /*
   * Scripts sit at the end of <body>, so the DOM is already parsed and boot
   * runs immediately — the same timing as before this refactor. The
   * DOMContentLoaded fallback only matters if the scripts are later moved into
   * <head>, in which case #main-content would not exist yet.
   */
  if (document.readyState === 'loading' && !document.getElementById('main-content')) {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }

})(window.AyushLink = window.AyushLink || {});
