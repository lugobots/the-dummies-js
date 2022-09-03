"use strict";
exports.__esModule = true;
exports.PLAYER_TACTIC_POSITIONS = exports.PLAYER_INITIAL_POSITIONS = exports.MAPPER_ROWS = exports.MAPPER_COLS = void 0;
// We will map the field into cols and rows, so the mapper will read the regions for us
// Read https://github.com/lugobots/lugo4node#mapper-and-region-classes
exports.MAPPER_COLS = 10;
exports.MAPPER_ROWS = 6;
// here we define the initial positions
exports.PLAYER_INITIAL_POSITIONS = {
    1: { Col: 0, Row: 0 },
    2: { Col: 1, Row: 1 },
    3: { Col: 2, Row: 2 },
    4: { Col: 2, Row: 3 },
    5: { Col: 1, Row: 4 },
    6: { Col: 3, Row: 1 },
    7: { Col: 3, Row: 2 },
    8: { Col: 3, Row: 3 },
    9: { Col: 3, Row: 4 },
    10: { Col: 4, Row: 3 },
    11: { Col: 4, Row: 2 }
};
// here we
exports.PLAYER_TACTIC_POSITIONS = {
    DEFENSIVE: {
        2: { Col: 1, Row: 1 },
        3: { Col: 2, Row: 2 },
        4: { Col: 2, Row: 3 },
        5: { Col: 1, Row: 4 },
        6: { Col: 3, Row: 1 },
        7: { Col: 3, Row: 2 },
        8: { Col: 3, Row: 3 },
        9: { Col: 3, Row: 4 },
        10: { Col: 4, Row: 3 },
        11: { Col: 4, Row: 2 }
    },
    NORMAL: {
        2: { Col: 2, Row: 1 },
        3: { Col: 4, Row: 2 },
        4: { Col: 4, Row: 3 },
        5: { Col: 2, Row: 4 },
        6: { Col: 6, Row: 1 },
        7: { Col: 8, Row: 2 },
        8: { Col: 8, Row: 3 },
        9: { Col: 6, Row: 4 },
        10: { Col: 7, Row: 4 },
        11: { Col: 7, Row: 1 }
    },
    OFFENSIVE: {
        2: { Col: 3, Row: 1 },
        3: { Col: 5, Row: 2 },
        4: { Col: 5, Row: 3 },
        5: { Col: 3, Row: 4 },
        6: { Col: 7, Row: 1 },
        7: { Col: 8, Row: 2 },
        8: { Col: 8, Row: 3 },
        9: { Col: 7, Row: 4 },
        10: { Col: 9, Row: 4 },
        11: { Col: 9, Row: 1 }
    }
};
