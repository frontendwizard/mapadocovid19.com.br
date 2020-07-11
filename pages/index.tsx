import { Stack, Flex, Text, Box } from '@chakra-ui/core'
import compareAsc from 'date-fns/compareAsc'

import * as Country from '../components/Country'
import Footer from '../components/Footer'
import PageHeader from '../components/PageHeader'
import LastUpdateInfo from '../components/LastUpdateInfo'
import BarChartByTime from '../components/BarChartByTime'
import counties from '../utils/counties.json'
import fetchAllReports, { Report } from '../utils/fetchAllReports'

import topology from '../public/topologies/brazil.json'

interface CountrySumReport {
  date: string
  deaths: number
  confirmed: number
  confirmedPer100k: number
  newConfirmed: number
  newDeaths: number
}

interface HomeProps {
  lastReports: Report[]
  previousReports: Report[]
  lastUpdate: string
  reportsByCounty: Report[]
  countrySumByDay: CountrySumReport[]
}

const Home: React.SFC<HomeProps> = ({
  lastReports,
  previousReports,
  lastUpdate,
  reportsByCounty,
  countrySumByDay,
}) => (
  <>
    <Country.Headers />
    <Stack
      as="main"
      padding={4}
      width={['full', 3 / 4, '700px', '1000px']}
      maxW="full"
      margin={[0, 'auto']}
      spacing={8}
    >
      <Flex justify="center">
        <PageHeader />
      </Flex>
      <Flex justify="center" align="center" wrap="wrap">
        <Box w={['100%', '100%', '45%']} mb={[4, 4, 0]} mr={[0, 0, 4]}>
          <Country.Map results={lastReports} topology={topology} />
        </Box>
        <Box w={['100%', '100%', '50%']}>
          <Country.TotalResults data={countrySumByDay} />
        </Box>
      </Flex>
      <LastUpdateInfo lastUpdate={lastUpdate} />
      <Box>
        <BarChartByTime
          data={countrySumByDay.map(({ date, newConfirmed }) => ({
            date,
            value: newConfirmed,
          }))}
          color="red"
          title="Casos novos por dia"
        />
      </Box>
      <Box>
        <BarChartByTime
          data={countrySumByDay.map(({ date, newDeaths }) => ({
            date,
            value: newDeaths,
          }))}
          color="gray"
          title="Óbitos por dia"
        />
      </Box>
      <Box>
        <Country.NormalizedConfirmed reportsByCounty={reportsByCounty} />
      </Box>
      <Stack spacing={2}>
        <Text fontSize="lg" color="gray.500">
          Dados por estado:
        </Text>
        <Country.DataTable
          previousReports={previousReports}
          lastReports={lastReports}
        />
      </Stack>
      <Footer />
    </Stack>
  </>
)

export async function getStaticProps() {
  const reports = await fetchAllReports(`place_type=state`)
  const lastReports = reports.filter(({ is_last: isLast }) => isLast)
  const countrySumByDay: CountrySumReport[] = reports
    .reduce<CountrySumReport[]>((acc, item) => {
      const index = acc.indexOf(acc.find((i) => i.date === item.date))
      if (index >= 0) {
        acc[index].deaths += item.last_available_deaths
        acc[index].confirmed += item.last_available_confirmed
        acc[index].confirmedPer100k +=
          item.last_available_confirmed_per_100k_inhabitants
        acc[index].newConfirmed += item.new_confirmed
        acc[index].newDeaths += item.new_deaths
      } else {
        acc.push({
          date: item.date,
          deaths: item.last_available_deaths,
          confirmed: item.last_available_confirmed,
          confirmedPer100k: item.last_available_confirmed_per_100k_inhabitants,
          newConfirmed: item.new_confirmed,
          newDeaths: item.new_deaths,
        })
      }
      return acc
    }, [])
    .sort((first, second) =>
      compareAsc(new Date(first.date), new Date(second.date))
    )
  const reportsByCounty = reports.reduce((acc, report) => {
    if (typeof acc[report.state] === 'object') {
      acc[report.state].push(report)
    } else {
      acc[report.state] = [report]
    }
    return acc
  }, {})
  const previousReports = counties.map(({ initials }) =>
    reports.find((report) => report.state === initials && !report.is_last)
  )
  const { tables } = await fetch(
    `https://brasil.io/api/dataset/covid19`
  ).then((r) => r.json())

  return {
    props: {
      countrySumByDay,
      reportsByCounty,
      lastReports,
      previousReports,
      lastUpdate: tables[1].import_date,
    },
  }
}

export default Home
