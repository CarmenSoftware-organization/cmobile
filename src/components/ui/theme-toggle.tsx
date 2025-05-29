"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"

import { useTheme } from "@/components/ui/theme-provider"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  // useEffect only runs on the client, so now we can safely show the UI
  React.useEffect(() => {
    setMounted(true)
  }, [])

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light")
  }

  // During SSR and initial client render before hydration,
  // use a completely empty placeholder to prevent any potential hydration mismatches
  if (!mounted) {
    return (
      <button 
        className="rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-primary/50 hover:bg-muted transition-colors" 
        aria-label="Loading theme toggle"
      >
        <div className="w-5 h-5" />
      </button>
    )
  }
  
  // Only render actual icons when on the client
  return (
    <button
      onClick={toggleTheme}
      className="rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-primary/50 hover:bg-muted transition-colors"
      aria-label="Toggle theme"
    >
      {theme === "light" ? (
        <Moon size={20} className="text-foreground" />
      ) : (
        <Sun size={20} className="text-foreground" />
      )}
    </button>
  )
} 