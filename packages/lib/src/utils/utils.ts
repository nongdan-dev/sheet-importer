//remove diacritics and special characters from string
// and convert to lowercase

import { CustomType } from '@/types'

//map data bằng cách học header
export const normalizeString = (str: string) => {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]/g, '')
    .trim()
}

export const getExcelColumnName = (index: number): string => {
  let columnName = ''
  let temp
  while (index >= 0) {
    temp = index % 26
    columnName = String.fromCharCode(temp + 65) + columnName
    index = Math.floor(index / 26) - 1
  }
  return columnName
}

export const detectColumnType = (values: any[], detectors: CustomType[]): string | null => {
  // on 50 first rows
  const sample = values.slice(0, 50).filter((v) => v != null && v !== '')

  if (sample.length === 0) return null

  // Tính điểm matching cho từng detector
  const scores = detectors.map((detector) => {
    const validCount = sample.filter((value) => {
      try {
        const result = detector.validate?.(String(value).trim())
        return !result?.error
      } catch {
        return false
      }
    }).length

    return {
      id: detector.id,
      score: validCount / sample.length,
      threshold: detector.threshold || 0.7,
    }
  })

  const bestMatch = scores.reduce(
    (best, current) =>
      current.score >= current.threshold && current.score > (best?.score || 0) ? current : best,
    null as { id: string; score: number } | null,
  )

  return bestMatch?.id || null
}
