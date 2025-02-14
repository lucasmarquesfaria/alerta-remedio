"use client"

import type { Medication } from "@/app/page"

interface MedicationListProps {
  medications: Medication[]
  onEdit: (medication: Medication) => void
  onDelete: (id: string) => void
}

export default function MedicationList({ medications, onEdit, onDelete }: MedicationListProps) {
  return (
    <div>
      {medications.length === 0 ? (
        <p className="text-gray-500 text-center">Nenhum remédio cadastrado ainda.</p>
      ) : (
        medications.map((medication) => (
          <div key={medication.id} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
            <p className="text-xl font-medium">{medication.name}</p>
            <p className="text-gray-600 mb-4">Horário: {medication.time}</p>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => onEdit(medication)}
                className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                Editar
              </button>
              <button
                onClick={() => onDelete(medication.id)}
                className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                Excluir
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  )
}

