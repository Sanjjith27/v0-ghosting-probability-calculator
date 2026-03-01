"use client"

import { useState } from "react"
import { LandingPage } from "@/components/landing-page"
import { Dashboard } from "@/components/dashboard"

export default function Home() {
  const [showDashboard, setShowDashboard] = useState(false)

  if (showDashboard) {
    return <Dashboard onBack={() => setShowDashboard(false)} />
  }

  return <LandingPage onStartAnalysis={() => setShowDashboard(true)} />
}
