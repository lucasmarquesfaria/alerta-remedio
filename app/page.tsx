"use client"

import { useState, useEffect } from "react"
import MedicationForm from "@/components/MedicationForm"
import MedicationList from "@/components/MedicationList"
import AlertSystem from "@/components/AlertSystem"
import AudioTest from "@/components/AudioTest"

export interface Medication {
  id: string
  name: string
  time: string
}

export default function Home() {
  const [medications, setMedications] = useState<Medication[]>([])
  const [editingMedication, setEditingMedication] = useState<Medication | null>(null)
  const [activeAlarm, setActiveAlarm] = useState<Medication | null>(null)

  useEffect(() => {
    const storedMedications = localStorage.getItem("medications")
    if (storedMedications) {
      setMedications(JSON.parse(storedMedications))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem("medications", JSON.stringify(medications))
  }, [medications])

  const addMedication = (medication: Medication) => {
    setMedications([...medications, medication])
  }

  const updateMedication = (updatedMedication: Medication) => {
    setMedications(medications.map((med) => (med.id === updatedMedication.id ? updatedMedication : med)))
    setEditingMedication(null)
  }

  const deleteMedication = (id: string) => {
    setMedications(medications.filter((med) => med.id !== id))
  }

  return (
    <main className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Sistema de Alerta de Remédios</h1>
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <h2 className="text-2xl font-semibold mb-4">
            {editingMedication ? "Editar Remédio" : "Adicionar Novo Remédio"}
          </h2>
          <MedicationForm
            onSubmit={editingMedication ? updateMedication : addMedication}
            initialData={editingMedication}
            onCancel={() => setEditingMedication(null)}
          />
        </div>
        <div>
          <h2 className="text-2xl font-semibold mb-4">Lista de Remédios</h2>
          <MedicationList medications={medications} onEdit={setEditingMedication} onDelete={deleteMedication} />
        </div>
      </div>
      <AlertSystem medications={medications} activeAlarm={activeAlarm} setActiveAlarm={setActiveAlarm} />
      <AudioTest />
    </main>
  )
}

