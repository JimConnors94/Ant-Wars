let isTimerRunning = true;
let timerInterval;

const defaultGameState = {
  gameTimer: 0,
  raidAvailable: false,
  spiderInCamp: false,
  encounteredCharacters: [],

  playerAntHill: {
    resources: {
      eggs: 0,
      sticks: 0,
      food: 0,
      shinyRocks: 0,
    },
    ants: {
      workers: 15,
      warriors: 10,
      guards: 10,
      enemy: 50,
    },
  },
  scores: {
    battleLog: [],
    enemyKilled: 0,
    highestPopulation: 0,
  },
};

let gameState = {};

const characters = [
  {
    name: "Angoliant the Terrible",
    icon: "img/spider.png",
    music: "audio/spiderMusic.wav",
    text: "While out on patrol, a troop of 10 warrior ants encounter a terrifying beast of a spider! They cower in fear, waiting for the monster to rip them apart... But it appears the spider wishes to speak?",
    responses: [
      {
        text: "What do you want with us, spider?",
        next: {
          name: "Angoliant the Terrible",
          icon: "img/spider.png",
          text: "Greetings, small tasty one! No no! Do not run! For an offer Angoliant has...",
          responses: [
            {
              text: "What is your offer?",
              next: {
                name: "Angoliant the Terrible",
                icon: "img/spider.png",
                text: "Your kind is so tasty, but chasing you down is tiresome. Angoliant understands you are at war, Angoliant can provide you with power that would be... indispensable for your war effort... All Angoliant asks for in return, is but for a few of your worthy selves to sacrifice themselves, to the greater good of your colony...",
                responses: [
                  {
                    text: "By sacrifice, you mean you expect us to let you eat us?!",
                    next: {
                      name: "Angoliant the Terrible",
                      icon: "img/spider.png",
                      text: "Ah, you understand perfectly. Wonderful. Yes, Angoliant will give you the tools to destroy your Enemy, and in return, some of you will sacrifice your delicious flesh to Angoliant. Believe what Angoliant says, for with Angoliant's power, many more of your puny lives will be saved from this war.",
                      responses: [
                        {
                          text: "We Ants would never agree to such a hideous deal! Ants do not fear death, but we will never die without honor!",
                          next: {
                            name: "Angoliant the Terrible",
                            icon: "img/spider.png",
                            text: "Foolish Ants... Die with your honor then! Prepare yourselves...",
                            responses: [
                              {
                                text: "Stand your ground! We fight to the last ant!",
                                action: spiderAttack,
                              },
                            ],
                          },
                        },
                        {
                          text: "You ask for far too much, Angoliant... but compared to the war with the Enemy... even you are the lesser of two evils. The Ants will accept your evil bargain.",
                          next: {
                            name: "Angoliant the Terrible",
                            icon: "img/spider.png",
                            text: "Yessssss... good, good... Angoliant will tell you the location of Angoliant's secret lair. When you are ready, come to Angoliant with your sacrifices! Hahahahaha!",
                            responses: [
                              {
                                text: "We will do what must be done... for the colony.",
                                action: spiderInCamp,
                              },
                            ],
                          },
                        },
                      ],
                    },
                  },
                  {
                    text: "I don't like where this is going... Ants! Attack!",
                    next: {
                      name: "Angoliant the Terrible",
                      icon: "img/spider.png",
                      text: "Then so be it. Angoliant has more fun this way anyways!",
                      responses: [
                        {
                          text: "Charge!",
                          action: spiderAttack,
                        },
                      ],
                    },
                  },
                ],
              },
            },
            {
              text: "We don't trust you! And we would rather die fighting!",
              next: {
                name: "Angoliant the Terrible",
                icon: "img/spider.png",
                text: "Fools. You die pointlessly.",
                responses: [
                  {
                    text: "Then we die as warriors!",
                    action: spiderAttack,
                  },
                ],
              },
            },
          ],
        },
      },
      {
        text: "We do not fear you, foul beast! Everyone attack!",
        next: {
          name: "Angoliant the Terrible",
          icon: "img/spider.png",
          text: "Brave but foolish. None can stand against Angoliant.",
          responses: [
            {
              text: "To battle!",
              action: spiderAttack,
            },
          ],
        },
      },
      {
        text: "S-s-s-SPIDER! RUN!",
        next: {
          name: "Angoliant the Terrible",
          icon: "img/spider.png",
          text: "Cowards! No one escapes from Angoliant!",
          responses: [
            {
              text: "Scatter!",
              action: spiderAttack,
            },
          ],
        },
      },
    ],
  },
  {
    name: "Heracles the Mighty",
    icon: "img/beetle.png",
    music: "audio/beetleMusic.wav",
    text: "A large, muscular beetle approaches the ant hill... He says he wishes to speak to the queen...",
    responses: [
      {
        text: "What do you want with our Queen?",
        next: {
          name: "Heracles the Mighty",
          icon: "img/beetle.png",
          text: "Hello friend! Allow me to introduce myself! Professionally I am known as 'The World's Strongest Beetle In The Entire World'! But you can just call me Heracles: 'The Mightiest One'!",
          responses: [
            {
              text: "Uh huh...",
              next: {
                name: "Heracles the Mighty",
                icon: "img/beetle.png",
                text: "Anyways... To become even stronger, I need protein! Ant eggs are so legendary full of protein, I believe they can give even more amazing muscles! So I will trade your Queen many sticks for her eggs!",
                responses: [
                  {
                    text: "What? That's so messed up! Our eggs aren't for sale! No way! Get outta here now!",
                    next: {
                      name: "Heracles the Mighty",
                      icon: "img/beetle.png",
                      text: "I-is that s-so... b-but what about my... my gains!!! Wahhhh!",
                      responses: [
                        {
                          text: "That's right, scram!",
                          action: heraclesCrying,
                        },
                      ],
                    },
                  },
                  {
                    text: "Sticks you say? I think an arrangement could be made...",
                    next: {
                      name: "Heracles the Mighty",
                      icon: "img/beetle.png",
                      text: "Hurrah! I will be working out over here! Bring me all the eggs you can!",
                      responses: [
                        {
                          text: "Alright, deal.",
                          action: heraclesInCamp,
                        },
                      ],
                    },
                  },
                ],
              },
            },
          ],
        },
      },
    ],
  },
];

