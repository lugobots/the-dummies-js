import {MyBot} from './my_bot'
import {EnvVarLoader, Mapper, NewClientFromConfig} from "@lugobots/lugo4node";

// we must load the env vars following the standard defined by the game specs because all bots will receive the
// arguments in the same format (env vars)
const config = new EnvVarLoader()

// the map will help us to see the field in quadrants (called regions) instead of working with coordinates
const mapper = new Mapper(10, 6, config.getBotTeamSide())

// here we define the initial positions
const PLAYER_INITIAL_POSITIONS = {
    1: {Col: 0, Row: 0},
    2: {Col: 1, Row: 1},
    3: {Col: 2, Row: 2},
    4: {Col: 2, Row: 3},
    5: {Col: 1, Row: 4},
    6: {Col: 3, Row: 1},
    7: {Col: 3, Row: 2},
    8: {Col: 3, Row: 3},
    9: {Col: 3, Row: 4},
    10: {Col: 4, Row: 3},
    11: {Col: 4, Row: 2},
}
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

