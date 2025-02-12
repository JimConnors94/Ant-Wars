const defaultGameState = {
  gameTimer: 0,
  raidAvailable: false,

  playerAntHill: {
    resources: {
      eggs: 0,
      food: 0,
    },
    ants: {
      workers: 30,
      warriors: 5,
      guards: 5,
      enemy: 35,
    },
  },
  scores: {
    battleLog: [],
    enemyKilled: 0,
    highestPopulation: 0,
  },
};

let gameState = {};

function updateResourceStats() {
  document.getElementById("eggCount").textContent =
    gameState.playerAntHill.resources.eggs;

  document.getElementById("foodCount").textContent =
    gameState.playerAntHill.resources.food;

  document.getElementById("workerCount").textContent =
    gameState.playerAntHill.ants.workers;

  document.getElementById("warriorCount").textContent =
    gameState.playerAntHill.ants.warriors;

  document.getElementById("guardCount").textContent =
    gameState.playerAntHill.ants.guards;

  document.getElementById("enemyCount").textContent =
    gameState.playerAntHill.ants.enemy;

  const { enemyAttack, enemyDefence, playerAttack, playerDefence } =
    calculateCombatStats();
  document.getElementById("playerDefence").textContent = playerDefence;
  document.getElementById("playerAttack").textContent = playerAttack;
  document.getElementById("enemyAttack").textContent = enemyAttack;
  document.getElementById("enemyDefence").textContent = enemyDefence;
}

function initializeGameState() {
  const savedState = localStorage.getItem("antWarsGameState");

  if (savedState) {
    gameState = JSON.parse(savedState);
  } else {
    gameState = JSON.parse(JSON.stringify(defaultGameState));
  }

  updateResourceStats();
  calculateCombatStats();
  startTimer();
  updateRaidButton();

  console.log(savedState ? "Loaded saved game." : "Starting a new game.");
}

function startNewGame() {
  localStorage.setItem("antWarsGameState", JSON.stringify(defaultGameState));

  startTimer();
  updateResourceStats();

  console.log("New game started.");
}

function saveGame() {
  localStorage.setItem("antWarsGameState", JSON.stringify(gameState));

  console.log("Game saved.");
}

function loadGame() {
  const savedState = JSON.parse(localStorage.getItem("antWarsGameState"));

  if (savedState) {
    gameState = savedState;
    console.log("Game loaded.");
    updateResourceStats();
  } else {
    console.log("No saved game found.");
  }
}

function calculateCombatStats() {
  const enemyAttack = gameState.playerAntHill.ants.enemy * 5;

  const enemyDefence = gameState.playerAntHill.ants.enemy * 5;

  const playerAttack =
    gameState.playerAntHill.ants.guards * 8 +
    gameState.playerAntHill.ants.warriors * 16 +
    gameState.playerAntHill.ants.workers * 1;

  const playerDefence =
    gameState.playerAntHill.ants.guards * 16 +
    gameState.playerAntHill.ants.warriors * 8 +
    gameState.playerAntHill.ants.workers * 1;

  return { enemyAttack, enemyDefence, playerAttack, playerDefence };
}

function startTimer() {
  setInterval(() => {
    gameState.gameTimer += 1;

    document.getElementById("gameTimer").innerText = gameState.gameTimer;

    everySecondEvents();

    if (gameState.gameTimer % 10 === 0) {
      everyTenSecondEvents();
    }

    if (gameState.gameTimer % 30 === 0) {
      everyThirtySecondEvents();
    }
  }, 1000);

  console.log("Timer Started");
}

function everySecondEvents() {
  gameState.playerAntHill.ants.enemy++;
  gameState.playerAntHill.resources.eggs++;

  const foodGathered =
    gameState.playerAntHill.ants.workers * 10 +
    gameState.playerAntHill.ants.guards * 1 +
    gameState.playerAntHill.ants.warriors * 1;
  gameState.playerAntHill.resources.food += foodGathered;

  console.log(foodGathered + 1 + " food has been gathered");

  updateResourceStats();
  calculateCombatStats();
  updateHatchGuardButton();
  updateHatchWarriorButton();
  updateHatchWorkerButton();
}

function everyTenSecondEvents() {
  const foodCost =
    gameState.playerAntHill.ants.workers * 10 +
    gameState.playerAntHill.ants.guards * 80 +
    gameState.playerAntHill.ants.warriors * 80;
  gameState.playerAntHill.resources.food -= foodCost;

  updateResourceStats();

  console.log(foodCost + 1 + " food has been consumed");
}

