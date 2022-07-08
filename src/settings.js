// we must load the env vars following the standard defined by the game specs because all bots will receive the
// arguments in the same format (env vars)
const {EnvVarLoader, Mapper, newClientFromConfig} = require("@lugobots/lugo4node");
const config = new EnvVarLoader()

// the map will help us to see the field in quadrants (called regions) instead of working with coordinates
const map = new Mapper(10, 6, config.botTeamSide)

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

const PLAYER_TACTIC_POSITIONS = {
    DEFENSIVE: {
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
    },
    NORMAL: {
        2: {Col: 2, Row: 1},
        3: {Col: 4, Row: 2},
        4: {Col: 4, Row: 3},
        5: {Col: 2, Row: 4},
        6: {Col: 6, Row: 1},
        7: {Col: 8, Row: 2},
        8: {Col: 8, Row: 3},
        9: {Col: 6, Row: 4},
        10: {Col: 7, Row: 4},
        11: {Col: 7, Row: 1},
    },
    OFFENSIVE: {
        2: {Col: 3, Row: 1},
        3: {Col: 5, Row: 2},
        4: {Col: 5, Row: 3},
        5: {Col: 3, Row: 4},
        6: {Col: 7, Row: 1},
        7: {Col: 8, Row: 2},
        8: {Col: 8, Row: 3},
        9: {Col: 7, Row: 4},
        10: {Col: 9, Row: 4},
        11: {Col: 9, Row: 1},
    }

}


// our bot strategy defines our bot initial position based on its number
const initialRegion = map.getRegion(PLAYER_INITIAL_POSITIONS[config.botNumber].Col, PLAYER_INITIAL_POSITIONS[config.botNumber].Row)

// now we can create the bot. We will use a shortcut to create the client from the config, but we could use the
// client constructor as well
const lugoClient = new newClientFromConfig(config, initialRegion.getCenter())


module.exports = {lugoClient, config, initialRegion, map, PLAYER_TACTIC_POSITIONS}