export interface Report {
  city?: string
  city_ibge_code: number
  date: string
  epidemiological_week: number
  estimated_population: number
  estimated_population_2019: number
  is_last: boolean
  is_repeated: boolean
  last_available_confirmed: number
  last_available_confirmed_per_100k_inhabitants: number
  last_available_date: string
  last_available_death_rate: number
  last_available_deaths: number
  new_confirmed: number
  new_deaths: number
  order_for_place: number
  place_type: string
  state: string
}

const authHeader:HeadersInit = new Headers()
authHeader.append('Authorization', `Token ${process.env.BRASILIO_TOKEN}`)

export const requestOptions = {
  headers: authHeader
}

const fetchAllReportsByType: (
  params: string,
  dataset?: string
) => Promise<Report[]> = async (params, dataset = 'caso_full') => {
  const { count, next, results: firstPage } = await fetch(
    `https://api.brasil.io/v1/dataset/covid19/${dataset}/data?${params}`,
    requestOptions
  ).then((r) => r.json())

  if (!next) return firstPage

  const reports = [...firstPage]
  const pages = Math.ceil(count / 1000)
  const remainingPages = await Promise.all(
    Array.from(Array(pages - 1).keys()).map((page) =>
      fetch(
        `https://api.brasil.io/v1/dataset/covid19/${dataset}/data?page=${
          page + 2
        }&${params}`,
        requestOptions
      ).then((r) => r.json())
    )
  )
  remainingPages.forEach(({ results }) => reports.push(...results))
  return reports
}

export default fetchAllReportsByType
