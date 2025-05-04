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
    selectedDateRanges: parseDateRanges(),
    selectedTypes: getArrayParam('types'),
    selectedCountries: getArrayParam('countries'),
    selectedCities: getArrayParam('cities'),
    selectedStar: getArrayParam('star')
  }
}


export const getFilterName = (key)=>{
  switch (key) {
  case 'cities':
    return 'Miasta'
  case 'countries':
    return 'Kraje'
  case 'seats':
    return 'Liczba miejsc'
  case 'star':
    return 'średnie oceny organizatora'
  case 'types':
    return 'Typy wydarzeń'
  default:
    return key
  }

}
