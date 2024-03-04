"use strict";
exports.__esModule = true;
var lugo4node_1 = require("@lugobots/lugo4node");
var my_bot_1 = require("./my_bot");
var starter = (0, lugo4node_1.NewDefaultStarter)();
starter.run(new my_bot_1.MyBot(starter.getConfig().getBotTeamSide(), starter.getConfig().getBotNumber(), starter.getInitialPosition(), starter.getMapper()));
// ADVANCED
// the map will help us to see the field in quadrants (called regions) instead of working with coordinates
// const config = new EnvVarLoader()
// the map will help us to see the field in quadrants (called regions) instead of working with coordinates
// const map = new Mapper(10, 6, config.getBotTeamSide())
// our bot strategy defines our bot initial position based on its number
// const initialRegion = map.getRegion(DEFAULT_PLAYER_POSITIONS[config.getBotNumber()].Col, DEFAULT_PLAYER_POSITIONS[config.getBotNumber()].Row)
// const lugoClient = NewClientFromConfig(config, initialRegion.getCenter())
// lugoClient.playAsBot(bot).then(() => {
//   console.log(`all done`)
// }).catch(e => {
//   console.error(e)
// })
