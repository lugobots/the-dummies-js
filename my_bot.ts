`use strict`;
import {GameSnapshotReader, PLAYER_STATE, Lugo, SPECS, Bot, Mapper} from '@lugobots/lugo4node'

const TEAM_HOME = Lugo.Team.Side.HOME
const TEAM_AWAY = Lugo.Team.Side.AWAY

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


export class MyBot implements Bot {

    side: Lugo.Team.Side;

    number: number;

    initPosition: Lugo.Point;

    mapper: Mapper;

    constructor(side: Lugo.Team.Side, number: number, initPosition: Lugo.Point, mapper: Mapper) {
        this.side = side
        this.number = number
        this.mapper = mapper
        this.initPosition = initPosition
    }


    /**
     * This method creates a snapshot reader. The Snapshot readers reads the game state and return elements we may need.
     * E.g. Players, the ball, etc.
     */
    makeReader(snapshot: Lugo.GameSnapshot) : {reader: GameSnapshotReader, me: Lugo.Player} {
        const reader = new GameSnapshotReader(snapshot, this.side)
        const me = reader.getPlayer(this.side, this.number)
        if (!me) {
            throw new Error("did not find myself in the game")
        }
        return {reader, me}
    }

    onDisputing(orderSet: Lugo.OrderSet, snapshot: Lugo.GameSnapshot): Lugo.OrderSet {
        try {
            const {reader, me} = this.makeReader(snapshot)
            const ballPosition = snapshot.getBall().getPosition()

            const ballRegion = this.mapper.getRegionFromPoint(ballPosition)
            const myRegion = this.mapper.getRegionFromPoint(this.initPosition)

            // by default, I will stay at my tactic position
            let moveDestination = this._getMyExpectedPosition(reader, me)
            orderSet.setDebugMessage("returning to my position")

            // if the ball is max 2 blocks away from me, I will move toward the ball
            if (Math.abs(myRegion.getRow() - ballRegion.getRow()) <= 2 &&
                Math.abs(myRegion.getCol() - ballRegion.getCol()) <= 2) {
                moveDestination = ballPosition
                orderSet.setDebugMessage("trying to catch the ball")
            }

            const moveOrder = reader.makeOrderMoveMaxSpeed(me.getPosition(), moveDestination)
            // we can ALWAYS try to catch the ball it we are not holding it
            const catchOrder = reader.makeOrderCatch()

            orderSet.setOrdersList([moveOrder, catchOrder])
            return orderSet
        } catch (e) {
            console.log(`did not play this turn`, e)
        }
    }

    onDefending(orderSet: Lugo.OrderSet, snapshot: Lugo.GameSnapshot): Lugo.OrderSet {
        try {
            const {reader, me} = this.makeReader(snapshot)
            const ballPosition = snapshot.getBall().getPosition()
            const ballRegion = this.mapper.getRegionFromPoint(ballPosition)
            const myRegion = this.mapper.getRegionFromPoint(this.initPosition)

            // by default, I will stay at my tactic position
            let moveDestination = this._getMyExpectedPosition(reader, me)
            orderSet.setDebugMessage("returning to my position")
            // if the ball is max 2 blocks away from me, I will move toward the ball
            if (Math.abs(myRegion.getRow() - ballRegion.getRow()) <= 2 &&
                Math.abs(myRegion.getCol() - ballRegion.getCol()) <= 2) {
                moveDestination = ballPosition
                orderSet.setDebugMessage("trying to catch the ball")
            }
            const moveOrder = reader.makeOrderMoveMaxSpeed(me.getPosition(), moveDestination)
            const catchOrder = reader.makeOrderCatch()

            orderSet.setOrdersList([moveOrder, catchOrder])
            return orderSet
        } catch (e) {
            console.log(`did not play this turn`, e)
        }
    }

    onHolding(orderSet: Lugo.OrderSet, snapshot: Lugo.GameSnapshot): Lugo.OrderSet {
        try {
            const {reader, me} = this.makeReader(snapshot)

            const myGoalCenter = this.mapper.getRegionFromPoint(reader.getOpponentGoal().getCenter())
            const currentRegion = this.mapper.getRegionFromPoint(me.getPosition())


            let myOrder;
            if (Math.abs(currentRegion.getRow() - myGoalCenter.getRow()) <= 1 &&
                Math.abs(currentRegion.getCol() - myGoalCenter.getCol()) <= 1) {
                myOrder = reader.makeOrderKickMaxSpeed(snapshot.getBall(), reader.getOpponentGoal().getCenter())
            } else {
                myOrder = reader.makeOrderMoveMaxSpeed(me.getPosition(), reader.getOpponentGoal().getCenter())
            }

            const orderSet = new Lugo.OrderSet()
            orderSet.setTurn(snapshot.getTurn())
            orderSet.setDebugMessage("attack!")
            orderSet.setOrdersList([myOrder])
            return orderSet
        } catch (e) {
            console.log(`did not play this turn`, e)
        }
    }

    onSupporting(orderSet: Lugo.OrderSet, snapshot: Lugo.GameSnapshot): Lugo.OrderSet {
        try {
            const {reader, me} = this.makeReader(snapshot)
            const ballHolderPosition = snapshot.getBall().getPosition()
            const myOrder = reader.makeOrderMoveMaxSpeed(me.getPosition(), ballHolderPosition)

            const orderSet = new Lugo.OrderSet()
            orderSet.setTurn(snapshot.getTurn())
            orderSet.setDebugMessage("supporting")
            orderSet.setOrdersList([myOrder])
            return orderSet
        } catch (e) {
            console.log(`did not play this turn`, e)
        }
    }

    asGoalkeeper(orderSet: Lugo.OrderSet, snapshot: Lugo.GameSnapshot, state: PLAYER_STATE): Lugo.OrderSet {
        try {
            const {reader, me} = this.makeReader(snapshot)
            let position = reader.getBall().getPosition()
            if (state !== PLAYER_STATE.DISPUTING_THE_BALL) {
                position = reader.getMyGoal().getCenter()
            }

            const myOrder = reader.makeOrderMoveMaxSpeed(me.getPosition(), position)

            const orderSet = new Lugo.OrderSet()
            orderSet.setTurn(snapshot.getTurn())
            orderSet.setDebugMessage("supporting")
            orderSet.setOrdersList([myOrder, reader.makeOrderCatch()])
            return orderSet
        } catch (e) {
            console.log(`did not play this turn`, e)
        }
    }

    gettingReady(snapshot: Lugo.GameSnapshot): void {
        // This method is called when the score is changed or before the game starts.
        // We can change the team strategy or do anything else based on the outcome of the game so far.
        // for now, we are not going anything here.
    }

    private _getMyExpectedPosition(reader: GameSnapshotReader, me: Lugo.Player) : Lugo.Point {
        const ballX = reader.getBall().getPosition().getX()
        const fieldThird = SPECS.FIELD_WIDTH / 3

        let teamState = "OFFENSIVE"
        if (ballX < fieldThird) {
            teamState = "DEFENSIVE"
        } else if (ballX < fieldThird * 2) {
            teamState = "NORMAL"
        }

        const expectedRegion = this.mapper.getRegion(PLAYER_TACTIC_POSITIONS[teamState][this.number].Col, PLAYER_TACTIC_POSITIONS[teamState][this.number].Row)
        return expectedRegion.getCenter();
    }
}