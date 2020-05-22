import { useState } from "react"
import { Box, Stack } from "@chakra-ui/core"

import DataThroughTime from "../DataThroughTime"

const TotalResults = ({ data }) => {
	const roundRate = (rate) => Math.round(rate * 1000) / 10
	const [highlightedIndex, setHighlightedIndex] = useState(0)
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
					tickFormat={(value: number) => `${value.toLocaleString("pt-BR")}%`}
					labelFormat={(value: number) => `${value.toLocaleString("pt-BR")}%`}
				/>
			</Box>
		</Stack>
	)
}

export default TotalResults
