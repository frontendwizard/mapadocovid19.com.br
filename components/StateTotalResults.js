import InfoCard from "../components/InfoCard"
import { Stack, Heading, Box } from "@chakra-ui/core"

const StateTotalResults = ({ result: { state, deaths, confirmed } }) => (
	<Box>
		<Heading fontSize="lg">Total em {state}:</Heading>
		<Stack isInline spacing={4}>
			<InfoCard color="red" value={confirmed} label="CONFIRMADOS" />
			<InfoCard color="gray" value={deaths} label="MORTES" />
			<InfoCard
				color="orange"
				value={`${Math.round((deaths / confirmed) * 1000) / 10}%`}
				label="MORTALIDADE"
			/>
		</Stack>
	</Box>
)

export default StateTotalResults
