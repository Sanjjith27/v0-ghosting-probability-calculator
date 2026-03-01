import {
  consumeStream,
  convertToModelMessages,
  streamText,
  UIMessage,
} from "ai"

export const maxDuration = 30

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json()

  const result = streamText({
    model: "openai/gpt-5-mini",
    system: `You are GhostSense AI, a witty and empathetic AI relationship advisor. You specialize in:
- Analyzing communication patterns and relationship dynamics
- Providing advice on modern dating and texting behavior
- Interpreting ghosting signals and red flags
- Offering constructive communication strategies
- Being supportive while keeping things light and fun

Your personality is warm, slightly humorous, and perceptive. You use casual language but are genuinely insightful.
You sometimes reference the "ghosting probability" concept. Keep responses concise (2-4 paragraphs max).
Never provide medical or professional therapy advice - always recommend professional help for serious concerns.`,
    messages: await convertToModelMessages(messages),
    abortSignal: req.signal,
  })

  return result.toUIMessageStreamResponse({
    originalMessages: messages,
    consumeSseStream: consumeStream,
  })
}