function openSpecialEvent() {
  if (Math.random() < 0.5) {
    const availableCharacters = characters.filter(
      (char) => !gameState.encounteredCharacters.includes(char.name)
    );

    if (availableCharacters.length > 0) {
      const randomChar =
        availableCharacters[
          Math.floor(Math.random() * availableCharacters.length)
        ];
      gameState.encounteredCharacters.push(randomChar.name);

      const eventPopup = document.getElementById("eventPopup");
      const dialogueName = document.getElementById("dialogue-name");
      const dialogueText = document.getElementById("dialogue-text");
      const dialogueOptions = document.getElementById("dialogue-options");
      const characterIcon = document.getElementById("characterIcon"); // Get the icon element

      // Function to display dialogue and options
      const displayDialogue = (dialogue) => {
        dialogueName.textContent = dialogue.name;
        dialogueText.textContent = dialogue.text;

        // Update the character icon
        characterIcon.src = dialogue.icon; // Set the src attribute
        characterIcon.alt = `${dialogue.name} icon`; // Update the alt text

        dialogueOptions.innerHTML = "";

        if (dialogue.responses) {
          dialogue.responses.forEach((response) => {
            const button = document.createElement("button");
            button.textContent = response.text;
            button.addEventListener("click", () => {
              if (response.action) {
                response.action();
                setTimeout(() => {
                  closeSpecialEvent();
                }, 500);
              } else if (response.next) {
                displayDialogue(response.next);
              } else {
                closeSpecialEvent();
              }
            });
            dialogueOptions.appendChild(button);
          });
        }
      };

      // Start the dialogue
      displayDialogue(randomChar);

      eventPopup.style.display = "flex";
      pauseTimer();
      playSound(randomChar.music);
    }
  }
}

