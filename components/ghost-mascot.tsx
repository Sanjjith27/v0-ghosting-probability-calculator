"use client"

import { useEffect, useState } from "react"

interface GhostMascotProps {
  mood?: "happy" | "neutral" | "worried" | "scared"
  size?: number
  className?: string
}

export function GhostMascot({ mood = "neutral", size = 120, className = "" }: GhostMascotProps) {
  const [eyeOffset, setEyeOffset] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const centerX = window.innerWidth / 2
      const centerY = window.innerHeight / 2
      const maxOffset = 3
      const x = ((e.clientX - centerX) / window.innerWidth) * maxOffset
      const y = ((e.clientY - centerY) / window.innerHeight) * maxOffset
      setEyeOffset({ x, y })
    }
    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  const mouthPath = {
    happy: "M 35 55 Q 42 65 50 55",
    neutral: "M 35 57 L 50 57",
    worried: "M 35 60 Q 42 55 50 60",
    scared: "M 35 62 Q 42 50 50 62",
  }

  return (
    <div className={`animate-float ${className}`}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 80 90"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <radialGradient id="ghostGlow" cx="50%" cy="30%" r="70%">
            <stop offset="0%" stopColor="oklch(0.85 0.15 190)" stopOpacity="0.6" />
            <stop offset="50%" stopColor="oklch(0.75 0.18 190)" stopOpacity="0.3" />
            <stop offset="100%" stopColor="oklch(0.55 0.2 300)" stopOpacity="0.1" />
          </radialGradient>
          <filter id="ghostBlur">
            <feGaussianBlur in="SourceGraphic" stdDeviation="1" />
          </filter>
        </defs>

        {/* Ghost glow */}
        <ellipse cx="40" cy="45" rx="30" ry="35" fill="url(#ghostGlow)" filter="url(#ghostBlur)" opacity="0.4" />

        {/* Ghost body */}
        <path
          d="M 15 45 C 15 20 65 20 65 45 L 65 70 C 65 75 55 65 50 70 C 45 75 35 65 30 70 C 25 75 15 65 15 70 Z"
          fill="oklch(0.90 0.05 280)"
          fillOpacity="0.9"
          stroke="oklch(0.75 0.18 190)"
          strokeWidth="0.5"
          strokeOpacity="0.5"
        />

        {/* Left eye */}
        <ellipse
          cx={33 + eyeOffset.x}
          cy={42 + eyeOffset.y}
          rx="5"
          ry="6"
          fill="oklch(0.13 0.02 280)"
        />
        <ellipse
          cx={34 + eyeOffset.x * 0.5}
          cy={41 + eyeOffset.y * 0.5}
          rx="2"
          ry="2.5"
          fill="oklch(0.75 0.18 190)"
        />

        {/* Right eye */}
        <ellipse
          cx={50 + eyeOffset.x}
          cy={42 + eyeOffset.y}
          rx="5"
          ry="6"
          fill="oklch(0.13 0.02 280)"
        />
        <ellipse
          cx={51 + eyeOffset.x * 0.5}
          cy={41 + eyeOffset.y * 0.5}
          rx="2"
          ry="2.5"
          fill="oklch(0.75 0.18 190)"
        />

        {/* Mouth */}
        <path
          d={mouthPath[mood]}
          stroke="oklch(0.13 0.02 280)"
          strokeWidth="2"
          strokeLinecap="round"
          fill="none"
        />

        {/* Blush marks */}
        {mood === "happy" && (
          <>
            <ellipse cx="26" cy="50" rx="4" ry="2" fill="oklch(0.75 0.15 350)" fillOpacity="0.3" />
            <ellipse cx="57" cy="50" rx="4" ry="2" fill="oklch(0.75 0.15 350)" fillOpacity="0.3" />
          </>
        )}
      </svg>
    </div>
  )
}
