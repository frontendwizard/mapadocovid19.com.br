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

import topology from "../../utils/topologyLowPoly.json"

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

const Map = ({ results }) => {
	const brazil = topojson.feature(
		topology as Topology<{ states: GeometryCollection<{ nome: string }> }>,
		topology.objects.states as GeometryCollection<{ nome: string }>
	)
	const outline = topojson.mesh(
		topology as Topology<{ states: GeometryCollection<{ nome: string }> }>,
		topology.objects.states as GeometryCollection<{ nome: string }>
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
								mercator.features.sort((a, b) => {
									const countyA = results.find((r) => r.state === a.feature.id)
									const countyB = results.find((r) => r.state === b.feature.id)
									return (
										countyB.last_available_confirmed -
										countyA.last_available_confirmed
									)
								})
								return (
									<g>
										{mercator.features.map(({ feature: f }) => {
											const county = results.find((r) => r.state === f.id)
											return (
												<Tooltip
													key={f.id}
													label={`${county.state} (${county.last_available_confirmed} confirmados, ${county.last_available_deaths} mortes)`}
													aria-label={`${county.state} (${county.last_available_confirmed} confirmados, ${county.last_available_deaths} mortes)`}
													placement="top"
													hasArrow
												>
													<Box as="g">
														<Link href="/[county]" as={`/${f.id}`}>
															<ChakraLink href={`/${f.id}`}>
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
