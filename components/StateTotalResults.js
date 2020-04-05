import InfoCard from "../components/InfoCard"
import { Stack, Heading, Box } from "@chakra-ui/core"

const StateTotalResults = ({ result }) => (
	<Box>
		<Heading fontSize="lg">Total em {result.state}:</Heading>
		<Stack isInline spacing={4}>
			<InfoCard color="red" value={result.confirmed} label="CONFIRMADOS" />
			<InfoCard color="gray" value={result.deaths} label="MORTES" />
		</Stack>
	</Box>
)

export default StateTotalResults
