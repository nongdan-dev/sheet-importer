import React from 'react'
import { CustomType, ExcelRow } from '../types'
interface ValidationTableRowProps {
  row: ExcelRow
  rowIndex: number
  fields: CustomType[]
  errors: {
    rowIndex: number
    field: string
    message: string
  }[]
  editingErrors: Record<string, string | undefined>
  onCellChange: (
    e: React.ChangeEvent<HTMLInputElement>,
    rowIndex: number,
    field: CustomType,
    displayValue: string,
  ) => void
  onKeyDown: (e: React.KeyboardEvent) => void
  onDelete: (rowIndex: number) => void
  inputRefs: React.MutableRefObject<{
    [key: string]: HTMLInputElement | null
  }>
}
export declare const ValidationTableRow: React.FC<ValidationTableRowProps>
export {}
//# sourceMappingURL=ValidationTableRow.d.ts.map
