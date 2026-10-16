# Editing guide

How to make common changes to the website. Every change follows the same pattern:

1. **Edit** the files (any text editor works — TextEdit in plain-text mode, VS Code, etc.).
2. **Preview** on your computer.
3. **Publish** by pushing to GitHub.

All commands below are typed in Terminal. Start every session by going to the site folder:

```sh
cd ~/Desktop/Q_Projects/Art/Website/website_setup_claude/qamart-site
```

---

## Preview your changes

```sh
python3 -m http.server 8000
```

Open http://localhost:8000 in your browser. After each edit, refresh the page (use Cmd+Shift+R if an image doesn't update). Press Ctrl+C in Terminal to stop the preview.

---

## Edit the bio text

Open `index.html` and find the line starting with `<p class="bio">`. Change the text between `<p class="bio">` and `</p>`.

## Edit the search / social-media description

This is the text Google and link previews (WhatsApp, Facebook, etc.) show. It appears **4 times** — twice in `index.html` and twice in `contact/index.html`:

```html
<meta name="description" content="…">
<meta property="og:description" content="…">
```

Change the text inside `content="…"` in all four places. Keep it between about 50 and 160 characters.

## Edit the page titles

- Home page: the `<title>` and `og:title` lines near the top of `index.html`.
- Contact page: the same two lines in `contact/index.html`.

## Change the "Get in touch here." text or "Contact me." heading

- "Get in touch here." is in `index.html` (`<a class="text-link" …>`).
- "Contact me." is in `contact/index.html` (`<h1>`).

> Tip: avoid typing `<`, `>` or `&` in text. If you need `&`, write `&amp;`.

---

## Add a new image

**1. Make the web copy and thumbnail.** Pick the next number and a short lowercase name with hyphens (no spaces), e.g. `33-tiong-bahru-market`. Then run, replacing the source path and the name:

```sh
NAME=33-tiong-bahru-market
SRC="/path/to/original image.jpg"

sips -s format jpeg -s formatOptions 85 -Z 2000 "$SRC" --out images/$NAME.jpg
sips -s format jpeg -s formatOptions 75 -Z 600 images/$NAME.jpg --out images/thumbs/$NAME.jpg
sips -g pixelWidth -g pixelHeight images/$NAME.jpg
```

Tip: to get the path of the original, drag the file from Finder into Terminal.

The last command prints the width and height — note them down.

**2. Add it to the gallery.** In `index.html`, find the block of lines starting with `<a class="tile"`. Copy one of them and paste it where you want the new image to appear (the gallery shows images in the order of these lines). Then update the four values:

```html
<a class="tile" href="images/33-tiong-bahru-market.jpg"><img src="images/thumbs/33-tiong-bahru-market.jpg" alt="Tiong Bahru Market" width="2000" height="1500" loading="lazy" decoding="async"></a>
```

- `href` → the full-size image
- `src` → the thumbnail (note `thumbs/`)
- `alt` → a short description of the artwork (helps search engines and screen readers)
- `width` / `height` → the numbers from step 1. **These must be correct**, otherwise images will overlap or leave gaps in the grid.

## Remove an image

1. In `index.html`, delete that image's `<a class="tile" …>` line.
2. Delete its files: `images/NN-name.jpg` and `images/thumbs/NN-name.jpg`.

The numbers in filenames don't need to stay consecutive — the order on the page comes only from the order of lines in `index.html`. Gaps like 07, 09, 10 are fine.

## Reorder images

Move the `<a class="tile" …>` lines up or down in `index.html`. You don't need to rename any files.

## Replace the featured image (next to the bio)

1. Make the web copy, overwriting the old one:
   ```sh
   sips -s format jpeg -s formatOptions 85 -Z 2000 "/path/to/new image.jpg" --out images/featured.jpg
   sips -g pixelWidth -g pixelHeight images/featured.jpg
   ```
2. In `index.html`, update `width`, `height` and `alt` on the `<img class="featured" …>` line.
3. In **both** `index.html` and `contact/index.html`, update the `og:image:width`, `og:image:height` and `og:image:alt` lines to match.

Social sites cache link previews, so a new featured image can take a few days to appear in shared links.

---

## Change the Instagram link

Search for `instagram.com/qamart.art` — it appears twice in each of `index.html` and `contact/index.html` (header icon and footer). Change all four.

## Set up the contact form (one-time)

1. Create a free account at https://formspree.io and create a new form.
2. Formspree gives you an ID like `xabcdwxy`.
3. In `contact/index.html`, replace `FORMSPREE_ID` with that ID.
4. Submit a test message on the live site and confirm the email arrives.

---

## Publish your changes

Once the site is on GitHub, run these after previewing:

```sh
git add -A
git commit -m "Describe what you changed"
git push
```

GitHub Pages updates the live site at https://www.qamart.art within a minute or two.

## Quick checklist before publishing

- [ ] Previewed on http://localhost:8000 and everything looks right
- [ ] New images have both a full-size file **and** a thumbnail
- [ ] `width` / `height` match the image (no overlapping or gaps in the grid)
- [ ] Every new image has an `alt` description
- [ ] Checked the page on a phone-sized window (make the browser window narrow)
