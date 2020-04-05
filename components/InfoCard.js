import { Heading, Text, Box } from "@chakra-ui/core"

const InfoCard = ({ label, value, color, ...rest }) => (
	<Box bg={`${color}.100`} p={4} rounded="md" shadow="sm" {...rest}>
		<Heading as="h2" fontSize="xs" m={0} color={`${color}.600`}>
			{label}
		</Heading>
		<Text fontSize="2xl" fontWeight="bold" m={0} color={`${color}.500`}>
			{value}
		</Text>
	</Box>
)

export default InfoCard
