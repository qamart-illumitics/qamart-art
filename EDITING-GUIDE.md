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

# Shrink only if the long side is over 2000px (never enlarge — that blurs the image)
W=$(sips -g pixelWidth "$SRC" | awk '/pixelWidth/{print $2}'); H=$(sips -g pixelHeight "$SRC" | awk '/pixelHeight/{print $2}')
if [ $W -gt 2000 ] || [ $H -gt 2000 ]; then RESIZE="-Z 2000"; else RESIZE=""; fi
sips -s format jpeg -s formatOptions 85 $RESIZE "$SRC" --out images/$NAME.jpg
sips -s format jpeg -s formatOptions 75 -Z 600 images/$NAME.jpg --out images/thumbs/$NAME.jpg
sips -g pixelWidth -g pixelHeight images/$NAME.jpg
```

Tip: to get the path of the original, drag the file from Finder into Terminal.

The last command prints the width and height — note them down.

> **Why not just `sips -Z 2000`?** `-Z` resizes to *exactly* 2000px on the long side, so a smaller original gets stretched up and looks blurry. The lines above only shrink large images. For the sharpest result, start from the highest-resolution scan or photo you have.

> **Dark border along an edge?** Crop it off the original first. For example, to remove 6px from the left of a 1179×1371 image: `sips -c 1371 1173 --cropOffset 0 6 "$SRC" --out ~/Desktop/cropped.jpg` (new height, new width, then how many pixels to skip from the top and left), and use the cropped file as `SRC`.

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

1. Make the web copy, overwriting the old one (drop `-Z 2000` if the original's long side is 2000px or less, so it isn't enlarged):
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

## Contact form

Messages are sent through Formspree (form ID `xjygjlkg`) and arrive by email. Manage the form, see past submissions and change the receiving address at https://formspree.io.

- **Change the email subject line:** in `contact/index.html`, edit the `value` of `<input type="hidden" name="_subject" …>`.
- **Change the thank-you message:** in `contact/index.html`, edit the text of `<p class="form-thanks" …>`.
- **Switch to a different Formspree form:** replace `xjygjlkg` in the form's `action="https://formspree.io/f/xjygjlkg"`.

After any change, submit a test message on the live site and confirm the email arrives.

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
