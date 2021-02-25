import { useState } from 'react'
import { Box, Stack } from '@chakra-ui/react'

import DataThroughTime from '../DataThroughTime'

const intl = new Intl.NumberFormat('pt-BR')

const TotalResults = ({ data }) => {
  const roundRate = (rate: number) => Math.round(rate * 1000) / 10
  const [highlightedIndex, setHighlightedIndex] = useState(data.length - 1)
  return (
    <Stack spacing={4} display="flex" w="100%">
      <Box flex={1}>
        <DataThroughTime
          highlightedIndex={highlightedIndex}
          setHighlightedIndex={setHighlightedIndex}
          title="Confirmados"
          data={data.map(({ date, last_available_confirmed }) => ({
            date,
            value: last_available_confirmed,
          }))}
          color="red"
          tickFormat={(value: number) => `${value / 1000}k`}
        />
      </Box>
      <Box flex={1}>
        <DataThroughTime
          highlightedIndex={highlightedIndex}
          setHighlightedIndex={setHighlightedIndex}
          title="Mortes"
          data={data.map(({ date, last_available_deaths }) => ({
            date,
            value: last_available_deaths,
          }))}
          color="gray"
        />
      </Box>
      <Box flex={1}>
        <DataThroughTime
          highlightedIndex={highlightedIndex}
          setHighlightedIndex={setHighlightedIndex}
          title="Taxa de Mortalidade"
          data={data.map(
            ({ date, last_available_deaths, last_available_confirmed }) => ({
              date,
              value: roundRate(
                last_available_deaths / last_available_confirmed
              ),
            })
          )}
          color="orange"
          tickFormat={(value: number) => `${intl.format(value)}%`}
          labelFormat={(value: number) => `${intl.format(value)}%`}
        />
      </Box>
    </Stack>
  )
}

export default TotalResults