function closeSpecialEvent() {
  const eventPopup = document.getElementById("eventPopup");
  eventPopup.style.display = "none";
  resumeTimer();
}

function tradeEggsForSticks() {
  if (gameState.playerAntHill.resources.eggs >= 1) {
    gameState.playerAntHill.resources.eggs -= 1;
    gameState.playerAntHill.resources.sticks += 10;
    addToLog("You traded an egg for 10 sticks.");
  } else {
    addToLog("Not enough eggs to trade.");
  }
  updateResourceStats();
}

function spiderAttack() {
  gameState.playerAntHill.ants.warriors -= 10;
  if (gameState.playerAntHill.ants.warriors < 0) {
    gameState.playerAntHill.ants.warriors = 0;
  }
  updateResourceStats();
  addToLog("In only a fraction of a second, Angoliant ripped apart and ate all 10 of the warrior ants!");
  document.getElementById("workerCount").textContent =
    gameState.playerAntHill.ants.workers;
  closeSpecialEvent();
}

function heraclesCrying() {
  gameState.playerAntHill.resources.sticks += 10;

  addToLog("Heracles ran away crying... But he dropped some sticks!");
  closeSpecialEvent();
}

function spiderInCamp() {
  addToLog(
    "We may have made a deal with the devil today... But if it gives us the power to crush the Enemy, then so be it."
  );
  if (!gameState.spiderInCamp) {
    gameState.spiderInCamp = true;
    closeSpecialEvent();
  }
}
function heraclesInCamp() {
  if (!gameState.heraclesInCamp) {
    gameState.heraclesInCamp = true;
    closeSpecialEvent();
  }
}

