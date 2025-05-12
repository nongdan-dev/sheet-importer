import React from 'react'
import { ExcelRow } from '../types'
import { getExcelColumnName } from '../utils/utils'

interface PreviewTableProps {
  data: ExcelRow[]
}

export const PreviewTable: React.FC<PreviewTableProps> = ({ data }) => {
  if (data.length === 0) return null

  const columnNames = Object.keys(data[0]).map((_, index) => getExcelColumnName(index))

  return (
    <div className="relative max-h-[400px] max-w-[800px] overflow-y-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50 sticky top-0 z-10">
          <tr>
            {columnNames.map((name) => (
              <th
                key={name}
                className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                {name}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.map((row, index) => (
            <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
              {Object.values(row).map((value, i) => (
                <td key={i} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {value !== null ? String(value) : '-'}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
