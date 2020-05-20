import { useState } from "react"
import { Box, Heading, Stack, Text } from "@chakra-ui/core"
import { LinePath, Bar } from "@vx/shape"
import { curveMonotoneX } from "@vx/curve"
import { scaleTime, scaleLinear } from "@vx/scale"
import { GlyphDot } from "@vx/glyph"
import { localPoint } from "@vx/event"
import { Group } from "@vx/group"
import { LinearGradient } from "@vx/gradient"
import { ParentSize } from "@vx/responsive"
import { AxisRight, AxisBottom } from "@vx/axis"
import format from "date-fns/format"
import { pt } from "date-fns/locale"

const min = (arr, fn) => Math.min(...arr.map(fn))
const max = (arr, fn) => Math.max(...arr.map(fn))
const extent = (arr, fn) => [min(arr, fn), max(arr, fn)]

interface Item {
	date: string
	value: number
}

interface Props {
	data: Item[]
	color: string
	title: string
	tickFormat?: (value: number) => string
	labelFormat?: (value: number) => string
}

function titleCase(str) {
	return str
		.toLowerCase()
		.split(" ")
		.map((word) => word.replace(word[0], word[0].toUpperCase()))
		.join(" ")
}

const DataThroughTime: React.FC<Props> = ({
	data,
	color,
	title,
	tickFormat = (value) => value,
	labelFormat = (value) => value,
}) => {
	const [activeIndex, setActiveIndex] = useState(0)
	const margin = { left: 24, right: 48, top: 24, bottom: 24 }
	return (
		<Stack spacing={2} bg={`${color}.100`} rounded="md">
			<Box height={[120, 150]}>
				<ParentSize>
					{({ width, height }) => {
						const xMax = width - margin.left - margin.right
						const yMax = height - margin.top - margin.bottom
						const xScale = scaleTime({
							range: [0, xMax],
							domain: extent(data, (x) => new Date(x.date)),
						})
						const yScale = scaleLinear({
							range: [yMax, 0],
							domain: [0, max(data, (x) => x.value)],
						})
						const handleHover = (event) => {
							const { x } = localPoint(event)
							const x0 = xScale.invert(x - margin.left)
							const d0 = data.find(
								(d) => d.date === format(x0, "yyyy-MM-dd", { locale: pt })
							)
							d0 && setActiveIndex(data.indexOf(d0))
						}
						return (
							<Box position="relative">
								<Box position="absolute" top={0} left={0} p={4}>
									<Heading fontSize="sm" margin={0} color={`${color}.500`}>
										{title}
									</Heading>
									<Heading fontSize="xs" margin={0} color={`${color}.300`}>
										{format(new Date(data[activeIndex].date), "dd 'de' MMMM", {
											locale: pt,
										})}
									</Heading>
									<Heading fontSize="xl" margin={0} color={`${color}.500`}>
										{labelFormat(data[activeIndex].value)}
									</Heading>
								</Box>
								<svg width={width} height={height}>
									<LinearGradient
										id="gradient"
										from={color}
										fromOpacity={0.25}
										to="white"
									/>
									<Group left={margin.left} top={margin.top}>
										<LinePath
											data={data}
											x={(d) => xScale(new Date(d.date))}
											y={(d) => yScale(d.value)}
											curve={curveMonotoneX}
											stroke={color}
											strokeWidth={3}
											opacity={0.5}
										/>
										{data.map((d, i) => (
											<GlyphDot
												key={d.date}
												cx={xScale(new Date(d.date))}
												cy={yScale(d.value)}
												fill={color}
												r={activeIndex === i ? 5 : 2}
											/>
										))}
									</Group>
									<Group left={margin.left}>
										<AxisBottom
											top={height - margin.bottom}
											scale={xScale}
											numTicks={3}
											stroke={color}
											strokeWidth={2}
											tickStroke={color}
											tickLength={4}
											rangePadding={10}
											tickFormat={(date: Date) =>
												titleCase(
													format(date, "dd MMM", {
														locale: pt,
													})
												)
											}
										/>
										<AxisRight
											top={margin.top}
											scale={yScale}
											left={xMax + 10}
											numTicks={5}
											stroke={color}
											strokeWidth={2}
											tickStroke={color}
											tickLength={4}
											tickFormat={tickFormat}
										/>
									</Group>
									<Bar
										x={0}
										y={0}
										width={width}
										height={height}
										fill="transparent"
										onTouchStart={handleHover}
										onTouchMove={handleHover}
										onMouseMove={handleHover}
										onMouseLeave={() => setActiveIndex(0)}
									/>
								</svg>
							</Box>
						)
					}}
				</ParentSize>
			</Box>
		</Stack>
	)
}

export default DataThroughTime
