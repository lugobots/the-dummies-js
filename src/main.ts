import { MyBot } from './my_bot'
import {EnvVarLoader, Mapper, NewDefaultStarter} from '@lugobots/lugo4node'


const starter = NewDefaultStarter()

// ADVANCED
// the map will help us to see the field in quadrants (called regions) instead of working with coordinates
//
// const config = new EnvVarLoader()

// the map will help us to see the field in quadrants (called regions) instead of working with coordinates
// const map = new Mapper(10, 6, config.getBotTeamSide())

// our bot strategy defines our bot initial position based on its number
// import {PLAYER_INITIAL_POSITIONS} from "./settings";
// const initialRegion = map.getRegion( PLAYER_INITIAL_POSITIONS[config.getBotNumber()].Col, PLAYER_INITIAL_POSITIONS[config.getBotNumber()].Row)

starter.run(new MyBot(
  starter.getConfig().getBotTeamSide(),
  starter.getConfig().getBotNumber(),
  starter.getInitialPosition(),
  starter.getMapper()
));