function everyThirtySecondEvents() {
  console.log("The Enemy attempted a raid!");
  if (Math.random() < 0.5) {
    console.log("Your defences pushed them back!");
  } else {
    const { enemyAttack, playerDefence } = calculateCombatStats();
    let antLoss = Math.round((10 * enemyAttack) / playerDefence);

    console.log(antLoss + 1 + " ants were killed!");

    const enemyRaidSound = document.getElementById("enemyRaid");
    if (enemyRaidSound) {
      enemyRaidSound.currentTime = 0;
      enemyRaidSound.play();
    }

    while (antLoss > 0) {
      if (
        gameState.playerAntHill.ants.guards > 0 &&
        gameState.playerAntHill.ants.warriors > 0
      ) {
        if (Math.random() < 0.5) {
          gameState.playerAntHill.ants.guards -= 1;
          antLoss -= 1;
        } else {
          gameState.playerAntHill.ants.warriors -= 1;
        }
      } else if (gameState.playerAntHill.ants.guards > 0) {
        gameState.playerAntHill.ants.guards -= 1;

        antLoss -= 1;
      } else if (gameState.playerAntHill.ants.warriors > 0) {
        gameState.playerAntHill.ants.warriors -= 1;

        antLoss -= 1;
      } else {
        gameState.playerAntHill.ants.workers -= 1;

        antLoss -= 1;
      }

      updateResourceStats();
    }
  }

  if (!gameState.raidAvailable) {
    gameState.raidAvailable = true;
    console.log("Raiding is now available!");
    updateRaidButton();
  }
}

function playSound(sound) {
  // if there's no sound, return early
  // effectively ending the function from carrying on
  // this can be used in place of your if statements, eg. if (hatchSound)...
  if (!sound) {
    return;
  }

  // and then all of your sounds are handled the same:
  sound.currentTime = 0;
  sound.play();
}

function hatchGuard() {
  if (gameState.playerAntHill.resources.eggs >= 1) {
    gameState.playerAntHill.ants.guards += 1;
    gameState.playerAntHill.resources.eggs -= 1;
    playSound(hatchingSound);

    console.log("A Guard was hatched!");

    updateResourceStats();
    updateHatchGuardButton();
  } else {
    console.log("No eggs available!");
  }
}

function hatchWarrior() {
  if (gameState.playerAntHill.resources.eggs >= 1) {
    gameState.playerAntHill.ants.warriors += 1;
    gameState.playerAntHill.resources.eggs -= 1;
    playSound(hatchingSound);

    console.log("A Warrior was hatched!");

    updateResourceStats();
    updateHatchWarriorButton();
  } else {
    console.log("No eggs available!");
  }
}

function hatchWorker() {
  if (gameState.playerAntHill.resources.eggs >= 1) {
    gameState.playerAntHill.ants.workers += 1;
    gameState.playerAntHill.resources.eggs -= 1;

    playSound(hatchingSound);
    /* const hatchSound = document.getElementById("hatchingSound");
    if (hatchSound) {
      hatchSound.currentTime = 0;
      hatchSound.play(); */

    console.log("A Worker was hatched!");

    updateResourceStats();
    updateHatchWorkerButton();
  } else {
    console.log("No eggs available!");
  }
}

function raidEnemy() {
  if (gameState.raidAvailable) {
    if (Math.random() < 0.5) {
      console.log("Your attack was repelled!");
    } else {
      const { playerAttack, enemyDefence } = calculateCombatStats();
      let enemyLoss = Math.round((10 * playerAttack) / enemyDefence);

      console.log(enemyLoss + 1 + " enemy ants were killed!");

      while (enemyLoss > 0 && gameState.playerAntHill.ants.enemy > 0) {
        gameState.playerAntHill.ants.enemy -= 1;
        enemyLoss -= 1;
      }
    }

    gameState.raidAvailable = false;
    updateRaidButton();
    playSound(raidSuccess);
  } else {
    console.log("Raiding is not available yet!");
    playSound(raidFailed);
  }
}

function updateRaidButton() {
  const raidButton = document.getElementById("raidEnemy");

  if (gameState.raidAvailable) {
    raidButton.classList.remove("disable");
    raidButton.disabled = false;
  } else {
    raidButton.classList.add("disable");
    raidButton.disabled = true;
  }
}

