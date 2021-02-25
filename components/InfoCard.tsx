import { Heading, Text, Flex } from '@chakra-ui/react'

import leadingSign from '../utils/leadingSign'

const InfoCard = ({
  label,
  value,
  color,
  comparison,
  suffix = '',
  ...rest
}) => {
  return (
    <Flex
      direction="column"
      align="center"
      justify="center"
      bg={`${color}.100`}
      rounded="md"
      p={3}
      {...rest}
    >
      <Heading as="h2" fontSize="xs" m={0} color={`${color}.500`}>
        {label}
      </Heading>
      <Text
        as="span"
        fontSize="2xl"
        fontWeight="bold"
        m={0}
        color={`${color}.700`}
      >
        {value}
        {suffix}
      </Text>
      <Text as="span" fontSize="sm" ml={1} color={`${color}.700`}>
        [{leadingSign(comparison)}
        {comparison}
        {suffix}]
      </Text>
    </Flex>
  )
}

export default InfoCard
