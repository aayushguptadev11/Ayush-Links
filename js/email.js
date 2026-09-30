/* ============================================
   EMAIL CONTROLLER — Pre-filled Project Inquiry
   ============================================
   Builds a mailto: link from App.config and plays a left-to-right progress
   sweep before handing off to the mail client.

   Exposed as: window.AyushLink.email
   ============================================ */
(function (App) {
  'use strict';

  /**
   * Milliseconds the progress sweep runs before the mail client opens.
   * Kept in sync with the GSAP tween below.
   */
  var PROGRESS_DURATION = 1.2;

  /**
   * Build the mailto: URL from the shared config.
   *
   * @returns {string} Encoded mailto link with subject and body.
   */
  function buildMailtoLink() {
    var to = App.config.email;
    var subject = App.config.mailto.subject;
    var body = App.config.mailto.body.join('\r\n');

    return 'mailto:' + to +
      '?subject=' + encodeURIComponent(subject) +
      '&body=' + encodeURIComponent(body);
  }

  /**
   * Attach the click handler that animates then opens the mail client.
   *
   * @returns {void}
   */
  function init() {
    var cta = App.utils.$('.hire-cta');
    if (!cta) return;

    cta.addEventListener('click', function (e) {
      e.preventDefault();

      // Guard against double-clicks during the animation.
      if (cta.classList.contains('is-loading')) return;
      cta.classList.add('is-loading');

      var mailtoLink = buildMailtoLink();

      // Reduced motion: skip the sweep and open immediately.
      if (App.utils.prefersReducedMotion()) {
        cta.classList.remove('is-loading');
        window.location.href = mailtoLink;
        return;
      }

      var progress = document.createElement('span');
      progress.className = 'hire-cta-progress';
      cta.appendChild(progress);

      // Block pointer events while the sweep runs.
      cta.style.pointerEvents = 'none';

      var openMail = function () {
        progress.remove();
        cta.classList.remove('is-loading');
        cta.style.pointerEvents = '';
        window.location.href = mailtoLink;
      };

      // No GSAP → open immediately (behaviour matches the original fallback).
      if (typeof gsap === 'undefined') {
        openMail();
        return;
      }

      gsap.fromTo(progress, {
        scaleX: 0,
        transformOrigin: 'left center'
      }, {
        scaleX: 1,
        duration: PROGRESS_DURATION,
        ease: 'expo.out',
        onComplete: openMail
      });

      // Rocket icon: quick orbit pulse.
      var icon = cta.querySelector('i');
      if (icon) {
        gsap.to(icon, {
          rotation: -15,
          scale: 1.2,
          duration: 0.25,
          ease: 'power2.out',
          yoyo: true,
          repeat: 1,
          onComplete: function () {
            gsap.set(icon, { clearProps: 'rotation,scale' });
          }
        });
      }
    });
  }

  App.email = { init: init };

})(window.AyushLink = window.AyushLink || {});
