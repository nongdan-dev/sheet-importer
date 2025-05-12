import { CustomType } from '@/types'
import React from 'react'

interface FieldItemProps {
  field: CustomType
}

export const FieldItem: React.FC<FieldItemProps> = ({ field }) => {
  return (
    <div draggable className="p-3 mb-2 bg-gray-100 rounded-lg cursor-move">
      <div className="font-medium">{field.label}</div>
    </div>
  )
}
