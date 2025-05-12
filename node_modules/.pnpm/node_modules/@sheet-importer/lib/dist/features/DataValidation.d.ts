import { CustomType, ExcelRow } from '../types'
import React from 'react'
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
export declare const DataValidationStep: React.ForwardRefExoticComponent<
  DataValidationStepProps & React.RefAttributes<unknown>
>
export {}
//# sourceMappingURL=DataValidation.d.ts.map
