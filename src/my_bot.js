`use strict`;
const {GameSnapshotReader, BotStub, PLAYER_STATE, FIELD} = require('@lugobots/lugo4node')
const BotBase = require('./bot_base')
const {map, PLAYER_TACTIC_POSITIONS} = require('./settings')

const TEAM_HOME = proto.lugo.Team.Side.HOME
const TEAM_AWAY = proto.lugo.Team.Side.AWAY

class Bot extends BotBase {

    onDisputing(orderSet, snapshot) {
        try {
            const {reader, me} = this.makeReader(snapshot)
            const ballPosition = snapshot.getBall().getPosition()

            const ballRegion = this.mapper.getRegionFromPoint(ballPosition)
            const myRegion = this.mapper.getRegionFromPoint(this.initPosition)

            // by default, I will stay at my tactic position
            let moveDestination = this.getMyExpectedPosition(reader, me)
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

    onDefending(orderSet, snapshot) {
        try {
            const {reader, me} = this.makeReader(snapshot)
            const ballPosition = snapshot.getBall().getPosition()
            const ballRegion = this.mapper.getRegionFromPoint(ballPosition)
            const myRegion = this.mapper.getRegionFromPoint(this.initPosition)

            // by default, I will stay at my tactic position
            let moveDestination = this.getMyExpectedPosition(reader, me)
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

    onHolding(orderSet, snapshot) {
        try {
            const {reader, me} = this.makeReader(snapshot)
            
            const myGoalCenter = this.mapper.getRegionFromPoint(reader.getOpponentGoal().center)
            const currentRegion = this.mapper.getRegionFromPoint(me.getPosition())
            

            let myOrder;
            if (Math.abs(currentRegion.getRow() - myGoalCenter.getRow()) <= 1 &&
                Math.abs(currentRegion.getCol() - myGoalCenter.getCol()) <= 1) {
                myOrder = reader.makeOrderKickMaxSpeed(snapshot.getBall(), reader.getOpponentGoal().center)
            } else {
                myOrder = reader.makeOrderMoveMaxSpeed(me.getPosition(), reader.getOpponentGoal().center)
            }

            const orderSet = new proto.lugo.OrderSet()
            orderSet.setTurn(snapshot.getTurn())
            orderSet.setDebugMessage("attack!")
            orderSet.setOrdersList([myOrder])
            return orderSet
        } catch (e) {
            console.log(`did not play this turn`, e)
        }
    }

    onSupporting(orderSet, snapshot) {
        try {
            const {reader, me} = this.makeReader(snapshot)
            const ballHolderPosition = snapshot.getBall().getPosition()
            const myOrder = reader.makeOrderMoveMaxSpeed(me.getPosition(), ballHolderPosition)

            const orderSet = new proto.lugo.OrderSet()
            orderSet.setTurn(snapshot.getTurn())
            orderSet.setDebugMessage("supporting")
            orderSet.setOrdersList([myOrder])
            return orderSet
        } catch (e) {
            console.log(`did not play this turn`, e)
        }
    }

    asGoalkeeper(orderSet, snapshot, state) {
        try {
            const {reader, me} = this.makeReader(snapshot)
            let position = reader.getBall().getPosition()
            if (state !== PLAYER_STATE.DISPUTING_THE_BALL) {
                position = reader.getMyGoal().center
            }

            const myOrder = reader.makeOrderMoveMaxSpeed(me.getPosition(), position)
                
            const orderSet = new proto.lugo.OrderSet()
            orderSet.setTurn(snapshot.getTurn())
            orderSet.setDebugMessage("supporting")
            orderSet.setOrdersList([myOrder, reader.makeOrderCatch()])
            return orderSet
        } catch (e) {
            console.log(`did not play this turn`, e)
        }
    }

    /**
     *
     * @param reader
     * @param me
     * @returns {proto.lugo.Point}
     */
    getMyExpectedPosition(reader, me) {
        const ballX = reader.getBall().getPosition().getX()
        const fieldThird = FIELD.FIELD_WIDTH/3

        let teamState = "OFFENSIVE"
        if (ballX < fieldThird) {
            teamState = "DEFENSIVE"
        } else if (ballX < fieldThird * 2) {
            teamState = "NORMAL"
        }

        const expectedRegion = map.getRegion(PLAYER_TACTIC_POSITIONS[teamState][this.number].Col, PLAYER_TACTIC_POSITIONS[teamState][this.number].Row)
        return expectedRegion.getCenter();
    }
}

module.exports = Bot