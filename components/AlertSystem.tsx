"use client"

import { useEffect, useState, useRef, useCallback } from "react"
import type { Medication } from "@/app/page"

interface AlertSystemProps {
  medications: Medication[]
  activeAlarm: Medication | null
  setActiveAlarm: (medication: Medication | null) => void
}

export default function AlertSystem({ medications, activeAlarm, setActiveAlarm }: AlertSystemProps) {
  const [notificationsEnabled, setNotificationsEnabled] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const isPlayingRef = useRef(false)

  useEffect(() => {
    if (typeof window !== "undefined") {
      const audio = new Audio()

      const sourceMP3 = document.createElement("source")
      sourceMP3.src = "/alarm.mp3"
      sourceMP3.type = "audio/mpeg"
      audio.appendChild(sourceMP3)

      const sourceWAV = document.createElement("source")
      sourceWAV.src = "/alarm.wav"
      sourceWAV.type = "audio/wav"
      audio.appendChild(sourceWAV)

      const sourceOGG = document.createElement("source")
      sourceOGG.src = "/alarm.ogg"
      sourceOGG.type = "audio/ogg"
      audio.appendChild(sourceOGG)

      audio.addEventListener("error", (e) => {
        setError("Erro ao carregar o áudio do alarme. Por favor, verifique se os arquivos de áudio estão presentes.")
        console.error("Erro de áudio:", e)
      })

      audio.loop = true
      audioRef.current = audio
    }
  }, [])

  const playAlarm = useCallback(() => {
    if (audioRef.current && !isPlayingRef.current) {
      isPlayingRef.current = true
      audioRef.current.play().catch((e) => {
        isPlayingRef.current = false
        setError("Erro ao reproduzir o alarme. Verifique se seu navegador suporta reprodução de áudio.")
        console.error("Erro ao tocar o alarme:", e)
      })
    }
  }, [])

  const stopAlarm = useCallback(() => {
    if (audioRef.current && isPlayingRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
      isPlayingRef.current = false
    }
    setActiveAlarm(null)
    setError(null)
  }, [setActiveAlarm])

  useEffect(() => {
    const checkMedications = () => {
      const now = new Date()
      const currentTime = `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}`

      medications.forEach((medication) => {
        if (medication.time === currentTime && !activeAlarm) {
          if (Notification.permission === "granted") {
            new Notification("Lembrete de Medicação", {
              body: `Está na hora de tomar ${medication.name}!`,
              icon: "/pill-icon.png",
            })
          }
          setActiveAlarm(medication)
          playAlarm()
        }
      })
    }

    const intervalId = setInterval(checkMedications, 1000) // Verifica a cada segundo

    return () => clearInterval(intervalId)
  }, [medications, activeAlarm, setActiveAlarm, playAlarm])

  useEffect(() => {
    if (typeof window !== "undefined") {
      if (Notification.permission === "granted") {
        setNotificationsEnabled(true)
      } else if (Notification.permission !== "denied") {
        Notification.requestPermission().then((permission) => {
          setNotificationsEnabled(permission === "granted")
        })
      }
    }
  }, [])

  return (
    <div className="mt-8 text-center">
      {notificationsEnabled ? (
        <p className="text-green-600">Notificações estão ativas. Você receberá alertas para seus remédios.</p>
      ) : (
        <p className="text-yellow-600">
          As notificações estão desativadas. Por favor, habilite-as para receber alertas.
        </p>
      )}
      {error && <p className="text-red-500 mt-2">{error}</p>}
      {activeAlarm && (
        <div className="mt-4">
          <p className="text-red-600 font-bold">Alarme ativo para: {activeAlarm.name}</p>
          <button
            onClick={stopAlarm}
            className="mt-2 bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Parar Alarme
          </button>
        </div>
      )}
    </div>
  )
}

