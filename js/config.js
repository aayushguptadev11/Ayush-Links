/* ============================================
   CONFIG — Single source of truth
   ============================================
   Contact details, typed roles, and message templates live here so they are
   defined exactly once. Before this file existed the email address and
   WhatsApp number were duplicated in index.html and in the controllers.

   Consumed by: email.js (mailto), whatsapp.js (wa.me), typed.js (roles).
   Exposed as:  window.AyushLink.config
   ============================================ */
(function (App) {
  'use strict';

  /**
   * @typedef {Object} MailtoTemplate
   * @property {string}   subject  Email subject line.
   * @property {string[]} body     Body lines; joined with CRLF when building the mailto URL.
   */

  /**
   * @typedef {Object} WhatsAppConfig
   * @property {string} number   Phone number in international format without '+'.
   * @property {string} message  Pre-filled message inserted after ?text=.
   */

  /**
   * The site's shareable configuration. Values are copied verbatim from their
   * original locations (index.html, email.js, whatsapp.js, typed.js) so behaviour
   * is unchanged; only their location moved.
   *
   * @type {{
   *   email: string,
   *   whatsapp: WhatsAppConfig,
   *   roles: string[],
   *   mailto: MailtoTemplate
   * }}
   */
  var config = {
    /** Primary contact address used for the "Let's Work Together" mailto link. */
    email: 'starverse1130@gmail.com',

    whatsapp: {
      /** International format, no '+' or spaces. */
      number: '917398244265',
      /** Pre-filled intro; emoji preserved via unicode escapes. */
      message: 'Hey Ayush \uD83D\uDC4B\n\nJust visited your portfolio. Let\'s connect \uD83D\uDE80'
    },

    /** Roles cycled by Typed.js in the hero section. */
    roles: [
      'Full Stack Developer',
      'UI/UX Designer',
      'Python Developer'
    ],

    /** Subject + body used to build the pre-filled project inquiry email. */
    mailto: {
      subject: 'Project Inquiry \u2014 Let\'s Work Together',
      body: [
        'Dear Ayush,',
        '',
        'I hope this message finds you well. I came across your profile and was impressed by your work. I would like to discuss a potential collaboration opportunity.',
        '',
        '\u2014\u2014\u2014 Project Details \u2014\u2014\u2014',
        'Full Name: ',
        'Organization / Institution: ',
        'Project Type: (Web Application / UI/UX Design / Python Development / Other)',
        'Estimated Budget: ',
        'Expected Timeline: ',
        '',
        '\u2014\u2014\u2014 Project Description \u2014\u2014\u2014',
        'Please describe your project requirements in brief:',
        '',
        '\u2014\u2014\u2014 Additional Notes \u2014\u2014\u2014',
        '(Any references, links, or specific requirements you\'d like to share)',
        '',
        'Thank you for your time. I look forward to connecting with you.',
        '',
        'Warm Regards,',
        '[Your Full Name]',
        '[Your Contact Number]'
      ]
    }
  };

  App.config = Object.freeze(config);

})(window.AyushLink = window.AyushLink || {});
