# Lugo - The Dummies JS
 
The Dummies JS is a Nodejs implementation of a player (bot) for [Lugo](https://lugobots.dev) game.

This bot was made using the [Node Client Player](https://github.com/lugobots/lugo4node).

Use this bot as a starting point to a new one. 

## Dependencies

* Docker ([https://docs.docker.com/get-docker/](https://docs.docker.com/get-docker/))
* Docker Compose ([https://docs.docker.com/compose/install/](https://docs.docker.com/compose/install/))
* (optional) NodeJS with NPM ([https://nodejs.org/en/download/current/](https://nodejs.org/en/download/current/))

## Before starting

Are you familiar with Lugo? 
If not, before continuing, please visit [the project website](https://lugobots.dev) and read about the game.

## How to use this source code


1. **Checkout the code** or download the most recent tag release
2. **Install the dependencies and compile the Typescript**: keep the `watcher` service ALWAYS running to keep your code ready to be run.
When this service is not running, :bangbang: **your code changes will NOT be executed** :bangbang:

    ```sh 
   docker compose -f watcher-compose.yml -p builder up
   ```
3. **Test it out**: Before any change, make the Dummies JS play to ensure you are not working on a broken code.

   ```sh 
   docker compose up
   ```
   and open [http://localhost:8080/](http://localhost:8080/) to watch the game.
4. **Now, make your changes**: (see :question:[How to change the bot](#how-to-edit-the-bot))
5. Play again to see your changes results: 

   ```sh 
   docker compose up
   ```
6. **Are you ready to compete? Build your Docker image:** 
    
    ```sh 
   docker build -t my-super-bot .
   ```
7. :checkered_flag: Before pushing your changes

   ```sh 
   MY_BOT=my-super-bot docker compose --file docker compose-test.yml -p tester up
   ```

## How to edit the bot   

The only files that you may need to edit are the ones inside [./src](./src). Ignore all the other ones.

### Main file [src/main.ts](src/main.ts)

You probably will not change this file. It only initializes the bot.

### Settings file [src/settings.ts](./src/settings.ts)

Settings file only stores configurations that will affect the player behaviour, e.g. positions, tactic, etc.

### Settings file [src/my_bot.ts](./src/my_bot.ts)

:eyes: This is the most important file!

There will be 5 important methods that you must edit to change the bot behaviour.

```typescript
 /**
     * OnDisputing is called when no one has the ball possession
     */
    onDisputing: (orderSet: OrderSet, snapshot: GameSnapshot) => OrderSet | null

    /**
     * OnDefending is called when an opponent player has the ball possession
     */
    onDefending: (orderSet: OrderSet, snapshot: GameSnapshot) => OrderSet | null

    /**
     * OnHolding is called when this bot has the ball possession
     */
    onHolding: (orderSet: OrderSet, snapshot: GameSnapshot) => OrderSet | null


    /**
     * OnSupporting is called when a teammate player has the ball possession
     */
    onSupporting: (orderSet: OrderSet, snapshot: GameSnapshot) => OrderSet | null

    /**
     * AsGoalkeeper is only called when this bot is the goalkeeper (number 1). This method is called on every turn,
     * and the player state is passed at the last parameter.
     */
    asGoalkeeper: (orderSet: OrderSet, snapshot: GameSnapshot, state: PLAYER_STATE) => OrderSet | null

```


## Running directly in your machine (:ninja: advanced) 

If you want to run the NodeJS code in your machine instead of inside the container, you definitely can do this.

The command to start locally is `BOT_NUMBER=1 BOT_TEAM=home npm run start`. However, when you run the Docker compose 
file, all players from both teams will start. Then, if you run another bot directly from your machine, it will not
be allowed to join the game.

But you also cannot start your bot before the game server has started.

You have two options to run your bot locally.

### Option 1 - comment out the bot from the Docker compose file

You can edit the file `docker-compose.yml` and comment out the player that you want to run locally.

The game server will wait all 11 players from both teams to connect before starting the game.

### Option 2 - starting the game server first

You can start _only_ the game server with the command `game_server`. The game will wait for the players. Then, you
start your local bot (`BOT_NUMBER=1 BOT_TEAM=home npm run start`), and finally start the rest of the players with the
command `docker compose up`
