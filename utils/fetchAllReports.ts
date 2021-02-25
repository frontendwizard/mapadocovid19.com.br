import { Report } from './types';

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

  // if(!next)return firstPage
  return firstPage

  // const reports = [...firstPage]
  // const pages = Math.ceil(count / 1000)
  // const remainingPages = await Promise.all(
  //   Array.from(Array(pages - 1).keys()).map((page) => 
  //     fetch(
  //       `https://api.brasil.io/v1/dataset/covid19/${dataset}/data?page=${
  //         page + 2
  //       }&${params}`,
  //       requestOptions
  //     ).then((r) => r.json())
  //   )
  // )
  // remainingPages.forEach(({ results }) => reports.push(...results))
  // return reports
}

export default fetchAllReportsByType
