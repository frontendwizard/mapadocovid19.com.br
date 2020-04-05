import { useState, useEffect, useRef } from "react"
import { ParentSize } from "@vx/responsive"
import { scaleLinear } from "@vx/scale"
import * as topojson from "topojson"
import { Box } from "@chakra-ui/core"
import styled from "@emotion/styled"
import { css } from "@emotion/core"

import topology from "../utils/simpleTopology.json"
import { geoPath, geoMercator } from "d3-geo"

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

const MapBrazil = ({ results, selectedState, onStateSelection }) => {
	const world = topojson.feature(topology, topology.objects.states)
	const outline = topojson.mesh(topology, topology.objects.states)
	const colorScale = scaleLinear({
		domain: [0, Math.max(...results.map((r) => r.confirmed))],
		range: ["white", "red"],
	})
	const [offset, setOffset] = useState(0)
	const [focus, setFocus] = useState(outline)
	useEffect(() => {
		selectedState ? setOffset(50) : setOffset(0)
	}, [selectedState])
	const projection = geoMercator()
	const path = useRef(geoPath().projection(projection))
	const focusProjection = (projection, feature) => {
		projection.fitExtent(
			[
				[offset, offset],
				[350 - offset, 350 - offset],
			],
			feature
		)
		path.current = geoPath().projection(projection)
	}
	useEffect(() => {
		focusProjection(projection, focus)
	}, [focus])
	const features = world.features
	return (
		<Box height={[350, 475, 600]} mt={8}>
			<ParentSize>
				{({ width: w, height: h }) => (
					<svg width={w} height={h}>
						<g>
							{features.map((f) => (
								<State
									fill={colorScale(
										results.find((r) => r.state === f.id).confirmed
									)}
									key={f.id}
									d={path.current(f)}
									onClick={() => {
										onStateSelection(f.id)
										setFocus(f)
									}}
								/>
							))}
							{selectedState && (
								<State
									fill={colorScale(
										results.find((r) => r.state === selectedState).confirmed
									)}
									d={path.current(features.find((f) => f.id === selectedState))}
									onClick={() => {
										onStateSelection(null)
										setFocus(outline)
									}}
									variant="selected"
								/>
							)}
						</g>
					</svg>
				)}
			</ParentSize>
		</Box>
	)
}

export default MapBrazil
