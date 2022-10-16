import { GameSnapshotReader, PLAYER_STATE, Lugo, SPECS, Bot, Mapper, Region, geo } from '@lugobots/lugo4node'
import { getMyExpectedPosition } from './settings';

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
            const { reader, me } = this.makeReader(snapshot)
            const ballPosition = snapshot.getBall().getPosition()

            const ballRegion = this.mapper.getRegionFromPoint(ballPosition)
            const myRegion = this.mapper.getRegionFromPoint(me.getPosition())

            // by default, I will stay at my tactic position
            let moveDestination = getMyExpectedPosition(reader, this.mapper, this.number)
            orderSet.setDebugMessage("returning to my position")

            // if the ball is max 2 blocks away from me, I will move toward the ball
            if (this.shouldICatchTheBall(reader, me)) {
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
            const { reader, me } = this.makeReader(snapshot)
            const ballPosition = snapshot.getBall().getPosition()
            const ballRegion = this.mapper.getRegionFromPoint(ballPosition)
            const myRegion = this.mapper.getRegionFromPoint(me.getPosition())

            // by default, I will stay at my tactic position
            let moveDestination = getMyExpectedPosition(reader, this.mapper, this.number)
            orderSet.setDebugMessage("returning to my position")
            // if the ball is max 2 blocks away from me, I will move toward the ball
            if (this.shouldICatchTheBall(reader, me)) {
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
            const { reader, me } = this.makeReader(snapshot)

            const myGoalCenter = this.mapper.getRegionFromPoint(reader.getOpponentGoal().getCenter())
            const currentRegion = this.mapper.getRegionFromPoint(me.getPosition())

            let myOrder: Lugo.Order;
            if (this.isINear(currentRegion, myGoalCenter, 0)) {
                myOrder = reader.makeOrderKickMaxSpeed(snapshot.getBall(), reader.getOpponentGoal().getCenter())
            } else {
                const closeOpponents = this.nearestPlayers(
                    reader.getOpponentTeam().getPlayersList(),
                    me.getPosition(),
                    3, [1])

                const obstacles = this.findObstacles(
                    me.getPosition(),
                    reader.getOpponentGoal().getCenter(),
                    closeOpponents.map(o => o.player.getPosition()),
                    SPECS.PLAYER_SIZE * 3,
                )

                if (obstacles.length > 0 && geo.distanceBetweenPoints(obstacles[0], me.getPosition()) < SPECS.PLAYER_SIZE * 5) {
                    const closeMate = this.nearestPlayers(
                        reader.getMyTeam().getPlayersList(),
                        me.getPosition(),
                        3, [1, this.number])
                    myOrder = reader.makeOrderKickMaxSpeed(reader.getBall(), closeMate[0].player.getPosition())
                    const bestPassPlayer = this.findBestPass(closeMate, me.getPosition(), reader)
                    if (bestPassPlayer !== null) {
                        myOrder = reader.makeOrderKickMaxSpeed(reader.getBall(), bestPassPlayer.getPosition())
                    }
                } else if (closeOpponents[0].dist < SPECS.PLAYER_SIZE * 5) {
                    const destination = reader.getOpponentGoal().getCenter()
                    let vect1 = new Lugo.Vector()
                    vect1.setX(destination.getX() - me.getPosition().getX())
                    vect1.setY(destination.getY() - me.getPosition().getY())
                    vect1 = geo.normalize(vect1)

                    let vect2 = new Lugo.Vector()
                    vect2.setX(me.getPosition().getX() - closeOpponents[0].player.getPosition().getX())
                    vect2.setY(me.getPosition().getY() - closeOpponents[0].player.getPosition().getY())
                    vect2 = geo.normalize(vect2)

                    const vect3 = new Lugo.Vector()
                    vect3.setX(vect1.getX() + vect2.getX())
                    vect3.setY(vect1.getY() + vect2.getY())

                    myOrder = reader.makeOrderMoveFromVector(vect3, SPECS.PLAYER_MAX_SPEED)

                } else {
                    myOrder = reader.makeOrderMoveMaxSpeed(me.getPosition(), reader.getOpponentGoal().getCenter())
                }
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
            const { reader, me } = this.makeReader(snapshot)
            const ballPosition = snapshot.getBall().getPosition()

            let moveDestination = getMyExpectedPosition(reader, this.mapper, this.number)
            orderSet.setDebugMessage("returning to my position")

            if (reader.getBall().getHolder().getNumber() == 1 && this.number == 2) {
                moveDestination = getMyExpectedPosition(reader, this.mapper, this.number)
                const myOrder = reader.makeOrderMoveMaxSpeed(me.getPosition(), moveDestination)
                orderSet.setDebugMessage("assisting the goalkeeper")
                orderSet.setOrdersList([myOrder])
                return orderSet
            }

            const closePlayers = this.nearestPlayers(reader.getMyTeam().getPlayersList(), ballPosition, 3,
                [1,
                    snapshot.getBall().getHolder().getNumber()
                ])

            if (closePlayers.find(info => info.number == this.number)) {
                const distToMate = geo.distanceBetweenPoints(me.getPosition(), ballPosition)
                if (distToMate > SPECS.PLAYER_SIZE * 4) {
                    moveDestination = ballPosition
                } else {
                    // todo find the best position?
                    moveDestination = reader.getOpponentGoal().getCenter()
                }
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

    asGoalkeeper(orderSet: Lugo.OrderSet, snapshot: Lugo.GameSnapshot, state: PLAYER_STATE): Lugo.OrderSet {
        try {
            const { reader, me } = this.makeReader(snapshot)
            let position = reader.getBall().getPosition()
            if (state !== PLAYER_STATE.DISPUTING_THE_BALL) {
                position = reader.getMyGoal().getCenter()
            }

            if (state === PLAYER_STATE.HOLDING_THE_BALL) {
                position = reader.getPlayer(this.side, 2).getPosition()
                if (snapshot.getTurnsBallInGoalZone() > SPECS.BALL_TIME_IN_GOAL_ZONE * 0.80) {
                    orderSet.setDebugMessage("returning the ball")
                    const kick = reader.makeOrderKickMaxSpeed(reader.getBall(), position)
                    orderSet.setOrdersList([kick])
                    return orderSet
                }
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

    private isINear(myPosition: Region, targetPosition: Region, minDist: number): boolean {
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
        return { reader, me }
    }

    private shouldICatchTheBall(reader: GameSnapshotReader, me: Lugo.Player): boolean {
        const myDistance = geo.distanceBetweenPoints(me.getPosition(), reader.getBall().getPosition())
        let closerPlayer = 0;
        for (const player of reader.getMyTeam().getPlayersList()) {
            if (player.getNumber() == me.getNumber() || player.getNumber() == 1) {
                continue;
            }
            const playerDist = geo.distanceBetweenPoints(player.getPosition(), reader.getBall().getPosition())
            if (playerDist < myDistance) {
                closerPlayer++;
                if (closerPlayer >= 2) {
                    return false;
                }
            }
        }
        return true;
    }

    private nearestPlayers(players: Array<Lugo.Player>, pointTarget: Lugo.Point, count: number, ignore: Array<number>): Array<{ dist: number, number: number, player: Lugo.Player }> {
        let playersDist = []

        for (const player of players) {
            if (ignore.includes(player.getNumber())) {
                continue
            }
            playersDist.push({
                dist: geo.distanceBetweenPoints(player.getPosition(), pointTarget),
                number: player.getNumber(),
                player: player,
            })
        }

        playersDist.sort((a, b) => {
            return a.dist - b.dist
        });
        return playersDist.slice(0, count)
    }

    private findObstacles(origin: Lugo.Point, target: Lugo.Point, elements: Array<Lugo.Point>, minAcceptableDist: number): Array<Lugo.Point> {
        const obstacles = []
        for (const element of elements) {
            const { dist, between } = this.getDistance(
                element.getX(),
                element.getY(),
                origin.getX(),
                origin.getY(),
                target.getX(),
                target.getY(),
            )
            if (between && dist <= minAcceptableDist) {
                obstacles.push(element)
            }
        }
        return obstacles
    }

    // https://stackoverflow.com/questions/849211/shortest-distance-between-a-point-and-a-line-segment
    private getDistance(obstacleX: number, obstacleY: number, x1: number, y1: number, x2: number, y2: number): { dist: number, between: boolean } {
        const A = obstacleX - x1;
        const B = obstacleY - y1;
        const C = x2 - x1;
        const D = y2 - y1;

        const dot = A * C + B * D;
        const len_sq = C * C + D * D;
        let param = -1;
        if (len_sq != 0) //in case of 0 length line
            param = dot / len_sq;

        let xx, yy;
        let between = false
        if (param < 0) {
            xx = x1;
            yy = y1;
        } else if (param > 1) {
            xx = x2;
            yy = y2;
        } else {
            between = true
            xx = x1 + param * C;
            yy = y1 + param * D;
        }

        let dx = obstacleX - xx;
        let dy = obstacleY - yy;
        return {
            dist: Math.sqrt(dx * dx + dy * dy),
            between,
        }
    }

    private findBestPass(closeMates: Array<{ dist: number; number: number; player: Lugo.Player }>, myPosition: Lugo.Point, reader: GameSnapshotReader): Lugo.Player {
        const candidates = []
        const opponents = reader.getOpponentTeam().getPlayersList().map(p => p.getPosition())
        const goalCenter = reader.getOpponentGoal().getCenter()
        for (const candidate of closeMates) {
            if (candidate.dist > SPECS.PLAYER_SIZE * 8) {
                continue
            }

            const obstacles = this.findObstacles(
                myPosition,
                candidate.player.getPosition(),
                opponents,
                SPECS.PLAYER_SIZE * 2,
            )

            const candidatesObstaclesToKick = this.findObstacles(
                candidate.player.getPosition(),
                goalCenter,
                opponents,
                SPECS.PLAYER_SIZE * 2,
            )

            const distToGoal = geo.distanceBetweenPoints(candidate.player.getPosition(), goalCenter)

            let score = 0;
            score -= obstacles.length * 10
            score -= (candidate.dist / SPECS.PLAYER_SIZE) / 2
            score -= (distToGoal / SPECS.PLAYER_SIZE) * 2

            if (candidatesObstaclesToKick.length == 0) {
                score += 30
            }

            candidates.push({
                score,
                player: candidate.player,
            })
        }
        if (candidates.length == 0) {
            return null
        }
        candidates.sort((a, b) => {
            return b.score - a.score
        });
        return candidates[0].player
    }
}