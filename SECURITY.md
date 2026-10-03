# Security

## Supported version

The current `main` branch and the latest 1.x version receive fixes. Older revisions and historical exports are not maintained.

## Reporting

Use [GitHub private vulnerability reporting](https://github.com/Hostlife22/cat-through-time/security/advisories/new) if the repository offers it. Do not post credentials or sensitive exploit details in a public issue. If private reporting is unavailable, open a non-sensitive issue asking the maintainer to arrange a private channel. Ordinary bugs can be reported through [GitHub Issues](https://github.com/Hostlife22/cat-through-time/issues). No response deadline or unverified email address is specified.

## Project scope

This is a static browser application with local assets. It has no backend, authentication, analytics, account system, or user-data persistence. Audio and video are generated locally by developer commands; the browser does not execute Python or shell scripts. External credit links are informational.

Install dependencies from the committed lockfile with `npm ci`. CI checks formatting, lint, types, the build, and browser behavior using read-only repository permissions. The Pages workflow can publish the exact commit from a successful CI push to `main`; only that workflow receives Pages and identity-token write permissions. Pull requests do not publish. Do not commit credentials, private reference material, browser profiles, or sensitive data in generated artifacts. Project and third-party licenses are documented separately.
