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

export const DEFAULT_LABELS: SheetMappingDataLabels = {
  upload: {
    title: 'Upload File',
  },
  mapping: {
    title: 'Map Fields',
    backButton: 'Back',
    nextButton: 'Next',
    warnings: {
      title: 'Mapping Warnings',
      duplicateColumn: (column, fields) =>
        `Column "${column}" is mapped to multiple fields: ${fields.join(', ')}`,
    },
    alerts: {
      mapOneField: 'Please map at least one field before proceeding.',
      fieldCountDifference:
        'There is a field count difference between the file and the system. Do you want to continue?',
    },
    buttons: {
      continue: 'Continue',
      addField: '+ Add Field',
    },
  },
  validation: {
    title: 'Validate Data',
    backButton: 'Back',
    nextButton: 'Next',
    stats: {
      totalErrors: (count) => `Total: ${count} error(s)`,
      currentError: (current, total) => `Current error ${current}/${total}`,
    },
    buttons: {
      nextError: 'Next Error',
      deleteAllErrors: 'Delete All Errors',
    },
    filters: {
      showErrorsOnly: 'Show errors only',
    },
    tableHeaders: {
      index: 'No.',
      action: 'Action',
    },
  },
  confirmation: {
    title: 'Upload Result',
  },
  common: {
    sheetLabel: 'Sheet:',
    stepIndicator: (current, total) => `${current} of ${total}`,
  },
}

export type CustomType<T = any> = {
  id: string
  label: string
  validate?: (value: string) => { error?: string; value?: T }
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
