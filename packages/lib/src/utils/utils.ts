

//remove diacritics and special characters from string
// and convert to lowercase

import { CustomType } from "@/types"

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

export const detectColumnType = async (
  values: any[],
  detectors: CustomType[],
): Promise<string | null> => {
  // onfirst 50 values
  const sample = values.slice(0, 50).filter((v) => v != null && v !== '')

  if (sample.length === 0) return null

  //promise per detector
  const detectorPromises = detectors.map(async (detector) => {
    let validCount = 0

    for (const value of sample) {
      try {
        const result = await detector.validate?.(String(value).trim())
        if (!result?.error) {
          validCount++
        }
      } catch (err) {
        console.log(`Validation: "${value}"/ column "${detector.id}":`, err)
      }
    }

    return {
      id: detector.id,
      score: validCount / sample.length,
      threshold: detector.threshold || 0.7,
    }
  })

  // độc lập từng promise
  const results = await Promise.allSettled(detectorPromises)

  const bestMatch = results
    .filter((result) => result.status === 'fulfilled')
    .map((result: any) => result.value)
    .find((detectorResult) => detectorResult.score >= detectorResult.threshold)

  return bestMatch ? bestMatch.id : null
}

export const builtInValidate = {
  string: (value: string): { error?: string; value?: string } => {
    const trimmed = value.trim()
    if (trimmed.length === 0) {
      return { error: 'Value cannot be empty', value: undefined }
    }
    return { value: trimmed }
  },

  number: (value: string): { error?: string; value?: number } => {
    const num = Number(value)
    if (isNaN(num)) {
      return { error: 'Invalid number format', value: undefined }
    }
    return { value: num }
  },

  integer: (value: string): { error?: string; value?: number } => {
    const result = builtInValidate.number(value)
    if (result.error || result.value === undefined) return { error: result.error, value: undefined }

    if (!Number.isInteger(result.value)) {
      return { error: 'Value must be an integer', value: undefined }
    }
    return { value: result.value }
  },

  email: (value: string): { error?: string; value?: string } => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    const trimmed = value.trim()

    if (!emailRegex.test(trimmed)) {
      return { error: 'Invalid email format', value: undefined }
    }
    return { value: trimmed.toLowerCase() }
  },

  date: (value: string): { error?: string; value?: Date } => {
    const parsedDate = new Date(value)
    if (isNaN(parsedDate.getTime())) {
      return { error: 'Invalid date format', value: undefined }
    }
    return { value: parsedDate }
  },

  boolean: (value: string): { error?: string; value?: boolean } => {
    const lowerValue = value.trim().toLowerCase()
    if (['true', 'yes', '1'].includes(lowerValue)) return { value: true }
    if (['false', 'no', '0'].includes(lowerValue)) return { value: false }
    return {
      error: 'Value must be boolean (true/false, yes/no, 1/0)',
      value: undefined,
    }
  },

  percentage: (value: string): { error?: string; value?: number } => {
    const percentageRegex = /^(\d+(\.\d+)?)\s*%?$/
    const match = value.trim().match(percentageRegex)

    if (!match) {
      return {
        error: 'Invalid percentage format (e.g. 10% or 0.1)',
        value: undefined,
      }
    }

    const num = parseFloat(match[1]) / 100
    return { value: num }
  },

  currency: (value: string): { error?: string; value?: number } => {
    const cleaned = value.replace(/[^\d.,-]/g, '').replace(',', '.')
    const num = parseFloat(cleaned)

    if (isNaN(num)) {
      return { error: 'Invalid currency format', value: undefined }
    }
    return { value: num }
  },

  url: (value: string): { error?: string; value?: string } => {
    try {
      const trimmed = value.trim()
      new URL(trimmed)
      return { value: trimmed }
    } catch {
      return { error: 'Invalid URL format', value: undefined }
    }
  },

  phone: (value: string): { error?: string; value?: string } => {
    const digits = value.replace(/\D/g, '')
    if (digits.length < 9) {
      return { error: 'Invalid phone number', value: undefined }
    }
    return { value: digits }
  },
}

export const builtInDisplay = {
  percentage: (value: number) => `${Math.round(value * 100)}%`,
  currency: (value: number) => `$${value.toFixed(2)}`,
  date: (value: Date) => value.toLocaleDateString(),
  boolean: (value: boolean) => (value ? 'Yes' : 'No'),
}
