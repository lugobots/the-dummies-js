`use strict`;

// We will map the field into cols and rows, so the mapper will read the regions for us
// Read https://github.com/lugobots/lugo4node#mapper-and-region-classes
import {GameSnapshotReader, Lugo, SPECS, Mapper} from "@lugobots/lugo4node";

export const MAPPER_COLS = 10
export const MAPPER_ROWS = 6

// here we define the initial positions
export const PLAYER_INITIAL_POSITIONS = {
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

// here we
export const PLAYER_TACTIC_POSITIONS = {
    DEFENSIVE: {
        2: {Col: 1, Row: 1},
        3: {Col: 0, Row: 2},
        4: {Col: 0, Row: 3},
        5: {Col: 1, Row: 4},
        6: {Col: 2, Row: 1},
        7: {Col: 3, Row: 2},
        8: {Col: 2, Row: 3},
        9: {Col: 3, Row: 4},
        10: {Col: 6, Row: 3},
        11: {Col: 5, Row: 2},
    },
    NORMAL: {
        2: {Col: 1, Row: 1},
        3: {Col: 2, Row: 2},
        4: {Col: 2, Row: 3},
        5: {Col: 1, Row: 4},
        6: {Col: 5, Row: 1},
        7: {Col: 5, Row: 2},
        8: {Col: 8, Row: 3},
        9: {Col: 6, Row: 4},
        10: {Col: 7, Row: 4},
        11: {Col: 9, Row: 1},
    },
    OFFENSIVE: {
        2: {Col: 2, Row: 1},
        3: {Col: 2, Row: 2},
        4: {Col: 3, Row: 3},
        5: {Col: 4, Row: 4},
        6: {Col: 6, Row: 1},
        7: {Col: 6, Row: 2},
        8: {Col: 8, Row: 3},
        9: {Col: 7, Row: 4},
        10: {Col: 9, Row: 4},
        11: {Col: 9, Row: 1},
    }

}

export function getMyExpectedPosition(reader: GameSnapshotReader, mapper: Mapper, myNumber: number): Lugo.Point {
    const ballRegion = mapper.getRegionFromPoint(reader.getBall().getPosition())
    const ballCol = ballRegion.getCol()

    const ballHolder = reader.getBall().getHolder()
    let teamState = "OFFENSIVE"
    if (ballCol < 4 || (ballHolder !== undefined && ballHolder.getTeamSide() !== reader.getMyTeam().getSide())) {
        teamState = "DEFENSIVE"
    } else if (ballCol < 6) {
        teamState = "NORMAL"
    }

    const expectedRegion = mapper.getRegion(PLAYER_TACTIC_POSITIONS[teamState][myNumber].Col, PLAYER_TACTIC_POSITIONS[teamState][myNumber].Row)
    return expectedRegion.getCenter();
}