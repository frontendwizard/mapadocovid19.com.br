import { useState } from 'react'
import { Stack, Box } from '@chakra-ui/react'

import DataThroughTime from '../DataThroughTime'

const intl = new Intl.NumberFormat('pt-BR')

const TotalResults = ({ data }) => {
  const roundRate = (rate) => Math.round(rate * 1000) / 10
  const [highlightedIndex, setHighlightedIndex] = useState(data.length - 1)
  return (
    <Stack spacing={4} display="flex" w="100%">
      <Box flex={1}>
        <DataThroughTime
          highlightedIndex={highlightedIndex}
          setHighlightedIndex={setHighlightedIndex}
          title="Confirmados"
          data={data.map(({ date, confirmed }) => ({
            date,
            value: confirmed,
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
          data={data.map(({ date, deaths }) => ({ date, value: deaths }))}
          color="gray"
          tickFormat={(value: number) => `${value / 1000}k`}
        />
      </Box>
      <Box flex={1}>
        <DataThroughTime
          highlightedIndex={highlightedIndex}
          setHighlightedIndex={setHighlightedIndex}
          title="Taxa de Mortalidade"
          data={data.map(({ date, deaths, confirmed }) => ({
            date,
            value: roundRate(deaths / confirmed),
          }))}
          tickFormat={(value: number) => `${intl.format(value)}%`}
          labelFormat={(value: number) => `${intl.format(value)}%`}
          color="orange"
        />
      </Box>
    </Stack>
  )
}

export default TotalResults
