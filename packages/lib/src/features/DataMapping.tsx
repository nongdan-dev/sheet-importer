import { AddFieldModal } from '../components/AddFieldModal'
import { FieldList } from '../components/FieldList'
import { Modal } from '../components/Modal'
import { PreviewTable } from '../components/PreviewTable'
import { CustomType, ExcelColumn, ExcelRow } from '../types'
import { detectColumnType } from '../utils/utils'
import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react'

type DataMappingStepProps = {
  rowData: ExcelRow[]
  columnData: ExcelColumn
  systemFields: CustomType[]
  mapping: Record<string, string>
  setMapping: React.Dispatch<React.SetStateAction<Record<string, string>>>
  setFilteredExcelData: (data: ExcelRow[]) => void
  setSystemFields: (fields: CustomType[]) => void
  removeMapping: (fieldId: string) => void
  onNext?: () => void
  onBack?: () => void
  enableLabelMapping?: boolean
  fields?: CustomType[]
  setDisableNegative?: (b: boolean) => void
  setDisablePositive?: (b: boolean) => void
  labels: {
    warnings: {
      title: string
      duplicateColumn: (column: string, fields: string[]) => string
    }
    alerts: {
      mapOneField: string
      fieldCountDifference: string
    }
    buttons: {
      continue: string
      addField: string
    }
  }
  onAddField?: (field: CustomType) => Promise<void>
}

