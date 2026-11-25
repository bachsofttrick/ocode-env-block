import { findProtectedEnvReference } from "./matcher.ts"

// Shell commands reference .env files as permission resources. Denying them
// here covers the model's shell tool and every agent, including ones that
// allow all shell commands.
export default {
  id: "env-guard",
  async setup(ctx) {
    await ctx.permission.hook("evaluate", (event) => {
      if (event.action !== "shell") return

      const reference = event.resources
        .map(findProtectedEnvReference)
        .find((value) => value !== undefined)
      if (reference === undefined) return

      event.effect = "deny"
      event.message = [
        "env-guard blocked this shell command because it references a .env file.",
        `Matched: ${reference}`
      ].join("\n")
    })
  },
}
