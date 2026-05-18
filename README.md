# Spotify Wrapped — SuperFan funnel

Clickable Wrapped-style prototype for the SuperFan acquisition funnel.

## Flow

1. **Home** — Spotify home with a prominent "Your 2025 Wrapped" card
2. **Story view** — 5 fullscreen slides, story-style navigation:
   1. Intro: "You listened. We counted."
   2. Minutes: 78,432 minutes / 86 days
   3. Top genres
   4. **Top artist (Playboi Carti)** — "You're in the top 1% of fans" + **Become SuperFan** CTA
   5. Wrap card — polaroid-style 2025 recap
3. **Success** — SuperFan confirmation

## Controls

- Tap right half of a slide → next; left half → previous
- Keyboard: ←/→ to navigate, Esc to close
- The Become SuperFan button (slide 4) routes to the success screen

## Structure

- `index.html` — home + story viewer + success screen
- `styles.css` — Spotify Wrapped aesthetics, per-slide palettes
- `app.js` — story navigation and screen routing
- `carti-avatar.jpg` — top artist photo (slide 4 + wrap card)

## Local run

Open `index.html` in a browser — static site, no build step.

## Deploy

Hosted on GitHub Pages. Pushing to `main` triggers an automatic rebuild.
