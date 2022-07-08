const Bot = require('./src/my_bot')
const {lugoClient, config, initialRegion, map} = require('./src/settings')

const myBot = new Bot(
    config.botTeamSide,
    config.botNumber,
    initialRegion.getCenter(),
    map,
)

lugoClient.playAsBot(myBot).then(() => {
    console.log(`game over`)
}).catch(e => {
    console.error(e)
})


