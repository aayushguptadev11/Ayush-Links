<div align="center">

<img src="assets/image/Aayush.webp" alt="Ayush-link Logo" width="128" style="border-radius: 50%; margin-bottom: 16px;">

# Ayush Links

### Social Links Hub — Ayush Gupta

<p align="center">
  <a href="https://aayushguptadev11.github.io/Ayush-Links/">
    <img src="https://img.shields.io/badge/Live_Demo-🌐-E11D48?style=for-the-badge&labelColor=1a1a1a" alt="Live Demo">
  </a>
  <a href="https://github.com/aayushguptadev11/Ayush-Links">
    <img src="https://img.shields.io/badge/GitHub-Repository-black?style=for-the-badge&logo=github" alt="GitHub Repo">
  </a>
</p>

<p align="center">
  <strong>
    One unified link that connects recruiters, collaborators, and the community to everything Ayush Gupta — across 10 social platforms.
  </strong>
</p>

<p align="center">
  <a href="https://aayush.rf.gd">🌐 Live Demo</a> •
  <a href="#-features">Features</a> •
  <a href="#-tech-stack">Tech Stack</a> •
  <a href="#-project-structure">Structure</a> •
  <a href="#-quick-start">Quick Start</a>
</p>

<img src="https://raw.githubusercontent.com/andreasbm/readme/master/assets/lines/rainbow.png" width="100%">

</div>

---

## ✨ Features

- **🎯 10 Social Links** — GitHub, LinkedIn, Instagram, Twitter/X, Threads, Snapchat, WhatsApp, Facebook, Portfolio, and Resume in a clean 5-column grid
- **🖼️ Animated Profile** — Rotating conic gradient ring around avatar with breathing glow effect
- **🚀 Cinematic Entrance** — GSAP-powered staggered timeline: avatar → name → tagline → typing → divider → icons
- **⌨️ Role Typing Effect** — Typed.js cycling through *Full Stack Developer*, *UI/UX Designer*, *Python Developer*
- **🌌 Star Particle Background** — Floating stars with twinkle animation, ambient red glow at top
- **🌙 Dark/Light Mode** — Elastic burst reveal transition with system preference detection + manual toggle with localStorage persistence
- **🎨 Brand Color Fills** — Each social icon fills with its brand color on hover (GitHub dark, LinkedIn blue, Instagram pink, etc.)
- **💬 Smart Tooltips** — Desktop hover tooltips + mobile long-press tooltips with haptic feedback
- **📱 Mobile Touch Design** — Ripple effects, touch press scale, avatar 3D tilt, finger trail stars on pointer move
- **📄 Resume CTA** — One-click download/redirect to resume PDF
- **📧 Hire Me CTA** — Pre-filled email template with progress bar animation
- **💬 WhatsApp Pre-fill** — Instant message with pre-written intro text
- **📲 Home-Screen Ready** — Web app manifest + iOS web-app meta tags, so "Add to Home Screen" gives a standalone, app-like icon with shortcuts
- **♿ Accessible** — Semantic HTML, ARIA labels, skip-to-content link, keyboard navigation, `prefers-reduced-motion` support
- **⚡ Pure Vanilla Stack** — No frameworks, no build step — static HTML + CSS + JS

## 🛠️ Tech Stack

