import { CustomType, ExcelColumn, ExcelRow } from '../types'
import React from 'react'
type DataMappingStepProps = {
  rowData: ExcelRow[]
  columnData: ExcelColumn
  systemFields: CustomType[]
  mapping: Record<string, string>
  setMapping: (mapping: Record<string, string>) => void
  setFilteredExcelData: (data: ExcelRow[]) => void
  setSystemFields: (fields: CustomType[]) => void
  removeMapping: (fieldId: string) => void
  onNext?: () => void
  onBack?: () => void
  enableLabelMapping?: boolean
  customDetectors?: CustomType[]
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
}
export declare const DataMappingStep: React.ForwardRefExoticComponent<
  DataMappingStepProps & React.RefAttributes<unknown>
>
export {}
//# sourceMappingURL=DataMapping.d.ts.map
