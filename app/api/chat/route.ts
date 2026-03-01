import {
  convertToModelMessages,
  streamText,
  UIMessage,
} from "ai"

export const maxDuration = 30

export async function POST(req: Request) {
  try {
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
    })
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "An unexpected error occurred"
    const isGatewayError = message.includes("credit card") || message.includes("AI Gateway")
    return new Response(
      JSON.stringify({
        error: isGatewayError
          ? "AI Gateway requires billing setup. Please add a credit card in your Vercel dashboard to unlock free AI credits."
          : message,
      }),
      { status: isGatewayError ? 402 : 500, headers: { "Content-Type": "application/json" } }
    )
  }
}
