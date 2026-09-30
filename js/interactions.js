/* ============================================
   INTERACTIONS CONTROLLER — Desktop micro-interactions
   ============================================
   Magnetic hover on social buttons, parallax tilt on the avatar, and tooltip
   cleanup after a click. Every effect is skipped when motion is reduced, and
   the avatar tilt is skipped on touch-only devices so it does not fight the
   touch tilt in touch.js.

   Exposed as: window.AyushLink.interactions
   ============================================ */
(function (App) {
  'use strict';

  /** Maximum icon travel, in px, during the magnetic hover. */
  var MAGNET_STRENGTH = 6;
  /** Maximum avatar rotation, in degrees, during the parallax tilt. */
  var TILT_MAX_DEG = 12;

  /**
   * Hide a button's tooltip right after it is clicked, so a tap on mobile does
   * not leave it stuck open.
   *
   * @returns {void}
   */
  function setupTooltipHide() {
    App.utils.$$('.social-icon-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var tip = this.querySelector('.tooltip');
        if (tip) {
          tip.style.opacity = '0';
          tip.style.transform = 'translateX(-50%) translateY(4px)';
        }
      });
    });
  }

  /**
   * Let the icon follow the cursor a little inside its button.
   *
   * @returns {void}
   */
  function setupMagneticButtons() {
    var buttons = App.utils.$$('.social-icon-btn');
    if (buttons.length === 0) return;
    if (App.utils.prefersReducedMotion()) return;

    buttons.forEach(function (btn) {
      var icon = btn.querySelector('i');
      if (!icon) return;

      btn.addEventListener('mousemove', function (e) {
        var rect = btn.getBoundingClientRect();
        var x = e.clientX - rect.left - rect.width / 2;
        var y = e.clientY - rect.top - rect.height / 2;
        icon.style.transform = 'translate(' + (x / rect.width) * MAGNET_STRENGTH + 'px, ' + (y / rect.height) * MAGNET_STRENGTH + 'px) scale(1.1)';
      });

      btn.addEventListener('mouseleave', function () {
        icon.style.transform = '';
      });
    });
  }

  /**
   * Tilt the avatar toward the cursor (desktop, fine pointer only).
   *
   * @returns {void}
   */
  function setupAvatarTilt() {
    var avatar = App.utils.$('#avatar');
    if (!avatar) return;
    if (App.utils.prefersReducedMotion()) return;
    // Touch devices use the 3D touch tilt in touch.js instead.
    if (!window.matchMedia('(hover: hover)').matches) return;

    avatar.addEventListener('mousemove', function (e) {
      var rect = avatar.getBoundingClientRect();
      var x = (e.clientX - rect.left) / rect.width - 0.5;
      var y = (e.clientY - rect.top) / rect.height - 0.5;
      var rotateY = x * TILT_MAX_DEG;
      var rotateX = -y * TILT_MAX_DEG;
      avatar.style.transform = 'perspective(400px) rotateX(' + rotateX + 'deg) rotateY(' + rotateY + 'deg) translateY(-6px)';
    });

    avatar.addEventListener('mouseleave', function () {
      avatar.style.transform = '';
    });
  }

  /**
   * Attach every desktop micro-interaction.
   *
   * @returns {void}
   */
  function init() {
    setupTooltipHide();
    setupMagneticButtons();
    setupAvatarTilt();
  }

  App.interactions = { init: init };

})(window.AyushLink = window.AyushLink || {});
