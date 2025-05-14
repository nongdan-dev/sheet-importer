import { ValidationTableRow } from '../components/ValidationTableRow'
import { CustomType, ExcelRow } from '../types'
import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  forwardRef,
  useImperativeHandle,
  useMemo,
} from 'react'

interface ValidationError {
  rowIndex: number
  field: string
  message: string
}

type DataValidationStepProps = {
  systemFieldsList: CustomType[]
  filteredExcelData: ExcelRow[]
  updateCell: (rowIndex: number, column: string, value: any) => void
  deleteRow: (rowIndex: number) => void
  onNext: () => void
  onBack: () => void
  labels: {
    title: string
    backButton: string
    nextButton: string
    stats: {
      totalErrors: (count: number) => string
      currentError: (current: number, total: number) => string
    }
    buttons: {
      nextError: string
      deleteAllErrors: string
    }
    filters: {
      showErrorsOnly: string
    }
    tableHeaders: {
      index: string
      action: string
    }
  }
}

export const DataValidationStep = forwardRef((props: DataValidationStepProps, ref) => {
  const { systemFieldsList, filteredExcelData, updateCell, deleteRow, onNext, onBack, labels } =
    props
  const [errors, setErrors] = useState<ValidationError[]>([])
  const [showErrorsOnly, setShowErrorsOnly] = useState(false)
  const [currentErrorIndex, setCurrentErrorIndex] = useState(0)
  const [editingErrors, setEditingErrors] = useState<Record<string, string>>({})
  const inputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({})
  const tableWrapperRef = useRef<HTMLDivElement>(null)
  const validateTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useImperativeHandle(ref, () => ({
    refOnNext() {
      errors.length === 0 && onNext()
    },
  }))

  const transformedData = useMemo(() => {
    return filteredExcelData.map((row) => ({ ...row }))
  }, [filteredExcelData])

  const validateData = useCallback(async () => {
    const newErrors: ValidationError[] = []

    for (const field of systemFieldsList) {
      if (!field.validate) continue

      for (let rowIndex = 0; rowIndex < filteredExcelData.length; rowIndex++) {
        const row = filteredExcelData[rowIndex]
        const value = row[field.id]

        const validationResult = await field.validate(String(value))

        if (validationResult.error) {
          newErrors.push({
            rowIndex,
            field: field.id,
            message: validationResult.error,
          })
        }
      }
    }

    setErrors(newErrors)
  }, [filteredExcelData, systemFieldsList])

  const handleCellChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>, rowIndex: number, field: CustomType) => {
      const newValue = e.target.value
      const fieldId = field.id
      const inputKey = `${rowIndex}-${fieldId}`

      updateCell(rowIndex, fieldId, newValue)

      setEditingErrors((prev) => {
        const newErrors = { ...prev }
        if (newErrors[inputKey]) {
          delete newErrors[inputKey]
        }
        return newErrors
      })

      if (field.validate) {
        try {
          const validationResult = await field.validate(newValue)

          if (validationResult.error) {
            setEditingErrors((prev) => ({
              ...prev,
              [inputKey]: validationResult.error || '',
            }))
          } else if (validationResult.value !== undefined) {
            updateCell(rowIndex, fieldId, validationResult.value)

            setErrors((prev) =>
              prev.filter((err) => !(err.rowIndex === rowIndex && err.field === fieldId)),
            )
          }
        } catch (err) {
          setEditingErrors((prev) => ({
            ...prev,
            [inputKey]: 'Validation error',
          }))
        }
      }

      if (validateTimerRef.current) clearTimeout(validateTimerRef.current)
      validateTimerRef.current = setTimeout(() => {
        validateData()
      }, 500)
    },
    [updateCell, validateData],
  )

  const focusErrorInput = useCallback(
    (errorIndex: number) => {
      if (errors.length === 0 || errorIndex >= errors.length) return

      const error = errors[errorIndex]
      const inputKey = `${error.rowIndex}-${error.field}`
      const inputElement = inputRefs.current[inputKey]

      if (inputElement) {
        inputElement.focus()
        inputElement.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
        })
      }
    },
    [errors],
  )

  useEffect(() => {
    validateData()
  }, [validateData])

  const handleNextError = useCallback(() => {
    if (errors.length === 0) return

    let nextIndex = currentErrorIndex
    let checked = 0

    while (checked < errors.length) {
      nextIndex = (nextIndex + 1) % errors.length

      const nextError = errors[nextIndex]
      const stillExists = filteredExcelData[nextError.rowIndex] !== undefined

      if (stillExists) {
        setCurrentErrorIndex(nextIndex)
        setTimeout(() => focusErrorInput(nextIndex), 0)
        return
      }

      checked++
    }
  }, [currentErrorIndex, errors, filteredExcelData, focusErrorInput])

  const handleInputKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleNextError()
    }
  }

  const handleDeleteRow = (rowIndex: number) => {
    deleteRow(rowIndex)
    validateData()
  }

  const filteredData = showErrorsOnly
    ? transformedData.filter((_, index) => errors.some((err) => err.rowIndex === index))
    : transformedData

  const handleDeleteAllErrorRows = () => {
    const uniqueErrorRowIndexes = Array.from(new Set(errors.map((error) => error.rowIndex))).sort(
      (a, b) => b - a,
    )

    uniqueErrorRowIndexes.forEach((rowIndex) => {
      deleteRow(rowIndex)
    })

    validateData()
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-6">
        <p>{labels.stats.totalErrors(errors.length)}</p>
        <p>
          Current error {errors.length > 0 ? currentErrorIndex + 1 : 0}/{errors.length}
        </p>
      </div>

      <div className="mb-4 flex gap-4 flex-wrap">
        <button
          onClick={handleNextError}
          disabled={errors.length === 0}
          className={`px-4 py-2 rounded-md shadow-sm text-sm font-medium text-white ${
            errors.length === 0 ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {labels.buttons.nextError}
        </button>

        <button
          onClick={handleDeleteAllErrorRows}
          disabled={errors.length === 0}
          className={`px-4 py-2 rounded-md shadow-sm text-sm font-medium text-white ${
            errors.length === 0 ? 'bg-gray-400 cursor-not-allowed' : 'bg-red-600 hover:bg-red-700'
          }`}
        >
          {labels.buttons.deleteAllErrors}
        </button>

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={showErrorsOnly}
            onChange={(e) => setShowErrorsOnly(e.target.checked)}
            className="rounded"
          />
          <span>Show error only</span>
        </label>
      </div>

      <div
        ref={tableWrapperRef}
        className="overflow-x-auto mb-8 max-h-[500px] overflow-y-auto border rounded"
      >
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                STT
              </th>
              {systemFieldsList.map((column) => {
                return (
                  <th
                    key={column.id}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    <div className="flex flex-col gap-1">
                      <span>{column.label || ''}</span>
                    </div>
                  </th>
                )
              })}
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredData.map((row, rowIndex) => {
              return (
                <ValidationTableRow
                  key={rowIndex}
                  row={row}
                  rowIndex={rowIndex}
                  fields={systemFieldsList}
                  errors={errors}
                  editingErrors={editingErrors}
                  onCellChange={handleCellChange}
                  onKeyDown={handleInputKeyDown}
                  onDelete={handleDeleteRow}
                  inputRefs={inputRefs}
                />
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
})
