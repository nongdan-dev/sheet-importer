var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value)
          })
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value))
        } catch (e) {
          reject(e)
        }
      }
      function rejected(value) {
        try {
          step(generator['throw'](value))
        } catch (e) {
          reject(e)
        }
      }
      function step(result) {
        result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected)
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next())
    })
  }
import { jsx as _jsx } from 'react/jsx-runtime'
import { SheetMappingData } from './SheetMappingData'
const Home = () => {
  const onSubmit = (jsonData) =>
    __awaiter(void 0, void 0, void 0, function* () {
      console.log('jsonData', jsonData)
    })
  // const valdateDiscount = value => {
  //   if (!/%$/.test(value)) return { error: 'Khong co dau phan tram' }
  //   let v = value.replace('%', '')
  //   v = Number(v) / 100
  //   if (v < 0 || v > 1) return { error: 'so khong hop le' }
  //   return { value: v }
  // }
  const discountDetector = {
    id: 'discountID',
    label: 'Discount',
    validate: (value) => {
      let numericValue
      let isPercentageFormat = false
      if (/%$/i.test(value)) {
        isPercentageFormat = true
        const numericPart = value.replace(/%/g, '').trim()
        numericValue = parseFloat(numericPart)
        if (isNaN(numericValue)) {
          return { error: 'Invalid number' }
        }
        numericValue = numericValue / 100
      } else {
        numericValue = parseFloat(value)
        if (isNaN(numericValue)) {
          return { error: 'Invalid number' }
        }
      }
      if (numericValue <= 0 || numericValue >= 1) {
        const displayValue = isPercentageFormat ? `${numericValue * 100}%` : numericValue
        return {
          error: `The value of ${displayValue} must be greater than 0 and less than 1`,
        }
      }
      return { value: numericValue }
    },
    threshold: 0.6,
    display: (value) => `${Math.round(value * 100)}%`,
  }
  const plantTypeDetector = {
    id: 'plantTypeID',
    label: 'Loại cây',
    validate: (value) => {
      if (typeof value !== 'string') {
        return { error: 'Value must be string' }
      }
      const cleaned = value.trim()
      if (cleaned === 'Chậu đât' || cleaned === 'Thuỷ sinh') {
        return { value: cleaned }
      }
      return {
        error: 'Only accept "Chậu đât" or "Thuỷ sinh".',
      }
    },
    display: (value) => value,
  }
  return _jsx('div', {
    children: _jsx(SheetMappingData, {
      onSubmit: onSubmit,
      fields: [discountDetector, plantTypeDetector],
    }),
  })
}
export default Home
//# sourceMappingURL=index.js.map
