import { Stack, Heading, Box } from "@chakra-ui/core"

import InfoCard from "../components/InfoCard"

const BrazilResults = ({ results }) => (
	<Box>
		<Heading fontSize="lg">Total no Brasil:</Heading>
		<Stack isInline spacing={4}>
			<InfoCard
				color="red"
				value={results.reduce((acc, current) => acc + current.confirmed, 0)}
				label="CONFIRMADOS"
			/>
			<InfoCard
				color="gray"
				value={results.reduce((acc, current) => acc + current.deaths, 0)}
				label="MORTES"
			/>
		</Stack>
	</Box>
)

export default BrazilResults
