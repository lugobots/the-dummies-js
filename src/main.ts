import {MyBot} from './my_bot'
import {MAPPER_COLS, MAPPER_ROWS, PLAYER_INITIAL_POSITIONS} from './settings'
import {EnvVarLoader, Mapper, NewClientFromConfig} from "@lugobots/lugo4node";

// we must load the env vars following the standard defined by the game specs because all bots will receive the
// arguments in the same format (env vars)
const config = new EnvVarLoader()

// the map will help us to see the field in quadrants (called regions) instead of working with coordinates
const mapper = new Mapper(MAPPER_COLS, MAPPER_ROWS, config.getBotTeamSide())


// our bot strategy defines our bot initial position based on its number
const initialRegion = mapper.getRegion(PLAYER_INITIAL_POSITIONS[config.getBotNumber()].Col, PLAYER_INITIAL_POSITIONS[config.getBotNumber()].Row)


// We will use a shortcut to create the client from the config, but we could use the
// client constructor as well
const lugoClient = NewClientFromConfig(config, initialRegion.getCenter())

// This instantiates our bot using the environment variables to define its team and position.
const myBot = new MyBot(
    config.getBotTeamSide(),
    config.getBotNumber(),
    initialRegion.getCenter(),
    mapper,
)

lugoClient.playAsBot(myBot).then(() => {
    console.log(`game over`)
}).catch(e => {
    console.error(e)
})

