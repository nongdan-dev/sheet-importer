import React from 'react'
import { SheetSelectionModalProps } from '../types'

export const SheetSelectionModal: React.FC<SheetSelectionModalProps> = ({
  sheetNames,
  onSelect,
  onClose,
}) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        <h3 className="text-lg font-medium mb-4">Select a Sheet</h3>
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {sheetNames.map((name) => (
            <button
              key={name}
              onClick={() => onSelect(name)}
              className="w-full text-left px-4 py-2 hover:bg-gray-100 rounded-md"
            >
              {name}
            </button>
          ))}
        </div>
        <div className="mt-6 flex justify-end">
          <button onClick={onClose} className="px-4 py-2 text-gray-600 hover:text-gray-800">
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}