function updateHatchGuardButton() {
  const hatchGuardButton = document.getElementById("hatchGuard");

  if (gameState.playerAntHill.resources.eggs === 0) {
    hatchGuardButton.classList.add("disable");
    hatchGuardButton.disable = true;
  } else {
    hatchGuardButton.classList.remove("disable");
    hatchGuardButton.disable = false;
  }
}

function updateHatchWarriorButton() {
  const hatchWarriorButton = document.getElementById("hatchWarrior");

  if (gameState.playerAntHill.resources.eggs === 0) {
    hatchWarriorButton.classList.add("disable");
    hatchWarriorButton.disable = true;
  } else {
    hatchWarriorButton.classList.remove("disable");
    hatchWarriorButton.disable = false;
  }
}

function updateHatchWorkerButton() {
  const hatchWorkerButton = document.getElementById("hatchWorker");

  if (gameState.playerAntHill.resources.eggs === 0) {
    hatchWorkerButton.classList.add("disable");
    hatchWorkerButton.disable = true;
  } else {
    hatchWorkerButton.classList.remove("disable");
    hatchWorkerButton.disable = false;
  }
}

document.addEventListener("DOMContentLoaded", () => {
  initializeGameState();

  const buttons = document.querySelectorAll("button");
  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      button.classList.add("pop");
      setTimeout(() => button.classList.remove("pop"), 200);
    });
  });

  const hatchGuardButton = document.getElementById("hatchGuard");
  hatchGuardButton.addEventListener("click", hatchGuard);

  const hatchWarriorButton = document.getElementById("hatchWarrior");
  hatchWarriorButton.addEventListener("click", hatchWarrior);

  const hatchWorkerButton = document.getElementById("hatchWorker");
  hatchWorkerButton.addEventListener("click", hatchWorker);

  const raidEnemyButton = document.getElementById("raidEnemy");
  raidEnemyButton.addEventListener("click", raidEnemy);

  const hatchingSound = document.getElementById("hatchingSound");
  

  const raidSuccess = document.getElementById("raidSuccess");
  

  const raidFailed = document.getElementById("raidFailed");
  
});

//         const loss = Math.round(10 * enemyAttack / playerDefence);

//             let antsToKill = loss;,

//             while (loss > 0)

//                 if (guards > 0 & warriors > 0) {

//                     if (Math.random() < 0.5) {

//                         guards -= 1;
//                         loss -= 1;

//                     } else {
//                         warriors -= 1;
//                         loss -= 8;
//                     }

//                 } else if (guards > 0) {

//                     guards -= 1;
//                     loss -= 8;

//                 } else if (warriors > 0) {

//                     warriors -= 1;
//                     loss -= 8;

//                 } else if (workers > 0) {
//                     workers -= 1;
//                     loss -= 1;

//                 } else {
//                     break;
//                 }
//             }

//  function Hatchant() {

//         case 'Hatch Worker':

//       if (player.eggs <= 0) {
//         break;}

//         else {
//             guards += 1;
//             eggs -= 1;
//         break;}

//         case 'Hatch Warrior':

//       if (player.eggs <= 0) {
//         break;}

//         else {
//             warriors += 1;
//             eggs -= 1;
//         break;}

//         case 'Hatch Guard':

//       if (player.eggs <= 0) {
//         break;}

//         else {
//             workers += 1;
//             eggs -= 1;
//         break;}

//     }

//  function raidTimer ()
//     setInterval() {
//     if (Math.random() < 0.5) {

//         const enemyAttack = enemyants * 5

//         playerDefence = guards * 16 + warriors * 8 + workers * 1

//         const loss = Math.round(10 * enemyAttack / playerDefence);

//             let antsToKill = loss;,

//             while (loss > 0)

//                 if (guards > 0 & warriors > 0) {

//                     if (Math.random() < 0.5) {

//                         guards -= 1;
//                         loss -= 1;

//                     } else {
//                         warriors -= 1;
//                         loss -= 8;
//                     }

//                 } else if (guards > 0) {

//                     guards -= 1;
//                     loss -= 8;

//                 } else if (warriors > 0) {

//                     warriors -= 1;
//                     loss -= 8;

//                 } else if (workers > 0) {
//                     workers -= 1;
//                     loss -= 1;

//                 } else {
//                     break;
//                 }
//             }

//         }

//         updatePlayerStats();
//     }, 30000);

//  }

//  function foodCostTimer (){

//     setInterval() {

//         const foodCost = workers * 1 + guards * 8 + warriors * 8;)

//         food -= Math.floor(foodCost);

//         if food < 0

//         let foodDeficit = food

//         while (foodDeficit > 0)

//             if (guards > 0 & warriors > 0) {

