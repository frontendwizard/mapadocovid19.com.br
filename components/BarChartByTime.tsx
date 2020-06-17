import {
  Box,
  Heading,
  useTheme,
  RadioGroup,
  Radio,
  Stat,
  StatNumber,
  StatHelpText,
  Icon,
  Stack,
} from '@chakra-ui/core'
import { useMemo, useState } from 'react'
import { scaleBand, scaleLinear } from '@vx/scale'
import { Group } from '@vx/group'
import { AxisLeft } from '@vx/axis'
import { ParentSize } from '@vx/responsive'
import { GridRows } from '@vx/grid'
import { motion, AnimatePresence } from 'framer-motion'
import format from 'date-fns/format'
import locale from 'date-fns/locale/pt-BR'

interface Report {
  date: string
  value: number
}

// accessors
const x = (d: Report) => new Date(d.date)
const y = (d: Report) => d.value

const margin = {
  top: 20,
  right: 0,
  left: 30,
  bottom: 20,
}

enum DateRange {
  LAST_WEEK = 'last week',
  LAST_MONTH = 'last month',
  BEGINNING = 'beginning',
}

const Chart = ({
  width,
  height,
  data,
  dateRange,
  setHighlighted,
  highlighted,
  color,
}) => {
  const theme = useTheme()
  const getData: () => Report[] = () => {
    switch (dateRange) {
      case DateRange.LAST_WEEK:
        return data.slice(-7)
      case DateRange.LAST_MONTH:
        return data.slice(-30)
      default:
        return data
    }
  }
  const activeData = getData()
  // bounds
  const xMax = width - margin.left - margin.right
  const yMax = height - margin.top - margin.bottom
  // scales
  const xScale = useMemo(
    () =>
      scaleBand<Date>({
        range: [0, xMax],
        domain: activeData.map(x),
        padding: 0.2,
      }),
    [xMax, activeData.length]
  )
  const yScale = useMemo(
    () =>
      scaleLinear<number>({
        range: [yMax, 0],
        domain: [0, Math.max(...activeData.map(y))],
        nice: true,
      }),
    [yMax]
  )

  return (
    <svg width={width} height={height}>
      <Group left={margin.left} top={margin.top}>
        <AxisLeft
          scale={yScale}
          tickFormat={(value: number) =>
            value > 1000 ? `${value / 1000}k` : value
          }
          hideAxisLine
          hideZero
        />
        <GridRows scale={yScale} width={xMax} />
        <AnimatePresence>
          {activeData.map((d) => {
            const barWidth = xScale.bandwidth()
            const barHeight = yMax - yScale(y(d))
            const barX = xScale(x(d))
            const barY = yMax - barHeight
            return (
              <Group key={`bar-${d.date}`}>
                <motion.rect
                  key={`bar-${d.date}-background`}
                  fill={
                    d.date === highlighted.date
                      ? theme.colors.blackAlpha[100]
                      : theme.colors.transparent
                  }
                  height={yMax}
                  y={0}
                  initial={{
                    x: -barWidth,
                    width: 0,
                  }}
                  animate={{
                    x: barX,
                    width: barWidth,
                  }}
                  exit={{ x: -barWidth }}
                  onMouseOver={() => setHighlighted(d)}
                />
                <motion.rect
                  key={`bar-${d.date}-foreground`}
                  fill={
                    d.date === highlighted.date
                      ? theme.colors[color][500]
                      : theme.colors[color][300]
                  }
                  initial={{
                    y: yMax,
                    height: 0,
                    x: -barWidth,
                    width: 0,
                  }}
                  animate={{
                    y: barY,
                    height: barHeight,
                    x: barX,
                    width: barWidth,
                  }}
                  exit={{ y: yMax, height: 0, x: -barWidth }}
                  transition={{ duration: 0.5 }}
                  onMouseOver={() => setHighlighted(d)}
                />
              </Group>
            )
          })}
        </AnimatePresence>
      </Group>
    </svg>
  )
}

interface BarChartByTimeProps {
  data: Report[]
  title: string
  color: string
}

const BarChartByTime = ({ data, title, color }: BarChartByTimeProps) => {
  const [dateRange, setDateRange] = useState('last week')
  const [highlighted, setHighlighted] = useState(data[data.length - 1])
  return (
    <Box>
      <Heading as="h2" fontSize="2xl">
        {title}
      </Heading>
      <Stack alignItems="center" spacing={4} isInline>
        <Box h={48} flex="1 auto">
          <ParentSize>
            {({ height, width }) => (
              <Chart
                width={width}
                height={height}
                data={data}
                dateRange={dateRange}
                highlighted={highlighted}
                setHighlighted={setHighlighted}
                color={color}
              />
            )}
          </ParentSize>
        </Box>
        <Stat flex="0 0 auto">
          <StatNumber>
            <Icon name="triangle-up" color={`${color}.500`} />
            {highlighted.value}
          </StatNumber>
          <StatHelpText textTransform="capitalize">
            {format(new Date(highlighted.date), 'EEEE dd/MM', { locale })}
          </StatHelpText>
        </Stat>
      </Stack>
      <RadioGroup
        isInline
        onChange={(e) => setDateRange(e.target.value)}
        value={dateRange}
      >
        <Radio value={DateRange.LAST_WEEK}>Últimos 7 dias</Radio>
        <Radio value={DateRange.LAST_MONTH}>Últimos 30 dias</Radio>
        <Radio value={DateRange.BEGINNING}>Desde o início</Radio>
      </RadioGroup>
    </Box>
  )
}

export default BarChartByTime
