import { useState, forwardRef, useMemo } from "react"
import { ResponsiveLine } from "@nivo/line"
import { differenceInCalendarDays, format } from "date-fns"
import {
	Heading,
	Text,
	Stack,
	Button,
	Box,
	RadioButtonGroup,
	Checkbox,
} from "@chakra-ui/core"

import counties from "../../utils/counties.json"

const RadioButton = forwardRef((props, ref) => {
	const { isChecked, isDisabled, value, ...rest } = props
	return (
		<Button
			ref={ref}
			rounded="full"
			variantColor={isChecked ? "red" : "gray"}
			aria-checked={isChecked}
			role="radio"
			isDisabled={isDisabled}
			{...rest}
		/>
	)
})

const NormalizedConfirmed = ({ reportsByCounty }) => {
	const [selectedChart, setSelectedChart] = useState("topConfirmed")
	const [fromFirstCaseDate, setFromFirstCaseDate] = useState(true)
	const data = useMemo(() => {
		const reportsFromDayOne = counties.map(({ initials, region }) => {
			const reports = reportsByCounty[initials]
			const firstDay = new Date(reports[reports.length - 1].date)
			return {
				id: initials,
				confirmed: reports[0].confirmed,
				confirmedPer100K: reports[0].confirmed_per_100k_inhabitants,
				region,
				data: reports
					.map(
						({ confirmed_per_100k_inhabitants: confirmedPer100K, date }) => ({
							x: fromFirstCaseDate
								? differenceInCalendarDays(new Date(date), new Date(firstDay))
								: date,
							y: confirmedPer100K,
						})
					)
					.reverse(),
			}
		})
		const sortByKeyDesc = (key) => (a, b) => {
			if (a[key] > b[key]) return -1
			if (a[key] < b[key]) return 1
			return 0
		}
		switch (selectedChart) {
			case "topConfirmed":
				return reportsFromDayOne
					.slice()
					.sort(sortByKeyDesc("confirmed"))
					.slice(0, 10)
			case "topConfirmedPerHundred":
				return reportsFromDayOne
					.slice()
					.sort(sortByKeyDesc("confirmedPer100K"))
					.slice(0, 10)
			case "Norte":
			case "Nordeste":
			case "Sudeste":
			case "Sul":
			case "Centro-Oeste":
				return reportsFromDayOne
					.slice()
					.sort(sortByKeyDesc("confirmedPer100K"))
					.filter(({ region }) => region === selectedChart)
		}
	}, [selectedChart, fromFirstCaseDate])

	const options = [
		{
			value: "topConfirmedPerHundred",
			label: "Estados com mais casos por 100k habitante",
		},
		{ value: "topConfirmed", label: "Estados com mais casos" },
		{ value: "Norte", label: "Região Norte" },
		{ value: "Nordeste", label: "Região Nordeste" },
		{ value: "Centro-Oeste", label: "Região Centro-Oeste" },
		{ value: "Sudeste", label: "Região Sudeste" },
		{ value: "Sul", label: "Região Sul" },
	]

	const fromFirstCaseDateChartOptions = {
		axisBottom: {
			legend: "dias a partir do primeiro caso confirmado",
			legendPosition: "middle",
			legendOffset: 35,
		},
		xScale: { type: "linear" },
	}

	const dateChartOptions = {
		axisBottom: {
			format: (v) => format(new Date(v), "dd/MM"),
			tickValues: "every 2 days",
			tickRotation: 45,
			legend: "data",
			legendPosition: "middle",
			legendOffset: 50,
		},

		xScale: { type: "time", format: "%Y-%m-%d", precision: "day" },
		xFormat: "time:%Y-%m-%d",
	}
	return (
		<Stack spacing={2}>
			<Heading as="h2" fontSize="2xl">
				Casos a cada 100k habitantes
			</Heading>
			<RadioButtonGroup
				defaultValue="topConfirmedPerHundred"
				onChange={(val) => setSelectedChart(val)}
				spacing={2}
				isInline
			>
				{options.map(({ value, label }) => (
					<RadioButton key={value} value={value} mb={2}>
						<Text as="span" fontSize="sm">
							{label}
						</Text>
					</RadioButton>
				))}
			</RadioButtonGroup>
			<Checkbox
				borderColor="gray.400"
				variantColor="green"
				size="sm"
				isChecked={fromFirstCaseDate}
				onChange={(e) => setFromFirstCaseDate(e.target.checked)}
			>
				<Text as="span">mostrar casos a partir da data do primeiro caso</Text>
			</Checkbox>
			<Box height={[250, 350]}>
				<ResponsiveLine
					data={data}
					axisLeft={{
						legend: "casos / 100k habitantes",
						legendPosition: "middle",
						legendOffset: -35,
					}}
					yScale={{ type: "linear" }}
					yFormat={(value) =>
						`${Math.round(value * 100) / 100} casos / 100k habitantes`
					}
					{...(fromFirstCaseDate
						? fromFirstCaseDateChartOptions
						: dateChartOptions)}
					margin={{ top: 10, right: 10, bottom: 80, left: 50 }}
					colors={{ scheme: "category10" }}
					animate={false}
					enableSlices="x"
					enableGridX={false}
					lineWidth={2}
					enablePoints={false}
					legends={[
						{
							anchor: "bottom",
							direction: "row",
							justify: "center",
							itemDirection: "left-to-right",
							itemWidth: 30,
							itemHeight: 20,
							itemsSpacing: 2,
							symbolSpacing: 2,
							symbolSize: 10,
							symbolShape: "circle",
							translateY: 70,
							effects: [
								{
									on: "hover",
									style: {
										itemBackground: "rgba(0, 0, 0, .03)",
										itemOpacity: 1,
									},
								},
							],
						},
					]}
				/>
			</Box>
		</Stack>
	)
}

export default NormalizedConfirmed
