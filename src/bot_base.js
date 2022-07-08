`use strict`;
const {GameSnapshotReader, BotStub, PLAYER_STATE} = require('@lugobots/lugo4node')

class BotBase extends BotStub {
    /**
     * @type {proto.lugo.Team.Side}
     */
    side;

    /**
     * @type {number}
     */
    number;

    /**
     * @type {proto.lugo.Point}
     */
    initPosition;

    /**
     * @type {Map}
     */
    mapper;

    /**
     *
     * @param {proto.lugo.Team.Side} side
     * @param {number} number
     * @param {proto.lugo.Point} initPosition
     * @param {Map} mapper
     */
    constructor(side, number, initPosition, mapper) {
        super();
        this.side = side
        this.number = number
        this.mapper = mapper
        this.initPosition = initPosition
    }

    /**
     * This method creates a snapshot reader. The Snapshot readers reads the game state and return elements we may need.
     * E.g. Players, the ball, etc.
     * @param {proto.lugo.GameSnapshot} snapshot
     */
    makeReader(snapshot) {
        const reader = new GameSnapshotReader(snapshot, this.side)
        const me = reader.getPlayer(this.side, this.number)
        if (!me) {
            throw new Error("did not find myself in the game")
        }
        return {reader, me}
    }
}

module.exports = BotBase