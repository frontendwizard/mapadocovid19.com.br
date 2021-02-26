import { Stack, Flex, Text, Box, Spacer } from '@chakra-ui/react'

import * as Country from '../components/Country'
import Footer from '../components/Footer'
import PageHeader from '../components/PageHeader'
import LastUpdateInfo from '../components/LastUpdateInfo'
import BarChartByTime from '../components/BarChartByTime'

import counties from '../utils/counties.json'
import topology from '../public/topologies/brazil.json'

import fetchAllReports, { requestOptions } from '../utils/fetchAllReports'
import { CountrySumReport, Report } from '../utils/types'
import { totalSumByDay } from '../utils/filters'

interface HomeProps {
  lastReports: Report[]
  // previousReports: Report[]
  lastUpdate: string
  reportsByCounty: Report[]
  countrySumByDay: CountrySumReport[]
}

const Home: React.FC<HomeProps> = ({
  lastReports,
  // previousReports,
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
          <Box mb="5">
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
        </Box>
      </Flex>
      <LastUpdateInfo lastUpdate={lastUpdate} />
      <Box>
        <Country.TotalResults data={countrySumByDay} />
        <Country.NormalizedConfirmed reportsByCounty={reportsByCounty} />
      </Box>
      <Stack spacing="5" direction="column">
        <Text fontSize="lg" color="gray.500">
          Dados por estado:
        </Text>
        {/* <Country.DataTable
          previousReports={previousReports}
          lastReports={lastReports}
        /> */}
      </Stack>
      <Footer />
    </Stack>
  </>
)

export async function getStaticProps() {
  // ? Busca todos os reports
  const reports = await fetchAllReports(`place_type=state`)
  // ? Atualiza os recentes
  const lastReports = reports.filter(({ is_last: isLast }) => isLast)
  // ? Soma total diária do PAÍS
  const countrySumByDay = totalSumByDay(reports)
  // ? Boletins por ESTADO
  const reportsByCounty = reports.reduce((acc, report) => {
    if (typeof acc[report.state] === 'object') {
      acc[report.state].push(report)
    } else {
      acc[report.state] = [report]
    }
    return acc
  }, {})
  // ? boletins Anteriores
  // const previousReports = counties.map(({ initials }) =>
  //   reports.find((report) => report.state === initials && !report.is_last)
  // )
  const { tables } = await fetch(
    `https://api.brasil.io/v1/dataset/covid19/`,
    requestOptions
  ).then((r) => r.json())

  return {
    props: {
      countrySumByDay,
      reportsByCounty,
      lastReports,
      // previousReports,
      lastUpdate: tables[1].import_date,
    },
  }
}

export default Home
