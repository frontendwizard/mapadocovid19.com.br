import * as React from 'react'
import DataThroughTime from './DataThroughTime'
import { theme, ThemeProvider } from '@chakra-ui/core'

import fetchAllReports from '../utils/fetchAllReports'

export default {
  title: 'components/DataThroughTime',
  component: DataThroughTime,
}

const intl = new Intl.NumberFormat('pt-BR')

const FetchData = ({ children }) => {
  const [data, setData] = React.useState(null)
  React.useEffect(() => {
    fetchAllReports('place_type=state').then((data) => setData(data))
  }, [])
  if (!data) {
    return <p>loading data</p>
  }
  const valueByDay = data.reduce((acc, item) => {
    const index = acc.indexOf(acc.find((i) => i.date === item.date))
    if (index >= 0) {
      acc[index].deaths += item.last_available_deaths
      acc[index].confirmed += item.last_available_confirmed
      acc[index].confirmedPer100k +=
        item.last_available_confirmed_per_100k_inhabitants
    } else {
      acc.push({
        date: item.date,
        deaths: item.last_available_deaths,
        confirmed: item.last_available_confirmed,
        confirmedPer100k: item.last_available_confirmed_per_100k_inhabitants,
      })
    }
    return acc
  }, [])
  return children(valueByDay)
}

export const confirmed = () => {
  const [highlightIndex, setHighlightIndex] = React.useState(0)
  return (
    <ThemeProvider theme={theme}>
      <FetchData>
        {(data) => (
          <DataThroughTime
            highlightedIndex={highlightIndex}
            setHighlightedIndex={setHighlightIndex}
            title="Confirmados"
            data={data.map(({ date, confirmed }) => ({
              date,
              value: confirmed,
            }))}
            color="red"
            tickFormat={(value: number) => `${value / 1000}k`}
          />
        )}
      </FetchData>
    </ThemeProvider>
  )
}

export const confirmedPer100k = () => {
  const [highlightIndex, setHighlightIndex] = React.useState(0)
  return (
    <ThemeProvider theme={theme}>
      <FetchData>
        {(data) => (
          <DataThroughTime
            highlightedIndex={highlightIndex}
            setHighlightedIndex={setHighlightIndex}
            title="Confirmados a cada 100k habitantes"
            data={data.map(({ date, confirmedPer100k }) => ({
              date,
              value: confirmedPer100k,
            }))}
            color="red"
            tickFormat={(value: number) => `${Math.round(value * 10) / 10}`}
          />
        )}
      </FetchData>
    </ThemeProvider>
  )
}

export const deaths = () => {
  const [highlightIndex, setHighlightIndex] = React.useState(0)
  return (
    <ThemeProvider theme={theme}>
      <FetchData>
        {(data) => (
          <DataThroughTime
            highlightedIndex={highlightIndex}
            setHighlightedIndex={setHighlightIndex}
            title="Mortes"
            data={data.map(({ date, deaths }) => ({ date, value: deaths }))}
            color="gray"
            tickFormat={(value: number) => `${value / 1000}k`}
          />
        )}
      </FetchData>
    </ThemeProvider>
  )
}

export const deathRate = () => {
  const [highlightIndex, setHighlightIndex] = React.useState(0)
  return (
    <ThemeProvider theme={theme}>
      <FetchData>
        {(data) => (
          <DataThroughTime
            highlightedIndex={highlightIndex}
            setHighlightedIndex={setHighlightIndex}
            title="Taxa de Mortalidade"
            data={data.map(({ date, deaths, confirmed }) => ({
              date,
              value: Math.round((deaths / confirmed) * 1000) / 10,
            }))}
            color="orange"
            labelFormat={(value) => `${intl.format(value)}%`}
            tickFormat={(value) => `${intl.format(value)}%`}
          />
        )}
      </FetchData>
    </ThemeProvider>
  )
}
