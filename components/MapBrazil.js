import { useState, useEffect } from "react"
import { ParentSize } from "@vx/responsive"
import { scaleLinear, scaleThreshold } from "@vx/scale"
import { Mercator } from "@vx/geo"
import {
	LegendLinear,
	LegendThreshold,
	LegendItem,
	LegendLabel,
} from "@vx/legend"
import * as topojson from "topojson"
import { Text, Flex, Box, Link as ChakraLink } from "@chakra-ui/core"
import styled from "@emotion/styled"
import { css } from "@emotion/core"
import Link from "next/link"
import { useRouter } from "next/router"

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

const Cities = ({ cities, projection, scale }) => {
	return (
		<g>
			{cities.map((city) => {
				const position = projection([city.coords.lon, city.coords.lat])
				return (
					<circle
						key={city.city_ibge_code}
						cx={position[0]}
						cy={position[1]}
						r={scale(city.confirmed)}
						fill="red"
						opacity={0.35}
					/>
				)
			})}
		</g>
	)
}

const MapBrazil = ({ results, cities }) => {
	const router = useRouter()
	const { state } = router.query
	const world = topojson.feature(topology, topology.objects.states)
	const outline = topojson.mesh(topology, topology.objects.states)
	const radiusScale = scaleThreshold({
		domain: [1, 10, 100, 1000, 10000],
		range: [2, 4, 6, 8, 10],
	})
	const colorScale = scaleLinear({
		domain: [0, Math.max(...results.map((r) => r.confirmed))],
		range: ["white", "red"],
	})
	const [offset, setOffset] = useState(0)
	useEffect(() => {
		state ? setOffset(25) : setOffset(0)
	}, [state])
	return (
		<Box height={[350, 475, 600]} mt={8} position="relative">
			{state && (
				<Box position="absolute" t={0} l={0}>
					<Link href="/" replace>
						<ChakraLink>Voltar</ChakraLink>
					</Link>
				</Box>
			)}
			<ParentSize>
				{({ width: w, height: h }) => (
					<svg width={w} height={h}>
						<Mercator
							data={world.features}
							fitExtent={[
								[
									[offset, offset],
									[w - offset, h - offset],
								],
								state ? world.features.find((f) => f.id === state) : outline,
							]}
						>
							{(mercator) => {
								return (
									<g>
										{mercator.features.map(({ feature: f }) => (
											<Link key={f.id} href="/[state]" as={`/${f.id}`}>
												<State
													fill={
														state
															? "white"
															: colorScale(
																	results.find((r) => r.state === f.id)
																		.confirmed
															  )
													}
													d={mercator.path(f)}
												/>
											</Link>
										))}
										{state && (
											<g>
												<Link href="/" replace>
													<State
														fill={colorScale(
															results.find((r) => r.state === state).confirmed
														)}
														d={mercator.path(
															mercator.features.find(
																(f) => f.feature.id === state
															).feature
														)}
														variant="selected"
													/>
												</Link>
												{cities && (
													<Cities
														cities={cities}
														projection={
															mercator.features.find(
																(f) => f.feature.id === state
															).projection
														}
														scale={radiusScale}
													/>
												)}
											</g>
										)}
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
				{state ? (
					<LegendThreshold scale={radiusScale}>
						{(labels) => {
							return labels.slice(1).map((label, i) => (
								<LegendItem key={`legend-threshold-${i}`}>
									<Flex mr={2}>
										<svg width={label.value * 2} height={label.value * 2}>
											<circle
												cx={label.value}
												cy={label.value}
												r={label.value}
												fill="red"
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
					</LegendThreshold>
				) : (
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
				)}
			</Flex>
		</Box>
	)
}

export default MapBrazil
