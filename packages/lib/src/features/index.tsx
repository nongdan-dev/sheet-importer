import { CustomType } from '../types'
import { builtInValidate } from '../utils/utils'
import { SheetMappingData } from './SheetMappingData'

const Home = () => {
  const onSubmit = async (jsonData: any[]) => {
    console.log('jsonData', jsonData)
  }

  // const valdateDiscount = value => {
  //   if (!/%$/.test(value)) return { error: 'Khong co dau phan tram' }
  //   let v = value.replace('%', '')
  //   v = Number(v) / 100
  //   if (v < 0 || v > 1) return { error: 'so khong hop le' }
  //   return { value: v }
  // }

  const discountDetector: CustomType<number> = {
    id: 'discountID',
    label: 'Discount',
    validate: (value: string) => {
      let numericValue: number
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
    display: (value: number) => `${Math.round(value * 100)}%`,
  }

  const plantTypeDetector: CustomType<string> = {
    id: 'plantTypeID',
    label: 'Loại cây',
    validate: async (value: string) => {
      await new Promise((resolve) => setTimeout(resolve, 100))

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
    display: (value: string) => value,
  }

  const mockOnAddField = async (field: CustomType): Promise<void> => {
    console.log(' Mock API - Field added:', field)

    return new Promise((resolve) => setTimeout(resolve, 500))
  }

  const priceDetector: CustomType<number> = {
    id: 'priceID',
    label: 'Price',
    validate: builtInValidate.number,
    display: (value: number) => `$${value.toFixed(2)}`,
  }

  return (
    <div>
      <SheetMappingData
        onSubmit={onSubmit}
        fields={[discountDetector, plantTypeDetector, priceDetector]}
        onAddField={mockOnAddField}
      />
    </div>
  )
}

export default Home
