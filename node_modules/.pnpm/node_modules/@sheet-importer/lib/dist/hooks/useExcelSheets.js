import { useState } from 'react'
import * as XLSX from 'xlsx'
export const useExcelSheets = () => {
  const [sheetDataMap, setSheetDataMap] = useState({})
  const parseSheet = (sheetName, worksheet) => {
    const sheetData = XLSX.utils.sheet_to_json(worksheet, {
      header: 1,
      defval: null,
      blankrows: false,
    })
    const rowData = sheetData.map((row, rowIndex) => {
      const processedRow = {}
      row.forEach((cellValue, colIndex) => {
        let value = cellValue
        if (value instanceof Date) {
          value = value.toLocaleDateString('vi-VN')
        }
        processedRow[`Column_${colIndex + 1}`] = value !== undefined ? value : null
      })
      return processedRow
    })
    const columnData = {}
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
    const parsedData = { rowData, columnData }
    setSheetDataMap((prev) => Object.assign(Object.assign({}, prev), { [sheetName]: parsedData }))
    return parsedData
  }
  return {
    sheetDataMap,
    parseSheet,
  }
}
//# sourceMappingURL=useExcelSheets.js.map
