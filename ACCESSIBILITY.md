# Accessibility

The app uses English interface text, semantic headings, native buttons, descriptive links, visible keyboard focus, and a **Skip to film** link that moves focus to the preview. The player does not steal focus on load or playback changes. A text description explains the journey through sixteen styles and the cat knocking the cup from the table. The Canvas image has an accessible name; ornamental icons are hidden from assistive technology.

Era buttons expose their selected state through `aria-pressed`. They pause playback and move to a settled frame of the chosen era. The player offers playback, seeking, and volume controls. Its play/pause button supports Enter and Space while focused. **Play again** restarts playback; **Download MP4** is available after export. Main app controls have touch targets of at least 44 pixels.

Playback starts paused, including when `prefers-reduced-motion` is enabled. Reduced motion removes interface transitions and smooth scrolling. The film remains animated when a user explicitly starts playback; they can pause, seek, or choose a still era. The soundtrack contains music and sound effects, with no spoken dialogue. The action is also described in text.

Layouts adapt to desktop, tablet, and mobile widths without horizontal overflow. Display fonts are served locally and have system fallbacks. If preview rendering fails, a text error explains how to reload or use the exported film.

Browser checks cover keyboard navigation, skip-link focus, era selection, replay, touch-target size, label fitting, three viewport widths, reduced-motion CSS, and browser errors. Visual animation is not fully conveyed by the text description. No formal WCAG certification or comprehensive screen-reader/device audit is claimed.

Report accessibility barriers through [GitHub Issues](https://github.com/Hostlife22/cat-through-time/issues), including the affected control, browser, input method or assistive technology, and reproduction steps when possible.
