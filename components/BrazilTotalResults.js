import { Stack, Heading, Box } from "@chakra-ui/core"

import InfoCard from "../components/InfoCard"

const BrazilResults = ({ results }) => {
	const confirmed = results.reduce((acc, current) => acc + current.confirmed, 0)
	const deaths = results.reduce((acc, current) => acc + current.deaths, 0)
	return (
		<Box>
			<Heading fontSize="lg">Total no Brasil:</Heading>
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
}

export default BrazilResults
