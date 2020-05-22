import { useState } from "react"
import { Stack, Box } from "@chakra-ui/core"

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
					tickFormat={(value: number) => `${value.toLocaleString("pt-BR")}%`}
					labelFormat={(value: number) => `${value.toLocaleString("pt-BR")}%`}
					color="orange"
				/>
			</Box>
		</Stack>
	)
}

export default TotalResults
