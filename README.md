# ask.pictures landing page

Static coming-soon website for `ask.pictures`.

## Files

- `index.html` - page content and structure
- `styles.css` - responsive minimal portfolio-style design
- `script.js` - small interactions and email waitlist mailto flow
- `assets/floating-ask-image.jpg` - floating image used in the animated page effect
- `assets/place-cafe.jpg`, `assets/place-rooftop.jpg`, `assets/place-gallery.jpg` - downloaded CC BY 4.0 photos used in the app mockup
- `.htaccess` - cPanel/Apache security headers and directory-listing protection

## cPanel upload

1. Open cPanel.
2. Go to **File Manager**.
3. Open the `public_html` folder for `ask.pictures`.
4. Enable hidden files in File Manager settings if `.htaccess` is not visible.
5. Upload `index.html`, `styles.css`, `script.js`, `.htaccess`, and the full `assets` folder.
6. Visit `https://ask.pictures`.

Keep `.git`, `.DS_Store`, and `output` out of `public_html`; they are local project files and should not be uploaded.

The waitlist form is static. It opens an email draft to `hello@ask.pictures`.
Create that mailbox in cPanel, or replace the address in `script.js`.
