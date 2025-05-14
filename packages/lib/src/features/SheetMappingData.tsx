import React, { useEffect, useRef, useState } from 'react'
import { DataMappingStep } from './DataMapping'
import { DataValidationStep } from './DataValidation'

import { ConfirmationStep } from './Confirmation'
import { FileUpload } from './FileUpload'
import { DEFAULT_LABELS, FileUploadResponse, SheetMappingDataProps } from '../types'
import { useMapping } from '../hooks/useMapping'
import { useExcelSheets } from '../hooks/useExcelSheets'

const STEP_VALIDATION = {
  UPLOAD: 1,
  MAPPING: 2,
  VALIDATION: 3,
  CONFIRMATION: 4,
}

export const SheetMappingData = ({
  onSubmit,
  fields = [],
  labels: propLabels = {},
  onAddField,
}: SheetMappingDataProps) => {
  const [activeTab, setActiveTab] = useState(STEP_VALIDATION.UPLOAD)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const [selectedSheet, setSelectedSheet] = useState<string | null>(null)

  const mappingStepRef = useRef<any>(null)
  const validationStepRef = useRef<any>(null)

  const {
    rowData,
    setRowData,
    columnData,
    setColumnData,
    filteredExcelData,
    updateCell,
    deleteRow,
    mapping,
    setMapping,
    removeMapping,
    systemFields,
    setSystemFields,
    setFilteredExcelData,
    clearData,
    disableNegative,
    disablePositive,
    setDisableNegative,
    setDisablePositive,
  } = useMapping({ field: fields })

  const { sheetDataMap, parseSheet } = useExcelSheets()

  const handleSubmit = async () => {
    setIsSubmitting(true)
    setSubmitError(null)
    setSubmitSuccess(false)

    try {
      await onSubmit(filteredExcelData)
      setSubmitSuccess(true)
    } catch (error: any) {
      setSubmitError(error.message || 'Failed to submit data')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleFileUploaded = (data: FileUploadResponse) => {
    setRowData(data.rowData)

    setColumnData(data.columnData)

    setActiveTab(STEP_VALIDATION.MAPPING)
  }

  const handleReset = () => {
    clearData()
    setActiveTab(STEP_VALIDATION.UPLOAD)
    setSubmitSuccess(false)
    setSubmitError(null)
    setSelectedSheet(null)
  }

  const handleSheetChange = (sheetName: string) => {
    setActiveTab(STEP_VALIDATION.MAPPING)
    clearData()
    setSelectedSheet(sheetName)
    const sheet = sheetDataMap?.[sheetName]
    if (sheet) {
      setRowData(sheet.rowData || [])
      setColumnData(sheet.columnData || [])
    }
  }
  const labels = {
    ...DEFAULT_LABELS,
    ...propLabels,
    upload: { ...DEFAULT_LABELS.upload, ...propLabels.upload },
    mapping: { ...DEFAULT_LABELS.mapping, ...propLabels.mapping },
    validation: { ...DEFAULT_LABELS.validation, ...propLabels.validation },
    confirmation: {
      ...DEFAULT_LABELS.confirmation,
      ...propLabels.confirmation,
    },
    common: { ...DEFAULT_LABELS.common, ...propLabels.common },
  }

  const getStepTitle = (step: number) => {
    switch (step) {
      case STEP_VALIDATION.UPLOAD:
        return labels.upload.title
      case STEP_VALIDATION.MAPPING:
        return labels.mapping.title
      case STEP_VALIDATION.VALIDATION:
        return labels.validation.title
      case STEP_VALIDATION.CONFIRMATION:
        return labels.confirmation.title
      default:
        return ''
    }
  }
  return (
    <div className="w-full h-full flex-1 mx-auto font-sans">
      {activeTab === STEP_VALIDATION.UPLOAD && (
        <FileUpload
          onUploadSuccess={handleFileUploaded}
          onUploadFailed={(err) => console.error('File upload failed:', err)}
          parseSheet={parseSheet}
        />
      )}

      {activeTab !== STEP_VALIDATION.UPLOAD && Object.keys(sheetDataMap || {}).length > 1 && (
        <div className="mb-2 flex items-center gap-2">
          <label className="text-sm font-medium whitespace-nowrap">
            {labels.common.sheetLabel}
          </label>
          <select
            className="border px-2 py-1 rounded text-sm w-auto"
            value={selectedSheet || ''}
            onChange={(e) => handleSheetChange(e.target.value)}
          >
            {Object.keys(sheetDataMap).map((sheetName) => (
              <option key={sheetName} value={sheetName}>
                {sheetName}
              </option>
            ))}
          </select>
        </div>
      )}

      {activeTab === STEP_VALIDATION.MAPPING && (
        <DataMappingStep
          ref={mappingStepRef}
          columnData={columnData}
          rowData={rowData}
          systemFields={systemFields}
          mapping={mapping}
          setMapping={setMapping}
          setFilteredExcelData={setFilteredExcelData}
          setSystemFields={setSystemFields}
          removeMapping={removeMapping}
          onBack={() => setActiveTab(STEP_VALIDATION.UPLOAD)}
          onNext={() => {
            setActiveTab(STEP_VALIDATION.VALIDATION)
            handleSubmit()
          }}
          fields={fields}
          setDisableNegative={setDisableNegative}
          setDisablePositive={setDisablePositive}
          labels={labels.mapping}
          onAddField={onAddField}
        />
      )}

      {activeTab === STEP_VALIDATION.VALIDATION && (
        <DataValidationStep
          ref={validationStepRef}
          onNext={() => {
            setActiveTab(STEP_VALIDATION.CONFIRMATION)
            handleSubmit()
          }}
          onBack={() => setActiveTab(STEP_VALIDATION.MAPPING)}
          updateCell={updateCell}
          deleteRow={deleteRow}
          filteredExcelData={filteredExcelData}
          systemFieldsList={systemFields}
          labels={labels.validation}
        />
      )}

      {activeTab === STEP_VALIDATION.CONFIRMATION && (
        <ConfirmationStep
          isSubmitting={isSubmitting}
          submitSuccess={submitSuccess}
          submitError={submitError}
          onReset={handleReset}
          onRetry={() => setActiveTab(STEP_VALIDATION.VALIDATION)}
        />
      )}

      {activeTab !== STEP_VALIDATION.UPLOAD && activeTab !== STEP_VALIDATION.CONFIRMATION && (
        <div className="flex justify-between mt-4">
          <button
            onClick={() => {
              if (activeTab === STEP_VALIDATION.MAPPING) {
                setActiveTab(STEP_VALIDATION.UPLOAD)
              } else {
                setActiveTab(STEP_VALIDATION.MAPPING)
              }
            }}
            disabled={disableNegative}
            className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded"
          >
            Back
          </button>

          <div className="flex flex-col">
            <span className="text-gray-500">{getStepTitle(activeTab)}</span>
            <span className="text-gray-500">{labels.common.stepIndicator(activeTab, 4)}</span>
          </div>

          <button
            onClick={() => {
              if (activeTab === STEP_VALIDATION.MAPPING) {
                mappingStepRef.current?.triggerRef?.()
              } else {
                validationStepRef.current?.refOnNext?.()
              }
            }}
            disabled={disablePositive}
            className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded"
          >
            {activeTab === STEP_VALIDATION.MAPPING
              ? labels.mapping.nextButton
              : labels.validation.nextButton}
          </button>
        </div>
      )}
    </div>
  )
}
