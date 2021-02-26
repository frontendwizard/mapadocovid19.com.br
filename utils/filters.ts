import { Report, CountrySumReport, lastAverageReports } from './types';
import compareAsc from 'date-fns/compareAsc'

export function totalSumByDay (reports: Report[]): CountrySumReport[] {
  return reports
    .reduce<CountrySumReport[]>((acc, item): CountrySumReport[] => {
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
}

export function countiesVariation (reports: Report[]): lastAverageReports[] {
  // Todo: calcular a média móvel dos últimos 7 dias e mapear em cores que indiquem variação no mapa 
}