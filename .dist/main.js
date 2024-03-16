"use strict";
exports.__esModule = true;
var my_bot_1 = require("./my_bot");
var lugo4node_1 = require("@lugobots/lugo4node");
var starter = (0, lugo4node_1.NewDefaultStarter)();
// ADVANCED
// the map will help us to see the field in quadrants (called regions) instead of working with coordinates
//
// const config = new EnvVarLoader()
// the map will help us to see the field in quadrants (called regions) instead of working with coordinates
// const map = new Mapper(10, 6, config.getBotTeamSide())
// our bot strategy defines our bot initial position based on its number
// import {PLAYER_INITIAL_POSITIONS} from "./settings";
// const initialRegion = map.getRegion( PLAYER_INITIAL_POSITIONS[config.getBotNumber()].Col, PLAYER_INITIAL_POSITIONS[config.getBotNumber()].Row)
starter.run(new my_bot_1.MyBot(starter.getConfig().getBotTeamSide(), starter.getConfig().getBotNumber(), starter.getInitialPosition(), starter.getMapper()));
