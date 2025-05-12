import { useState, useCallback, useEffect } from 'react'
import { CustomType, ExcelColumn, ExcelRow } from '../types'

type MappingProps = {
  field: CustomType[]
}

export const useMapping = ({ field }: MappingProps) => {
  const [rowData, setRowData] = useState<ExcelRow[]>([])
  const [columnData, setColumnData] = useState<ExcelColumn>({})
  const [filteredExcelData, setFilteredExcelData] = useState<ExcelRow[]>([])
  const [mapping, setMapping] = useState<Record<string, string>>({})
  const [systemFields, setSystemFields] = useState<CustomType[]>(field)

  const [disablePositive, setDisablePositive] = useState(false)
  const [disableNegative, setDisableNegative] = useState(false)

  const updateCell = useCallback((rowIndex: number, columnId: string, value: any) => {
    setFilteredExcelData((prev) => {
      const newData = [...prev]
      newData[rowIndex] = { ...newData[rowIndex], [columnId]: value }
      return newData
    })
  }, [])

  const deleteRow = useCallback((rowIndex: number) => {
    setFilteredExcelData((prev) => prev.filter((_, index) => index !== rowIndex))
  }, [])

  const removeMapping = useCallback((fieldId: string) => {
    setMapping((prev) => {
      const newMapping = { ...prev }
      delete newMapping[fieldId]
      return newMapping
    })
  }, [])

  const clearData = useCallback(() => {
    setRowData([])
    setColumnData({})
    setFilteredExcelData([])
    setMapping({})
    setSystemFields(field)
  }, [])

  return {
    rowData,
    setRowData,

    columnData,
    setColumnData,

    filteredExcelData,
    setFilteredExcelData,

    mapping,
    setMapping,
    removeMapping,

    systemFields,
    setSystemFields,

    updateCell,
    deleteRow,
    clearData,

    disablePositive,
    setDisablePositive,
    disableNegative,
    setDisableNegative,
  }
}
