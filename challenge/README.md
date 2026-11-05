# Starter files

A small list screen built with HTML, CSS and Bootstrap.

## Run it
Open `index.html` in a browser. No install or server needed.

## Files
- `index.html`: the list screen and search box
- `app.js`: loading, search and the screen states (loading, empty, no results, error)
- `tokens.css`: design tokens and styles
- `data.js`: sample data
- `CLAUDE.md`: rules for AI coding tools

Using GitHub Copilot or Cursor instead of Claude Code? Copy the rules in `CLAUDE.md` into your tool's own rules file.

## Search
Type to filter by name, phone or label. Several words narrow the list ("work alex"),
accents and case are ignored, and phone numbers match with or without formatting.
Press `/` to jump to search and `Escape` to clear it. The query is kept in the URL (`?q=`).
Checks live in `../challenge-checks`.
