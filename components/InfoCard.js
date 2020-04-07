import { Heading, Text, Flex } from "@chakra-ui/core"

const InfoCard = ({ label, value, color, ...rest }) => (
	<Flex
		direction="column"
		align="center"
		justify="center"
		bg={`${color}.100`}
		rounded="md"
		shadow="sm"
		p={4}
		{...rest}
	>
		<Heading as="h2" fontSize="xs" m={0} color={`${color}.600`}>
			{label}
		</Heading>
		<Text fontSize="2xl" fontWeight="bold" m={0} color={`${color}.500`}>
			{value}
		</Text>
	</Flex>
)

export default InfoCard
