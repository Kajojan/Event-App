/* eslint-disable no-console */
import { Box, Button, Rating } from '@mui/material'
import { useEffect, useRef, useState } from 'react'
import apiData from '../../services/apiData'
import { useNavigate } from 'react-router-dom'
import DatePicker from 'react-datepicker'
import { pl } from 'date-fns/locale/pl'
import 'react-datepicker/dist/react-datepicker.css'
import { getFilterName, useParsedFilters } from '../helper/FiltersUrl'
import style from './Filters.module.scss'
import PropTypes from 'prop-types'



const Filters = ({ skip, setEvent, event }) =>{
  const skipRef = useRef(skip)

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
  const [open, setOpen] = useState(window.innerWidth >= 1300)
  useEffect(() => {
    const params = new URLSearchParams(location.search)
    let updatedValues = {}

    Object.keys(filters).forEach((key) => {
      const paramValue = params.get(key)

      if (paramValue) {
        updatedValues[key] = key == 'seats' ? paramValue.split(',').map((el)=>parseInt(el)) : paramValue.split(',')
      } else {
        key == 'star' ? updatedValues[key] = [0] : updatedValues[key] = []
      }
    })
    const dateRanges = params.get('date')
    if (dateRanges) {
      const firstRange = dateRanges.split(',')[0]
      const [start, end] = firstRange.split('_')
      updatedValues.startDate = start || null
      updatedValues.endDate = end || null
    } else {
      const date = new Date()
      date.setHours(date.getHours() + 2)
      updatedValues.startDate = date
      updatedValues.endDate = null
    }

    // eslint-disable-next-line no-console

    apiData.filtersArg({ ...updatedValues }).then((res)=>{
      setFilters(res.data.filters)
    })
    apiData.filtersEvents({ ...updatedValues }).then((res)=>{
      if (res.data) {
        setEvent(res.data)
      }
    })
    // eslint-disable-next-line no-console
    setSelectedValues(updatedValues)

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.search])

  useEffect(() => {
    if (skipRef.current === skip) {
      return
    }
    console.log(skip, selectedValues)
    skipRef.current = skip
    apiData.filtersEvents({ ...selectedValues, skip }).then((res) => {
      if (res.data) {
        setEvent([...event, ...res.data])
      }
    })

  }, [skip])

  const handleClick = (key, value) => {
    const current = (searchParams.get(key) || '').split(',').filter(Boolean)

    let updated
    if (current.includes(value)) {
      updated = current.filter(item => item !== value)
    } else {
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
        <h2 onClick={window.innerWidth < 1300 ? ()=>setOpen(!open) : null}>Filtrowanie
          {window.innerWidth < 1300 && !open ? <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 55" width="25" height="25">
            <path d="M50 10 L50 70 M50 70 L30 50 M50 70 L70 50" stroke="blue" strokeWidth="5" fill="none"/>
          </svg>
            : null}</h2>
        { open && <Button onClick={()=>{navigate(''), setSelectedDate([null, null]) }}>
          wyszyść
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
            <path d="M2.146 2.146a.5.5 0 011 0L8 6.293l4.854-4.147a.5.5 0 01.707.707L8.707 7l4.854 4.854a.5.5 0 01-.707.707L8 7.707l-4.854 4.854a.5.5 0 01-.707-.707L7.293 7 2.146 2.854a.5.5 0 010-.707z"/>
          </svg>
        </Button>}
      </Box>
      {open && <> <Box>
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
          <ul style={{ maxHeight: '250px', overflow:'auto' }}>
            {values?.length > 0 && values.map(({ count, value }, i) => {
              if (key == 'star') {
                return (
                  <li key={i}>
                    <label key={i}>
                      <input
                        type="checkbox"
                        checked={selectedValues[key] && selectedValues[key].includes(`${value.low ? value.low : value}`)}
                        onChange={() => handleClick(key, `${value.low ? value.low : value}`)}
                      />
                      <Rating
                        name="read-only-rating"
                        value={value.low ? value.low : value}
                        readOnly
                        precision={0.01}
                      />
                      <a>{count.low}</a>
                    </label>
                  </li>
                )
              }
              if (key == 'seats') {
                return (
                  <li key={i}>
                    <label key={i}>
                      <input
                        type="checkbox"
                        checked={selectedValues[key] && selectedValues[key].includes(value.low ? value.low : value)}
                        onChange={() => handleClick(key, `${value.low ? value.low : value}`)}
                      />
                      <p> {value.low ? value.low : value} </p>
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
      ))} </> }
    </Box>
  )
}

Filters.propTypes = {
  setEvent: PropTypes.func,
  skip: PropTypes.number,
  event: PropTypes.array
}
export default Filters
