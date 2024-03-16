"use strict";
exports.__esModule = true;
exports.MyBot = void 0;
var lugo4node_1 = require("@lugobots/lugo4node");
var settings_1 = require("./settings");
var MyBot = /** @class */ (function () {
    function MyBot(side, number, initPosition, mapper) {
        this.side = side;
        this.number = number;
        this.mapper = mapper;
        this.initPosition = initPosition;
    }
    MyBot.prototype.onDisputing = function (inspector) {
        try {
            var orders = [];
            var me = inspector.getMe();
            var ballPosition = inspector.getBall().getPosition();
            var ballRegion = this.mapper.getRegionFromPoint(ballPosition);
            var myRegion = this.mapper.getRegionFromPoint(me.getPosition());
            // by default, I will stay at my tactic position
            var moveDestination = (0, settings_1.getMyExpectedPosition)(inspector, this.mapper, this.number);
            // if the ball is max 2 blocks away from me, I will move toward the ball
            if (this.isINear(myRegion, ballRegion)) {
                moveDestination = ballPosition;
            }
            var moveOrder = inspector.makeOrderMoveMaxSpeed(moveDestination);
            // Try other ways to create a move Oorder
            // const moveOrder = reader.makeOrderMoveByDirection(DIRECTION.BACKWARD)
            // we can ALWAYS try to catch the ball it we are not holding it
            var catchOrder = inspector.makeOrderCatch();
            orders.push(moveOrder, catchOrder);
            return orders;
        }
        catch (e) {
            console.log("did not play this turn", e);
            return null;
        }
    };
    MyBot.prototype.onDefending = function (inspector) {
        try {
            var orders = [];
            var me = inspector.getMe();
            var ballPosition = inspector.getBall().getPosition();
            var ballRegion = this.mapper.getRegionFromPoint(ballPosition);
            var myRegion = this.mapper.getRegionFromPoint(me.getPosition());
            // by default, I will stay at my tactic position
            var moveDestination = (0, settings_1.getMyExpectedPosition)(inspector, this.mapper, this.number);
            // if the ball is max 2 blocks away from me, I will move toward the ball
            if (this.isINear(myRegion, ballRegion)) {
                moveDestination = ballPosition;
            }
            var moveOrder = inspector.makeOrderMoveMaxSpeed(moveDestination);
            var catchOrder = inspector.makeOrderCatch();
            orders.push(moveOrder, catchOrder);
            return orders;
        }
        catch (e) {
            console.log("did not play this turn", e);
            return null;
        }
    };
    MyBot.prototype.onHolding = function (inspector) {
        try {
            var orders = [];
            var me = inspector.getMe();
            var attackGoalCenter = this.mapper.getAttackGoal().getCenter();
            var opponentGoal = this.mapper.getRegionFromPoint(attackGoalCenter);
            var currentRegion = this.mapper.getRegionFromPoint(me.getPosition());
            var myOrder = void 0;
            if (this.isINear(currentRegion, opponentGoal)) {
                myOrder = inspector.makeOrderKickMaxSpeed(attackGoalCenter);
            }
            else {
                myOrder = inspector.makeOrderMoveMaxSpeed(attackGoalCenter);
            }
            orders.push(myOrder);
            return orders;
        }
        catch (e) {
            console.log("did not play this turn", e);
            return null;
        }
    };
    MyBot.prototype.onSupporting = function (inspector) {
        try {
            var orders = [];
            var me = inspector.getMe();
            var ballHolderPosition = inspector.getBall().getPosition();
            var myOrder = inspector.makeOrderMoveMaxSpeed(ballHolderPosition);
            orders.push(myOrder);
            return orders;
        }
        catch (e) {
            console.log("did not play this turn", e);
            return null;
        }
    };
    MyBot.prototype.asGoalkeeper = function (inspector, state) {
        try {
            var orders = [];
            var me = inspector.getMe();
            var position = inspector.getBall().getPosition();
            if (state !== lugo4node_1.PLAYER_STATE.DISPUTING_THE_BALL) {
                position = this.mapper.getDefenseGoal().getCenter();
            }
            var myOrder = inspector.makeOrderMoveMaxSpeed(position);
            orders.push(myOrder, inspector.makeOrderCatch());
            return orders;
        }
        catch (e) {
            console.log("did not play this turn", e);
            return null;
        }
    };
    MyBot.prototype.gettingReady = function (inspector) {
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
    return MyBot;
}());
exports.MyBot = MyBot;
