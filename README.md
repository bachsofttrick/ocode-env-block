# env-guard

OpenCode plugin that blocks shell commands which reference a `.env` file.

The guard hooks permission evaluation for the `shell` action and turns the
decision into a `deny` with an explanation the model can read. It applies to
every agent, including agents that allow all shell commands.

## Protected names

- `.env`
- `.env.local`, `.env.production`, and other `.env.*` variants
- `config.env` and other `*.env` names

Matching is case-insensitive and ignores quoting, so `cat ".env"` is caught.

## Exceptions

`.env.example` is allowed because it is a committed template that holds
placeholders, not credentials. The name must match exactly, so `.env.example.bak`
and `.env.example.local` stay blocked. Every `.env` reference in a command is
checked, so `cp .env.example .env` and `diff .env .env.example` stay blocked.

## Not covered

- Native `read`, `write`, and `edit` tools. Global `opencode.json` already
  denies those for `.env` files.
- Paths built at runtime, such as `cat $(printf .%s env)` or `cat .e''nv`.
  The check is textual by design.

## Disable

Remove or rename this directory, or add `-env-guard` to `plugins` in
`~/.config/opencode/opencode.json`.

## Test

```sh
bun test
```
