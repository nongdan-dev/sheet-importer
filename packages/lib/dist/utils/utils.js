//remove diacritics and special characters from string
// and convert to lowercase
//map data bằng cách học header
export const normalizeString = (str) => {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]/g, '')
    .trim()
}
export const getExcelColumnName = (index) => {
  let columnName = ''
  let temp
  while (index >= 0) {
    temp = index % 26
    columnName = String.fromCharCode(temp + 65) + columnName
    index = Math.floor(index / 26) - 1
  }
  return columnName
}
export const detectColumnType = (values, detectors) => {
  // on 50 first rows
  const sample = values.slice(0, 50).filter((v) => v != null && v !== '')
  if (sample.length === 0) return null
  // Tính điểm matching cho từng detector
  const scores = detectors.map((detector) => {
    const validCount = sample.filter((value) => {
      var _a
      try {
        const result =
          (_a = detector.validate) === null || _a === void 0
            ? void 0
            : _a.call(detector, String(value).trim())
        return !(result === null || result === void 0 ? void 0 : result.error)
      } catch (_b) {
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
      current.score >= current.threshold &&
      current.score > ((best === null || best === void 0 ? void 0 : best.score) || 0)
        ? current
        : best,
    null,
  )
  return (bestMatch === null || bestMatch === void 0 ? void 0 : bestMatch.id) || null
}
//# sourceMappingURL=utils.js.map
