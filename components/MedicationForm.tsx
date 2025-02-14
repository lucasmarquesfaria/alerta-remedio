"use client"

import { useState, useEffect } from "react"
import type { Medication } from "@/app/page"

interface MedicationFormProps {
  onSubmit: (medication: Medication) => void
  initialData?: Medication | null
  onCancel?: () => void
}

export default function MedicationForm({ onSubmit, initialData, onCancel }: MedicationFormProps) {
  const [name, setName] = useState(initialData?.name || "")
  const [time, setTime] = useState(initialData?.time || "")

  useEffect(() => {
    setName(initialData?.name || "")
    setTime(initialData?.time || "")
  }, [initialData])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({
      id: initialData?.id || Date.now().toString(),
      name,
      time,
    })
    if (!initialData) {
      setName("")
      setTime("")
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
      <div className="mb-4">
        <label htmlFor="name" className="block text-gray-700 text-sm font-bold mb-2">
          Nome do Remédio
        </label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
      </div>
      <div className="mb-6">
        <label htmlFor="time" className="block text-gray-700 text-sm font-bold mb-2">
          Horário
        </label>
        <input
          type="time"
          id="time"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          required
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
      </div>
      <div className="flex items-center justify-between">
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          {initialData ? "Atualizar" : "Adicionar"} Remédio
        </button>
        {initialData && onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Cancelar
          </button>
        )}
      </div>
    </form>
  )
}

