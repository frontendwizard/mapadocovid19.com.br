import { ParentSize } from '@vx/responsive'
import { scaleLog } from '@vx/scale'
import { Mercator } from '@vx/geo'
import { LegendSize, LegendItem, LegendLabel } from '@vx/legend'
import { GeoProjection } from 'd3-geo'
import * as topojson from 'topojson'
import { Topology, GeometryCollection } from 'topojson-specification'
import { Text, Flex, Box, Link as ChakraLink } from '@chakra-ui/core'
import styled from '@emotion/styled'
import { css } from '@emotion/core'
import Link from 'next/link'
import { useRouter } from 'next/router'

import useEscToNavigateBack from '../../hooks/useEscToNavigateBack'
import { useMemo, useState, useEffect } from 'react'

const selectedStyles = (props: { variant: 'selected' | null }) =>
  props.variant === 'selected' &&
  css`
    fill: white;
    stroke: red;
    stroke-width: 2;
  `

const State = styled.path`
  stroke: black;
  stroke-width: 0.5;
  cursor: pointer;
  ${selectedStyles}
`

interface City {
  city: string
  city_ibge_code: number
  date: string
  epidemiological_week: number
  estimated_population_2019: number
  is_last: boolean
  is_repeated: boolean
  last_available_confirmed: number
  last_available_confirmed_per_100k_inhabitants: number
  last_available_date: string
  last_available_death_rate: number
  last_available_deaths: number
  new_confirmed: number
  new_deaths: number
  order_for_place: number
  place_type: string
  state: string
  coords: {
    lon: number
    lat: number
  }
}

interface CitiesProps {
  cities: City[]
  projection: GeoProjection
  scale: (value: number) => number
  isTabbable?: boolean
}

const Cities = ({
  cities,
  projection,
  scale,
  isTabbable = false,
}: CitiesProps) => {
  cities.sort((a, b) => b.last_available_confirmed - a.last_available_confirmed)
  return (
    <g>
      {cities.map((city) => {
        const position = projection([city.coords.lon, city.coords.lat])
        const radius = scale(city.last_available_confirmed)
        if (Number.isNaN(radius)) {
          return null
        }
        return (
          <Box as="g" key={city.city_ibge_code} tabIndex={isTabbable ? 0 : -1}>
            <circle
              cx={position[0]}
              cy={position[1]}
              r={scale(city.last_available_confirmed)}
              fill="red"
              stroke="black"
              opacity={0.35}
            />
          </Box>
        )
      })}
    </g>
  )
}

interface GeometryProps {
  codarea: string
  centroide: [number, number]
}

interface Props {
  cities: City[]
}

const Map: React.FC<Props> = ({ cities }) => {
  const router = useRouter()
  const { county } = router.query
  const [topology, setTopology] = useState<Topology<{
    foo: GeometryCollection<GeometryProps>
  }> | null>(null)
  useEffect(() => {
    ;(async () => {
      const topology: Topology<{
        foo: GeometryCollection<GeometryProps>
      }> = await import(`../../public/topologies/${county}.json`)
      setTopology(topology)
    })()
  }, [])
  const countyTopology = useMemo(
    () => topology && topojson.feature(topology, topology.objects.foo),
    [topology]
  )
  const radiusScale = useMemo(
    () =>
      scaleLog({
        domain: [1, 10000],
        range: [2, 20],
      }),
    []
  )

  const offset = 15
  useEscToNavigateBack(router)

  if (!topology) return null
  console.log('cities', cities)

  return (
    <Box height={[350, 475, 600]} mt={8} position="relative">
      <Text position="absolute" top={0} left={0}>
        <Link href="/" replace shallow>
          <ChakraLink href="/">Voltar</ChakraLink>
        </Link>
      </Text>
      <ParentSize>
        {({ width: w, height: h }) => (
          <svg width={w} height={h}>
            <Mercator
              data={countyTopology.features}
              fitExtent={[
                [
                  [offset, offset],
                  [w - offset, h - offset],
                ],
                countyTopology.features[0],
              ]}
            >
              {(mercator) => {
                return (
                  <g>
                    <State
                      d={mercator.path(mercator.features[0].feature)}
                      variant="selected"
                    />
                    <Cities
                      cities={cities.filter((city) => city.state === county)}
                      projection={mercator.features[0].projection}
                      scale={radiusScale}
                      isTabbable
                    />
                  </g>
                )
              }}
            </Mercator>
          </svg>
        )}
      </ParentSize>
      <Flex
        direction="column"
        position="absolute"
        bottom={0}
        left={0}
        p={2}
        border="1px"
        bg="whiteAlpha.800"
      >
        <LegendSize scale={radiusScale} domain={[1, 10, 100, 1000]}>
          {(labels) => {
            return labels.map((label, i) => (
              <LegendItem key={`legend-threshold-${i}`}>
                <Flex mr={2}>
                  <svg width={label.value * 2} height={label.value * 2}>
                    <circle
                      cx={label.value}
                      cy={label.value}
                      r={label.value}
                      fill="red"
                      stroke="black"
                      opacity={0.35}
                    />
                  </svg>
                </Flex>
                <LegendLabel>
                  <Text m={0} fontSize="xs">
                    {label.text}
                  </Text>
                </LegendLabel>
              </LegendItem>
            ))
          }}
        </LegendSize>
      </Flex>
    </Box>
  )
}

export default Map
