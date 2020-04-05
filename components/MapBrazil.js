import { useState, useEffect } from "react"
import { Mercator } from "@vx/geo"
import { ParentSize } from "@vx/responsive"
import { scaleLinear, scaleQuantize } from "@vx/scale"
import * as topojson from "topojson"
import { Box } from "@chakra-ui/core"
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

const Cities = ({ cities, projection }) => {
	const radiusScale = scaleLinear({ domain: [1, 5000], range: [3, 20] })
	return (
		<g>
			{cities.map((city) => {
				const position = projection([city.coords.lon, city.coords.lat])
				return (
					<circle
						key={city.city_ibge_code}
						cx={position[0]}
						cy={position[1]}
						r={radiusScale(city.confirmed)}
						fill="red"
						stroke="#000"
						strokeWidth={0.5}
						opacity={0.5}
					/>
				)
			})}
		</g>
	)
}

const MapBrazil = ({
	results,
	selectedState = null,
	onStateSelection,
	cities,
}) => {
	const world = topojson.feature(topology, topology.objects.states)
	const outline = topojson.mesh(topology, topology.objects.states)
	const colorScale = scaleLinear({
		domain: [0, Math.max(...results.map((r) => r.confirmed))],
		range: ["white", "red"],
	})
	const [offset, setOffset] = useState(0)
	useEffect(() => {
		selectedState ? setOffset(25) : setOffset(0)
	}, [selectedState])
	return (
		<Box height={[350, 475, 600]} mt={8}>
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
								selectedState
									? world.features.find((f) => f.id === selectedState)
									: outline,
							]}
						>
							{(mercator) => {
								return (
									<g>
										{mercator.features.map(({ feature: f }) => (
											<Link key={f.id} href="/[state]" as={`/${f.id}`}>
												<State
													fill={colorScale(
														results.find((r) => r.state === f.id).confirmed
													)}
													d={mercator.path(f)}
													onClick={() => onStateSelection(f.id)}
												/>
											</Link>
										))}
										{selectedState && (
											<g>
												<Link href="/" as="/">
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
														onClick={() => onStateSelection(null)}
														variant="selected"
													/>
												</Link>
												{cities && (
													<Cities
														cities={cities}
														projection={
															mercator.features.find(
																(f) => f.feature.id === selectedState
															).projection
														}
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
		</Box>
	)
}

export default MapBrazil
