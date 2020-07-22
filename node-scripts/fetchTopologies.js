const fs = require('fs')
const fetch = require('node-fetch')
const counties = require('./counties')

;(async () => {
  fs.rmdirSync('./public/topologies', { recursive: true })
  fs.mkdirSync('./public/topologies', { recursive: true })
  const brazil = await fetch(
    `https://servicodados.ibge.gov.br/api/v2/malhas?resolucao=2&qualidade=1&formato=application/json`
  ).then((r) => r.json())
  fs.writeFileSync('./public/topologies/brazil.json', JSON.stringify(brazil))
  const countiesCode = await fetch(
    'https://servicodados.ibge.gov.br/api/v1/localidades/estados'
  ).then((r) => r.json())
  fs.writeFileSync(`./public/countiesCode.json`, JSON.stringify(countiesCode))
  counties.forEach(async (county) => {
    const countyData = countiesCode.find((c) => c.sigla === county.initials)
    const topology = await fetch(
      `https://servicodados.ibge.gov.br/api/v2/malhas/${countyData.id}?resolucao=2&qualidade=3&formato=application/json`
    ).then((r) => r.json())
    fs.writeFileSync(
      `./public/topologies/${county.initials}.json`,
      JSON.stringify(topology)
    )
  })
})()
