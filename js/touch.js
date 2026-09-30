/* ============================================
   TOUCH CONTROLLER — Mobile visual feedback
   ============================================
   Pointer-events based feedback for touch devices: ripples, press scale,
   long-press tooltip, long-press copy-link, 3D avatar tilt, and a finger-trail
   particle canvas. Every effect is skipped when motion is reduced.

   Ripple/press/tilt always run (pointer events also fire on desktop, but each
   handler early-returns unless `pointerType === 'touch'`); the touch-only
   extras only attach on devices without fine hover.

   Exposed as: window.AyushLink.touch
   ============================================ */
(function (App) {
  'use strict';

  /** Duration of a ripple expansion, in seconds. */
  var RIPPLE_DURATION = 0.5;
  /** Long-press delay before a tooltip appears, in ms. */
  var TOOLTIP_HOLD_MS = 500;
  /** Long-press delay before the link is copied, in ms. */
  var COPY_HOLD_MS = 800;
  /** Max finger travel before a long-press is cancelled, in px. */
  var MOVE_TOLERANCE = 10;
  /** Hard cap on live trail particles, for performance. */
  var MAX_TRAIL_PARTICLES = 200;

  /** No fine hover → treat as a touch device. */
  var isTouchDevice = false;
  /** Trail canvas + 2D context. */
  var trailCtx = null;
  var trailCanvas = null;
  /** Live trail particles. */
  var trailParticles = [];
  /** Active trail animation frame id. */
  var trailAnimId = null;

  /** Trail particle colours as rgba prefixes (alpha appended per draw). */
  var TRAIL_COLORS = [
    'rgba(225, 29, 72,',
    'rgba(190, 18, 60,',
    'rgba(244, 114, 182,',
    'rgba(251, 146, 60,',
    'rgba(255, 255, 255,'
  ];

  /* =============================================
     LEVEL 2a — GSAP touch ripples
     ============================================= */

  /**
   * Spawn an expanding ripple at the pointer position on touch press.
   *
   * @returns {void}
   */
  function setupRippleEffects() {
    var targets = App.utils.$$('.social-icon-btn, .hire-cta');
    if (!targets.length || typeof gsap === 'undefined') return;
    if (App.utils.prefersReducedMotion()) return;

    targets.forEach(function (el) {
      // Ripple is absolutely positioned, so the host must be a containing block.
      if (getComputedStyle(el).position === 'static') {
        el.style.position = 'relative';
      }

      el.addEventListener('pointerdown', function (e) {
        // Desktop clicks use the CTA progress animation instead.
        if (e.pointerType !== 'touch') return;

        var rect = el.getBoundingClientRect();
        var x = e.clientX - rect.left;
        var y = e.clientY - rect.top;
        var size = Math.max(rect.width, rect.height) * 1.2;

        var ripple = document.createElement('span');
        ripple.className = 'touch-ripple';
        ripple.style.width = size + 'px';
        ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        el.appendChild(ripple);

        gsap.fromTo(ripple, {
          scale: 0,
          opacity: 0.6
        }, {
          scale: 2.5,
          opacity: 0,
          duration: RIPPLE_DURATION,
          ease: 'power2.out',
          onComplete: function () {
            ripple.remove();
          }
        });
      });
    });
  }

  /* =============================================
     LEVEL 2b — Press scale
     ============================================= */

  /**
   * Shrink a pressed control, then spring it back on release.
   *
   * @returns {void}
   */
  function setupPressEffects() {
    var targets = App.utils.$$('.social-icon-btn, .hire-cta');
    if (!targets.length || typeof gsap === 'undefined') return;
    if (App.utils.prefersReducedMotion()) return;

    targets.forEach(function (el) {
      el.addEventListener('pointerdown', function (e) {
        if (e.pointerType !== 'touch') return;
        gsap.to(el, { scale: 0.92, duration: 0.1, ease: 'power2.out', overwrite: 'auto' });
      });

      el.addEventListener('pointerup', function (e) {
        if (e.pointerType !== 'touch') return;
        gsap.to(el, { scale: 1, duration: 0.3, ease: 'back.out(1.5)', overwrite: 'auto' });
      });

      el.addEventListener('pointerleave', function (e) {
        if (e.pointerType !== 'touch') return;
        gsap.to(el, { scale: 1, duration: 0.2, ease: 'power2.out', overwrite: 'auto' });
      });
    });
  }

  /* =============================================
     LEVEL 2b — Avatar touch bounce
     ============================================= */

  /**
   * Give the avatar a press-and-release bounce.
   *
   * @returns {void}
   */
  function setupAvatarTouchBounce() {
    var avatar = App.utils.$('#avatar');
    if (!avatar || typeof gsap === 'undefined') return;
    if (App.utils.prefersReducedMotion()) return;

    avatar.addEventListener('pointerdown', function (e) {
      if (e.pointerType !== 'touch') return;
      gsap.to(avatar, { scale: 0.95, duration: 0.1, ease: 'power2.out', overwrite: 'auto' });
    });

    avatar.addEventListener('pointerup', function (e) {
      if (e.pointerType !== 'touch') return;
      gsap.to(avatar, { scale: 1, duration: 0.4, ease: 'back.out(2)', overwrite: 'auto' });
    });

    avatar.addEventListener('pointerleave', function (e) {
      if (e.pointerType !== 'touch') return;
      gsap.to(avatar, { scale: 1, duration: 0.3, ease: 'power2.out', overwrite: 'auto' });
    });
  }

  /* =============================================
     LEVEL 2b — Typed section touch glow
     ============================================= */

  /**
   * Flash the typed wrapper's border and glow while pressed.
   *
   * @returns {void}
   */
  function setupTypedTouchGlow() {
    var wrapper = App.utils.$('.typed-wrapper');
    if (!wrapper || typeof gsap === 'undefined') return;
    if (App.utils.prefersReducedMotion()) return;

    wrapper.addEventListener('pointerdown', function (e) {
      if (e.pointerType !== 'touch') return;
      gsap.to(wrapper, {
        borderColor: 'var(--accent)',
        boxShadow: '0 0 20px var(--accent-glow), inset 0 0 20px var(--accent-glow)',
        duration: 0.15,
        ease: 'power1.out',
        overwrite: 'auto'
      });
    });

    wrapper.addEventListener('pointerup', function (e) {
      if (e.pointerType !== 'touch') return;
      gsap.to(wrapper, {
        borderColor: 'var(--border)',
        boxShadow: 'none',
        duration: 0.4,
        ease: 'power2.out',
        overwrite: 'auto'
      });
    });

    wrapper.addEventListener('pointerleave', function (e) {
      if (e.pointerType !== 'touch') return;
      gsap.to(wrapper, {
        borderColor: 'var(--border)',
        boxShadow: 'none',
        duration: 0.3,
        ease: 'power2.out',
        overwrite: 'auto'
      });
    });
  }

  /* =============================================
     LEVEL 2c — Long-press tooltip + copy-link (touch only)
     ============================================= */

  /**
   * On touch: long-press shows the tooltip (500ms) and, after 800ms, copies the
   * link. Moving the finger more than 10px cancels both, so scrolling is not
   * hijacked.
   *
   * @returns {void}
   */
  function setupTouchTooltips() {
    var buttons = App.utils.$$('.social-icon-btn');
    if (!buttons.length) return;

    buttons.forEach(function (btn) {
      var tooltipTimer = null;
      var copyTimer = null;
      var tooltipCancelled = false;
      var copyCancelled = false;
      var startX = 0;
      var startY = 0;
      var touchId = null;

      function clearTooltipTimer() {
        if (tooltipTimer) {
          clearTimeout(tooltipTimer);
          tooltipTimer = null;
        }
      }

      function resetCopyState() {
        copyCancelled = true;
        if (copyTimer) {
          clearTimeout(copyTimer);
          copyTimer = null;
        }
      }

      btn.addEventListener('pointerdown', function (e) {
        if (e.pointerType !== 'touch') return;

        // Track a single pointer; a second touch cancels both long-presses.
        if (touchId !== null && touchId !== e.pointerId) {
          tooltipCancelled = true;
          resetCopyState();
        }
        touchId = e.pointerId;

        var url = btn.getAttribute('href');
        tooltipCancelled = false;
        copyCancelled = false;
        startX = e.clientX;
        startY = e.clientY;

        // 1) Tooltip long-press.
        tooltipTimer = setTimeout(function () {
          if (!tooltipCancelled) {
            btn.classList.add('touch-tooltip-visible');
            if (navigator.vibrate) navigator.vibrate(10);
          }
        }, TOOLTIP_HOLD_MS);

        // 2) Copy-link long-press.
        if (url) {
          copyTimer = setTimeout(function () {
            if (copyCancelled) return;

            try {
              // Clipboard API requires a secure context.
              if (!navigator.clipboard || !window.isSecureContext) {
                throw new Error('Clipboard unavailable');
              }

              navigator.clipboard.writeText(url).then(function () {
                showToast('Link copied');
              }).catch(function (err) {
                // Graceful fallback: no toast.
                console.warn('[Touch] Copy link failed:', err);
              });
            } catch (err) {
              console.warn('[Touch] Copy link failed:', err);
            }
          }, COPY_HOLD_MS);
        }
      });

      btn.addEventListener('pointermove', function (e) {
        if (e.pointerType !== 'touch') return;
        if (touchId !== null && e.pointerId !== touchId) return;

        var dx = Math.abs(e.clientX - startX);
        var dy = Math.abs(e.clientY - startY);

        // Finger moved too far → treat as a scroll/gesture.
        if (dx > MOVE_TOLERANCE || dy > MOVE_TOLERANCE) {
          tooltipCancelled = true;
          resetCopyState();
          clearTooltipTimer();
          btn.classList.remove('touch-tooltip-visible');
        }
      });

      btn.addEventListener('pointerup', function (e) {
        if (e.pointerType !== 'touch') return;
        if (touchId !== null && e.pointerId !== touchId) return;

        clearTooltipTimer();
        resetCopyState();

        // Keep a visible tooltip briefly, then hide it.
        if (btn.classList.contains('touch-tooltip-visible')) {
          setTimeout(function () {
            btn.classList.remove('touch-tooltip-visible');
          }, 1200);
        }

        touchId = null;
      });

      btn.addEventListener('pointerleave', function (e) {
        if (e.pointerType !== 'touch') return;
        if (touchId !== null && e.pointerId !== touchId) return;

        clearTooltipTimer();
        resetCopyState();
        btn.classList.remove('touch-tooltip-visible');
        touchId = null;
      });

      btn.addEventListener('pointercancel', function (e) {
        if (e.pointerType !== 'touch') return;
        if (touchId !== null && e.pointerId !== touchId) return;

        clearTooltipTimer();
        resetCopyState();
        btn.classList.remove('touch-tooltip-visible');
        touchId = null;
      });
    });
  }

  /**
   * Show a transient toast message (used by the copy-link gesture).
   *
   * @param {string} message Text to display.
   * @returns {void}
   */
  function showToast(message) {
    var existing = App.utils.$('.bb-toast');
    if (existing) existing.remove();

    var toast = document.createElement('div');
    toast.className = 'bb-toast';
    toast.textContent = message;
    document.body.appendChild(toast);

    requestAnimationFrame(function () {
      toast.classList.add('bb-toast--visible');
    });

    setTimeout(function () {
      toast.classList.remove('bb-toast--visible');
      setTimeout(function () {
        if (toast.parentNode) toast.parentNode.removeChild(toast);
      }, 200);
    }, 1200);
  }

  /* =============================================
     LEVEL 3a — Avatar 3D tilt (touch only)
     ============================================= */

  /**
   * Tilt the avatar under the finger while touching it.
   *
   * @returns {void}
   */
  function setupAvatarTouchTilt() {
    var avatar = App.utils.$('#avatar');
    if (!avatar || typeof gsap === 'undefined') return;
    if (App.utils.prefersReducedMotion()) return;

    var isTouching = false;

    avatar.addEventListener('pointerdown', function (e) {
      if (e.pointerType !== 'touch') return;
      isTouching = true;
    });

    avatar.addEventListener('pointermove', function (e) {
      if (!isTouching || e.pointerType !== 'touch') return;

      var rect = avatar.getBoundingClientRect();
      var x = (e.clientX - rect.left) / rect.width - 0.5;
      var y = (e.clientY - rect.top) / rect.height - 0.5;
      var rotateY = x * 15;
      var rotateX = -y * 15;

      gsap.to(avatar, {
        rotationX: rotateX,
        rotationY: rotateY,
        duration: 0.15,
        ease: 'power2.out',
        overwrite: 'auto',
        transformPerspective: 500
      });
    });

    avatar.addEventListener('pointerup', function () {
      isTouching = false;
      gsap.to(avatar, {
        rotationX: 0,
        rotationY: 0,
        duration: 0.4,
        ease: 'back.out(1.5)',
        overwrite: 'auto'
      });
    });

    avatar.addEventListener('pointerleave', function () {
      isTouching = false;
      gsap.to(avatar, {
        rotationX: 0,
        rotationY: 0,
        duration: 0.3,
        ease: 'power2.out',
        overwrite: 'auto'
      });
    });
  }

  /* =============================================
     LEVEL 3b — Finger-trail stars (touch only)
     ============================================= */

  /**
   * Size the trail canvas to the viewport.
   *
   * @returns {void}
   */
  function resizeTrailCanvas() {
    if (!trailCanvas) return;
    trailCanvas.width = window.innerWidth;
    trailCanvas.height = window.innerHeight;
  }

  /**
   * Clear the trail canvas.
   *
   * @returns {void}
   */
  function drawTrailClear() {
    if (!trailCtx) return;
    trailCtx.clearRect(0, 0, trailCanvas.width, trailCanvas.height);
  }

  /**
   * Draw the current trail frame.
   *
   * @returns {void}
   */
  function drawTrail() {
    if (!trailCtx) return;

    trailCtx.clearRect(0, 0, trailCanvas.width, trailCanvas.height);

    for (var i = 0; i < trailParticles.length; i++) {
      var p = trailParticles[i];
      var alpha = p.life * 0.6;

      trailCtx.beginPath();
      trailCtx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2);
      trailCtx.fillStyle = p.color + alpha + ')';
      trailCtx.fill();

      // Soft glow for bigger particles.
      if (p.size > 3 && p.life > 0.3) {
        trailCtx.beginPath();
        trailCtx.arc(p.x, p.y, p.size * p.life * 2, 0, Math.PI * 2);
        trailCtx.fillStyle = p.color + (alpha * 0.2) + ')';
        trailCtx.fill();
      }
    }
  }

  /**
   * Advance trail particles and retire expired ones.
   *
   * @returns {void}
   */
  function updateTrail() {
    for (var i = trailParticles.length - 1; i >= 0; i--) {
      var p = trailParticles[i];
      p.x += p.speedX;
      p.y += p.speedY;
      p.speedY += p.gravity;
      p.life -= p.decay;

      if (p.life <= 0) {
        trailParticles.splice(i, 1);
      }
    }
  }

  /**
   * Drive the trail loop while particles remain, then stop and clear.
   *
   * @returns {void}
   */
  function animateTrail() {
    if (trailAnimId) return;

    function loop() {
      if (trailParticles.length === 0) {
        drawTrailClear();
        trailAnimId = null;
        return;
      }
      drawTrail();
      updateTrail();
      trailAnimId = requestAnimationFrame(loop);
    }

    trailAnimId = requestAnimationFrame(loop);
  }

  /**
   * Emit trail particles at a point.
   *
   * @param {number} x     X coordinate.
   * @param {number} y     Y coordinate.
   * @param {number} count How many particles to emit.
   * @returns {void}
   */
  function spawnTrailParticles(x, y, count) {
    for (var i = 0; i < count; i++) {
      trailParticles.push({
        x: x + (Math.random() - 0.5) * 8,
        y: y + (Math.random() - 0.5) * 8,
        size: Math.random() * 4 + 2,
        speedX: (Math.random() - 0.5) * 2.5,
        speedY: -(Math.random() * 2 + 1),
        life: 1,
        decay: Math.random() * 0.03 + 0.02,
        color: TRAIL_COLORS[Math.floor(Math.random() * TRAIL_COLORS.length)],
        gravity: Math.random() * 0.05 + 0.02
      });
    }

    // Performance cap.
    if (trailParticles.length > MAX_TRAIL_PARTICLES) {
      trailParticles.splice(0, trailParticles.length - MAX_TRAIL_PARTICLES);
    }

    // Restart the loop if it had stopped, so new particles render immediately.
    if (!trailAnimId) {
      animateTrail();
    }
  }

  /**
   * Create the overlay canvas and follow the finger.
   *
   * @returns {void}
   */
  function setupTouchTrail() {
    if (App.utils.prefersReducedMotion()) return;

    trailCanvas = document.createElement('canvas');
    trailCanvas.className = 'touch-trail-canvas';
    document.body.appendChild(trailCanvas);
    trailCtx = trailCanvas.getContext('2d');
    resizeTrailCanvas();

    window.addEventListener('resize', resizeTrailCanvas);

    var isActive = false;

    document.addEventListener('pointerdown', function (e) {
      if (e.pointerType !== 'touch') return;
      isActive = true;
      spawnTrailParticles(e.clientX, e.clientY, 3);
      animateTrail();
    });

    document.addEventListener('pointermove', function (e) {
      if (!isActive || e.pointerType !== 'touch') return;
      spawnTrailParticles(e.clientX, e.clientY, 2);
    });

    document.addEventListener('pointerup', function () {
      isActive = false;
    });

    document.addEventListener('pointerleave', function () {
      isActive = false;
    });
  }

  /* =============================================
     Lifecycle
     ============================================= */

  /**
   * Attach all touch feedback. Ripple/press/tilt always attach; tooltips, 3D
   * tilt, and the trail are touch-device only.
   *
   * @returns {void}
   */
  function init() {
    isTouchDevice = !window.matchMedia('(hover: hover)').matches;

    setupRippleEffects();
    setupPressEffects();
    setupAvatarTouchBounce();
    setupTypedTouchGlow();

    if (isTouchDevice) {
      setupTouchTooltips();
      setupAvatarTouchTilt();
      setupTouchTrail();
    }
  }

  /**
   * Release canvas resources. Called on page unload.
   *
   * @returns {void}
   */
  function destroy() {
    if (trailAnimId) {
      cancelAnimationFrame(trailAnimId);
      trailAnimId = null;
    }
    if (trailCanvas && trailCanvas.parentNode) {
      trailCanvas.parentNode.removeChild(trailCanvas);
    }
    trailParticles = [];
  }

  App.touch = {
    init: init,
    destroy: destroy,
    showToast: showToast
  };

})(window.AyushLink = window.AyushLink || {});
