import { CustomType, ExcelColumn, ExcelRow } from '../types'
type MappingProps = {
  field: CustomType[]
}
export declare const useMapping: ({ field }: MappingProps) => {
  rowData: ExcelRow[]
  setRowData: import('react').Dispatch<import('react').SetStateAction<ExcelRow[]>>
  columnData: ExcelColumn
  setColumnData: import('react').Dispatch<import('react').SetStateAction<ExcelColumn>>
  filteredExcelData: ExcelRow[]
  setFilteredExcelData: import('react').Dispatch<import('react').SetStateAction<ExcelRow[]>>
  mapping: Record<string, string>
  setMapping: import('react').Dispatch<import('react').SetStateAction<Record<string, string>>>
  removeMapping: (fieldId: string) => void
  systemFields: CustomType[]
  setSystemFields: import('react').Dispatch<import('react').SetStateAction<CustomType[]>>
  updateCell: (rowIndex: number, columnId: string, value: any) => void
  deleteRow: (rowIndex: number) => void
  clearData: () => void
  disablePositive: boolean
  setDisablePositive: import('react').Dispatch<import('react').SetStateAction<boolean>>
  disableNegative: boolean
  setDisableNegative: import('react').Dispatch<import('react').SetStateAction<boolean>>
}
export {}
//# sourceMappingURL=useMapping.d.ts.map
