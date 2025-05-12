import * as XLSX from 'xlsx'
interface SheetMappingDataLabels {
  upload: {
    title: string
  }
  mapping: {
    title: string
    backButton: string
    nextButton: string
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
  validation: {
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
  confirmation: {
    title: string
  }
  common: {
    sheetLabel: string
    stepIndicator: (current: number, total: number) => string
  }
}
export declare const DEFAULT_LABELS: SheetMappingDataLabels
export type CustomType<T = any> = {
  id: string
  label: string
  validate?: (value: string) => {
    error?: string
    value?: T
  }
  threshold?: number
  display?: (value: T) => string
}
export type ExcelRow = Record<string, any>
export type ExcelColumn = Record<string, any[]>
export interface FileUploadResponse {
  rowData: ExcelRow[]
  columnData: ExcelColumn
  sheetName: string
  fileName: string
  fileSize: number
}
export interface SheetSelectionModalProps {
  sheetNames: string[]
  onSelect: (sheetName: string) => void
  onClose: () => void
}
export interface FileUploadProps {
  onUploadSuccess: (response: FileUploadResponse) => void
  onUploadFailed: (error: string) => void
  maxFileSizeMB?: number
  acceptedFileTypes?: string[]
  parseSheet: (
    sheetName: string,
    worksheet: XLSX.WorkSheet,
  ) => {
    rowData: ExcelRow[]
    columnData: ExcelColumn
  }
}
export interface SheetMappingDataProps {
  onSubmit: (jsonData: any[]) => Promise<void>
  fields?: CustomType[]
  labels?: Partial<SheetMappingDataLabels>
}
export {}
//# sourceMappingURL=types.d.ts.map
