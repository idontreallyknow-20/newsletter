import Anthropic from '@anthropic-ai/sdk'
import { extractText, parseIssue, translationPrompt } from '@/lib/generation'

export const TRANSLATE_MODEL = 'claude-haiku-4-5'

/** Translate an issue to Simplified Chinese. Throws on failure or timeout. */
export async function translateIssue(client: Anthropic, subject: string, markdown: string, timeoutMs = 20_000) {
  const res = await client.messages.create({
    model: TRANSLATE_MODEL,
    max_tokens: 3000,
    messages: [{ role: 'user', content: translationPrompt(subject, markdown) }],
  }, { timeout: timeoutMs })
  return parseIssue(extractText(res.content), subject)
}
