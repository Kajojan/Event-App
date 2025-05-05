/* eslint-disable no-unused-vars */
import { Box, Button, Rating } from '@mui/material'
import { useEffect, useState } from 'react'
import apiData from '../../services/apiData'
import { useNavigate } from 'react-router-dom'
import DatePicker from 'react-datepicker'
import { pl } from 'date-fns/locale/pl'
import 'react-datepicker/dist/react-datepicker.css'
import { getFilterName, useParsedFilters } from '../helper/FiltersUrl'
import style from './Filters.module.scss'
import PropTypes, { object } from 'prop-types'



const Filters = ({ setEvent }) =>{
  const {
    selectedDateRanges,
  } = useParsedFilters()

  const navigate = useNavigate()
  const [filters, setFilters] = useState(
    { types: [],
      countries: [],
      cities: [],
      startDate: null,
      endDate: null,
      seats: [],
      star: [] })
  const searchParams = new URLSearchParams(window.location.search)
  const [selectedDate, setSelectedDate] = useState(selectedDateRanges[0] || [null, null])
  const [selectedValues, setSelectedValues] = useState({})

  useEffect(() => {
    const params = new URLSearchParams(location.search)
    let updatedValues = {}

    Object.keys(filters).forEach((key) => {
      const paramValue = params.get(key)
      console.log('params', key, paramValue)

      if (paramValue) {
        updatedValues[key] = paramValue.split(',')
      } else {
        updatedValues[key] = []
      }
    })
    const dateRanges = params.get('date')
    if (dateRanges) {
      const firstRange = dateRanges.split(',')[0]
      const [start, end] = firstRange.split('_')
      updatedValues.startDate = start || null
      updatedValues.endDate = end || null
    } else {
      updatedValues.startDate = new Date()
      updatedValues.endDate = null
    }

    apiData.filtersArg({ ...updatedValues }).then((res)=>{
      setFilters(res.data.filters)
      console.log('filteraArg', res.data.filters)

    })
    apiData.filtersEvents({ ...updatedValues }).then((res)=>{
      console.log('data', res.data)
      if (res.data) {
        setEvent(res.data)
      }
    })

    console.log('updated', updatedValues)

    setSelectedValues(updatedValues)

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.search])

  const handleClick = (key, value) => {
    const current = (searchParams.get(key) || '').split(',').filter(Boolean)

    let updated

    if (current.includes(value)) {
      updated = current.filter(item => item !== value)
    } else {
      console.log(key, value)

      key == 'date' ? updated = [value] : updated = [...current, value]
    }

    if (updated.length > 0) {
      searchParams.set(key, updated.join(','))
    } else {
      searchParams.delete(key)
    }
    navigate(`?${searchParams.toString()}`)
  }


  const handleDateChange = (dates) => {
    setSelectedDate(dates)

    const [start, end] = dates
    console.log(dates)

    if (start && end) {
      const startDate = new Date(start)
      const endDate = new Date(end)

      const formattedStart = startDate.toLocaleDateString('en-CA')
      const formattedEnd = endDate.toLocaleDateString('en-CA')
      const finalValue = `${formattedStart}_${formattedEnd}`

      handleClick('date', finalValue)
    }
  }

  return (
    <Box className={style.filters_container}>
      <Box className={style.filter_header_container}>
        <h2>Filtrowanie</h2>
        <Button onClick={()=>{navigate(''), setSelectedDate([null, null]) }}>
          wyszyść
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
            <path d="M2.146 2.146a.5.5 0 011 0L8 6.293l4.854-4.147a.5.5 0 01.707.707L8.707 7l4.854 4.854a.5.5 0 01-.707.707L8 7.707l-4.854 4.854a.5.5 0 01-.707-.707L7.293 7 2.146 2.854a.5.5 0 010-.707z"/>
          </svg>
        </Button>
      </Box>
      <Box>
        <h3>Data</h3>
        <DatePicker
          className={style.datePicker}
          locale={pl}
          onChange={(date) => {handleDateChange(date)}}
          placeholderText="Wybierz datę"
          dateFormat="yyyy-MM-dd"
          calendarStartDay={1}
          selectsRange={true}
          startDate={selectedDate?.[0]}
          endDate={selectedDate?.[1]}
          minDate={new Date()}
        />
      </Box>
      {filters && Object.entries(filters).map(([key, values]) => (
        <div key={key}>
          <h3>{getFilterName(key)}</h3>
          <ul>
            {values?.length > 0 && values.map(({ count, value }, i) => {
              if (key == 'star') {
                return (
                  <li key={i}>
                    <label key={i}>
                      <input
                        type="checkbox"
                        checked={selectedValues[key] && selectedValues[key].includes(`${value}`)}
                        onChange={() => handleClick(key, `${value}`)}
                      />
                      <Rating
                        name="read-only-rating"
                        value={value}/>
                      <a>{count.low}</a>
                    </label>
                  </li>
                )
              }
              return (
                <li key={i}>
                  <label key={i}>
                    <input
                      type="checkbox"
                      checked={selectedValues[key] && selectedValues[key].includes(`${value}`)}
                      onChange={() => handleClick(key, `${value}`)}
                    />
                    <p> {value} </p>
                    <a>{count.low}</a>
                  </label>
                </li>
              )}
            )}
          </ul>
        </div>
      ))}
    </Box>
  )

}

Filters.propTypes = {
  setEvent: PropTypes.func
}
export default Filters
