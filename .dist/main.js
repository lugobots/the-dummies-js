"use strict";
exports.__esModule = true;
var my_bot_1 = require("./my_bot");
var settings_1 = require("./settings");
var lugo4node_1 = require("@lugobots/lugo4node");
// we must load the env vars following the standard defined by the game specs because all bots will receive the
// arguments in the same format (env vars)
var config = new lugo4node_1.EnvVarLoader();
// the map will help us to see the field in quadrants (called regions) instead of working with coordinates
var mapper = new lugo4node_1.Mapper(settings_1.MAPPER_COLS, settings_1.MAPPER_ROWS, config.getBotTeamSide());
// our bot strategy defines our bot initial position based on its number
var initialRegion = mapper.getRegion(settings_1.PLAYER_INITIAL_POSITIONS[config.getBotNumber()].Col, settings_1.PLAYER_INITIAL_POSITIONS[config.getBotNumber()].Row);
// We will use a shortcut to create the client from the config, but we could use the
// client constructor as well
var lugoClient = (0, lugo4node_1.NewClientFromConfig)(config, initialRegion.getCenter());
// This instantiates our bot using the environment variables to define its team and position.
var myBot = new my_bot_1.MyBot(config.getBotTeamSide(), config.getBotNumber(), initialRegion.getCenter(), mapper);
lugoClient.playAsBot(myBot).then(function () {
    console.log("game over");
})["catch"](function (e) {
    console.error(e);
});
