// Matches .env, .env.local, .env.production, and config.env in a command line.
// Over-matches on purpose: a quoted or escaped mention is still blocked.
const PROTECTED_ENV_FILE =
  /(?<![\w.-])(?:\.env(?:\.[\w-]+)*|[\w.-]+\.env)(?![\w.-])/i

// Committed templates hold placeholders instead of credentials, so a command
// may read them. Any other .env reference in the same command still blocks.
const ALLOWED_TEMPLATE_NAMES = new Set([".env.example"])

const PROTECTED_ENV_FILE_ALL = new RegExp(PROTECTED_ENV_FILE.source, "gi")

function getFileName(reference: string): string {
  const separator = Math.max(reference.lastIndexOf("/"), reference.lastIndexOf("\\"))
  return reference.slice(separator + 1)
}

export function findProtectedEnvReference(text: string): string | undefined {
  for (const match of text.matchAll(PROTECTED_ENV_FILE_ALL)) {
    const reference = match[0].trim()
    if (!ALLOWED_TEMPLATE_NAMES.has(getFileName(reference))) return reference
  }
  return undefined
}

export function isProtectedEnvReference(text: string): boolean {
  return findProtectedEnvReference(text) !== undefined
}
