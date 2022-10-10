`use strict`;
import {GameSnapshotReader, PLAYER_STATE, Lugo, SPECS, Bot, Mapper, Region} from '@lugobots/lugo4node'
import {getMyExpectedPosition} from './settings';

const TEAM_HOME = Lugo.Team.Side.HOME
const TEAM_AWAY = Lugo.Team.Side.AWAY

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

    onDisputing(orderSet: Lugo.OrderSet, snapshot: Lugo.GameSnapshot): Lugo.OrderSet {
        try {
            const {reader, me} = this.makeReader(snapshot)
            const ballPosition = snapshot.getBall().getPosition()           

            const ballRegion = this.mapper.getRegionFromPoint(ballPosition)
            const myRegion = this.mapper.getRegionFromPoint(me.getPosition())

            // by default, I will stay at my tactic position
            let moveDestination = getMyExpectedPosition(reader, this.mapper, this.number)
            orderSet.setDebugMessage("returning to my position")
            
            // if the ball is max 2 blocks away from me, I will move toward the ball
            if (this.isINear(myRegion, ballRegion)) {
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
            const myRegion = this.mapper.getRegionFromPoint(me.getPosition())

            // by default, I will stay at my tactic position
            let moveDestination = getMyExpectedPosition(reader, this.mapper, this.number)
            orderSet.setDebugMessage("returning to my position")
            // if the ball is max 2 blocks away from me, I will move toward the ball
            if (this.isINear(myRegion, ballRegion)) {
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
            if (this.isINear(currentRegion, myGoalCenter)) {
                myOrder = reader.makeOrderKickMaxSpeed(snapshot.getBall(), reader.getOpponentGoal().getCenter())
            } else {
                myOrder = reader.makeOrderMoveMaxSpeed(me.getPosition(), reader.getOpponentGoal().getCenter())
            }
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

    private isINear(myPosition: Region, targetPosition: Region): boolean {
        const minDist = 2;
        const colDist = myPosition.getCol() - targetPosition.getCol()
        const rowDist = myPosition.getRow() - targetPosition.getRow()
        return Math.hypot(colDist, rowDist) <= minDist
    }


    /**
     * This method creates a snapshot reader. The Snapshot readers reads the game state and return elements we may need.
     * E.g. Players, the ball, etc.
     */
    private makeReader(snapshot: Lugo.GameSnapshot): { reader: GameSnapshotReader, me: Lugo.Player } {
        const reader = new GameSnapshotReader(snapshot, this.side)
        const me = reader.getPlayer(this.side, this.number)
        if (!me) {
            throw new Error("did not find myself in the game")
        }
        return {reader, me}
    }


}