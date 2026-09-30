/* ============================================
   STARS CONTROLLER — Floating particle canvas
   ============================================
   Draws drifting, twinkling stars on #star-canvas with a soft ambient glow at
   the top. Disabled entirely when motion is reduced.

   Exposed as: window.AyushLink.stars
   ============================================ */
(function (App) {
  'use strict';

  /** Canvas and 2D context. */
  var canvas = null;
  var ctx = null;
  /** Live particle list. */
  var particles = [];
  /** Active requestAnimationFrame id. */
  var animationId = null;
  /** Whether the draw loop is running. */
  var isRunning = false;
  /** Debounce handle for window resize. */
  var resizeTimeout = null;

  /**
   * Particle colours as rgba prefixes (alpha is appended per draw).
   * @type {string[]}
   */
  var COLORS = [
    'rgba(225, 29, 72,',   // accent red
    'rgba(190, 18, 60,',   // accent dim
    'rgba(244, 114, 182,', // soft pink
    'rgba(251, 146, 60,',  // warm orange
    'rgba(251, 191, 36,'   // golden
  ];

  /**
   * Size the canvas to the viewport and rebuild the particle field.
   *
   * @returns {void}
   */
  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    createParticles();
  }

  /**
   * Rebuild the particle field. Count scales with width, capped at 50.
   *
   * @returns {void}
   */
  function createParticles() {
    particles = [];
    var count = Math.min(Math.floor(window.innerWidth * 0.06), 50);

    for (var i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 3 + 1,
        speedX: (Math.random() - 0.5) * 0.3,
        speedY: -(Math.random() * 0.5 + 0.2),
        opacity: Math.random() * 0.4 + 0.1,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        twinkleSpeed: Math.random() * 0.02 + 0.005,
        twinklePhase: Math.random() * Math.PI * 2
      });
    }
  }

  /**
   * Draw the current frame: ambient glow, then each star (plus a soft halo on
   * the brighter ones).
   *
   * @returns {void}
   */
  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Ambient glow at the top.
    var gradient = ctx.createRadialGradient(
      canvas.width / 2, -100, 0,
      canvas.width / 2, -100, 500
    );
    gradient.addColorStop(0, 'rgba(225, 29, 72, 0.04)');
    gradient.addColorStop(1, 'rgba(225, 29, 72, 0)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    for (var i = 0; i < particles.length; i++) {
      var p = particles[i];
      var twinkle = Math.sin(p.twinklePhase) * 0.3 + 0.7;
      var alpha = p.opacity * twinkle;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = p.color + alpha + ')';
      ctx.fill();

      // Soft glow around brighter stars.
      if (p.size > 2 && alpha > 0.2) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 2.5, 0, Math.PI * 2);
        ctx.fillStyle = p.color + (alpha * 0.15) + ')';
        ctx.fill();
      }
    }
  }

  /**
   * Advance every particle and recycle those that leave the viewport.
   *
   * @returns {void}
   */
  function update() {
    for (var i = 0; i < particles.length; i++) {
      var p = particles[i];
      p.x += p.speedX;
      p.y += p.speedY;
      p.twinklePhase += p.twinkleSpeed;

      if (p.y < -10) {
        p.y = canvas.height + 10;
        p.x = Math.random() * canvas.width;
      }
      if (p.x < -10) p.x = canvas.width + 10;
      if (p.x > canvas.width + 10) p.x = -10;
    }
  }

  /**
   * Start the render loop.
   *
   * @returns {void}
   */
  function animate() {
    isRunning = true;

    function loop() {
      draw();
      update();
      animationId = requestAnimationFrame(loop);
    }

    loop();
  }

  /**
   * Boot the canvas. No-ops under reduced motion or when the canvas is absent.
   *
   * @returns {void}
   */
  function init() {
    if (App.utils.prefersReducedMotion()) return;

    canvas = App.utils.$('#star-canvas');
    if (!canvas) return;

    ctx = canvas.getContext('2d');
    resize();
    animate();

    // Debounced resize handler.
    window.addEventListener('resize', function () {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(resize, 150);
    });
  }

  /**
   * Stop the render loop and clear the canvas.
   *
   * @returns {void}
   */
  function destroy() {
    if (animationId) {
      cancelAnimationFrame(animationId);
      isRunning = false;
    }
    if (ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  }

  App.stars = {
    init: init,
    destroy: destroy
  };

})(window.AyushLink = window.AyushLink || {});