export const DataMappingStep = forwardRef((props: DataMappingStepProps, ref) => {
  const {
    rowData,
    columnData,
    systemFields,
    mapping,
    setMapping,
    setFilteredExcelData,
    setSystemFields,
    removeMapping,
    onNext,
    fields,
    setDisableNegative,
    setDisablePositive,
    labels,
    onAddField,
  } = props

  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false)
  const [mappingWarnings, setMappingWarnings] = useState<Record<string, string[]>>({})

  useImperativeHandle(ref, () => ({
    triggerRef() {
      setIsConfirmModalOpen(true)
    },
  }))

  // const handleAddField = (newField: CustomType) => {
  //   setSystemFields([...systemFields, newField])
  // }

  useEffect(() => {
    if (setDisablePositive) {
      if (Object.keys(mappingWarnings).length === 0) {
        setDisablePositive(false)
      } else {
        setDisablePositive(true)
      }
    }
  }, [mappingWarnings])

  useEffect(() => {
    const warnings: Record<string, string[]> = {}
    const columnUsage: Record<string, string[]> = {}

    Object.entries(mapping).forEach(([fieldId, column]) => {
      if (!columnUsage[column]) {
        columnUsage[column] = []
      }
      columnUsage[column].push(fieldId)
    })

    Object.entries(columnUsage).forEach(([column, fieldIds]) => {
      if (fieldIds.length > 1) {
        warnings[column] = fieldIds
      }
    })

    setMappingWarnings(warnings)
  }, [mapping])

  useEffect(() => {
    if (rowData.length === 0 || !fields) return

    let cancelled = false

    const detectAndMap = async () => {
      const newMapping: Record<string, string> = {}
      const mappedColumns = new Set(Object.values(mapping))

      const promises = systemFields.map(async (field) => {
        if (mapping[field.id]) return

        const detector = fields.find((d) => d.id === field.id)
        if (!detector) return

        for (const [col, values] of Object.entries(columnData)) {
          if (mappedColumns.has(col)) continue

          try {
            const detectedType = await detectColumnType(values, [detector])
            if (detectedType === field.id) {
              newMapping[field.id] = col
              mappedColumns.add(col)
              break
            }
          } catch (err) {
            console.log(`field "${field.id}" / column "${col}":`, err)
          }
        }
      })

      await Promise.all(promises)

      if (!cancelled && Object.keys(newMapping).length > 0) {
        setMapping({ ...mapping, ...newMapping })
      }
    }

    detectAndMap()

    return () => {
      cancelled = true
    }
  }, [rowData, systemFields, columnData, mapping, fields])

  useEffect(() => {
    if (rowData.length === 0 || !fields) return

    let cancelled = false
    const mappedCols = new Set<string>()

    const detectAndMap = async () => {
      const tasks: Promise<void>[] = []

      for (const field of systemFields) {
        if (mapping[field.id]) continue

        const detector = fields.find((d) => d.id === field.id)
        if (!detector) continue

        for (const [col, values] of Object.entries(columnData)) {
          if (mappedCols.has(col) || Object.values(mapping).includes(col)) continue

          const task = (async () => {
            try {
              const detectedType = await detectColumnType(values, [detector])
              if (!cancelled && detectedType === field.id) {
                mappedCols.add(col)
                setMapping((prev) => {
                  if (prev[field.id] || Object.values(prev).includes(col)) return prev
                  return {
                    ...prev,
                    [field.id]: col,
                  }
                })
              }
            } catch (err) {
              console.error(`field "${field.id}" / column "${col}":`, err)
            }
          })()

          tasks.push(task)
        }
      }

      await Promise.allSettled(tasks)
    }

    detectAndMap()

    return () => {
      cancelled = true
    }
  }, [rowData, systemFields, columnData, fields])

  const handleConfirmMapping = () => {
    if (Object.keys(mapping).length === 0) {
      alert(labels.alerts.mapOneField)
      return
    }

    const validMapping: Record<string, string> = {}
    const originalColumns = Object.keys(rowData[0] || {})

    Object.entries(mapping).forEach(([fieldId, column]) => {
      if (originalColumns.includes(column)) {
        validMapping[fieldId] = column
      }
    })

    systemFields.forEach((field) => {
      if (!validMapping[field.id]) {
        validMapping[field.id] = `${field.id}`
      }
    })

    const filteredData = rowData.map((row) => {
      const filteredRow: Record<string, any> = {}
      Object.entries(validMapping).forEach(([fieldId, column]) => {
        filteredRow[fieldId] = originalColumns.includes(column) ? row[column] : null
      })
      return filteredRow
    })

    setFilteredExcelData(filteredData)
    setMapping(validMapping)
    setSystemFields(systemFields)
    onNext?.()
  }

  const handleRemoveField = (fieldId: string) => {
    removeMapping(fieldId)
  }

  const WarningDisplay = () => {
    if (Object.keys(mappingWarnings).length === 0) return null

    return (
      <div className="mb-4 p-4 bg-yellow-50 border-l-4 border-yellow-400">
        <div className="flex">
          <div className="ml-3">
            <h3 className="text-sm font-medium text-yellow-800">{labels.warnings.title}</h3>
            <div className="mt-2 text-sm text-yellow-700">
              <ul className="list-disc pl-5 space-y-1">
                {Object.entries(mappingWarnings).map(([column, fieldIds]) => {
                  const fieldNames = fieldIds.map((id) => {
                    const field = systemFields.find((f) => f.id === id)
                    return field?.label || id
                  })

                  const warningMessage = labels.warnings.duplicateColumn(column, fieldNames)

                  return <li key={column} dangerouslySetInnerHTML={{ __html: warningMessage }} />
                })}
              </ul>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex flex-row gap-10 mb-8">
        <div className="flex-1">
          <PreviewTable data={rowData} />
        </div>

        <div className="flex-1 flex flex-col justify-between">
          <FieldList
            fields={systemFields}
            onRemoveField={handleRemoveField}
            mapping={mapping}
            excelData={rowData}
            setMapping={setMapping}
          />

          <div className="mt-4">
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              {labels.buttons.addField}
            </button>
          </div>
        </div>
      </div>
      <WarningDisplay />
      <Modal
        isOpen={isConfirmModalOpen}
        message={labels.alerts.fieldCountDifference}
        onCancel={() => setIsConfirmModalOpen(false)}
        onConfirm={() => {
          handleConfirmMapping()
          setIsConfirmModalOpen(false)
        }}
      />
      {onAddField && (
        <AddFieldModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onAddField={onAddField}
          setSystemFields={setSystemFields}
          systemFields={systemFields}
        />
      )}
    </div>
  )
})
