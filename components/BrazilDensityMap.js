import { ParentSize } from "@vx/responsive"
import { scaleLinear } from "@vx/scale"
import { Mercator } from "@vx/geo"
import { LegendLinear, LegendItem, LegendLabel } from "@vx/legend"
import * as topojson from "topojson"
import * as d3 from "d3"
import { Text, Flex, Box } from "@chakra-ui/core"
import styled from "@emotion/styled"
import { css } from "@emotion/core"
import Link from "next/link"

import topology from "../utils/simpleTopology.json"

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

const BrazilClorophletMap = ({ results }) => {
	const world = topojson.feature(topology, topology.objects.states)
	const outline = topojson.mesh(topology, topology.objects.states)
	const colorScale = scaleLinear({
		domain: [0, Math.max(...results.map((r) => r.confirmed))],
		range: ["white", "red"],
	})
	const rawPoints = () => {
		// range longitudes from 10 (S) to 55 (N) for every 1 degree
		const lons = d3.range(-34, 5, 2).reverse()

		// range latitudes from -130 (W) to -60 (E) for every 1 degree
		const lats = d3.range(-75, -30, 2)

		// long / lat points in order from west to east, then north to south, like a wrap
		return lons.map((lon, i) => lats.map((lat) => [lat, lon])).flat()
	}
	const geojson = rawPoints.map((d, i) => {
		return {
			type: "Feature",
			geometry: {
				type: "Point",
				coordinates: d,
			},
			properties: {
				index: i,
			},
		}
	})
	return (
		<Box height={[350, 475, 600]} mt={8} position="relative">
			<ParentSize>
				{({ width: w, height: h }) => (
					<svg width={w} height={h}>
						<Mercator data={world.features} fitSize={[[w, h], outline]}>
							{(mercator) => {
								return (
									<>
										<g>
											{mercator.features.map(({ feature: f }) => (
												<Link key={f.id} href="/[county]" as={`/${f.id}`}>
													<State
														fill={colorScale(
															results.find((r) => r.state === f.id).confirmed
														)}
														d={mercator.path(f)}
													/>
												</Link>
											))}
										</g>
										<g>{}</g>
									</>
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
										{label.text}
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

export default BrazilClorophletMap
