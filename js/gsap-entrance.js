/* ============================================
   ENTRANCE CONTROLLER — Cinematic timeline
   ============================================
   Animates the hero into view on load. The elements start at opacity 0 via
   animations.css; this timeline restores them. When motion is reduced, or GSAP
   is unavailable, they are simply shown immediately.

   Exposed as: window.AyushLink.entrance
   ============================================ */
(function (App) {
  'use strict';

  /** Selector list for every element the entrance timeline touches. */
  var ENTRANCE_SELECTOR = '#avatar, #name, #tagline, #typed-section, #divider, #social-title, .social-icon-btn, .hire-cta, #footer';

  /**
   * Run the staggered entrance timeline.
   *
   * @returns {void}
   */
  function runEntrance() {
    // Reduced motion or no GSAP → reveal everything immediately.
    if (App.utils.prefersReducedMotion() || typeof gsap === 'undefined') {
      App.utils.$$(ENTRANCE_SELECTOR).forEach(function (el) {
        el.style.opacity = '1';
      });
      return;
    }

    // Initial states for every animated property.
    gsap.set(ENTRANCE_SELECTOR, { opacity: 0 });
    gsap.set('#name, #tagline, #typed-section, #social-title, .social-icon-btn, .hire-cta, #footer', {
      y: 30
    });
    gsap.set('#avatar', {
      scale: 0.3, rotation: -12
    });
    gsap.set('#name', {
      scale: 0.85,
      letterSpacing: '-0.08em'
    });
    gsap.set('#typed-section', {
      scale: 0.85
    });
    gsap.set('#tagline .highlight', {
      opacity: 0,
      scale: 0.5
    });
    gsap.set('.social-icon-btn', {
      scale: 0.6,
      rotation: function (i) {
        return (i < 5 ? -1 : 1) * (Math.floor(i % 5) + 1) * 4;
      }
    });
    gsap.set('#divider', {
      scaleX: 0, transformOrigin: 'left center'
    });

    var tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    // ——— HERO SECTION (0s → 1.2s) ———
    tl.to('#avatar', {
      opacity: 1, scale: 1, rotation: 0,
      duration: 0.8,
      ease: 'back.out(1.7)'
    }, 0)
    .to('#name', {
      opacity: 1,
      y: 0,
      scale: 1,
      letterSpacing: '-0.03em',
      duration: 0.85,
      ease: 'power3.out'
    }, 0.35)
    .to('#tagline', {
      opacity: 1,
      y: 0,
      duration: 0.5,
      ease: 'power2.out'
    }, 0.65)
    .to('#tagline .highlight', {
      opacity: 1,
      scale: 1,
      duration: 0.45,
      ease: 'back.out(2)'
    }, 0.85)
    .to('#typed-section', {
      opacity: 1, scale: 1, y: 0,
      duration: 0.45,
      ease: 'back.out(1.2)'
    }, 0.95);

    // ——— DIVIDER + TITLE (1.1s → 1.6s) ———
    tl.to('#divider', {
      opacity: 1, scaleX: 1,
      duration: 0.55,
      ease: 'power3.inOut'
    }, 1.1)
    .to('#social-title', {
      opacity: 1, y: 0,
      duration: 0.35,
      ease: 'power2.out'
    }, 1.35);

    // ——— SOCIAL ICONS (1.5s → 2.1s) ———
    tl.to('.social-icon-btn', {
      opacity: 1, y: 0, scale: 1, rotation: 0,
      duration: 0.45,
      stagger: { each: 0.05, from: 'start', ease: 'power2.inOut' },
      ease: 'back.out(1.3)'
    }, 1.5);

    // ——— CTA + FOOTER (2.0s → 2.6s) ———
    tl.to('.hire-cta', {
      opacity: 1, y: 0,
      duration: 0.45,
      ease: 'back.out(1.3)'
    }, 2.0)
    .to('#footer', {
      opacity: 1, y: 0,
      duration: 0.35,
      ease: 'power2.out'
    }, 2.25);

    // ——— Ambient glow (parallel) ———
    gsap.to('.ambient-glow', {
      opacity: 0.6,
      duration: 1.5,
      ease: 'power2.out',
      delay: 0.5
    });
  }

  App.entrance = { runEntrance: runEntrance };

})(window.AyushLink = window.AyushLink || {});
