const fs = require("fs")
const path = require("path")


const getPokemon = id => {
  const url = path.join("api-data", "data", "api", "v2", "pokemon", String(id), "index.json")
  let rawdata = fs.readFileSync(url)
  return JSON.parse(rawdata)
}
const getSpecies = id => {
  const url = path.join("api-data", "data", "api", "v2", "pokemon-species", String(id), "index.json")
  let rawdata = fs.readFileSync(url)
  return JSON.parse(rawdata)
}
const getEvolutionChain = id => {
  const flatChain = ({evolution_details, evolves_to, species}) => {
    if (Array.isArray(evolves_to) && evolves_to.length > 0) {
      evolves_to = evolves_to.map(chain => flatChain(chain))
    }
    let details
    if (Array.isArray(evolution_details) && evolution_details.length) {
      let detailsEntries = Object.entries(evolution_details[0])
      details = Object.fromEntries(detailsEntries.filter(a => a[1]))
      details.trigger = details.trigger.name
    }
    let step = {...Array.isArray(evolves_to) && evolves_to.length && {evolves_to}, ...details && {details}, species: {name: species.name, id: species.url.replace(/(\/api\/v2\/pokemon-species\/|[\/$])/g,"")}}
    return step
  }
  const url = path.join("api-data", "data", "api", "v2", "evolution-chain", String(id), "index.json")
  let rawdata = fs.readFileSync(url)
  let {chain} = JSON.parse(rawdata)
  return flatChain(chain)
}

const reduceMoves = moves => moves.map(({move}) => move.name).sort()
const reduceHabitat = habitat => habitat.name
const reduceTypes = types => types.map(t => t.type.name)
const reduceTextEntry = textEntries =>  textEntries.filter(e => e.version.name === "red" && e.language.name === "en")[0].flavor_text
const reduceGenera = genera => genera.filter(g => g.language.name ===  "en")[0].genus
const reduceEvolvesFrom = pkmn => pkmn ? ({name: pkmn.name, id: pkmn.url.replace(/(\/api\/v2\/pokemon-species\/|[\/$])/g,"")}) : null
const reduceVarieties = varieties => varieties.filter(v => !v.is_default).map(({pokemon}) => ({name: pokemon.name, id: pokemon.url.replace(/(\/api\/v2\/pokemon\/|[\/$])/g,"")}))

saveEvolutionChainData = () => {
  const list = []
  for (let i = 1; i <= 78; i++) {
    list.push(getEvolutionChain(i))
  }
  console.log("writing evolution-chain data")
  let url = path.join("public", "json", "evolution-chain.json")
  fs.writeFileSync(url, JSON.stringify({list}))
  console.log("done!")
}
savePokemonData = () => {
  const list = []
  for (let i = 1; i <= 151; i++) {
    let {id, name, height, weight, types, sprites, moves} = getPokemon(i)
    let {habitat, genera, flavor_text_entries, evolves_from_species, evolution_chain, varieties, has_gender_differences} = getSpecies(i)
    let pkmn = {
      id,
      name,
      height,
      weight,
      types: reduceTypes(types),
      sprites,
      moves: reduceMoves(moves),
      habitat: reduceHabitat(habitat),
      genera: reduceGenera(genera),
      entry: reduceTextEntry(flavor_text_entries),
      evolves_from: reduceEvolvesFrom(evolves_from_species),
      evolution_chain: evolution_chain.url.replace(/(\/api\/v2\/evolution-chain\/|[\/$])/g,""),
      varieties: reduceVarieties(varieties),
      has_gender_differences
    }
    list.push(pkmn)
    //console.log(i)
  }
  console.log("writing pokemon data")
  let url = path.join("public", "json", "pokemon.json")
  fs.writeFileSync(url, JSON.stringify({list}))
  console.log("done!")
}

saveEvolutionChainData()
