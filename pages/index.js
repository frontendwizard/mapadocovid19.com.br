import Head from "next/head"
import { Mercator } from "@vx/geo"
import { scaleLinear } from "@vx/scale"
import { ParentSize } from "@vx/responsive"
import * as topojson from "topojson"
import { Stack, Heading, Text, Box } from "@chakra-ui/core"
import styled from "@emotion/styled"
import { css } from "@emotion/core"
import fetch from "isomorphic-fetch"
import topology from "../utils/simpleTopology.json"

const selectedStyles = (props) =>
  props.variant === "selected" &&
  css`
    stroke: red;
    stroke-width: 2;
  `
const State = styled.path`
  stroke: black;
  stroke-width: 0.5;
  cursor: pointer;
  ${selectedStyles}
`

const InfoCard = ({ label, value, color, ...rest }) => (
  <Box bg={`${color}.100`} p={4} rounded='md' shadow='sm' {...rest}>
    <Heading as='h2' fontSize='xs' m={0} color={`${color}.600`}>
      {label}
    </Heading>
    <Text fontSize='2xl' fontWeight='bold' m={0} color={`${color}.500`}>
      {value}
    </Text>
  </Box>
)

const BrazilResults = ({ results }) => (
  <Box>
    <Heading fontSize='lg'>Total no Brasil:</Heading>
    <Stack isInline spacing={8}>
      <InfoCard
        color='red'
        value={results.reduce((acc, current) => acc + current.confirmed, 0)}
        label='CONFIRMADOS'
      />
      <InfoCard
        color='gray'
        value={results.reduce((acc, current) => acc + current.deaths, 0)}
        label='MORTES'
      />
    </Stack>
  </Box>
)

const StateResult = ({ result }) => (
  <Box>
    <Heading fontSize='lg'>Total em {result.state}:</Heading>
    <Stack isInline spacing={8}>
      <InfoCard color='red' value={result.confirmed} label='CONFIRMADOS' />
      <InfoCard color='gray' value={result.deaths} label='MORTES' />
    </Stack>
  </Box>
)

const Home = ({ results }) => {
  const [selectedState, setSelectedState] = React.useState(null)
  const world = topojson.feature(topology, topology.objects.states)
  const outline = topojson.mesh(topology, topology.objects.states)
  const colorScale = scaleLinear({
    domain: [0, Math.max(...results.map((r) => r.confirmed))],
    range: ["white", "red"],
  })
  return (
    <div className='container'>
      <Head>
        <title>Mapa do COVID-19 no Brasil</title>
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <Box
        as='main'
        padding={4}
        width={["100%", 3 / 4, "700px"]}
        margin={[0, "auto"]}
      >
        <Heading as='h1' fontSize='2xl' mt={0}>
          COVID-19 no Brasil
        </Heading>
        <Text fontSize='xl'>Selecione um estado para mais detalhes</Text>
        {!selectedState ? (
          <BrazilResults results={results} />
        ) : (
          <StateResult
            result={results.find((r) => r.state === selectedState)}
          />
        )}
        <Box height={[350, 475, 600]} mt={8}>
          <ParentSize>
            {({ width: w, height: h }) => (
              <svg width={w} height={h}>
                <Mercator data={world.features} fitSize={[[w, h], outline]}>
                  {(mercator) => {
                    return (
                      <g>
                        {mercator.features.map(({ feature: f }) => (
                          <State
                            fill={colorScale(
                              results.find((r) => r.state === f.id).confirmed
                            )}
                            key={f.id}
                            d={mercator.path(f)}
                            onClick={() => setSelectedState(f.id)}
                          />
                        ))}
                        {selectedState && (
                          <State
                            fill={colorScale(
                              results.find((r) => r.state === selectedState)
                                .confirmed
                            )}
                            d={mercator.path(
                              mercator.features.find(
                                (f) => f.feature.id === selectedState
                              ).feature
                            )}
                            variant='selected'
                          />
                        )}
                      </g>
                    )
                  }}
                </Mercator>
              </svg>
            )}
          </ParentSize>
        </Box>
      </Box>
    </div>
  )
}

export async function getStaticProps() {
  const res = await fetch(
    `https://brasil.io/api/dataset/covid19/caso/data?is_last=true&place_type=state`
  )
  const { results } = await res.json()
  return {
    props: { results },
  }
}

export default Home
