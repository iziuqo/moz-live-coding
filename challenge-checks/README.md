# Go-live checks for the contacts search

Kept outside `challenge/` so the app itself stays dependency-free.
Runs the real page in headless Chromium and checks 36 things: loading, search
(name, phone, label, multi-word, accents), no-results, empty, error + retry,
XSS, keyboard (`/`, Escape, Enter), URL deep link, axe accessibility scan,
mobile width and reduced motion.

```sh
npm i --no-save playwright axe-core bootstrap@5.3.3
node challenge-checks/search.check.js            # prints PASS/FAIL per check
node challenge-checks/search.check.js ./shots    # also saves screenshots
```
