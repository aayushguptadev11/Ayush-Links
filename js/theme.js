/* ============================================
   THEME CONTROLLER — Dark/Light Toggle
   ============================================
   Manual override with system-preference fallback. The chosen theme is stored
   under localStorage key `theme-preference`; when nothing is stored, the OS
   preference is used and continues to be followed live.

   Exposed as: window.AyushLink.theme
   ============================================ */
(function (App) {
  'use strict';

  /** localStorage key holding the manual override. */
  var STORAGE_KEY = 'theme-preference';

  /** Current theme: "light" or "dark". Module state. */
  var currentTheme = 'light';

  /**
   * Restore the saved preference (else follow the system), apply it, and wire
   * the toggle button plus the live system-preference listener.
   *
   * @returns {void}
   */
  function init() {
    // Restore saved preference, else use the system setting.
    var saved = null;
    try { saved = localStorage.getItem(STORAGE_KEY); } catch (_) { /* private mode */ }

    if (saved === 'dark' || saved === 'light') {
      currentTheme = saved;
    } else {
      currentTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }

    // Apply immediately, before any render.
    applyTheme(false);

    setupToggle();

    // Follow system changes only while there is no manual override.
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function (e) {
      var stored = null;
      try { stored = localStorage.getItem(STORAGE_KEY); } catch (_) { /* private mode */ }
      if (!stored) {
        currentTheme = e.matches ? 'dark' : 'light';
        applyTheme(true);
      }
    });
  }

  /**
   * Write the theme to <html> and refresh the toggle icon.
   *
   * @param {boolean} animated Whether to animate the icon swap.
   * @returns {void}
   */
  function applyTheme(animated) {
    document.documentElement.setAttribute('data-theme', currentTheme);
    updateToggleIcon(animated);
  }

  /**
   * Flip the theme, persist it, and play the burst reveal.
   *
   * @returns {void}
   */
  function toggle() {
    currentTheme = currentTheme === 'dark' ? 'light' : 'dark';
    try { localStorage.setItem(STORAGE_KEY, currentTheme); } catch (_) { /* private mode */ }

    animateElasticReveal();
  }

  /**
   * Elastic burst reveal.
   *
   * Design rationale:
   * - Duration 600ms, Back.easeOut(2) for a subtle overshoot.
   * - Button press uses Elastic.easeOut for tactile feedback.
   * - Interruptible: a rapid-click guard removes any in-flight overlay.
   * - Reduced motion falls back to an instant switch.
   *
   * A circular ripple of the OLD background bursts outward from the button and
   * fades, leaving the NEW theme visible underneath.
   *
   * @returns {void}
   */
  function animateElasticReveal() {
    var btn = App.utils.$('.theme-toggle');
    if (!btn) return;

    // Rapid-click guard: drop any existing overlay.
    var existing = App.utils.$('.theme-wave');
    if (existing) {
      if (typeof gsap !== 'undefined') gsap.killTweensOf(existing);
      existing.parentNode.removeChild(existing);
    }

    if (typeof gsap !== 'undefined') gsap.killTweensOf(btn);

    // Geometry: centre of the toggle button.
    var rect = btn.getBoundingClientRect();
    var cx = rect.left + rect.width / 2;
    var cy = rect.top + rect.height / 2;

    // Read the OLD theme's background (applyTheme has not run yet).
    var oldBg = getComputedStyle(document.documentElement).getPropertyValue('--bg-primary').trim() || '#fdf5f5';

    // No GSAP or reduced motion → switch instantly.
    if (typeof gsap === 'undefined' || App.utils.prefersReducedMotion()) {
      applyTheme(true);
      return;
    }

    // 1. Button press feedback.
    gsap.fromTo(btn, { scale: 0.92 }, {
      scale: 1,
      duration: 0.6,
      ease: 'Elastic.easeOut.config(1, 0.5)'
    });

    // 2. Switch the page to the NEW theme first.
    applyTheme(true);

    // Radius needed to cover the viewport from the button.
    var dx = Math.max(cx, window.innerWidth - cx);
    var dy = Math.max(cy, window.innerHeight - cy);
    var maxRadius = Math.sqrt(dx * dx + dy * dy);

    // 3. Overlay painted with the OLD background.
    var overlay = document.createElement('div');
    overlay.className = 'theme-wave';
    overlay.style.position = 'fixed';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '100%';
    overlay.style.height = '100%';
    overlay.style.zIndex = '9998';
    overlay.style.pointerEvents = 'none';
    overlay.style.background = oldBg;
    overlay.style.willChange = 'clip-path, opacity';
    document.body.appendChild(overlay);

    gsap.set(overlay, {
      clipPath: 'circle(0% at ' + cx + 'px ' + cy + 'px)',
      opacity: 1
    });

    // 4. Burst outward and fade, revealing the new theme.
    gsap.to(overlay, {
      clipPath: 'circle(' + (maxRadius * 1.5) + 'px at ' + cx + 'px ' + cy + 'px)',
      opacity: 0,
      duration: 0.6,
      ease: 'Back.easeOut.config(2)',
      onComplete: function () {
        if (overlay.parentNode) {
          overlay.parentNode.removeChild(overlay);
        }
      }
    });
  }

  /**
   * Swap the toggle icon. Uses exit-faster-than-enter timing:
   * exit 200ms, enter 300ms with a spring bounce.
   *
   * @param {boolean} animated Whether to animate the swap.
   * @returns {void}
   */
  function updateToggleIcon(animated) {
    var btn = App.utils.$('.theme-toggle');
    if (!btn) return;

    var icon = btn.querySelector('i');
    if (!icon) return;

    var isDark = currentTheme === 'dark';
    var newIconClass = isDark ? 'ri-sun-line' : 'ri-moon-line';

    if (icon.className.indexOf(newIconClass) !== -1) return;

    if (animated && typeof gsap !== 'undefined' && !App.utils.prefersReducedMotion()) {
      gsap.killTweensOf(icon);

      gsap.timeline({
        onComplete: function () {
          gsap.set(icon, { clearProps: 'rotation,scale' });
        }
      })
      // Exit
      .to(icon, {
        rotation: -120,
        scale: 0,
        duration: 0.2,
        ease: 'power2.in'
      })
      // Swap at peak
      .call(function () {
        icon.className = isDark ? 'ri-sun-line' : 'ri-moon-line';
      })
      // Enter
      .to(icon, {
        rotation: 0,
        scale: 1,
        duration: 0.3,
        ease: 'back.out(1.7)'
      });
    } else {
      icon.className = isDark ? 'ri-sun-line' : 'ri-moon-line';
    }
  }

  /**
   * Wire the toggle button's click handler.
   *
   * @returns {void}
   */
  function setupToggle() {
    var btn = App.utils.$('.theme-toggle');
    if (!btn) return;

    btn.addEventListener('click', function () {
      toggle();
    });
  }

  App.theme = {
    init: init,
    toggle: toggle
  };

})(window.AyushLink = window.AyushLink || {});
