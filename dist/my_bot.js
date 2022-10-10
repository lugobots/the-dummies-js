"use strict";
exports.__esModule = true;
exports.MyBot = void 0;
var lugo4node_1 = require("@lugobots/lugo4node");
var settings_1 = require("./settings");
var TEAM_HOME = lugo4node_1.Lugo.Team.Side.HOME;
var TEAM_AWAY = lugo4node_1.Lugo.Team.Side.AWAY;
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
            var myRegion = this.mapper.getRegionFromPoint(me.getPosition());
            // by default, I will stay at my tactic position
            var moveDestination = (0, settings_1.getMyExpectedPosition)(reader, this.mapper, this.number);
            orderSet.setDebugMessage("returning to my position");
            // if the ball is max 2 blocks away from me, I will move toward the ball
            if (this.isINear(myRegion, ballRegion)) {
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
            var myRegion = this.mapper.getRegionFromPoint(me.getPosition());
            // by default, I will stay at my tactic position
            var moveDestination = (0, settings_1.getMyExpectedPosition)(reader, this.mapper, this.number);
            orderSet.setDebugMessage("returning to my position");
            // if the ball is max 2 blocks away from me, I will move toward the ball
            if (this.isINear(myRegion, ballRegion)) {
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
            if (this.isINear(currentRegion, myGoalCenter)) {
                myOrder = reader.makeOrderKickMaxSpeed(snapshot.getBall(), reader.getOpponentGoal().getCenter());
            }
            else {
                myOrder = reader.makeOrderMoveMaxSpeed(me.getPosition(), reader.getOpponentGoal().getCenter());
            }
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
            orderSet.setDebugMessage("supporting");
            orderSet.setOrdersList([myOrder]);
            return orderSet;
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
            orderSet.setDebugMessage("supporting");
            orderSet.setOrdersList([myOrder, reader.makeOrderCatch()]);
            return orderSet;
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
    MyBot.prototype.isINear = function (myPosition, targetPosition) {
        var minDist = 2;
        var colDist = myPosition.getCol() - targetPosition.getCol();
        var rowDist = myPosition.getRow() - targetPosition.getRow();
        return Math.hypot(colDist, rowDist) <= minDist;
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
    return MyBot;
}());
exports.MyBot = MyBot;
