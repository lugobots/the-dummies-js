"use strict";
exports.__esModule = true;
exports.MyBot = void 0;
var lugo4node_1 = require("@lugobots/lugo4node");
var TEAM_HOME = lugo4node_1.Lugo.Team.Side.HOME;
var TEAM_AWAY = lugo4node_1.Lugo.Team.Side.AWAY;
var PLAYER_TACTIC_POSITIONS = {
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
var MyBot = /** @class */ (function () {
    function MyBot(side, number, initPosition, mapper) {
        this.side = side;
        this.number = number;
        this.mapper = mapper;
        this.initPosition = initPosition;
    }
    MyBot.prototype.onDisputing = function (orderSet, snapshot) {
        try {
            var _a = this.makeReader(snapshot), reader = _a.reader, me = _a.me;
            var ballPosition = snapshot.getBall().getPosition();
            var ballRegion = this.mapper.getRegionFromPoint(ballPosition);
            var myRegion = this.mapper.getRegionFromPoint(this.initPosition);
            // by default, I will stay at my tactic position
            var moveDestination = this._getMyExpectedPosition(reader, me);
            orderSet.setDebugMessage("returning to my position");
            // if the ball is max 2 blocks away from me, I will move toward the ball
            if (this.amINear(myRegion, ballRegion)) {
                moveDestination = ballPosition;
                orderSet.setDebugMessage("trying to catch the ball");
            }
            var moveOrder = reader.makeOrderMoveMaxSpeed(me.getPosition(), moveDestination);
            // we can ALWAYS try to catch the ball it we are not holding it
            var catchOrder = reader.makeOrderCatch();
            orderSet.setOrdersList([moveOrder, catchOrder]);
            return orderSet;
        }
        catch (e) {
            console.log("did not play this turn", e);
        }
    };
    MyBot.prototype.onDefending = function (orderSet, snapshot) {
        try {
            var _a = this.makeReader(snapshot), reader = _a.reader, me = _a.me;
            var ballPosition = snapshot.getBall().getPosition();
            var ballRegion = this.mapper.getRegionFromPoint(ballPosition);
            var myRegion = this.mapper.getRegionFromPoint(this.initPosition);
            // by default, I will stay at my tactic position
            var moveDestination = this._getMyExpectedPosition(reader, me);
            orderSet.setDebugMessage("returning to my position");
            // if the ball is max 2 blocks away from me, I will move toward the ball
            if (this.amINear(myRegion, ballRegion)) {
                moveDestination = ballPosition;
                orderSet.setDebugMessage("trying to catch the ball");
            }
            var moveOrder = reader.makeOrderMoveMaxSpeed(me.getPosition(), moveDestination);
            var catchOrder = reader.makeOrderCatch();
            orderSet.setOrdersList([moveOrder, catchOrder]);
            return orderSet;
        }
        catch (e) {
            console.log("did not play this turn", e);
        }
    };
    MyBot.prototype.onHolding = function (orderSet, snapshot) {
        try {
            var _a = this.makeReader(snapshot), reader = _a.reader, me = _a.me;
            var myGoalCenter = this.mapper.getRegionFromPoint(reader.getOpponentGoal().getCenter());
            var currentRegion = this.mapper.getRegionFromPoint(me.getPosition());
            var myOrder = void 0;
            if (this.amINear(currentRegion, myGoalCenter)) {
                myOrder = reader.makeOrderKickMaxSpeed(snapshot.getBall(), reader.getOpponentGoal().getCenter());
            }
            else {
                myOrder = reader.makeOrderMoveMaxSpeed(me.getPosition(), reader.getOpponentGoal().getCenter());
            }
            orderSet.setTurn(snapshot.getTurn());
            orderSet.setDebugMessage("attack!");
            orderSet.setOrdersList([myOrder]);
            return orderSet;
        }
        catch (e) {
            console.log("did not play this turn", e);
        }
    };
    MyBot.prototype.onSupporting = function (orderSet, snapshot) {
        try {
            var _a = this.makeReader(snapshot), reader = _a.reader, me = _a.me;
            var ballHolderPosition = snapshot.getBall().getPosition();
            var myOrder = reader.makeOrderMoveMaxSpeed(me.getPosition(), ballHolderPosition);
            var orderSet_1 = new lugo4node_1.Lugo.OrderSet();
            orderSet_1.setTurn(snapshot.getTurn());
            orderSet_1.setDebugMessage("supporting");
            orderSet_1.setOrdersList([myOrder]);
            return orderSet_1;
        }
        catch (e) {
            console.log("did not play this turn", e);
        }
    };
    MyBot.prototype.asGoalkeeper = function (orderSet, snapshot, state) {
        try {
            var _a = this.makeReader(snapshot), reader = _a.reader, me = _a.me;
            var position = reader.getBall().getPosition();
            if (state !== lugo4node_1.PLAYER_STATE.DISPUTING_THE_BALL) {
                position = reader.getMyGoal().getCenter();
            }
            var myOrder = reader.makeOrderMoveMaxSpeed(me.getPosition(), position);
            var orderSet_2 = new lugo4node_1.Lugo.OrderSet();
            orderSet_2.setTurn(snapshot.getTurn());
            orderSet_2.setDebugMessage("supporting");
            orderSet_2.setOrdersList([myOrder, reader.makeOrderCatch()]);
            return orderSet_2;
        }
        catch (e) {
            console.log("did not play this turn", e);
        }
    };
    MyBot.prototype.gettingReady = function (snapshot) {
        // This method is called when the score is changed or before the game starts.
        // We can change the team strategy or do anything else based on the outcome of the game so far.
        // for now, we are not going anything here.
    };
    MyBot.prototype.amINear = function (myPosition, targetPosition) {
        var minDist = 2;
        throw new Error('bruno');
        return Math.abs(myPosition.getRow() - targetPosition.getRow()) <= minDist &&
            Math.abs(myPosition.getCol() - targetPosition.getCol()) <= minDist;
    };
    /**
     * This method creates a snapshot reader. The Snapshot readers reads the game state and return elements we may need.
     * E.g. Players, the ball, etc.
     */
    MyBot.prototype.makeReader = function (snapshot) {
        var reader = new lugo4node_1.GameSnapshotReader(snapshot, this.side);
        var me = reader.getPlayer(this.side, this.number);
        if (!me) {
            throw new Error("did not find myself in the game");
        }
        return { reader: reader, me: me };
    };
    MyBot.prototype._getMyExpectedPosition = function (reader, me) {
        var ballX = reader.getBall().getPosition().getX();
        var fieldThird = lugo4node_1.SPECS.FIELD_WIDTH / 3;
        var teamState = "OFFENSIVE";
        if (ballX < fieldThird) {
            teamState = "DEFENSIVE";
        }
        else if (ballX < fieldThird * 2) {
            teamState = "NORMAL";
        }
        var expectedRegion = this.mapper.getRegion(PLAYER_TACTIC_POSITIONS[teamState][this.number].Col, PLAYER_TACTIC_POSITIONS[teamState][this.number].Row);
        return expectedRegion.getCenter();
    };
    return MyBot;
}());
exports.MyBot = MyBot;
