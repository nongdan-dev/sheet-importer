import React, { useState } from 'react'
import { observer } from 'mobx-react-lite'
import { ErrorTooltip } from './ErrorToolTips'
import { CustomType, ExcelRow } from '../types'

interface ValidationTableRowProps {
  row: ExcelRow
  rowIndex: number
  fields: CustomType[]
  errors: { rowIndex: number; field: string; message: string }[]
  editingErrors: Record<string, string | undefined>
  onCellChange: (
    e: React.ChangeEvent<HTMLInputElement>,
    rowIndex: number,
    field: CustomType,
    displayValue: string,
  ) => void
  onKeyDown: (e: React.KeyboardEvent) => void
  onDelete: (rowIndex: number) => void
  inputRefs: React.MutableRefObject<{ [key: string]: HTMLInputElement | null }>
}

export const ValidationTableRow: React.FC<ValidationTableRowProps> = observer(
  ({
    row,
    rowIndex,
    fields,
    errors,
    editingErrors,
    onCellChange,
    onKeyDown,
    onDelete,
    inputRefs,
  }) => {
    const [editValues, setEditValues] = useState<Record<string, string>>({})
    const [isFocused, setIsFocused] = useState<Record<string, boolean>>({})

    const getFieldError = (fieldId: string) => {
      const editingError = editingErrors[`${rowIndex}-${fieldId}`]
      if (editingError) return { message: editingError }
      return errors.find((err) => err.rowIndex === rowIndex && err.field === fieldId)
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>, field: CustomType) => {
      setEditValues((prev) => ({ ...prev, [field.id]: e.target.value }))
    }

    const handleFocus = (field: CustomType) => {
      setIsFocused((prev) => ({ ...prev, [field.id]: true }))

      setEditValues((prev) => ({
        ...prev,
        [field.id]: String(row[field.id] || ''),
      }))
    }

    const handleBlurOrKeyDown = (field: CustomType) => {
      setIsFocused((prev) => ({ ...prev, [field.id]: false }))

      const currentValue = editValues[field.id] ?? String(row[field.id] || '')
      const fakeEvent = {
        target: { value: currentValue },
      } as React.ChangeEvent<HTMLInputElement>

      onCellChange(fakeEvent, rowIndex, field, currentValue)

      setEditValues((prev) => {
        const { [field.id]: _, ...rest } = prev
        return rest
      })
    }

    const getDisplayValue = (field: CustomType) => {
      const fieldId = field.id

      if (isFocused[fieldId] || editValues[fieldId] !== undefined) {
        return editValues[fieldId] ?? String(row[fieldId] || '')
      }

      if (
        editingErrors[`${rowIndex}-${fieldId}`] ||
        errors.some((e) => e.rowIndex === rowIndex && e.field === fieldId)
      ) {
        return editValues[fieldId] ?? String(row[fieldId] || '')
      }

      return field.display ? field.display(row[fieldId]) : row[fieldId]
    }

    return (
      <tr>
        <td className="px-6 py-4 whitespace-nowrap text-gray-700 font-medium text-center">
          {rowIndex + 1}
        </td>

        {fields.map((field) => {
          const error = getFieldError(field.id)
          const displayValue = getDisplayValue(field)

          return (
            <td
              key={field.id}
              className={`px-6 py-4 whitespace-nowrap ${error ? 'bg-red-50' : ''}`}
            >
              <div className="flex items-center">
                <input
                  value={displayValue || ''}
                  onChange={(e) => handleChange(e, field)}
                  onFocus={() => handleFocus(field)}
                  onBlur={() => handleBlurOrKeyDown(field)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleBlurOrKeyDown(field)
                    }
                    onKeyDown(e)
                  }}
                  className={`px-2 py-1 rounded text-sm w-full ${
                    error ? 'border border-red-500 bg-red-50' : 'border border-gray-300'
                  }`}
                  ref={(el) => {
                    inputRefs.current[`${rowIndex}-${field.id}`] = el
                  }}
                />
                {error && <ErrorTooltip message={error.message} />}
              </div>
            </td>
          )
        })}

        <td className="px-6 py-4 whitespace-nowrap text-center">
          <button
            onClick={() => onDelete(rowIndex)}
            className="text-red-600 hover:text-red-800 font-semibold text-sm"
          >
            Delete
          </button>
        </td>
      </tr>
    )
  },
)
