import React, { useState } from 'react'
import * as XLSX from 'xlsx'
import { useDropzone } from 'react-dropzone'
import { SheetSelectionModal } from '../components/SheetSectionModal'
import { FileUploadProps } from '../types'

const DEFAULT_MAX_FILE_SIZE_MB = 10
const DEFAULT_ACCEPTED_FILE_TYPES = [
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'text/csv',
]

export const FileUpload: React.FC<FileUploadProps> = ({
  onUploadSuccess,
  onUploadFailed,
  maxFileSizeMB = DEFAULT_MAX_FILE_SIZE_MB,
  acceptedFileTypes = DEFAULT_ACCEPTED_FILE_TYPES,
  parseSheet,
}) => {
  const [workbook, setWorkbook] = useState<XLSX.WorkBook | null>(null)
  const [sheetNames, setSheetNames] = useState<string[]>([])
  const [fileName, setFileName] = useState<string>('')
  const [fileSize, setFileSize] = useState<number>(0)
  const [showModal, setShowModal] = useState<boolean>(false)
  const [isProcessing, setIsProcessing] = useState<boolean>(false)
  const handleFileChange = async (file: File) => {
    try {
      if (!acceptedFileTypes.includes(file.type)) {
        throw new Error('Unsupported file format')
      }

      const maxSizeBytes = maxFileSizeMB * 1024 * 1024
      if (file.size > maxSizeBytes) {
        throw new Error(`File size exceeds ${maxFileSizeMB}MB limit`)
      }

      setIsProcessing(true)
      setFileName(file.name)
      setFileSize(file.size)

      const wb = await readWorkbook(file)
      setWorkbook(wb)
      setSheetNames(wb.SheetNames)

      wb.SheetNames.forEach((sheetName) => {
        const worksheet = wb.Sheets[sheetName]
        parseSheet(sheetName, worksheet)
      })

      const firstSheet = wb.SheetNames[0]
      if (firstSheet) {
        processSelectedSheet(firstSheet, wb)
      }

      if (wb.SheetNames.length > 1) {
        setShowModal(true)
      }
    } catch (error) {
      handleUploadError(error)
    } finally {
      setIsProcessing(false)
    }
  }

  const readWorkbook = (file: File): Promise<XLSX.WorkBook> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()

      reader.onload = (e) => {
        try {
          const binaryStr = e.target?.result
          const wb = XLSX.read(binaryStr, {
            type: 'binary',
            cellDates: true,
            raw: true,
          })
          resolve(wb)
        } catch (error) {
          reject(new Error('Failed to parse Excel file'))
        }
      }

      reader.onerror = () => reject(new Error('File reading failed'))
      reader.readAsBinaryString(file)
    })
  }
  const processSelectedSheet = (sheetName: string, wb?: XLSX.WorkBook) => {
    try {
      const workbookToUse = wb || workbook
      if (!workbookToUse) return

      const worksheet = workbookToUse.Sheets[sheetName]
      const { rowData, columnData } = parseSheet(sheetName, worksheet)

      onUploadSuccess({
        rowData,
        columnData,
        sheetName,
        fileName,
        fileSize,
      })
    } catch (error) {
      handleUploadError(error)
    }
  }

  const handleUploadError = (error: unknown) => {
    let errorMessage = 'An unknown error occurred'
    if (error instanceof Error) {
      errorMessage = error.message
    } else if (typeof error === 'string') {
      errorMessage = error
    }
    onUploadFailed(errorMessage)
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        resetState()
        handleFileChange(acceptedFiles[0])
      }
    },
    accept: Object.fromEntries(
      acceptedFileTypes.map((format) => [format, ['.xls', '.xlsx', '.csv']]),
    ),
    multiple: false,
    maxSize: maxFileSizeMB * 1024 * 1024,
  })

  const resetState = () => {
    setWorkbook(null)
    setSheetNames([])
    setFileName('')
    setFileSize(0)
    setShowModal(false)
    setIsProcessing(false)
  }

  const handleSheetSelect = (sheetName: string) => {
    setShowModal(false)
    processSelectedSheet(sheetName)
  }

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg cursor-pointer text-center transition
          ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 bg-gray-50'}
          ${isProcessing ? 'opacity-70 pointer-events-none' : ''}
          p-10`}
      >
        <input {...getInputProps()} />
        {isProcessing ? (
          <div className="space-y-2">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
            <p className="text-gray-600">Processing file...</p>
          </div>
        ) : (
          <>
            <p className="text-gray-600">
              {isDragActive
                ? 'Drop your Excel file here'
                : 'Drag & drop Excel file here or click to browse'}
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Supported formats: .xls, .xlsx, .csv (Max {maxFileSizeMB}MB)
            </p>
          </>
        )}
      </div>

      {fileName && (
        <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
          <p className="text-sm">
            <span className="font-medium">Selected file:</span> {fileName}
            <span className="text-gray-500 ml-2">({(fileSize / 1024 / 1024).toFixed(2)} MB)</span>
          </p>
        </div>
      )}

      {showModal && (
        <SheetSelectionModal
          sheetNames={sheetNames}
          onSelect={handleSheetSelect}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  )
}
