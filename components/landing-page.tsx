"use client"

import { useState } from "react"
import { GhostMascot } from "@/components/ghost-mascot"
import { ArrowRight, Brain, Shield, MessageSquare, TrendingUp, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"

interface LandingPageProps {
  onStartAnalysis: () => void
}

function FeatureCard({ icon: Icon, title, description, delay }: { icon: React.ElementType; title: string; description: string; delay: number }) {
  return (
    <div
      className="glass neon-border rounded-xl p-6 animate-fade-up hover:scale-[1.03] transition-transform duration-300"
      style={{ animationDelay: `${delay}ms`, animationFillMode: "both" }}
    >
      <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10 mb-4">
        <Icon className="w-6 h-6 text-primary" />
      </div>
      <h3 className="text-lg font-semibold text-foreground mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
    </div>
  )
}

function StepCard({ number, title, description, delay }: { number: number; title: string; description: string; delay: number }) {
  return (
    <div
      className="flex flex-col items-center text-center animate-fade-up"
      style={{ animationDelay: `${delay}ms`, animationFillMode: "both" }}
    >
      <div className="w-16 h-16 rounded-full bg-primary/20 neon-border flex items-center justify-center mb-4 animate-pulse-glow">
        <span className="text-2xl font-bold text-primary">{number}</span>
      </div>
      <h3 className="text-lg font-semibold text-foreground mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">{description}</p>
    </div>
  )
}

export function LandingPage({ onStartAnalysis }: LandingPageProps) {
  const [hoveredCta, setHoveredCta] = useState(false)

  return (
    <div className="min-h-screen overflow-hidden">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-border/30">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <GhostMascot mood="happy" size={36} className="[animation-duration:4s]" />
            <span className="text-lg font-bold text-foreground">GhostSense<span className="text-primary">AI</span></span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm text-muted-foreground">
            <a href="#features" className="hover:text-primary transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-primary transition-colors">How It Works</a>
            <a href="#chatbot" className="hover:text-primary transition-colors">AI Advisor</a>
          </div>
          <Button onClick={onStartAnalysis} size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90">
            Launch App
          </Button>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative pt-32 pb-20 px-6">
        {/* Ambient background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-[120px]" />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-ghost-purple/10 rounded-full blur-[100px]" />
        </div>

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="flex justify-center mb-8">
            <GhostMascot mood="happy" size={140} />
          </div>

          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass neon-border mb-6 animate-fade-up text-xs font-medium text-primary">
            <Sparkles className="w-3.5 h-3.5" />
            AI-Powered Relationship Intelligence
          </div>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-foreground mb-6 animate-fade-up text-balance leading-tight" style={{ animationDelay: "100ms", animationFillMode: "both" }}>
            Predict Ghosting
            <br />
            <span className="neon-text text-primary">Before It Happens</span>
          </h1>

          <p
            className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 animate-fade-up leading-relaxed text-pretty"
            style={{ animationDelay: "200ms", animationFillMode: "both" }}
          >
            Our AI analyzes behavioral patterns, message sentiment, and communication trends
            to calculate the probability of being ghosted. Get insights before the silence hits.
          </p>

          <div
            className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-up"
            style={{ animationDelay: "300ms", animationFillMode: "both" }}
          >
            <Button
              onClick={onStartAnalysis}
              size="lg"
              className="bg-primary text-primary-foreground hover:bg-primary/90 px-8 py-6 text-base font-semibold animate-pulse-glow relative overflow-hidden group"
              onMouseEnter={() => setHoveredCta(true)}
              onMouseLeave={() => setHoveredCta(false)}
            >
              <span className="relative z-10 flex items-center gap-2">
                Start Analysis
                <ArrowRight className={`w-4 h-4 transition-transform duration-300 ${hoveredCta ? "translate-x-1" : ""}`} />
              </span>
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="border-border bg-secondary/50 text-foreground hover:bg-secondary px-8 py-6 text-base"
              onClick={() => document.getElementById("how-it-works")?.scrollIntoView({ behavior: "smooth" })}
            >
              How It Works
            </Button>
          </div>

          {/* Stats row */}
          <div
            className="grid grid-cols-3 gap-6 max-w-lg mx-auto mt-16 animate-fade-up"
            style={{ animationDelay: "500ms", animationFillMode: "both" }}
          >
            {[
              { value: "50K+", label: "Analyses Run" },
              { value: "94%", label: "Accuracy Rate" },
              { value: "4.9/5", label: "User Rating" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-2xl font-bold text-primary">{stat.value}</div>
                <div className="text-xs text-muted-foreground mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 text-balance">
              Powered by Advanced AI
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto text-pretty">
              Six layers of behavioral analysis working together to give you the most accurate predictions.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <FeatureCard
              icon={Brain}
              title="Behavioral Pattern Analysis"
              description="Deep analysis of communication frequency, response timing, and engagement patterns to identify ghosting signals."
              delay={100}
            />
            <FeatureCard
              icon={MessageSquare}
              title="AI Sentiment Detection"
              description="Natural language processing evaluates message tone and emotional shifts to detect declining interest."
              delay={200}
            />
            <FeatureCard
              icon={TrendingUp}
              title="Risk Classification Engine"
              description="Multi-factor scoring system categorizes relationships into risk tiers with actionable insights."
              delay={300}
            />
            <FeatureCard
              icon={Sparkles}
              title="AI Relationship Advisor"
              description="Chat with our AI advisor for personalized guidance on your relationship dynamics and communication strategies."
              delay={400}
            />
            <FeatureCard
              icon={Shield}
              title="Privacy-First Architecture"
              description="All analysis happens in real-time with zero data retention. Your personal information stays yours."
              delay={500}
            />
            <FeatureCard
              icon={Brain}
              title="Conversation Health Score"
              description="Beyond ghosting probability, get a holistic score of your conversation health and communication quality."
              delay={600}
            />
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 text-balance">
              Three Steps to Clarity
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto text-pretty">
              Get your ghosting probability score in under a minute.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-10">
            <StepCard
              number={1}
              title="Enter Behavior Details"
              description="Rate communication patterns using our interactive sliders - reply time, message frequency, and more."
              delay={100}
            />
            <StepCard
              number={2}
              title="Add a Recent Message"
              description="Paste a recent message for AI sentiment analysis to detect emotional tone and engagement level."
              delay={250}
            />
            <StepCard
              number={3}
              title="Get Your Score"
              description="Receive a detailed risk assessment with probability score, category breakdown, and personalized advice."
              delay={400}
            />
          </div>
        </div>
      </section>

      {/* AI Chatbot CTA */}
      <section id="chatbot" className="py-20 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <div className="glass neon-border rounded-2xl p-10 animate-fade-up">
            <GhostMascot mood="happy" size={80} className="mx-auto mb-6" />
            <h2 className="text-3xl font-bold text-foreground mb-4 text-balance">
              Meet Your AI Relationship Advisor
            </h2>
            <p className="text-muted-foreground mb-8 max-w-lg mx-auto text-pretty leading-relaxed">
              Not sure what your results mean? Our AI chatbot provides personalized relationship advice,
              helps interpret your analysis, and offers communication strategies.
            </p>
            <Button onClick={onStartAnalysis} size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
              <MessageSquare className="w-4 h-4 mr-2" />
              Talk to AI Advisor
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/30 py-10 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <GhostMascot mood="neutral" size={28} className="[animation-duration:8s]" />
            <span className="text-sm font-semibold text-foreground">GhostSense<span className="text-primary">AI</span></span>
          </div>
          <p className="text-xs text-muted-foreground">Built with AI. For entertainment purposes only.</p>
        </div>
      </footer>
    </div>
  )
}
