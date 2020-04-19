import { Stack, Heading } from "@chakra-ui/core"

import InfoCard from "../InfoCard"

const TotalResults = ({ current, previous }) => {
	const confirmed = current.reduce((acc, current) => acc + current.confirmed, 0)
	const deaths = current.reduce((acc, current) => acc + current.deaths, 0)
	const previousConfirmed = previous.reduce(
		(acc, current) => acc + current.confirmed,
		0
	)
	const previousDeaths = previous.reduce(
		(acc, current) => acc + current.deaths,
		0
	)
	const currentRate = deaths / confirmed
	const previousRate = previousDeaths / previousConfirmed
	const roundRate = (rate) => Math.round(rate * 1000) / 10
	return (
		<Stack spacing={2}>
			<Heading fontSize="lg">Total no Brasil:</Heading>
			<Stack isInline spacing={4} justify="center">
				<InfoCard
					color="red"
					value={confirmed}
					comparison={confirmed - previousConfirmed}
					label="CONFIRMADOS"
				/>
				<InfoCard
					color="gray"
					value={deaths}
					comparison={deaths - previousDeaths}
					label="MORTES"
				/>
				<InfoCard
					color="orange"
					value={roundRate(currentRate)}
					comparison={roundRate(currentRate - previousRate)}
					suffix="%"
					label="MORTALIDADE"
				/>
			</Stack>
		</Stack>
	)
}

export default TotalResults
