"use client"

import { useState, useCallback, useRef, useEffect } from "react"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"
import { GhostMascot } from "@/components/ghost-mascot"
import { Sparkles, AlertTriangle, PartyPopper, Clock, Eye, MessageSquareText, Users, Palette, Smartphone } from "lucide-react"

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

interface GhostingCalculatorProps {
  onResult: (result: AnalysisResult) => void
}

function SliderField({
  icon: Icon,
  label,
  description,
  value,
  onChange,
  min,
  max,
  step,
  unit,
}: {
  icon: React.ElementType
  label: string
  description: string
  value: number
  onChange: (val: number) => void
  min: number
  max: number
  step: number
  unit: string
}) {
  return (
    <div className="glass neon-border rounded-xl p-5 transition-all duration-300 hover:border-primary/50 group">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
            <Icon className="w-4 h-4 text-primary" />
          </div>
          <div>
            <label className="text-sm font-medium text-foreground">{label}</label>
            <p className="text-xs text-muted-foreground">{description}</p>
          </div>
        </div>
        <div className="text-right">
          <span className="text-xl font-bold text-primary tabular-nums">{value}</span>
          <span className="text-xs text-muted-foreground ml-1">{unit}</span>
        </div>
      </div>
      <Slider
        value={[value]}
        onValueChange={([v]) => onChange(v)}
        min={min}
        max={max}
        step={step}
        className="mt-2"
      />
    </div>
  )
}

function analyzeSentiment(text: string): { label: string; score: number } {
  if (!text.trim()) return { label: "Neutral", score: 0 }

  const positiveWords = [
    "love", "great", "amazing", "wonderful", "happy", "excited", "awesome",
    "beautiful", "perfect", "incredible", "miss", "cant wait", "thank", "appreciate",
    "adore", "cherish", "enjoy", "like", "good", "nice", "sweet", "kind",
    "haha", "lol", "lmao", "yes", "sure", "absolutely", "definitely", "always",
  ]
  const negativeWords = [
    "busy", "maybe", "idk", "whatever", "ok", "fine", "sure",
    "later", "tired", "cant", "sorry", "nah", "meh", "dunno",
    "leave me", "stop", "annoying", "bored", "not interested",
    "k", "bye", "gtg", "brb", "ttyl", "nm",
  ]

  const lower = text.toLowerCase()
  const words = lower.split(/\s+/)

  let posCount = 0
  let negCount = 0

  for (const word of words) {
    if (positiveWords.some(pw => word.includes(pw))) posCount++
    if (negativeWords.some(nw => word.includes(nw))) negCount++
  }

  // Check for short messages (ghosting signal)
  if (words.length <= 2 && text.length < 10) negCount += 2

  // Check for excessive periods or lack of enthusiasm
  if (text.includes("...")) negCount += 1
  if (text.endsWith(".") && !text.endsWith("..")) negCount += 0.5

  // Emoji check
  const positiveEmojis = /[😊😍🥰❤️💕😘🤗😁💖✨🔥💯😻]/g
  const negativeEmojis = /[😐😑😒🙄😤😠💀☠️👻😬😕]/g
  posCount += (text.match(positiveEmojis) || []).length
  negCount += (text.match(negativeEmojis) || []).length

  const total = posCount + negCount
  if (total === 0) return { label: "Neutral", score: 0 }

  const sentimentScore = ((posCount - negCount) / Math.max(total, 1))
  if (sentimentScore > 0.2) return { label: "Positive", score: -sentimentScore * 30 }
  if (sentimentScore < -0.2) return { label: "Negative", score: Math.abs(sentimentScore) * 40 }
  return { label: "Neutral", score: 10 }
}

