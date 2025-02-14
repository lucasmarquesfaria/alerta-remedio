"use client"

import { useState, useRef, useEffect, useCallback } from "react"

export default function AudioTest() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const isPlayingRef = useRef(false)

  useEffect(() => {
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
      setError("Erro ao carregar o áudio. Por favor, verifique se os arquivos de áudio estão presentes.")
      console.error("Erro de áudio:", e)
    })

    audioRef.current = audio
  }, [])

  const toggleAudio = useCallback(() => {
    if (audioRef.current) {
      if (isPlayingRef.current) {
        audioRef.current.pause()
        audioRef.current.currentTime = 0
        isPlayingRef.current = false
        setIsPlaying(false)
      } else {
        audioRef.current
          .play()
          .then(() => {
            isPlayingRef.current = true
            setIsPlaying(true)
          })
          .catch((e) => {
            setError("Erro ao reproduzir o áudio. Verifique se seu navegador suporta reprodução de áudio.")
            console.error("Erro ao tocar o áudio:", e)
          })
      }
    }
  }, [])

  return (
    <div className="mt-4">
      <h3 className="text-lg font-semibold mb-2">Teste de Áudio</h3>
      {error && <p className="text-red-500 mb-2">{error}</p>}
      <button
        onClick={toggleAudio}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
      >
        {isPlaying ? "Parar" : "Tocar"} Áudio de Teste
      </button>
    </div>
  )
}

