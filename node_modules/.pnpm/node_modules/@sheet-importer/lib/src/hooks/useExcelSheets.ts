import { ExcelColumn, ExcelRow } from '@/types'
import { useState } from 'react'
import * as XLSX from 'xlsx'

interface ParsedSheetData {
  rowData: ExcelRow[]
  columnData: ExcelColumn
}

export const useExcelSheets = () => {
  const [sheetDataMap, setSheetDataMap] = useState<Record<string, ParsedSheetData>>({})

  const parseSheet = (sheetName: string, worksheet: XLSX.WorkSheet) => {
    const sheetData = XLSX.utils.sheet_to_json<any[]>(worksheet, {
      header: 1,
      defval: null,
      blankrows: false,
    })

    const rowData: ExcelRow[] = sheetData.map((row, rowIndex) => {
      const processedRow: ExcelRow = {}

      row.forEach((cellValue, colIndex) => {
        let value = cellValue
        if (value instanceof Date) {
          value = value.toLocaleDateString('vi-VN')
        }
        processedRow[`Column_${colIndex + 1}`] = value !== undefined ? value : null
      })

      return processedRow
    })

    const columnData: ExcelColumn = {}
    const maxColumns = Math.max(...sheetData.map((row) => row.length))

    for (let colIndex = 0; colIndex < maxColumns; colIndex++) {
      const columnName = `Column_${colIndex + 1}`
      const columnValues = sheetData.map((row) =>
        row[colIndex] !== undefined ? row[colIndex] : null,
      )

      const isEmpty = columnValues.every((val) => val === null || val === undefined || val === '')

      if (!isEmpty) {
        columnData[columnName] = columnValues
      }
    }

    const parsedData: ParsedSheetData = { rowData, columnData }

    setSheetDataMap((prev) => ({
      ...prev,
      [sheetName]: parsedData,
    }))

    return parsedData
  }

  return {
    sheetDataMap,
    parseSheet,
  }
}
