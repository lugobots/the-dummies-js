# JS Troopers

JS Troopers is a Nodejs implementation of a player (bot) for [Lugo](https://lugobots.dev) game.

This bot was made using the [Node Client Player](https://github.com/lugobots/lugo4node).

Use this bot as a starting point to a new one. 

## Before starting

Are you familiar with Lugo? 
If not, before continuing, please visit [the project website](https://lugobots.dev) and read about the game.

## How to use this source code

1. **Checkout the code**: Use `git clone` or download the most recent tag release
2. **Install the dependencies**: Although the bot runs inside the container, the code will be read directly from your drive.
To keep the dependencies consistent, use this command:
   (Linux/Mac) `docker run --init -v $(pwd):/app --workdir="/app" node:18 npm install`
   (Windows) or  `docker run --init -v %dir%:/app --workdir="/app" node:18 npm install`
3. **Test it out**: Before any change, make the JS Troopers play to ensure you are not working on a broken code:
   `npm run play`
4. **Now, make your changes**: change the methods in [current bot](src/my_bot.ts). You may also need to change some [settings in the main file](src/main.ts)
5. Play again to see your changes results: `npm run play`
6. **Done? Build your Docker image:**
    `docker build -t my-super-bot .`
7. Before pushing your changes
    `MY_BOT=my-super-bot docker-compose --file docker-compose-test.yml up`
## Running directly in your machine
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
command `docker-compose up`
