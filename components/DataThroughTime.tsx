import { useMemo } from "react"
import { Box, Heading, Stack } from "@chakra-ui/core"
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

const titleCase: (str: string) => string = (str) =>
	str
		.toLowerCase()
		.split(" ")
		.map((word) => word.replace(word[0], word[0].toUpperCase()))
		.join(" ")

const intl = new Intl.NumberFormat("pt-BR")
const margin = { left: 24, right: 48, top: 24, bottom: 24 }

interface ChartProps extends Props {
	width: number
	height: number
}

const Chart: React.FC<ChartProps> = ({
	width,
	height,
	data,
	setHighlightedIndex,
	color,
	title,
	highlightedIndex,
	labelFormat,
	tickFormat,
}) => {
	const xMax = width - margin.left - margin.right
	const yMax = height - margin.top - margin.bottom
  const xScale = useMemo(() => scaleTime({
		range: [0, xMax],
    domain: extent(data, (x: Item) => new Date(x.date)),
		nice: true,
	}), [xMax])
  const yScale = useMemo(() => scaleLinear({
		range: [yMax, 0],
    domain: [0, max(data, (x: Item) => x.value)],
		nice: true,
	}), [yMax])
	const handleHover = (
		event:
			| React.TouchEvent<SVGRectElement>
			| React.MouseEvent<SVGRectElement, MouseEvent>
	) => {
		const { x } = localPoint(event)
		const x0 = xScale.invert(x - margin.left)
		const d0 = data.find(
			(d) => d.date === format(x0, "yyyy-MM-dd", { locale: pt })
		)
		d0 && setHighlightedIndex(data.indexOf(d0))
	}
	return (
		<Box position="relative">
			<Box position="absolute" top={0} left={0} p={4}>
				<Heading fontSize="sm" margin={0} color={`${color}.500`}>
					{title}
				</Heading>
				<Heading fontSize="xs" margin={0} color={`${color}.300`}>
					{format(new Date(data[highlightedIndex].date), "dd 'de' MMMM", {
						locale: pt,
					})}
				</Heading>
				<Heading fontSize="xl" margin={0} color={`${color}.500`}>
					{labelFormat(data[highlightedIndex].value)}
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
							r={highlightedIndex === i ? 5 : 2}
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
						left={xMax}
						numTicks={5}
						stroke={color}
						strokeWidth={2}
						tickStroke={color}
						tickLength={4}
						tickFormat={tickFormat}
						hideZero
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
					onMouseLeave={() => setHighlightedIndex(0)}
				/>
			</svg>
		</Box>
	)
}

interface Props {
	data: Item[]
	color: string
	title: string
	highlightedIndex: number
	setHighlightedIndex: (value: number) => void
	tickFormat?: (value: number) => string
	labelFormat?: (value: number) => string
}

const DataThroughTime: React.FC<Props> = ({
	data,
	color,
	title,
	tickFormat = (value) => `${intl.format(value)}`,
	labelFormat = (value) => `${intl.format(value)}`,
	highlightedIndex,
	setHighlightedIndex,
}) => {
	return (
		<Stack spacing={2} bg={`${color}.100`} rounded="md">
			<Box height={[120, 150]}>
				<ParentSize>
					{({ width, height }) => (
						<Chart
							width={width}
							height={height}
							data={data}
							color={color}
							title={title}
							tickFormat={tickFormat}
							labelFormat={labelFormat}
							highlightedIndex={highlightedIndex}
							setHighlightedIndex={setHighlightedIndex}
						/>
					)}
				</ParentSize>
			</Box>
		</Stack>
	)
}

export default DataThroughTime