| Technology | Purpose |
|:---:|:---|
| ![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat-square&logo=html5&logoColor=white) | Semantic structure with accessibility + web app manifest & iOS meta tags |
| ![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat-square&logo=css3&logoColor=white) | Custom properties for theming, conic gradients, responsive breakpoints |
| ![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=black) | Vanilla JS — modular controller pattern, service worker registration |
| ![GSAP](https://img.shields.io/badge/GSAP-88CE02?style=flat-square&logo=greensock&logoColor=black) | Cinematic entrance timeline, elastic burst theme transition, touch interactions |
| ![Typed.js](https://img.shields.io/badge/Typed.js-0D6EFD?style=flat-square&logo=javascript&logoColor=white) | Role typing animation with loop and smart backspace |
| ![Remix Icons](https://img.shields.io/badge/Remix_Icons-111111?style=flat-square&logo=remix&logoColor=white) | 10+ social brand icons, theme toggle icons |
| ![Google Fonts](https://img.shields.io/badge/Google_Fonts-4285F4?style=flat-square&logo=googlefonts&logoColor=white) | Poppins (headings), DM Sans (body), JetBrains Mono (code/typed) |

## 🎨 Brand Identity

| Aspect | Detail |
|:---|:---|
| **Brand** | Starverse (Ayush-link) |
| **Primary Color** | `#E11D48` (Rose Red) |
| **Accent Palette** | Amber `#F59E0B`, Pink `#EC4899`, Violet `#8B5CF6` |
| **Design Theme** | Cosmic / Space / Starry — Premium Minimal |
| **Vibe** | AI-powered, futuristic, editorial |
| **Dark BG** | `#0f0a0a` |
| **Light BG** | `#fdf5f5` |

## 📁 Project Structure

```
Ayush-link/
├── index.html                    ← Single-page entry point (includes web app manifest + iOS meta tags)
├── sw.js                         ← One-off service-worker kill switch (see "Home Screen")
├── assets/
│   ├── icons/                    ← Favicons & home-screen icons
│   │   ├── favicon.ico
│   │   ├── favicon-16x16.png
│   │   ├── favicon-32x32.png
│   │   ├── android-chrome-192x192.png
│   │   ├── android-chrome-512x512.png
│   │   └── site.webmanifest      ← Web app manifest (name, icons, screenshots, shortcuts)
│   ├── image/
│   │   └── Aayush.webp           ← Profile image
│   ├── pdf/
│   │   └── Ayush_Resume.pdf      ← Downloadable resume
│   └── screenshots/              ← Manifest screenshots & README previews
│       ├── desktop.png
│       └── mobile.png
├── css/
│   ├── variables.css             ← CSS custom properties (light/dark tokens)
│   ├── base.css                  ← Reset, typography, utilities, ambient glow
│   ├── hero.css                  ← Profile image ring, name, tagline, typed wrapper
│   ├── components.css            ← Social grid, tooltips, brand fills, CTA, footer
│   ├── animations.css            ← Shimmer, pulse, twinkle, rocket hover, reduced motion
│   ├── responsive.css            ← Tablet (769px), Desktop (1024px), XS mobile (360px)
│   └── touch.css                 ← Ripple, press effects, touch tooltip, trail canvas
├── js/
│   ├── config.js                 ← Shared constants (email, WhatsApp, roles, mailto template)
│   ├── utils.js                  ← Shared helpers (reduced-motion check, $ / $$)
│   ├── init.js                   ← Composition root — boots all controllers
│   ├── theme.js                  ← Dark/light toggle + elastic burst reveal animation
│   ├── stars.js                  ← Floating particle canvas with twinkle
│   ├── typed.js                  ← Typed.js controller (roles cycling)
│   ├── gsap-entrance.js          ← GSAP cinematic entrance timeline
│   ├── interactions.js           ← Magnetic hover, avatar tilt, tooltip hide
│   ├── email.js                  ← Pre-filled email template + progress bar
│   ├── whatsapp.js               ← Pre-filled WhatsApp message
│   └── touch.js                  ← Ripples, press scale, long-press tooltip, 3D tilt, trail stars
├── docs/
│   ├── ARCHITECTURE.md           ← Code structure, CSS ownership, boot order, how-to guides
│   └── superpowers/              ← Design spec + implementation plan for the code refactor
└── README.md                     ← You are here
```

## 🚀 Quick Start

No build step, no dependencies, no backend. Just open in a browser!

```bash
# Clone the repository
git clone https://github.com/aayushguptadev11/Ayush-Links.git

# Navigate into the project
cd Ayush-link

# Open directly in browser
open index.html
# or just double-click index.html!
```

> 💡 **Tip:** All links are hardcoded in `index.html`. To edit your own links, modify the `<a>` tags in the `.social-icons-row` section.

## 📲 Home Screen (no service worker)

The site ships a web app manifest and iOS web-app meta tags, so visitors can use the browser's **Add to Home Screen** to pin a standalone, app-like icon with shortcuts.

There is intentionally **no service worker and no offline caching**. That feature was removed because this is a link hub — every link needs the network anyway, so offline adds nothing — while cache-first HTML could serve returning visitors **stale links** after an update.

> **Note:** Chrome's install prompt requires a service worker, so it no longer appears. iOS "Add to Home Screen" still works, and the manifest shortcuts (GitHub, WhatsApp, Resume) remain available.

### 🧹 Service Worker Cleanup

`sw.js` is now a one-off **kill switch**. For visitors who installed the old version it deletes every cache, unregisters itself, and reloads the tab. It can be deleted once those clients have updated (roughly a few weeks after deploy).

## 📸 Screenshots

<div align="center">
  <img src="assets/screenshots/desktop.png" alt="Ayush-link Desktop Screenshot" width="700" style="border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.1); margin-bottom: 16px;">

  <img src="assets/screenshots/mobile.png" alt="Ayush-link Mobile Screenshot" width="300" style="border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.1);">
</div>

## 🌟 How It Works

1. **Open the page** — A single URL (`aayush.rf.gd`) represents your entire online identity
2. **Cinematic entrance** — GSAP animates avatar → name → tagline → typing → divider → social icons in a staggered timeline
3. **Browse social links** — 10 icons in a responsive 5-column grid. Hover to see brand color fills and tooltips
4. **Connect instantly** — Click any icon to open the platform profile in a new tab
5. **WhatsApp pre-fill** — WhatsApp link auto-appends a pre-written intro message
6. **Hire Me CTA** — Opens email client with a structured project inquiry template and animated progress bar
7. **Dark/Light toggle** — Fixed top-right button with elastic burst reveal animation. Preference saved to localStorage
8. **Mobile touch** — Ripple effects, press scale, long-press tooltips, 3D avatar tilt, finger trail stars
9. **Add to Home Screen** — Use your browser's "Add to Home Screen" to pin a standalone icon (no offline caching)

## ♿ Accessibility

- Semantic HTML5 landmarks with `aria-label` attributes on all interactive elements
- Skip-to-content link for keyboard users
- `prefers-reduced-motion` respected — animations disabled, trail canvas hidden, ripples removed
- Image fallback (initials "AG") if profile image fails to load
- Sufficient color contrast with WCAG AA compliance
- Keyboard navigable — Tab through all social links and CTA
- `noscript` fallback message for users without JavaScript

## 💡 Design Highlights

| Feature | Detail |
|:---|:---|
| **Conic Ring** | Avatar surrounded by rotating multi-color gradient ring (`#E11D48 → #F59E0B → #EC4899 → #8B5CF6`) |
| **Template Shimmer** | "CONNECT WITH ME" title has animated gradient shimmer text |
| **Tooltip Placement** | Row 1-5 icons show tooltips below; Row 6-10 show above to prevent overlap |
| **Rocket CTA** | "Let's Work Together" button animates rocket icon on hover + progress bar on click |
| **Theme Wave** | Dark/light toggle uses GSAP `clip-path` burst from button position — like a ripple spreading across the screen |
| **Star Twinkle** | Footer star (`&#10022;`) twinkles infinitely — subtle cosmic touch |
| **App Shortcuts** | Long-press the home-screen icon for quick access to GitHub, WhatsApp, and Resume |

---

<div align="center">

Built with ❤️ under **Starverse** — Ayush Gupta

</div>
