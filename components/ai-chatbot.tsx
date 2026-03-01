"use client"

import { useState, useRef, useEffect } from "react"
import { useChat } from "@ai-sdk/react"
import { DefaultChatTransport } from "ai"
import { Button } from "@/components/ui/button"
import { GhostMascot } from "@/components/ghost-mascot"
import { Send, Bot, User, AlertTriangle } from "lucide-react"

const STARTER_PROMPTS = [
  "They take hours to reply but are always online. Red flag?",
  "How do I know if someone is losing interest?",
  "What are the biggest signs someone will ghost me?",
  "They suddenly started giving one-word replies. Help!",
  "Is it ghosting if they still watch my stories?",
  "How can I improve my texting game?",
]

export function AIChatbot() {
  const [input, setInput] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const { messages, sendMessage, status, error } = useChat({
    transport: new DefaultChatTransport({ api: "/api/chat" }),
  })

  const isLoading = status === "streaming" || status === "submitted"
  const errorMessage = error
    ? error.message.includes("credit card") || error.message.includes("AI Gateway") || error.message.includes("402")
      ? "AI Gateway requires billing setup. Add a credit card in your Vercel dashboard (Settings > Billing) to unlock free AI credits, then try again."
      : `Something went wrong: ${error.message}`
    : null

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return
    sendMessage({ text: input })
    setInput("")
  }

  const handleStarterClick = (prompt: string) => {
    if (isLoading) return
    sendMessage({ text: prompt })
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center gap-3 p-4 border-b border-border/30">
        <div className="relative">
          <GhostMascot mood="happy" size={40} className="[animation-duration:4s]" />
          <div className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-success border-2 border-background" />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-foreground">AI Relationship Advisor</h3>
          <p className="text-xs text-muted-foreground">
            {isLoading ? "Typing..." : "Online - Ask me anything about relationships"}
          </p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center py-8">
            <GhostMascot mood="happy" size={100} className="mb-6" />
            <h3 className="text-lg font-semibold text-foreground mb-2">Hey there!</h3>
            <p className="text-sm text-muted-foreground mb-6 max-w-sm leading-relaxed">
              {"I'm your AI relationship advisor. Ask me anything about dating, communication patterns, or interpreting someone's behavior."}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full max-w-md">
              {STARTER_PROMPTS.map((prompt) => (
                <button
                  key={prompt}
                  onClick={() => handleStarterClick(prompt)}
                  className="text-left text-xs p-3 rounded-lg glass neon-border hover:border-primary/50 text-muted-foreground hover:text-foreground transition-all duration-200"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex gap-3 animate-fade-up ${
              message.role === "user" ? "flex-row-reverse" : ""
            }`}
          >
            <div className={`flex items-center justify-center w-8 h-8 rounded-full shrink-0 ${
              message.role === "user"
                ? "bg-primary/20"
                : "bg-secondary"
            }`}>
              {message.role === "user" ? (
                <User className="w-4 h-4 text-primary" />
              ) : (
                <Bot className="w-4 h-4 text-primary" />
              )}
            </div>
            <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
              message.role === "user"
                ? "bg-primary text-primary-foreground rounded-tr-sm"
                : "glass neon-border text-foreground rounded-tl-sm"
            }`}>
              {message.parts.map((part, index) => {
                if (part.type === "text") {
                  return <span key={index} className="whitespace-pre-wrap">{part.text}</span>
                }
                return null
              })}
            </div>
          </div>
        ))}

        {isLoading && messages[messages.length - 1]?.role === "user" && (
          <div className="flex gap-3 animate-fade-up">
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-secondary shrink-0">
              <Bot className="w-4 h-4 text-primary" />
            </div>
            <div className="glass neon-border rounded-2xl rounded-tl-sm px-4 py-3">
              <div className="flex gap-1">
                <div className="w-2 h-2 rounded-full bg-primary/60 animate-bounce" style={{ animationDelay: "0ms" }} />
                <div className="w-2 h-2 rounded-full bg-primary/60 animate-bounce" style={{ animationDelay: "150ms" }} />
                <div className="w-2 h-2 rounded-full bg-primary/60 animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
            </div>
          </div>
        )}

        {errorMessage && (
          <div className="flex gap-3 animate-fade-up">
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-destructive/20 shrink-0">
              <AlertTriangle className="w-4 h-4 text-destructive" />
            </div>
            <div className="max-w-[80%] rounded-2xl rounded-tl-sm px-4 py-3 text-sm leading-relaxed bg-destructive/10 border border-destructive/30 text-foreground">
              {errorMessage}
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="p-4 border-t border-border/30">
        <div className="flex gap-2">
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about relationship patterns..."
            disabled={isLoading}
            className="flex-1 bg-secondary/50 border border-border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all disabled:opacity-50"
          />
          <Button
            type="submit"
            disabled={!input.trim() || isLoading}
            size="icon"
            className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl h-[46px] w-[46px] shrink-0"
          >
            <Send className="w-4 h-4" />
            <span className="sr-only">Send message</span>
          </Button>
        </div>
      </form>
    </div>
  )
}
