import React from 'react'
import { observer } from 'mobx-react-lite'
import { CustomType, ExcelRow } from '../types'
import { getExcelColumnName } from '../utils/utils'

interface FieldListProps {
  fields: CustomType[]
  onRemoveField: (fieldLabel: string) => void
  mapping: Record<string, string>
  setMapping: (mapping: Record<string, string>) => void
  excelData: ExcelRow[]
  allowMultipleFieldsPerColumn?: boolean
}

export const FieldList: React.FC<FieldListProps> = observer(
  ({
    fields,
    onRemoveField,
    mapping,
    setMapping,
    excelData,
    allowMultipleFieldsPerColumn = true,
  }) => {
    const handleMappingChange = (fieldId: string, columnName: string) => {
      setMapping({
        ...mapping,
        [fieldId]: columnName,
      })
    }

    const mappedColumns = allowMultipleFieldsPerColumn
      ? new Set()
      : new Set(Object.values(mapping).filter(Boolean))

    return (
      <div className="space-y-4 h-[400px]">
        <div className="overflow-y-auto overflow-x-hidden max-h-96 space-y-4 pr-2">
          {fields.map((field) => (
            <div key={field.id} className="space-y-2 group relative">
              <button
                onClick={() => {
                  onRemoveField(field.id)
                  const newMapping = { ...mapping }
                  delete newMapping[field.id]
                  setMapping(newMapping)
                }}
                className="absolute -right-6 top-0 opacity-0 group-hover:opacity-100 transition-opacity text-red-500 hover:text-red-700"
                title="Remove field"
              >
                ×
              </button>

              <label className="block text-sm font-medium text-gray-700 m-0 p-0 text-left">
                {field.label}
              </label>

              <div className="flex gap-2">
                <select
                  value={mapping[field.id] || ''}
                  onChange={(e) => handleMappingChange(field.id, e.target.value)}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md border"
                >
                  <option value="">-- None --</option>
                  {Object.keys(excelData[0] || {}).map((column, index) => {
                    const columnLabel = getExcelColumnName(index)
                    const isDisabled =
                      !allowMultipleFieldsPerColumn &&
                      mappedColumns.has(column) &&
                      mapping[field.id] !== column

                    return (
                      <option
                        key={column}
                        value={column}
                        disabled={isDisabled}
                        className={isDisabled ? 'text-gray-400' : ''}
                      >
                        {columnLabel}
                        {isDisabled}
                      </option>
                    )
                  })}
                </select>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  },
)
