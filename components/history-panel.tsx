"use client"

import { BarChart3, Trash2, TrendingDown, TrendingUp, Minus } from "lucide-react"
import { Button } from "@/components/ui/button"

interface HistoryEntry {
  id: string
  date: string
  probability: number
  category: string
  sentiment: string
  timestamp: number
}

interface HistoryPanelProps {
  history: HistoryEntry[]
  onClear: () => void
  onDelete: (id: string) => void
}

export function HistoryPanel({ history, onClear, onDelete }: HistoryPanelProps) {
  if (history.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full py-16 text-center">
        <BarChart3 className="w-12 h-12 text-muted-foreground/30 mb-4" />
        <h3 className="text-lg font-semibold text-foreground mb-2">No History Yet</h3>
        <p className="text-sm text-muted-foreground max-w-xs">
          Run your first analysis to start tracking your results over time.
        </p>
      </div>
    )
  }

  const avgRisk = Math.round(history.reduce((sum, h) => sum + h.probability, 0) / history.length)
  const highestRisk = Math.max(...history.map(h => h.probability))
  const lowestRisk = Math.min(...history.map(h => h.probability))

  const trend = history.length >= 2
    ? history[history.length - 1].probability - history[history.length - 2].probability
    : 0

  return (
    <div className="space-y-6 p-1">
      {/* Stats */}
      <div className="grid grid-cols-2 gap-3">
        {[
          { label: "Total Analyses", value: history.length, color: "text-primary" },
          { label: "Average Risk", value: `${avgRisk}%`, color: avgRisk <= 30 ? "text-success" : avgRisk <= 60 ? "text-warning" : "text-danger" },
          { label: "Highest Risk", value: `${highestRisk}%`, color: "text-danger" },
          { label: "Lowest Risk", value: `${lowestRisk}%`, color: "text-success" },
        ].map((stat) => (
          <div key={stat.label} className="glass neon-border rounded-xl p-4">
            <span className="text-xs text-muted-foreground">{stat.label}</span>
            <div className={`text-2xl font-bold ${stat.color} mt-1 tabular-nums animate-count-up`}>
              {stat.value}
            </div>
          </div>
        ))}
      </div>

      {/* Trend */}
      {history.length >= 2 && (
        <div className="glass neon-border rounded-xl p-4 flex items-center gap-3">
          {trend > 0 ? (
            <TrendingUp className="w-5 h-5 text-danger" />
          ) : trend < 0 ? (
            <TrendingDown className="w-5 h-5 text-success" />
          ) : (
            <Minus className="w-5 h-5 text-warning" />
          )}
          <div>
            <span className="text-sm font-medium text-foreground">
              {trend > 0 ? "Risk is increasing" : trend < 0 ? "Risk is decreasing" : "Risk is stable"}
            </span>
            <p className="text-xs text-muted-foreground">
              {trend > 0
                ? `Up ${trend} points from last analysis`
                : trend < 0
                ? `Down ${Math.abs(trend)} points from last analysis`
                : "No change from last analysis"}
            </p>
          </div>
        </div>
      )}

      {/* Mini chart */}
      {history.length >= 2 && (
        <div className="glass neon-border rounded-xl p-4">
          <h4 className="text-xs text-muted-foreground mb-3">Risk Over Time</h4>
          <div className="flex items-end gap-1 h-20">
            {history.slice(-12).map((entry, i) => (
              <div
                key={entry.id}
                className="flex-1 rounded-t transition-all duration-500"
                style={{
                  height: `${Math.max(entry.probability, 5)}%`,
                  background: entry.probability <= 30 ? "oklch(0.72 0.19 155)" : entry.probability <= 60 ? "oklch(0.80 0.18 85)" : "oklch(0.65 0.25 25)",
                  animationDelay: `${i * 50}ms`,
                }}
                title={`${entry.probability}% - ${entry.date}`}
              />
            ))}
          </div>
        </div>
      )}

      {/* History list */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-medium text-foreground">Analysis History</h4>
          <Button variant="ghost" size="sm" onClick={onClear} className="text-xs text-muted-foreground hover:text-danger">
            Clear All
          </Button>
        </div>
        {history.slice().reverse().map((entry) => (
          <div
            key={entry.id}
            className="glass rounded-lg p-3 flex items-center justify-between group animate-slide-in-right"
          >
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-sm font-bold ${
                entry.probability <= 30 ? "bg-success/20 text-success" :
                entry.probability <= 60 ? "bg-warning/20 text-warning" :
                "bg-danger/20 text-danger"
              }`}>
                {entry.probability}%
              </div>
              <div>
                <span className="text-xs font-medium text-foreground">{entry.category}</span>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-xs text-muted-foreground">{entry.date}</span>
                  <span className={`text-xs px-1.5 py-0.5 rounded ${
                    entry.sentiment === "Positive" ? "bg-success/10 text-success" :
                    entry.sentiment === "Negative" ? "bg-danger/10 text-danger" :
                    "bg-warning/10 text-warning"
                  }`}>
                    {entry.sentiment}
                  </span>
                </div>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onDelete(entry.id)}
              className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-danger h-8 w-8"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span className="sr-only">Delete entry</span>
            </Button>
          </div>
        ))}
      </div>
    </div>
  )
}
