import { jsx as _jsx, jsxs as _jsxs } from 'react/jsx-runtime'
import { FieldList } from '../components/FieldList'
import { Modal } from '../components/Modal'
import { PreviewTable } from '../components/PreviewTable'
import { detectColumnType } from '../utils/utils'
import { useState, useEffect, forwardRef, useImperativeHandle } from 'react'
export const DataMappingStep = forwardRef((props, ref) => {
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
    customDetectors,
    setDisableNegative,
    setDisablePositive,
    labels,
  } = props
  // const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false)
  const [mappingWarnings, setMappingWarnings] = useState({})
  useImperativeHandle(ref, () => ({
    triggerRef() {
      setIsConfirmModalOpen(true)
    },
  }))
  // const handleAddField = (newField: CustomType) => {
  //   setSystemFields([...systemFields, newField])
  // }
  useEffect(() => {
    console.log('mappingWarnings', Object.keys(mappingWarnings).length === 0)
    if (setDisablePositive) {
      if (Object.keys(mappingWarnings).length === 0) {
        setDisablePositive(false)
      } else {
        setDisablePositive(true)
      }
    }
  }, [mappingWarnings])
  useEffect(() => {
    const warnings = {}
    const columnUsage = {}
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
    if (rowData.length === 0 || !customDetectors) return
    const newMapping = {}
    const mappedColumns = new Set(Object.values(mapping))
    systemFields.forEach((field) => {
      if (!mapping[field.id]) {
        const detector = customDetectors.find((d) => d.id === field.id)
        if (!detector) return
        const bestColumn = Object.entries(columnData)
          .filter(([col]) => !mappedColumns.has(col))
          .map(([col, values]) => {
            const detectedType = detectColumnType(values, [detector])
            return {
              col,
              matchRatio: detectedType === field.id ? 1 : 0,
              detector,
            }
          })
          .find(({ matchRatio }) => matchRatio >= (detector.threshold || 0.7))
        if (bestColumn) {
          newMapping[field.id] = bestColumn.col
          mappedColumns.add(bestColumn.col)
        }
      }
    })
    if (Object.keys(newMapping).length > 0) {
      setMapping(Object.assign(Object.assign({}, mapping), newMapping))
    }
  }, [rowData, systemFields, columnData, mapping, customDetectors])
  const handleConfirmMapping = () => {
    if (Object.keys(mapping).length === 0) {
      alert(labels.alerts.mapOneField)
      return
    }
    const validMapping = {}
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
      const filteredRow = {}
      Object.entries(validMapping).forEach(([fieldId, column]) => {
        filteredRow[fieldId] = originalColumns.includes(column) ? row[column] : null
      })
      return filteredRow
    })
    setFilteredExcelData(filteredData)
    setMapping(validMapping)
    setSystemFields(systemFields)
    onNext === null || onNext === void 0 ? void 0 : onNext()
  }
  const handleRemoveField = (fieldId) => {
    removeMapping(fieldId)
  }
  const WarningDisplay = () => {
    if (Object.keys(mappingWarnings).length === 0) return null
    return _jsx('div', {
      className: 'mb-4 p-4 bg-yellow-50 border-l-4 border-yellow-400',
      children: _jsx('div', {
        className: 'flex',
        children: _jsxs('div', {
          className: 'ml-3',
          children: [
            _jsx('h3', {
              className: 'text-sm font-medium text-yellow-800',
              children: labels.warnings.title,
            }),
            _jsx('div', {
              className: 'mt-2 text-sm text-yellow-700',
              children: _jsx('ul', {
                className: 'list-disc pl-5 space-y-1',
                children: Object.entries(mappingWarnings).map(([column, fieldIds]) => {
                  const fieldNames = fieldIds.map((id) => {
                    const field = systemFields.find((f) => f.id === id)
                    return (field === null || field === void 0 ? void 0 : field.label) || id
                  })
                  const warningMessage = labels.warnings.duplicateColumn(column, fieldNames)
                  return _jsx('li', { dangerouslySetInnerHTML: { __html: warningMessage } }, column)
                }),
              }),
            }),
          ],
        }),
      }),
    })
  }
  return _jsxs('div', {
    className: 'max-w-6xl mx-auto p-6',
    children: [
      _jsxs('div', {
        className: 'flex flex-row gap-10 mb-8',
        children: [
          _jsx('div', { className: 'flex-1', children: _jsx(PreviewTable, { data: rowData }) }),
          _jsxs('div', {
            className: 'flex-1 flex flex-col justify-between',
            children: [
              _jsx(FieldList, {
                fields: systemFields,
                onRemoveField: handleRemoveField,
                mapping: mapping,
                excelData: rowData,
                setMapping: setMapping,
              }),
              _jsx('div', {
                className: 'mt-4',
                children: _jsx('button', {
                  // onClick={() => setIsAddModalOpen(true)}
                  className:
                    'px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500',
                  children: labels.buttons.addField,
                }),
              }),
            ],
          }),
        ],
      }),
      _jsx(WarningDisplay, {}),
      _jsx(Modal, {
        isOpen: isConfirmModalOpen,
        message: labels.alerts.fieldCountDifference,
        onCancel: () => setIsConfirmModalOpen(false),
        onConfirm: () => {
          handleConfirmMapping()
          setIsConfirmModalOpen(false)
        },
      }),
    ],
  })
})
//# sourceMappingURL=DataMapping.js.map
