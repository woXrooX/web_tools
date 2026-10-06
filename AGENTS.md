# AGENTS.md

Rules for anyone changing this repo: people and AI coding agents alike.
Read this file before making any change. It is the single place for repo-wide rules.

## How this file works

- The owner adds rules here over time. Put each rule under the section it belongs to, one line, written as an instruction. Add the reason when it is not obvious.
- Rules here apply to every tool. A tool may add its own rules in a protocol block at the top of its script (see "Tool protocol blocks"). That block adds detail; it does not override this file. If the two conflict, stop and ask.
- Agents: when a change creates a new repo-wide convention, propose adding it here. Do not add rules on your own.

## Repository

- Static site served by GitHub Pages at https://woxroox.github.io/web_tools/. No build step, no package manager, no framework.
- Layout: `index.html` (tool list), `styles/core.css` (shared design layer), `images/Favicon/` (shared icons), `source/<tool>/index.html` (one folder per tool).
- Never rename a tool folder. Its URL is public and people link to it.
- Each tool is one self-contained `index.html`: its own `<style>` and `<script>` inline, plus the shared `core.css`.
- Tools work offline and stay private: no CDNs, no external fonts, no analytics, no requests to third parties at runtime. Third-party assets (icons and the like) are copied into the file with a license credit in a comment.
- Use relative paths such as `../../styles/core.css`. The site is served under `/web_tools/`, so root-relative paths (`/styles/...`) break on GitHub Pages.

### Adding a new tool

1. Create `source/<tool_name>/index.html`.
2. Copy the `<head>` pattern from an existing tool: favicon links, `theme-color`, a `title` and a `meta description`, and `../../styles/core.css`.
3. Start the body with the shared `site_bar` navigation.
4. Add the tool to the list in the root `index.html`, alphabetically and ignoring case.

## Design

- Use the tokens in `styles/core.css`. Do not introduce new colors for the interface.
- The palette follows the owner's Portfolio repo. There is one accent for the whole site, and it is monochrome. Red is reserved for errors and destructive actions.
- Use the radius, shadow and spacing tokens rather than new values.
- Tool-specific layout lives in the tool's own `<style>` block. Move anything that becomes shared into `core.css`.
- Interface text is sentence case, in plain words.
- Every tool must work with mouse, keyboard, touch, and Apple Pencil on iPad. Keep touch targets large enough for a fingertip.

## Code style

These apply to code you write or change. Do not reformat untouched legacy code.

### All languages

- snake_case for every identifier you define. Built-in APIs keep their own names.
- No vertical or columnar alignment. Separate tokens with a single space.

### JavaScript

- Vanilla JavaScript only, no frameworks.
- Tabs for indentation.
- Always end statements with a semicolon. Do not rely on automatic semicolon insertion.
- A single-statement `if` has no braces. Keep it on one line when short; otherwise put the body on the next line, indented one tab.
- Use braces when the body has several statements, when an `else` would be ambiguous, or when any branch of an `if` / `else` chain needs them (then brace every branch).
- Single-line comments use `// comment`.
- Multi-line comments put `/*` and `*/` on their own lines, with the text between indented one tab and no leading `*` on each line.
- Imports use root-relative paths (`"/path/b.js"`), not `./` or `../`, unless technically necessary. Tool pages are single files, so this rarely comes up.

### Python

- Tabs for indentation, no type hints.

### PostgreSQL

- Always wrap table names in double quotes.
- Do not alias tables or columns unless it is technically necessary.

## Working on a change

1. Read this file, then the protocol block of the tool you are changing.
2. Keep saved data backward compatible. New stored fields are optional and have a default. Never rename or repurpose a stored key. Files saved by older versions must still open.
3. When you change a tool's architecture, invariants or the places a feature touches, update that tool's protocol block in the same change.
4. When a feature is added, removed or declined, record it in the tool's decisions list, so it is not added back by accident.
5. If the tool publishes a spec for AI (a description of its file format that other AIs read to write files for it), update that spec in the same change whenever what a file can hold, or how a file is read, changes. A stale spec makes AIs write broken files.
6. Keep the change scoped to what was asked. No unrelated refactors.
7. Before finishing: no console errors, test with mouse and touch, reload the page, and check save, open and export where the tool has them.

## Tool protocol blocks

A tool with enough internal structure keeps a protocol block as the first thing inside its `<script>`. It holds:

- a map of the script's sections, in order;
- invariants that must not break;
- checklists for common changes (for example, "adding an element type");
- the spec for AI, if the tool has one, and which code feeds it;
- a manual test list;
- decisions: features added, removed or declined, and why.

Tools that have a protocol block:

- `source/infinite_canvas/index.html` (also publishes a spec for AI: "Format for AI" in the sidebar, built by `format_spec()`)

## Decisions (repo-wide)

- `favicon_generator` was renamed to `favicon_and_OGP`. This is the one allowed exception to the no-rename rule; the old URL is handled by the owner.
