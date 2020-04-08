import { useState, useEffect } from "react"
import { ParentSize } from "@vx/responsive"
import { scaleThreshold } from "@vx/scale"
import { Mercator } from "@vx/geo"
import { LegendThreshold, LegendItem, LegendLabel } from "@vx/legend"
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

const CountyMap = ({ cities }) => {
	const router = useRouter()
	const { county } = router.query
	const world = topojson.feature(topology, topology.objects.states)
	const radiusScale = scaleThreshold({
		domain: [1, 10, 100, 500, 1000],
		range: [2, 4, 6, 8, 10],
	})
	const [offset, setOffset] = useState(0)
	useEffect(() => {
		county ? setOffset(25) : setOffset(0)
	}, [county])
	return (
		<Box height={[350, 475, 600]} mt={8} position="relative">
			<Box position="absolute" t={0} l={0}>
				<Link href="/" replace>
					<ChakraLink>Voltar</ChakraLink>
				</Link>
			</Box>
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
								world.features.find((f) => f.id === county),
							]}
						>
							{(mercator) => {
								return (
									<g>
										{mercator.features.map(({ feature: f }) => (
											<Link key={f.id} href="/[county]" as={`/${f.id}`}>
												<State fill="white" d={mercator.path(f)} />
											</Link>
										))}
										<g>
											<Link href="/" replace>
												<State
													d={mercator.path(
														mercator.features.find(
															(f) => f.feature.id === county
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
															(f) => f.feature.id === county
														).projection
													}
													scale={radiusScale}
												/>
											)}
										</g>
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
			</Flex>
		</Box>
	)
}

export default CountyMap
