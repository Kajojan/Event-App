import { useSearchParams } from 'react-router-dom'

export const useParsedFilters = () => {
  const [searchParams] = useSearchParams()

  const getArrayParam = (key) => {
    const param = searchParams.get(key)
    return param ? param.split(',') : []
  }

  const parseDateRanges = () => {
    const param = searchParams.get('date')
    if (!param) return []

    return param.split(',').map(range => {
      const [start, end] = range.split('_')
      return [new Date(start), new Date(end)]
    })
  }

  return {
    selectedDateRanges: parseDateRanges(), // => array of [Date, Date]
    selectedTypes: getArrayParam('types'),
    selectedCountries: getArrayParam('countries'),
    selectedCities: getArrayParam('cities'),
  }
}
