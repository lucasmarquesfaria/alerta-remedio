"use client"

import { useEffect } from "react"
import type { Medication } from "@/app/page"

interface AlertSystemProps {
  activeAlarm: Medication | null
  setActiveAlarm: (medication: Medication | null) => void
}

export default function AlertSystem({ activeAlarm, setActiveAlarm }: AlertSystemProps) {
  useEffect(() => {
    if (activeAlarm) {
      // Exibe um alerta
      alert(`Hora do remédio: ${activeAlarm.name}!`)

      // Toca um bip sonoro
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)()
      const oscillator = audioCtx.createOscillator()
      const gainNode = audioCtx.createGain()
      
      oscillator.type = "sine"
      oscillator.frequency.setValueAtTime(1000, audioCtx.currentTime) // Frequência do bip
      gainNode.gain.setValueAtTime(1, audioCtx.currentTime)
      gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.5)
      
      oscillator.connect(gainNode)
      gainNode.connect(audioCtx.destination)
      
      oscillator.start()
      oscillator.stop(audioCtx.currentTime + 0.5)

      // Limpa o alarme após exibição
      setTimeout(() => setActiveAlarm(null), 1000)
    }
  }, [activeAlarm, setActiveAlarm])

  return null
}
