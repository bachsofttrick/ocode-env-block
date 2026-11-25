import { describe, expect, test } from "bun:test"
import { findProtectedEnvReference, isProtectedEnvReference } from "./matcher.ts"

describe("isProtectedEnvReference", () => {
  const blocked = [
    "cat .env",
    "cat ./.env",
    "cat /srv/app/.env.local",
    "echo KEY=value > .env",
    "rm -f .env.production",
    "cat config.env",
    "grep -rn .env src",
    'grep -n ".env" .',
    "source ../.env",
    "docker compose --env-file .env.local up",
    "cat .env.example.bak",
    "cat .env.example.local",
    "cp .env.example .env",
    "diff .env .env.example",
    "cat .env.example > .env",
  ]

  const allowed = [
    "git status",
    "ls -la",
    "cat .envrc",
    "cat .environment",
    "echo environment",
    "cat env.local",
    "printenv",
    "cat .env.example",
    "cat ./.env.example",
    "cat /srv/app/.env.example",
    "grep -n AI_MODEL .env.example",
  ]

  for (const command of blocked) {
    test(`blocks: ${command}`, () => {
      expect(isProtectedEnvReference(command)).toBe(true)
    })
  }

  for (const command of allowed) {
    test(`allows: ${command}`, () => {
      expect(isProtectedEnvReference(command)).toBe(false)
    })
  }

  test("returns the matched reference", () => {
    expect(findProtectedEnvReference("echo KEY=value > .env")).toBe(".env")
    expect(findProtectedEnvReference("cat /srv/app/.env.local")).toBe(".env.local")
    expect(findProtectedEnvReference("cat config.env")).toBe("config.env")
    expect(findProtectedEnvReference("cp .env.example .env")).toBe(".env")
    expect(findProtectedEnvReference("cat .env.example")).toBeUndefined()
  })
})
