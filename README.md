# Qamar Tahasildar Art

Static site for [www.qamart.art](https://www.qamart.art), replacing the old Squarespace site. Plain HTML, CSS and JavaScript — no framework or build step — hosted on GitHub Pages.

## Structure

```
index.html          Home: bio, featured image, gallery
contact/index.html  Contact form
css/style.css       All styles
js/main.js          Masonry layout and lightbox
js/contact.js       Contact form submission and thank-you message
images/             featured.jpg + numbered gallery images (01-…, 02-…)
images/thumbs/      600px versions of the gallery images for the grid
favicon.png
CNAME               Custom domain for GitHub Pages
```

## Preview locally

```sh
python3 -m http.server 8000
```

Then open http://localhost:8000.

## Common edits

Step-by-step instructions for every common change are in [EDITING-GUIDE.md](EDITING-GUIDE.md). In short:

- **Add or reorder artwork:** put the JPEG in `images/` with a numbered name (long side at most 2000px — shrink larger originals, but never enlarge smaller ones), make its grid thumbnail with `sips -s format jpeg -s formatOptions 75 -Z 600 images/NN-name.jpg --out images/thumbs/`, then add or move its `<a class="tile">` line in `index.html`. The grid shows `images/thumbs/`; the lightbox opens the full-size file. Keep the `width` and `height` attributes accurate (`sips -g pixelWidth -g pixelHeight file.jpg`); the masonry layout uses them.
- **Contact form:** posts to [Formspree](https://formspree.io) form `xjygjlkg`. `js/contact.js` sends it in the background and shows the thank-you message on the page; without JavaScript it falls back to Formspree's own thank-you page.

## Deploy

Push to a GitHub repository, enable Pages (Settings → Pages → deploy from the `main` branch, root folder), and point the `qamart.art` DNS at GitHub Pages. `images/all/` and `contact-sheet.html` are working files and are excluded by `.gitignore`.
