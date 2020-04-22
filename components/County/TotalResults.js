import { Stack } from "@chakra-ui/core"

import InfoCard from "../InfoCard"
const TotalResults = ({ history }) => {
	const mostRecent = history[0]
	const previous = history[1]
	const roundRate = (rate) => Math.round(rate * 1000) / 10
	const rateComparison = roundRate(mostRecent.death_rate - previous.death_rate)
	const deathComparison = mostRecent.deaths - previous.deaths
	return (
		<Stack isInline spacing={4}>
			<InfoCard
				color="red"
				value={mostRecent.confirmed}
				comparison={mostRecent.confirmed - previous.confirmed}
				label="CONFIRMADOS"
			/>
			<InfoCard
				color="gray"
				value={mostRecent.deaths}
				comparison={deathComparison}
				label="MORTES"
			/>

			<InfoCard
				color="orange"
				value={roundRate(mostRecent.death_rate)}
				comparison={rateComparison}
				suffix="%"
				label="MORTALIDADE"
			/>
		</Stack>
	)
}

export default TotalResults
