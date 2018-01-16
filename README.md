
# Space Explorers
[![Build Status](https://travis-ci.org/ZacIsLate/SpaceExplorers.svg?branch=master)](https://travis-ci.org/ZacIsLate/SpaceExplorers)

Command Line, choose your own adventure game that lets you explore the galaxzy and encounter quirky charecters in the ship of your chosing. 

# Tech Used
Inquirer npm package for client side command line gameplay.  
Restfull Express server with json web token for user authenitcation. 
Mongoose for schema managment of MongoDB.
Heroku for db storage. 


## Requirements

MongoDB, latest stable version of Node.js 

## Installation   

1. Clone repository and change directory.

    ```
    git clone https://github.com/martsyalis/travel-share 
    ```

2. Install dependencies.

    ```
    npm install
    ```
3. Run the game 
    ```
    node cli
    ```

## Coding consistency
1. good: fn()  bad: fn ()
2. good: map.(a => a * 2);
    bad: map.((a)=> a*2);
3. good: let b == 'str';
    bad: let b=='str';
4. good: function((power, exp) => {

        })
    bad: function((power, exp) =>{

        })

5. no line spaces between like items (ie 'require')
6. one line space between unlike items
7. Promises not async/await

Behavior
1. Taking breaks every 30 minutes is recommended
2. Stand ups twice a day
3. No pulling in your own pull request

User Stories
1. As a user, I would like the game to have a definitive ending.
2. I would like the game to be challenging.
3. I would like to be able to play the game with different characters, ships, enemies and encounters.
4. I would like the game to have a good story.
5. I would like to save my progress.
6. I would like an engaging and intuitive way to play.
7. I would like a rich environment.

Developer stories
1. Code should be consistent and readable.
2. Code should be resilient and reliable.
3. Code should be tested.
4. Errors should be handled.
5. App should be secure and won't release personal information.
6. User should sign up and sign in.
7. Code should be modular and expandable.
8. Use db smartly.
