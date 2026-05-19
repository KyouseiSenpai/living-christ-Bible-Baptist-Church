# Living Christ Bible Baptist Church — website

A simple, static one-page site shaped like a typical **Bible Baptist church homepage** (welcome, ministries, schedule, live stream, beliefs, outreach, scripture, visit)—with **original** wording and styling so it is not a copy of any other church’s site. Replace placeholders for **city, pastor, contact, photos, and embed URL** before publishing.

## Temporary photos

The hero, welcome, and outreach sections use **Unsplash** URLs as stand-ins. Search `TEMP IMAGE` in `index.html` to find each `<img>`. Replace `src` with a path to your own files (see `images/README.txt`) or with another host you control.

## Live broadcast (embedded player)

The **Live broadcast** section uses a responsive 16:9 `<iframe>`. Replace the `src` on `.broadcast-frame` with your embed URL, for example:

- **YouTube (live or recorded):** `https://www.youtube-nocookie.com/embed/VIDEO_ID`  
  In YouTube: Share → Embed → copy only the `src` from their iframe.

- **Facebook Live:** use Meta’s embed code from your page’s video; paste their iframe (you may need a Facebook Page and embed permissions).

Update the two placeholder links under the player (YouTube channel, Facebook page) with your real URLs.

## Files

- `index.html` — structure and text
- `images/` — optional local photos (`README.txt` inside explains filenames)
- `styles.css` — styling
- `script.js` — mobile menu + copyright year

## Theme

Warm, traditional **church** presentation: cream paper backgrounds, **navy** and **burgundy** accents, **Cormorant Garamond** (headings) + **Source Sans 3** (body), gold trim on the hero and footer. **Nav works like separate pages:** each menu item shows **only that section** (Welcome, Ministries, Schedule, etc.)—click another link to switch views instantly. Click the **logo** for the home hero. The slide-in **phone / tablet** menu works on small screens.

## View locally

Open `index.html` in your browser, or from this folder run:

```bash
npx --yes serve .
```

Then follow the URL shown in the terminal.

## Logo

The navbar logo is an **inline SVG** in `index.html` (inside `.brand-logo`). You can swap it for your own SVG or PNG; if you use an image file, add `<img src="logo.png" alt="Living Christ Bible Baptist Church" width="44" height="44" />` inside `.brand-logo` and remove the SVG.

## Fonts

The page loads [Google Fonts](https://fonts.google.com/) (**Cormorant Garamond** for titles, **Source Sans 3** for body). For offline use, self-host the font files and add `@font-face` rules in `styles.css`.