//                 if (Math.random() < 0.5) {

//                     guards -= 1;
//                     foodDeficit -= 8;

//                 } else {
//                     warriors -= 1;
//                     foodDeficit -= 8;
//                 }

//             } else if (guards > 0) {

//                 guards -= 1;
//                 foodDeficit -= 8;

//             } else if (warriors > 0) {

//                 warriors -= 1;
//                 foodDeficit -= 8;

//             } else if (workers > 0) {
//                 workers -= 1;
//                 foodDeficit -= 1;

//             } else {
//                 break;
//             }
//         }
//         gameState.playerAntHill.resources.food = 0;
//     }

//     updatePlayerStats();
// }, 10000);

//     }
//  }

// function foodGathheringTimer  {

//     setInterval(){

//         const foodGathered = workers * 1 + guards * 0.1 warriors * 0.1;)

//         food += Math.floor(foodGathered);

//         updatePlayerStats();

//         1000);
//     }

// }

// function Layegg  {

//     setInterval(gameState.playerAntHill.resources.eggs++; 1000)

// }

/* 


 Colony population and stats:

    Every second, one egg is added to players egg inventory.

    Hatching an ant cost one egg.

    Every living ant is counted towards population

    Killed ants are removed from population.


    Populatin cannot exceed 999.

    if a Worker type ant is hatched, one ant is created with the following stats:

    Attack: 1
    Defence: 1
    Food gathering: 1 food per second 
    Food cost: 1

    if a Guard type ant is hatched, one ant is created with the following stats:

    Attack: 8
    Defence: 16
    Food gathering: 1/10 food per second 
    Food cost: 8

    if a Warrior type ant is hatched, one ant is created with the following stats:

    Attack: 16
    Defence: 8
    Food gathering: 1/10 food per second 
    Food cost: 8


    Colony's Attack, Defence, Food Gathering, and Food Cost stats, are the sum of the individual (living) ants stats combined.


 Food system:

    Gathering

        Food is gathered every second and added to food store.

        The total food gathered each second is equal to the sum of all colonys ants food gathering stats. 

        Food can be gathered in fractions, but only the floor of the number appears to the player.

    

    Food costs


        Every 10 seconds food is deducted from food store. 

        Fractions are ignored. Only the floor of the number is used. 

        Food deducted is equal to the sum of food cost stat of all colonys ants.

        If food cost is greater than the food stores, ants will die based on the food deficit.

        Ex. Food store is 23, and food cost is 97, there is a 74 food cost deficit. 

        Ants will die randomly until the food cost of dead ants is greater to or equal the food cost deficit.

        Guard and Warrior ants die before Worker ants. 

        If the population of Guard and Warrior ants equal zero, food shortage will then affect Worker ants.

        ex. 

        In a population distribution of:

            25 Workers 
            5 Guards
            4 Warriors

        4 Warrior and 5 Guard ants die = 72 food cost.

        food deficit is now 2.

        2 Worker ants now die. = 2 food cost

        Food deficit is equal to food cost of dead ants. 

        Population is now:

            23 Workers 
            0 Guards
            0 Warriors




     Enemy colony:

        The enemy adds to their population at one per 1.5 second.

        Enemy ants have individual stats are randomly generated. 

        Individual enemy ants total stats have a minimum of 5 and a maximum of 8. 

        ex. An enemy ant could have 3 attack and 5 defence, while the next could have 4 attack and 1 defence.

        Enemy colony's Attack and Defence stats are the sum of the individual ants stats combined.

        Food is not a factor for the enemy. 

        


     Raiding:

        Every thirty seconds the enemy will attempt to raid you.

        There is a 50% chance their raid will fail.

        If their raid is sucessful, it will kill your ants.

        Loss = 10 x Enemy Attack / Players Defence

        Loss rounds to nearest natural number.

        Guard and Warrior ants die before Worker ants. 

        If the population of Guard and Warrior ants equal zero, Worker ants would then die.

            Ex. 
                Player has 276 Defence

                Enemy has 198 Attack
                
                10 x 198/276 = 7.1

                7.1 rounds down to 7

                7 ants die
        
        

        The player has the ability to raid the enemy in the same way every 30 seconds by pressing a button.

        
        
     Victory:

        Victory is acheived when Enemy colony's population equals zero.

        or

        Victory is acheived if you reach 999 population before the enemy.

    Defeat

        The Enemy's population reaching 999 will result in defeat.

        or

        Your population reaching zero, due to either food shortage or enemy raid will result in defeat. */
