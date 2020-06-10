import { ParentSize } from "@vx/responsive"
import { scaleLinear } from "@vx/scale"
import { Mercator } from "@vx/geo"
import { LegendLinear, LegendItem, LegendLabel } from "@vx/legend"
import * as topojson from "topojson"
import { Topology, GeometryCollection } from "topojson-specification"
import { Text, Flex, Box, Tooltip, Link as ChakraLink } from "@chakra-ui/core"
import styled from "@emotion/styled"
import { css } from "@emotion/core"
import Link from "next/link"

const selectedStyles = (props) =>
	props.variant === "selected" &&
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

interface GeometryProps {
	codarea: string
	centroide: [number, number]
}

const Map = ({ results, topology, countiesCode }) => {
	const brazil = topojson.feature(
		topology as Topology<{ foo: GeometryCollection<GeometryProps> }>,
		topology.objects.foo as GeometryCollection<GeometryProps>
	)
	const outline = topojson.mesh(
		topology as Topology<{ foo: GeometryCollection<GeometryProps> }>,
		topology.objects.foo as GeometryCollection<GeometryProps>
	)
	const colorScale = scaleLinear({
		domain: [0, Math.max(...results.map((r) => r.last_available_confirmed))],
		range: ["white", "red"],
	})
	const offset = 0
	return (
		<Box height={[350, 475, 600]} mt={8} position="relative">
			<ParentSize>
				{({ width: w, height: h }) => (
					<svg width={w} height={h}>
						<Mercator
							data={brazil.features}
							fitExtent={[
								[
									[offset, offset],
									[w - offset, h - offset],
								],
								outline,
							]}
						>
							{(mercator) => {
								return (
									<g>
										{mercator.features.map(({ feature: f }) => {
											const countyCode = f.properties.codarea
											const { sigla } = countiesCode.find(
												(c) => c.id === +countyCode
											)
											const county = results.find((r) => r.state === sigla)
											return (
												<Tooltip
													key={sigla}
													label={`${county.state} (${county.last_available_confirmed} confirmados, ${county.last_available_deaths} mortes)`}
													aria-label={`${county.state} (${county.last_available_confirmed} confirmados, ${county.last_available_deaths} mortes)`}
													placement="top"
													hasArrow
												>
													<Box as="g">
														<Link href="/[county]" as={`/${sigla}`}>
															<ChakraLink href={`/${sigla}`}>
																<State
																	fill={colorScale(
																		county.last_available_confirmed
																	)}
																	d={mercator.path(f)}
																/>
															</ChakraLink>
														</Link>
													</Box>
												</Tooltip>
											)
										})}
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
				bg="whiteAlpha.500"
			>
				<LegendLinear scale={colorScale}>
					{(labels) => {
						return labels.map((label, i) => (
							<LegendItem key={`legend-threshold-${i}`}>
								<Flex mr={2}>
									<svg width={15} height={15}>
										<rect
											width={15}
											height={15}
											fill={label.value}
											stroke="black"
											strokeWidth={0.5}
										/>
									</svg>
								</Flex>
								<LegendLabel>
									<Text m={0} fontSize="xs">
										{Math.round(parseFloat(label.text))} casos confirmados
									</Text>
								</LegendLabel>
							</LegendItem>
						))
					}}
				</LegendLinear>
			</Flex>
		</Box>
	)
}

export default Map
