# Repository instructions

## Project overview

- This is a static website published with GitHub Pages from `main`.
- The site currently uses plain HTML, CSS, and assets in `images/`; it has no package manifest or application version file.
- Keep the site simple and compatible with static hosting unless the user asks for a different setup.

## Versioning

- Do not bump a version for routine website edits. There is currently no application version to maintain.
- For a release explicitly requested by the user, use semantic version tags in the form `vMAJOR.MINOR.PATCH`:
  - `PATCH` for fixes and small polish.
  - `MINOR` for backwards-compatible features or substantial content additions.
  - `MAJOR` only for a significant breaking redesign or change in site behavior.
- Do not create or push release tags unless the user asks for a release.

## Branches

- Start feature branches from the latest `main`.
- Use lowercase, hyphen-separated names with one of these prefixes:
  - `feature/` for new site features or sections.
  - `fix/` for corrections and bugs.
  - `docs/` for documentation and repository instructions.
  - `chore/` for maintenance and asset organization.
- Keep each branch focused on one change.
- Do not commit directly to `main`; use a pull request.

## Commits

- Use Conventional Commit subjects in the form `type: concise description`.
- Common types: `feat`, `fix`, `docs`, `style`, `refactor`, and `chore`.
- Use imperative wording and keep the subject short, for example `docs: add repository workflow instructions`.
- Add a commit body when it helps explain the reason, relevant details, or user-visible impact. Separate the subject and body with a blank line.
- Do not commit or push unless the user explicitly asks.

## Website and assets

- Keep image and other static assets in `images/`.
- Use descriptive, lowercase, hyphen-separated filenames. Update every reference in `index.html` when an asset is renamed.
- Preserve meaningful alternative text for images and titles for embedded media.
- Keep the layout responsive and avoid adding a build step unless requested.
- Check that local asset paths resolve after changing the site.

## Publishing

- GitHub Pages publishes from `main`; merging a pull request into `main` deploys the site.
- Do not merge or publish a pull request unless the user explicitly asks.
