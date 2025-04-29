/* eslint-disable no-unused-vars */
import { Box } from '@mui/material'
import { useEffect, useState } from 'react'
import apiData from '../../services/apiData'
import { useNavigate } from 'react-router-dom'
import DatePicker from 'react-datepicker'
import { pl } from 'date-fns/locale/pl'
import 'react-datepicker/dist/react-datepicker.css'
import { useParsedFilters } from '../helper/FiltersUrl'
import style from './Filters.module.scss'
import PropTypes from 'prop-types'



const Filters = ({ setEvent }) =>{
  const {
    selectedDateRanges,
  } = useParsedFilters()

  const navigate = useNavigate()
  const [filters, setFilters] = useState({})
  const searchParams = new URLSearchParams(window.location.search)
  const [selectedDate, setSelectedDate] = useState(selectedDateRanges[0] || [null, null])
  const [selectedValues, setSelectedValues] = useState({})

  useEffect(()=>{
    apiData.filters().then((res)=>{
      setFilters(res.data.filters)
    })
  }, [])

  useEffect(() => {
    const params = new URLSearchParams(location.search)
    let updatedValues = {}

    Object.keys(filters).forEach((key) => {
      const paramValue = params.get(key)
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
      updatedValues.startDate = null
      updatedValues.endDate = null
    }


    apiData.filtersArg({ ...updatedValues }).then((res)=>{
      setFilters(res.data.filters)
    })
    apiData.filtersEvents({ ...updatedValues }).then((res)=>{
      console.log('data', res.data)
      if (res.data) {
        setEvent(res.data)
      }

    })

    console.log(updatedValues)

    setSelectedValues(updatedValues)

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


    // apiData.filtersArg({})
    console.log(searchParams.toString())

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
      <h2>Filtrowanie</h2>
      {filters && Object.entries(filters).map(([key, values]) => (
        <div key={key}>
          <h3>{key}</h3>
          <ul>
            {values.map(({ count, value }, i) => (
              <li key={i}>
                <label key={i}>
                  <input
                    type="checkbox"
                    checked={selectedValues[key] && selectedValues[key].includes(`${value}`)}
                    onChange={() => handleClick(key, `${value}`)}
                  />
                  <p> { !value.low ? value : value.low} </p>
                  <a>{count.low}</a>
                </label>
              </li>
            ))}
          </ul>
        </div>
      ))}
      <DatePicker
        locale={pl}
        onChange={(date) => {handleDateChange(date)}}
        placeholderText="Wybierz datę"
        dateFormat="yyyy-MM-dd"
        calendarStartDay={1}
        selectsRange={true}
        startDate={selectedDate?.[0]}
        endDate={selectedDate?.[1]}
      />
    </Box>
  )

}

Filters.propTypes = {
  setEvent: PropTypes.func
}
export default Filters
