import Anthropic from '@anthropic-ai/sdk'

const client = new Anthropic()

export async function POST(req: Request) {
  try {
    const { before, after } = await req.json()

    const message = await client.messages.create({
      model: 'claude-opus-4-6',
      max_tokens: 200,
      system: `You are an inline code completion engine for a React sandbox editor.
Complete the code exactly at the cursor position marked <|>.
Rules:
- Return ONLY the raw completion text. No explanations, no markdown, no code fences.
- Complete the current expression, line, or add 1-3 natural follow-up lines.
- Context: React JSX, CSS Modules (import styles from './styles.module.css'), optional Motion (motion/react), optional lodash.
- If nothing meaningful can be completed, return an empty string.`,
      messages: [
        {
          role: 'user',
          content: `${before}<|>${after}`,
        },
      ],
    })

    const completion =
      message.content[0]?.type === 'text' ? message.content[0].text : ''

    return Response.json({ completion: completion.trim() })
  } catch {
    return Response.json({ completion: '' })
  }
}