function updateResourceStats() {
  document.getElementById("eggCount").textContent =
    gameState.playerAntHill.resources.eggs;

  document.getElementById("stickCount").textContent =
    gameState.playerAntHill.resources.sticks;

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

function openRules() {
  document.getElementById("rulesPopup").style.display = "flex";
  pauseTimer();
}

function closeRules() {
  document.getElementById("rulesPopup").style.display = "none";
  resumeTimer();
}

function openShop() {
  document.getElementById("shopPopup").style.display = "flex";
  pauseTimer();
}


function closeShop() {
  document.getElementById("shopPopup").style.display = "none";
  resumeTimer();
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
  if (!timerInterval) {
    // Prevent multiple intervals from being created
    timerInterval = setInterval(() => {
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

  openSpecialEvent();
  updateResourceStats();
  calculateCombatStats();
  updateHatchGuardButton();
  updateHatchWarriorButton();
  updateHatchWorkerButton();
  checkVictory();
  checkDefeat();
}

function checkVictory() {
  if (gameState.playerAntHill.ants.enemy <= 0) {
    triggerVictory();
  }
}

function checkDefeat() {
  if (
    gameState.playerAntHill.ants.workers <= 0 &&
    gameState.playerAntHill.ants.warriors <= 0 &&
    gameState.playerAntHill.ants.guards <= 0
  ) {
    triggerDefeat();
  }
  if (gameState.playerAntHill.ants.enemy >= 999) {
    triggerDefeat();
  }
}

function triggerVictory() {
  addToLog("Victory! You have defeated all enemy ants!");
  pauseTimer();
}

function triggerDefeat() {
  addToLog("Defeat! All your ants have been eliminated.");
  pauseTimer();
}

function everyTenSecondEvents() {
  const sticksGathered = gameState.playerAntHill.ants.workers * 1;

  gameState.playerAntHill.resources.sticks += sticksGathered;

  console.log(sticksGathered + 1 + " sticks has been gathered");
  const foodCost =
    gameState.playerAntHill.ants.workers * 10 +
    gameState.playerAntHill.ants.guards * 80 +
    gameState.playerAntHill.ants.warriors * 80;

  if (gameState.playerAntHill.resources.food >= foodCost) {
    gameState.playerAntHill.resources.food -= foodCost;
  } else {
    let deficit = foodCost - gameState.playerAntHill.resources.food;
    gameState.playerAntHill.resources.food = 0;
    let warriorsDied = 0;
    let guardsDied = 0;
    let workersDied = 0;

    while (deficit > 0) {
      if (
        gameState.playerAntHill.ants.guards > 0 &&
        gameState.playerAntHill.ants.warriors > 0
      ) {
        if (Math.random() < 0.5) {
          gameState.playerAntHill.ants.guards -= 1;
          deficit -= 80;
          guardsDied += 1;
        } else {
          gameState.playerAntHill.ants.warriors -= 1;
          deficit -= 80;
          warriorsDied += 1;
        }
      } else if (gameState.playerAntHill.ants.guards > 0) {
        gameState.playerAntHill.ants.guards -= 1;
        deficit -= 80;
        guardsDied += 1;
      } else if (gameState.playerAntHill.ants.warriors > 0) {
        gameState.playerAntHill.ants.warriors -= 1;
        deficit -= 80;
        warriorsDied += +1;
      } else if (gameState.playerAntHill.ants.workers > 0) {
        gameState.playerAntHill.ants.workers -= 1;
        deficit -= 10;
        workersDied += +1;
      } else {
        break;
      }
    }
    console.log(
      `Famine has struck! ${guardsDied} Guards, ${warriorsDied} Warriors, and ${workersDied} Workers died.`
    );

    addToLog("Famine has struck!");

    if (warriorsDied >= 1) {
      addToLog(`${warriorsDied} warriors have starved to death`);
    }

    if (guardsDied >= 1) {
      addToLog(`${guardsDied} guards have starved to death`);
    }

    if (workersDied >= 1) {
      addToLog(`${workersDied} workers have starved to death`);
    }
  }

  updateResourceStats();

  console.log(foodCost + 1 + " food has been consumed");
}

function everyThirtySecondEvents() {
  console.log("The Enemy attempted a raid!");
  addToLog("The Enemy attempted a raid!");
  if (Math.random() < 0.5) {
    console.log("Your defences pushed them back!");
    addToLog("Your defences pushed them back!");
  } else {
    const { enemyAttack, playerDefence } = calculateCombatStats();
    let antLoss = Math.round((10 * enemyAttack) / playerDefence);

    playSound(enemyRaid);
    console.log(antLoss + 1 + " ants were killed!");
    addToLog(antLoss + 1 + " ants were killed!");

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
  if (!sound) {
    return;
  }
  sound.currentTime = 0;
  sound.play();
}

function pauseTimer() {
  if (isTimerRunning) {
    clearInterval(timerInterval);
    timerInterval = null;
    isTimerRunning = false;
    console.log("Timer Paused");
  }
}
function resumeTimer() {
  if (!isTimerRunning) {
    isTimerRunning = true;
    startTimer();
    console.log("Timer Resumed");
  }
}

function addToLog(message) {
  const logArea = document.getElementById("logArea");

  const logEntry = document.createElement("div");
  logEntry.textContent = message;

  logArea.appendChild(logEntry);

  logArea.scrollTop = logArea.scrollHeight;
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
      addToLog("Your attack was repelled!");

      playSound(raidFailed);
    } else {
      const { playerAttack, enemyDefence } = calculateCombatStats();
      let enemyLoss = Math.round((10 * playerAttack) / enemyDefence);

      console.log(enemyLoss + 1 + " enemy ants were killed!");
      addToLog("You raided your enemy!");
      addToLog(enemyLoss + 1 + " enemy ants were killed!");

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