export function GhostingCalculator({ onResult }: GhostingCalculatorProps) {
  const [replyDelay, setReplyDelay] = useState(2)
  const [seenIgnored, setSeenIgnored] = useState(3)
  const [messageLengthDrop, setMessageLengthDrop] = useState(20)
  const [initiationRatio, setInitiationRatio] = useState(5)
  const [toneChange, setToneChange] = useState(2)
  const [socialMedia, setSocialMedia] = useState(3)
  const [messageText, setMessageText] = useState("")
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const calculateProbability = useCallback(() => {
    setIsAnalyzing(true)

    setTimeout(() => {
      const sentiment = analyzeSentiment(messageText)

      // Weighted calculation
      const replyScore = Math.min((replyDelay / 48) * 100, 100) * 0.20
      const seenScore = (seenIgnored / 10) * 100 * 0.15
      const lengthScore = messageLengthDrop * 0.15
      const initScore = Math.abs(5 - initiationRatio) / 5 * 100 * 0.15
      const toneScore = ((toneChange - 1) / 4) * 100 * 0.10
      const socialScore = (socialMedia / 10) * 100 * 0.10
      const sentimentScore = Math.max(0, Math.min(100, 50 + sentiment.score)) * 0.15

      const rawProbability = replyScore + seenScore + lengthScore + initScore + toneScore + socialScore + sentimentScore
      const probability = Math.round(Math.min(100, Math.max(0, rawProbability)))

      let category: string
      let message: string

      if (probability <= 30) {
        category = "Low Risk"
        message = "Relax, you're safe. Communication looks healthy!"
      } else if (probability <= 60) {
        category = "Medium Risk"
        message = "Something feels off... pay attention to the patterns."
      } else {
        category = "High Risk"
        message = "Emotional damage loading... prepare yourself."
      }

      const result: AnalysisResult = {
        probability,
        sentiment,
        category,
        message,
        breakdown: {
          replyDelay: Math.round(replyScore / 0.20),
          seenIgnored: Math.round(seenScore / 0.15),
          messageLengthDrop: Math.round(lengthScore / 0.15),
          initiationRatio: Math.round(initScore / 0.15),
          toneChange: Math.round(toneScore / 0.10),
          socialMedia: Math.round(socialScore / 0.10),
          sentimentImpact: Math.round(sentimentScore / 0.15),
        },
      }

      setIsAnalyzing(false)
      onResult(result)
    }, 2000)
  }, [replyDelay, seenIgnored, messageLengthDrop, initiationRatio, toneChange, socialMedia, messageText, onResult])

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-foreground mb-2">Ghosting Risk Analyzer</h2>
        <p className="text-sm text-muted-foreground">Adjust the sliders based on their recent behavior</p>
      </div>

      <div className="grid gap-4">
        <SliderField
          icon={Clock}
          label="Average Reply Delay"
          description="How long they take to respond"
          value={replyDelay}
          onChange={setReplyDelay}
          min={0}
          max={48}
          step={1}
          unit="hrs"
        />
        <SliderField
          icon={Eye}
          label="Seen but Ignored Frequency"
          description="How often they see your messages without replying"
          value={seenIgnored}
          onChange={setSeenIgnored}
          min={0}
          max={10}
          step={1}
          unit="/10"
        />
        <SliderField
          icon={MessageSquareText}
          label="Message Length Reduction"
          description="How much shorter their messages have become"
          value={messageLengthDrop}
          onChange={setMessageLengthDrop}
          min={0}
          max={100}
          step={5}
          unit="%"
        />
        <SliderField
          icon={Users}
          label="Initiation Ratio"
          description="Who starts conversations (0 = always you, 10 = always them)"
          value={initiationRatio}
          onChange={setInitiationRatio}
          min={0}
          max={10}
          step={1}
          unit="/10"
        />
        <SliderField
          icon={Palette}
          label="Tone Change Level"
          description="How much their communication tone has shifted"
          value={toneChange}
          onChange={setToneChange}
          min={1}
          max={5}
          step={1}
          unit="/5"
        />
        <SliderField
          icon={Smartphone}
          label="Active Online, No Reply"
          description="Active on social media but not responding to you"
          value={socialMedia}
          onChange={setSocialMedia}
          min={0}
          max={10}
          step={1}
          unit="/10"
        />
      </div>

      {/* Sentiment Input */}
      <div className="glass neon-border rounded-xl p-5">
        <div className="flex items-center gap-3 mb-3">
          <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-primary/10">
            <MessageSquareText className="w-4 h-4 text-primary" />
          </div>
          <div>
            <label className="text-sm font-medium text-foreground">AI Sentiment Analysis</label>
            <p className="text-xs text-muted-foreground">Paste a recent message from them</p>
          </div>
        </div>
        <textarea
          ref={textareaRef}
          value={messageText}
          onChange={(e) => setMessageText(e.target.value)}
          placeholder="Paste their most recent message here for AI analysis..."
          className="w-full min-h-[100px] bg-secondary/50 border border-border rounded-lg p-3 text-sm text-foreground placeholder:text-muted-foreground resize-none focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all"
        />
        {messageText && (
          <div className="mt-2 flex items-center gap-2">
            <span className="text-xs text-muted-foreground">Detected sentiment:</span>
            <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
              analyzeSentiment(messageText).label === "Positive" ? "bg-success/20 text-success" :
              analyzeSentiment(messageText).label === "Negative" ? "bg-danger/20 text-danger" :
              "bg-warning/20 text-warning"
            }`}>
              {analyzeSentiment(messageText).label}
            </span>
          </div>
        )}
      </div>

      {/* Analyze Button */}
      <Button
        onClick={calculateProbability}
        disabled={isAnalyzing}
        size="lg"
        className="w-full bg-primary text-primary-foreground hover:bg-primary/90 py-6 text-base font-semibold animate-pulse-glow"
      >
        {isAnalyzing ? (
          <span className="flex items-center gap-2">
            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            AI is analyzing patterns...
          </span>
        ) : (
          <span className="flex items-center gap-2">
            <Sparkles className="w-5 h-5" />
            Analyze Ghosting Risk
          </span>
        )}
      </Button>
    </div>
  )
}

// Result display component
interface ResultDisplayProps {
  result: AnalysisResult
  onReset: () => void
  onSaveToHistory: (result: AnalysisResult) => void
}

export function ResultDisplay({ result, onReset, onSaveToHistory }: ResultDisplayProps) {
  const [animatedPercent, setAnimatedPercent] = useState(0)
  const [showConfetti, setShowConfetti] = useState(false)
  const [showShake, setShowShake] = useState(false)
  const circumference = 2 * Math.PI * 80

  useEffect(() => {
    const duration = 1500
    const start = Date.now()
    const animate = () => {
      const elapsed = Date.now() - start
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3) // ease-out cubic
      setAnimatedPercent(Math.round(result.probability * eased))
      if (progress < 1) requestAnimationFrame(animate)
    }
    requestAnimationFrame(animate)

    if (result.probability <= 30) {
      setTimeout(() => setShowConfetti(true), 1500)
    } else if (result.probability > 60) {
      setTimeout(() => setShowShake(true), 1500)
      setTimeout(() => setShowShake(false), 2000)
    }

    // Auto save to history
    onSaveToHistory(result)
  }, [result, onSaveToHistory])

  const getColor = () => {
    if (result.probability <= 30) return "text-success"
    if (result.probability <= 60) return "text-warning"
    return "text-danger"
  }

  const getStrokeColor = () => {
    if (result.probability <= 30) return "oklch(0.72 0.19 155)"
    if (result.probability <= 60) return "oklch(0.80 0.18 85)"
    return "oklch(0.65 0.25 25)"
  }

  const getGhostMood = (): "happy" | "neutral" | "worried" | "scared" => {
    if (result.probability <= 30) return "happy"
    if (result.probability <= 60) return "worried"
    return "scared"
  }

  const breakdownLabels: Record<string, string> = {
    replyDelay: "Reply Delay",
    seenIgnored: "Seen & Ignored",
    messageLengthDrop: "Message Length",
    initiationRatio: "Initiation",
    toneChange: "Tone Change",
    socialMedia: "Social Activity",
    sentimentImpact: "Sentiment",
  }

  return (
    <div className={`space-y-8 animate-scale-in ${showShake ? "animate-shake" : ""}`}>
      {/* Confetti for low risk */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center">
          {Array.from({ length: 30 }).map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 rounded-full"
              style={{
                background: ["oklch(0.72 0.19 155)", "oklch(0.75 0.18 190)", "oklch(0.80 0.18 85)"][i % 3],
                left: `${Math.random() * 100}%`,
                top: `-10%`,
                animation: `fall ${2 + Math.random() * 2}s ease-out forwards`,
                animationDelay: `${Math.random() * 0.5}s`,
              }}
            />
          ))}
          <style>{`
            @keyframes fall {
              to { transform: translateY(120vh) rotate(720deg); opacity: 0; }
            }
          `}</style>
        </div>
      )}

      {/* Main Score */}
      <div className="text-center">
        <GhostMascot mood={getGhostMood()} size={80} className="mx-auto mb-4" />

        <div className="relative inline-flex items-center justify-center mb-6">
          <svg width="200" height="200" viewBox="0 0 200 200">
            <circle
              cx="100"
              cy="100"
              r="80"
              fill="none"
              stroke="oklch(0.20 0.025 280)"
              strokeWidth="8"
            />
            <circle
              cx="100"
              cy="100"
              r="80"
              fill="none"
              stroke={getStrokeColor()}
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={circumference - (circumference * animatedPercent) / 100}
              transform="rotate(-90 100 100)"
              style={{
                transition: "stroke-dashoffset 0.1s ease",
                filter: result.probability > 60 ? `drop-shadow(0 0 10px ${getStrokeColor()})` : "none",
              }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className={`text-5xl font-bold tabular-nums ${getColor()}`}>{animatedPercent}%</span>
            <span className="text-xs text-muted-foreground mt-1">Probability</span>
          </div>
        </div>

        <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold ${
          result.probability <= 30 ? "bg-success/20 text-success" :
          result.probability <= 60 ? "bg-warning/20 text-warning" :
          "bg-danger/20 text-danger"
        }`}>
          {result.probability <= 30 && <PartyPopper className="w-4 h-4" />}
          {result.probability > 30 && result.probability <= 60 && <AlertTriangle className="w-4 h-4" />}
          {result.probability > 60 && <AlertTriangle className="w-4 h-4" />}
          {result.category}
        </div>

        <p className="text-muted-foreground mt-4 text-sm">{result.message}</p>
      </div>

      {/* Sentiment Badge */}
      <div className="glass neon-border rounded-xl p-4">
        <h3 className="text-sm font-medium text-foreground mb-3">Sentiment Analysis</h3>
        <div className="flex items-center gap-3">
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
            result.sentiment.label === "Positive" ? "bg-success/20 text-success" :
            result.sentiment.label === "Negative" ? "bg-danger/20 text-danger" :
            "bg-warning/20 text-warning"
          }`}>
            {result.sentiment.label}
          </span>
          <span className="text-xs text-muted-foreground">
            {"Impact: "}
            {Math.abs(result.sentiment.score) < 5 ? "Minimal" :
             Math.abs(result.sentiment.score) < 15 ? "Moderate" : "Significant"}
          </span>
        </div>
      </div>

      {/* Breakdown */}
      <div className="glass neon-border rounded-xl p-5">
        <h3 className="text-sm font-medium text-foreground mb-4">Risk Breakdown</h3>
        <div className="space-y-3">
          {Object.entries(result.breakdown).map(([key, value]) => (
            <div key={key} className="flex items-center gap-3">
              <span className="text-xs text-muted-foreground w-28 shrink-0">{breakdownLabels[key]}</span>
              <div className="flex-1 h-2 rounded-full bg-secondary overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-1000"
                  style={{
                    width: `${value}%`,
                    background: value <= 30 ? "oklch(0.72 0.19 155)" : value <= 60 ? "oklch(0.80 0.18 85)" : "oklch(0.65 0.25 25)",
                  }}
                />
              </div>
              <span className="text-xs font-medium text-foreground w-8 text-right tabular-nums">{value}%</span>
            </div>
          ))}
        </div>
      </div>

      <Button
        onClick={onReset}
        size="lg"
        className="w-full bg-secondary text-secondary-foreground hover:bg-secondary/80 py-6"
      >
        Analyze Another
      </Button>
    </div>
  )
}
