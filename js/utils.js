/* ============================================
   UTILS — Shared helpers
   ============================================
   Small, dependency-free helpers used by two or more controllers. Anything used
   by a single controller stays local to that controller (YAGNI).

   Exposed as: window.AyushLink.utils
   ============================================ */
(function (App) {
  'use strict';

  /**
   * Whether the visitor has asked the OS/browser to reduce motion.
   * Controllers use this to short-circuit animations and effects.
   *
   * @returns {boolean} True when `prefers-reduced-motion: reduce` matches.
   */
  function prefersReducedMotion() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  /**
   * Query a single element.
   *
   * @param {string}      selector  CSS selector.
   * @param {ParentNode} [root]     Optional scope; defaults to the document.
   * @returns {Element|null} The first match, or null.
   */
  function $(selector, root) {
    return (root || document).querySelector(selector);
  }

  /**
   * Query multiple elements and return a real array so callers can use
   * `forEach`, `map`, and `filter` without conversion.
   *
   * @param {string}      selector  CSS selector.
   * @param {ParentNode} [root]     Optional scope; defaults to the document.
   * @returns {Element[]} All matches as an array.
   */
  function $$(selector, root) {
    return Array.prototype.slice.call((root || document).querySelectorAll(selector));
  }

  App.utils = {
    prefersReducedMotion: prefersReducedMotion,
    $: $,
    $$: $$
  };

})(window.AyushLink = window.AyushLink || {});
