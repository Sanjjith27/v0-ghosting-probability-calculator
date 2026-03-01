"use client"

import { useState, useCallback } from "react"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { GhostingCalculator, ResultDisplay } from "@/components/ghosting-calculator"
import { AIChatbot } from "@/components/ai-chatbot"
import { HistoryPanel } from "@/components/history-panel"
import { GhostMascot } from "@/components/ghost-mascot"
import { Button } from "@/components/ui/button"
import { Calculator, MessageSquare, BarChart3, ArrowLeft, Sparkles } from "lucide-react"

interface AnalysisResult {
  probability: number
  sentiment: { label: string; score: number }
  category: string
  message: string
  breakdown: {
    replyDelay: number
    seenIgnored: number
    messageLengthDrop: number
    initiationRatio: number
    toneChange: number
    socialMedia: number
    sentimentImpact: number
  }
}

interface HistoryEntry {
  id: string
  date: string
  probability: number
  category: string
  sentiment: string
  timestamp: number
}

interface DashboardProps {
  onBack: () => void
}

export function Dashboard({ onBack }: DashboardProps) {
  const [result, setResult] = useState<AnalysisResult | null>(null)
  const [history, setHistory] = useState<HistoryEntry[]>([])
  const [activeTab, setActiveTab] = useState("calculator")

  const handleResult = useCallback((r: AnalysisResult) => {
    setResult(r)
  }, [])

  const handleSaveToHistory = useCallback((r: AnalysisResult) => {
    const entry: HistoryEntry = {
      id: Date.now().toString(),
      date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }),
      probability: r.probability,
      category: r.category,
      sentiment: r.sentiment.label,
      timestamp: Date.now(),
    }
    setHistory(prev => [...prev, entry])
  }, [])

  const handleReset = useCallback(() => {
    setResult(null)
  }, [])

  return (
    <div className="min-h-screen flex flex-col">
      {/* Top bar */}
      <header className="glass border-b border-border/30 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={onBack} className="text-muted-foreground hover:text-foreground h-8 w-8">
              <ArrowLeft className="w-4 h-4" />
              <span className="sr-only">Back to home</span>
            </Button>
            <div className="flex items-center gap-2">
              <GhostMascot mood="happy" size={32} className="[animation-duration:4s]" />
              <span className="text-sm font-bold text-foreground hidden sm:inline">GhostSense<span className="text-primary">AI</span></span>
            </div>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="mx-auto">
            <TabsList className="bg-secondary/80 border border-border/30">
              <TabsTrigger value="calculator" className="gap-1.5 text-xs data-[state=active]:text-primary">
                <Calculator className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Analyzer</span>
              </TabsTrigger>
              <TabsTrigger value="chatbot" className="gap-1.5 text-xs data-[state=active]:text-primary">
                <MessageSquare className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">AI Advisor</span>
              </TabsTrigger>
              <TabsTrigger value="history" className="gap-1.5 text-xs data-[state=active]:text-primary">
                <BarChart3 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">History</span>
                {history.length > 0 && (
                  <span className="ml-1 w-5 h-5 rounded-full bg-primary/20 text-primary text-xs flex items-center justify-center">
                    {history.length}
                  </span>
                )}
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="w-8" />
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 max-w-2xl w-full mx-auto px-4 py-6">
        {activeTab === "calculator" && (
          <div className="animate-fade-up">
            {result ? (
              <ResultDisplay result={result} onReset={handleReset} onSaveToHistory={handleSaveToHistory} />
            ) : (
              <GhostingCalculator onResult={handleResult} />
            )}
          </div>
        )}

        {activeTab === "chatbot" && (
          <div className="animate-fade-up h-[calc(100vh-120px)] glass neon-border rounded-2xl overflow-hidden">
            <AIChatbot />
          </div>
        )}

        {activeTab === "history" && (
          <div className="animate-fade-up">
            <HistoryPanel
              history={history}
              onClear={() => setHistory([])}
              onDelete={(id) => setHistory(prev => prev.filter(h => h.id !== id))}
            />
          </div>
        )}
      </main>
    </div>
  )
}
