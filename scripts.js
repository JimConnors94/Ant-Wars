let isTimerRunning = true;
let timerInterval;

const defaultGameState = {
  gameTimer: 0,
  raidAvailable: false,
  spiderInCamp: false,
  mantisInCamp: false,
  encounteredCharacters: [],
  attackUpgrades: 0,
  defenceUpgrades: 0,

  test: 1,

  attackMultiplier: 1,
  defenceMultiplier: 1,
  enemyAttackMultiplier: 1,
  enemyDefenceMultiplier: 1,

  spiderVenom: false,

  playerAntHill: {
    resources: {
      eggs: 0,
      sticks: 100000,
      food: 10000,
      shinyRocks: 0,
    },
    ants: {
      workers: 150,
      warriors: 0,
      guards: 500,
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

function initializeGameState() {
  const savedState = localStorage.getItem("antWarsGameState");

  if (savedState) {
    gameState = JSON.parse(savedState);
  } else {
    gameState = JSON.parse(JSON.stringify(defaultGameState));
  }

  updateResourceStats();
  calculateCombatStats();
  updateRaidButton();
  startTimer();
  menuButtonOn();
  updateUpgradeMenu();

  console.log(savedState ? "Loaded saved game." : "Starting a new game.");
}

function openSpecialEvent() {
  if (Math.random() < 0.9) {
    const availableCharacters = characters.filter((char) => {
      const encounterCount = gameState.encounteredCharacters[char.name] || 0;
      const canAppear = encounterCount < char.encounters.length;

      // For Mantissa, only allow her to appear if Mantis is in the camp
      if (char.name === "Mantissa the Fierce") {
        return canAppear && gameState.mantisInCamp;
      }

      return canAppear;
    });

    if (availableCharacters.length > 0) {
      const randomChar =
        availableCharacters[
          Math.floor(Math.random() * availableCharacters.length)
        ];
      gameState.encounteredCharacters.push(randomChar.name);

      const encounterCount =
        gameState.encounteredCharacters[randomChar.name] || 0;
      gameState.encounteredCharacters[randomChar.name] = encounterCount + 1;

      const eventPopup = document.getElementById("eventPopup");
      const dialogueName = document.getElementById("dialogue-name");
      const dialogueText = document.getElementById("dialogue-text");
      const dialogueOptions = document.getElementById("dialogue-options");
      const characterIcon = document.getElementById("characterIcon");

      const displayDialogue = (dialogue) => {
        dialogueName.textContent = randomChar.name;
        dialogueText.textContent = dialogue.text;

        characterIcon.src = randomChar.icon;
        characterIcon.alt = `${randomChar.name} icon`;

        dialogueOptions.innerHTML = "";

        if (dialogue.responses) {
          dialogue.responses.forEach((response) => {
            const button = document.createElement("button");
            button.textContent = response.text;
            button.addEventListener("click", () => {
              if (response.action) {
                response.action();
                setTimeout(() => {
                  closeMenu("eventPopup");
                }, 500);
              } else if (response.next) {
                displayDialogue(response.next);
              } else {
                closeMenu("eventPopup");
              }
            });
            dialogueOptions.appendChild(button);
          });
        }
      };

      displayDialogue(randomChar.encounters[encounterCount]);

      eventPopup.style.display = "flex";
      pauseTimer();
    }
  }
}

function mantissaFindsMantis() {
  if (gameState.mantisInCamp) {
    gameState.mantisInCamp = false;
    gameState.mantissaInCamp = true;
    addToLog(
      "Mantissa found Mantis and dragged him away. Maybe we should check on him later..."
    );
    closeMenu("eventPopup");
  }
}

function mantissaAttack() {
  const { enemyAttack, playerDefence } = calculateCombatStats();
  let antLoss = Math.round(10000 / playerDefence);

  playSound(enemyRaid);
  addToLog("Mantissa attacked your colony in a fit of rage!");
  addToLog(`${antLoss + 1} ants were killed!`);

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
  }

  closeMenu("eventPopup");
}

function spiderAttack() {
  gameState.playerAntHill.ants.warriors -= 10;
  if (gameState.playerAntHill.ants.warriors < 0) {
    gameState.playerAntHill.ants.warriors = 0;
  }
}

function heraclesInCamp() {
  gameState.heraclesInCamp = true;
  addToLog(
    "Heracles the Mighty has joined your camp. He will trade sticks for ant eggs."
  );
  closeMenu("heraclesPopup");
}

function heraclesCrying() {
  addToLog(
    "Heracles is crying because you rejected his offer. He leaves in disappointment."
  );
  closeMenu("heraclesPopup");
}

function tradeEggsForSticks() {
  if (gameState.playerAntHill.resources.eggs >= 10) {
    gameState.playerAntHill.resources.eggs -= 10;
    gameState.playerAntHill.resources.sticks += 100;
    addToLog("You traded 10 eggs for 100 sticks with Heracles.");
  } else {
    addToLog("Not enough eggs to trade with Heracles.");
  }
  updateResourceStats();
}

function mantisInCamp() {
  gameState.mantisInCamp = true;
  addToLog(
    "Mantis the Elusive has joined your camp. He will teach your warriors advanced techniques."
  );
  closeMenu("eventPopup");
}

function mantisFlees() {
  addToLog("Mantis the Elusive flees in panic...");
  closeMenu("eventPopup");
}

function caterpillarInCamp() {
  gameState.caterpillarInCamp = true;
  addToLog(
    "Caterpillar the Silkweaver has joined your camp. She will trade silk for food."
  );
  closeMenu("eventPopup");
}

function caterpillarLeaves() {
  addToLog(
    "Caterpillar the Silkweaver leaves, disappointed by your rejection."
  );
  closeMenu("eventPopup");
}

function spiderInCamp() {
  gameState.spiderInCamp = true;
  addToLog(
    "Angoliant the Terrible has told you the location of her dark liar... She will provide power in exchange for sacrifices."
  );
  closeMenu("eventPopup");
}

function openMenu(menuId) {
  if (menuId === "menuPopup") {
    document.getElementById("menuPopup").style.display = "flex";
    menuButtonOn();
  }

  if (menuId === "merchantPopup") {
    document.getElementById("merchantPopup").style.display = "flex";

    const merchantPopup = document.getElementById("merchantPopup");
    merchantPopup.innerHTML = "";

    // Add Angoliant the Terrible
    if (gameState.spiderInCamp) {
      const spiderButton = document.createElement("button");
      spiderButton.textContent = "Angoliant the Terrible";
      spiderButton.onclick = () => openMenu("spiderPopup");
      merchantPopup.appendChild(spiderButton);
    }

    // Add Heracles the Mighty
    if (gameState.heraclesInCamp) {
      const heraclesButton = document.createElement("button");
      heraclesButton.textContent = "Heracles the Mighty";
      heraclesButton.onclick = () => openMenu("heraclesPopup");
      merchantPopup.appendChild(heraclesButton);
    }

    // Add Mantis the Elusive
    if (gameState.mantisInCamp) {
      const mantisButton = document.createElement("button");
      mantisButton.textContent = "Mantis the Elusive";
      mantisButton.onclick = () => openMenu("mantisPopup");
      merchantPopup.appendChild(mantisButton);
    }

    // Add Mantissa the Fierce
    if (gameState.mantissaInCamp) {
      const mantissaButton = document.createElement("button");
      mantissaButton.textContent = "Mantissa the Fierce";
      mantissaButton.onclick = () => openMenu("mantissaPopup");
      merchantPopup.appendChild(mantissaButton);
    }

    // Add Caterpillar the Silkweaver
    if (gameState.caterpillarInCamp) {
      const caterpillarButton = document.createElement("button");
      caterpillarButton.textContent = "Caterpillar the Silkweaver";
      caterpillarButton.onclick = () => openMenu("caterpillarPopup");
      merchantPopup.appendChild(caterpillarButton);
    }

    const closeButton = document.createElement("button");
    closeButton.textContent = "Close";
    closeButton.onclick = () => closeMenu("merchantPopup");
    merchantPopup.appendChild(closeButton);

    pauseTimer();
  }

  if (menuId === "shopPopup") {
    document.getElementById("shopPopup").style.display = "flex";
    pauseTimer();
    menuButtonOn();
  }

  if (menuId === "spiderPopup") {
    if (gameState.spiderInCamp) {
      document.getElementById("spiderPopup").style.display = "flex";
    }
    closeMenu("shopPopup");
  }

  if (menuId === "heraclesPopup") {
    if (gameState.heraclesInCamp) {
      document.getElementById("heraclesPopup").style.display = "flex";
    }
    closeMenu("shopPopup");
  }

  if (menuId === "mantisPopup") {
    if (gameState.mantisInCamp) {
      document.getElementById("mantisPopup").style.display = "flex";
    }
    closeMenu("shopPopup");
  }

  if (menuId === "mantissaPopup") {
    if (gameState.mantissaInCamp) {
      document.getElementById("mantissaPopup").style.display = "flex";
    }
    closeMenu("shopPopup");
  }

  if (menuId === "caterpillarPopup") {
    if (gameState.caterpillarInCamp) {
      document.getElementById("caterpillarPopup").style.display = "flex";
    }
    closeMenu("shopPopup");
  }

  if (menuId === "savedGamesPopup") {
    const savedGamesPopup = document.getElementById("savedGamesPopup");
    const savedGamesList = document.getElementById("savedGamesList");
    savedGamesList.innerHTML = "";

    const savedGames =
      JSON.parse(localStorage.getItem("antWarsSavedGames")) || [];

    savedGames.forEach((game, index) => {
      const gameItem = document.createElement("div");
      gameItem.className = "saved-game-item";

      const loadButton = document.createElement("button");
      loadButton.textContent = `Load: ${game.name || `Game ${index + 1}`}`;
      loadButton.onclick = () => loadSavedGame(index);
      gameItem.appendChild(loadButton);

      const deleteButton = document.createElement("button");
      deleteButton.textContent = "Delete";
      deleteButton.onclick = () => {
        saveGameIndexToDelete = index; // Set the index to delete
        openMenu("deleteConfirmationPopup"); // Open the confirmation popup
      };
      gameItem.appendChild(deleteButton);

      savedGamesList.appendChild(gameItem);
    });

    savedGamesPopup.style.display = "flex";
    pauseTimer();
  }

  if (menuId === "rulesPopup") {
    document.getElementById("rulesPopup").style.display = "flex";
  }

  if (menuId === "nameSavePopup") {
    document.getElementById("nameSavePopup").style.display = "flex";
  }

  if (menuId === "deleteConfirmationPopup") {
    document.getElementById("deleteConfirmationPopup").style.display = "flex";
  }

  if (menuId === "newGameConfirmationPopup") {
    document.getElementById("newGameConfirmationPopup").style.display = "flex";
  }

  if (menuId === "upgradesPopup") {
    document.getElementById("upgradesPopup").style.display = "flex";
    updateUpgradeMenu();
  }

  if (menuId === "eventPopup") {
    document.getElementById("eventPopup").style.display = "flex";
  }
}

function closeMenu(menuId) {
  const doc = document.getElementById(menuId);

  if (!doc) {
    return;
  }

  document.getElementById(menuId).style.display = "none";

  if (menuId === "eventPopup") {
    resumeTimer();
  }

  if (menuId === "merchantPopup") {
    document.getElementById("shopPopup").style.display = "flex";
  }

  if (menuId === "shopPopup") {
    resumeTimer();
    menuButtonOff();
  }

  if (menuId === "deleteConfirmationPopup") {
    saveGameIndexToDelete = null;
  }

  if (menuId === "menuPopup") {
    resumeTimer();
    menuButtonOff();
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

function calculateCombatStats() {
  let enemyBaseAttack = gameState.playerAntHill.ants.enemy * 5;
  let enemyBaseDefence = gameState.playerAntHill.ants.enemy * 5;

  const enemyDefence = enemyBaseDefence * gameState.enemyDefenceMultiplier;
  const enemyAttack = enemyBaseAttack * gameState.enemyAttackMultiplier;

  let baseAttack =
    gameState.playerAntHill.ants.guards * 8 +
    gameState.playerAntHill.ants.warriors * 16 +
    gameState.playerAntHill.ants.workers * 1;

  let baseDefence =
    gameState.playerAntHill.ants.guards * 16 +
    gameState.playerAntHill.ants.warriors * 8 +
    gameState.playerAntHill.ants.workers * 1;

  const playerDefence = baseDefence * gameState.defenceMultiplier;
  const playerAttack = baseAttack * gameState.attackMultiplier;

  return { enemyAttack, enemyDefence, playerAttack, playerDefence };
}

function upgradeAttack() {
  let attackLevel = gameState.attackUpgrades;
  let nextLevel = attackLevel + 1;
  let cost = 100 * nextLevel;
  console.log(cost);
  console.log(nextLevel);
  console.log(attackLevel);
  console.log(gameState.enemyAttackMultiplier);
  console.log(gameState.attackUpgrades);
  console.log(gameState.test);

  if (gameState.playerAntHill.resources.sticks >= cost && nextLevel <= 10) {
    gameState.attackMultiplier += 0.5;
    gameState.attackUpgrades += 1;
    gameState.playerAntHill.resources.sticks -= cost;

    console.log(`Attack increased to Level ${nextLevel}!`);

    updateUpgradeMenu();
    calculateCombatStats();
  } else if (nextLevel > 10) {
    console.log("Maximum attack level reached!");
  } else {
    console.log("Not enough sticks available!");
  }
}
function upgradeDefence() {
  const nextLevel = gameState.defenceUpgrades + 1;
  const cost = 100 * nextLevel;

  if (gameState.playerAntHill.resources.sticks >= cost && nextLevel <= 10) {
    gameState.defenceMultiplier += 0.5;
    gameState.defenceUpgrades += 1;
    gameState.playerAntHill.resources.sticks -= cost;

    console.log(`Defence increased to Level ${nextLevel}!`);

    updateUpgradeMenu();
    calculateCombatStats();
  } else if (nextLevel > 10) {
    console.log("Maximum defence level reached!");
  } else {
    console.log("Not enough sticks available!");
  }
}

function updateUpgradeMenu() {
  const attackUpgrades = gameState.attackUpgrades || 0;
  const defenceUpgrades = gameState.defenceUpgrades || 0;

  console.log("Attack Upgrades:", attackUpgrades);
  console.log("Defence Upgrades:", defenceUpgrades);
  console.log(gameState.playerAntHill.resources.sticks);

  // Update Attack Buttons
  for (let i = 1; i <= 10; i++) {
    const attackButton = document.getElementById(`attackLevel${i}`);
    if (attackButton) {
      if (i <= attackUpgrades) {
        attackButton.textContent = `Level ${i} (Purchased)`;
        attackButton.disabled = true;
      } else if (i === attackUpgrades + 1) {
        attackButton.textContent = `Level ${i} (Cost: ${100 * i} sticks)`;
        attackButton.disabled = false;
      } else {
        attackButton.textContent = `Level ${i} (Locked)`;
        attackButton.disabled = true;
      }
    }
  }

  for (let i = 1; i <= 10; i++) {
    const defenceButton = document.getElementById(`defenceLevel${i}`);
    if (defenceButton) {
      if (i <= defenceUpgrades) {
        defenceButton.textContent = `Level ${i} (Purchased)`;
        defenceButton.disabled = true;
      } else if (i === defenceUpgrades + 1) {
        defenceButton.textContent = `Level ${i} (Cost: ${100 * i} sticks)`;
        defenceButton.disabled = false;
      } else {
        defenceButton.textContent = `Level ${i} (Locked)`;
        defenceButton.disabled = true;
      }
    }
  }
}
function startTimer() {
  if (!timerInterval) {
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
  updateHatchButton("hatchGuard");
  updateHatchButton("hatchWarrior");
  updateHatchButton("hatchWorker");
  checkVictory();
  checkDefeat();
}

function everyTenSecondEvents() {
  stickGathered();
  foodCost();
  updateResourceStats();
  console.log("Enemy ants:", gameState.playerAntHill.ants.enemy);
  console.log("Guards:", gameState.playerAntHill.ants.guards);
  console.log("Warriors:", gameState.playerAntHill.ants.warriors);
  console.log("Workers:", gameState.playerAntHill.ants.workers);
  console.log("Attack Multiplier:", gameState.attackMultiplier);
  console.log("Defence Multiplier:", gameState.defenceMultiplier);
  console.log("Enemy Attack Multiplier:", gameState.enemyAttackMultiplier);
  console.log("Enemy Defence Multiplier:", gameState.enemyDefenceMultiplier);
}

function everyThirtySecondEvents() {
  triggerRaid();
  enemyUpgrade();
}

function enemyUpgrade() {
  if (Math.random() < 0.5) {
    console.log("The enemy failed to evolve!");
  } else {
    if (Math.random() < 0.5) {
      gameState.enemyAttackMultiplier += 0.5;
      addToLog("The enemy evolved stronger attack!");
    } else {
      gameState.enemyDefenceMultiplier += 0.5;
      addToLog("The enemy evolved stronger defence!");
    }
  }
}

function stickGathered() {
  const sticksGathered = gameState.playerAntHill.ants.workers * 1;

  gameState.playerAntHill.resources.sticks += sticksGathered;

  console.log(sticksGathered + 1 + " sticks has been gathered");
}

function triggerRaid() {
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
    }
  }

  if (!gameState.raidAvailable) {
    gameState.raidAvailable = true;
    console.log("Raiding is now available!");
    updateRaidButton();
  }
}

function foodCost() {
  let workers = gameState.playerAntHill.ants.workers;
  let guards = gameState.playerAntHill.ants.guards;
  let warriors = gameState.playerAntHill.ants.warriors;
  const foodCost = workers * 10 + guards * 80 + warriors * 80;

  if (gameState.playerAntHill.resources.food >= foodCost) {
    gameState.playerAntHill.resources.food -= foodCost;
  } else {
    let deficit = foodCost - gameState.playerAntHill.resources.food;
    gameState.playerAntHill.resources.food = 0;
    let warriorsDied = 0;
    let guardsDied = 0;
    let workersDied = 0;

    while (deficit > 0) {
      if (guards > 0 && warriors > 0) {
        if (Math.random() < 0.5) {
          guards -= 1;
          deficit -= 80;
          guardsDied += 1;
        } else {
          warriors -= 1;
          deficit -= 80;
          warriorsDied += 1;
        }
      } else if (guards > 0) {
        guards -= 1;
        deficit -= 80;
        guardsDied += 1;
      } else if (warriors > 0) {
        warriors -= 1;
        deficit -= 80;
        warriorsDied += +1;
      } else if (workers > 0) {
        workers -= 1;
        deficit -= 10;
        workersDied += +1;
      } else {
        break;
      }
      console.log(foodCost + 1 + " food has been consumed");
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
}

function playSound(sound) {
  if (!sound) {
    return;
  }
  sound.currentTime = 0;
  sound.play();
}

function addToLog(message) {
  const logArea = document.getElementById("logArea");

  const logEntry = document.createElement("div");
  logEntry.textContent = message;

  logArea.appendChild(logEntry);

  logArea.scrollTop = logArea.scrollHeight;
}
function triggerVictory() {
  addToLog("Victory! You have defeated all enemy ants!");
  pauseTimer();
}

function triggerDefeat() {
  addToLog("Defeat! All your ants have been eliminated.");
  pauseTimer();
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

function hatchAnt(type) {
  if (gameState.playerAntHill.resources.eggs >= 1) {
    const antType = type + "s";

    gameState.playerAntHill.ants[antType] += 1;
    gameState.playerAntHill.resources.eggs -= 1;
    playSound(hatchingSound);

    console.log(`A ${type} was hatched!`);

    updateResourceStats();
    updateHatchButton(`hatch${type.charAt(0).toUpperCase() + type.slice(1)}`);
  } else {
    const eggCountButton = document.getElementById("eggCount");
    eggCountButton.classList.add("noEggs");
    addToLog("No eggs available!");
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

function menuButtonOn() {
  const hatchGuardButton = document.getElementById("hatchGuard");
  const hatchWarriorButton = document.getElementById("hatchWarrior");
  const hatchWorkerButton = document.getElementById("hatchWorker");
  const menuButton = document.getElementById("menuButton");
  const shopButton = document.getElementById("shopButton");

  hatchGuardButton.classList.add("disable");
  hatchGuardButton.disable = true;

  hatchWarriorButton.classList.add("disable");
  hatchWarriorButton.disable = true;

  hatchWorkerButton.classList.add("disable");
  hatchWorkerButton.disable = true;

  menuButton.classList.add("disable");
  menuButton.disable = true;

  shopButton.classList.add("disable");
  shopButton.disable = true;
}

function menuButtonOff() {
  const hatchGuardButton = document.getElementById("hatchGuard");
  const hatchWarriorButton = document.getElementById("hatchWarrior");
  const hatchWorkerButton = document.getElementById("hatchWorker");
  const menuButton = document.getElementById("menuButton");
  const shopButton = document.getElementById("shopButton");

  hatchGuardButton.classList.remove("disable");
  hatchGuardButton.disable = false;

  hatchWarriorButton.classList.remove("disable");
  hatchWarriorButton.disable = false;

  hatchWorkerButton.classList.remove("disable");
  hatchWorkerButton.disable = false;

  menuButton.classList.remove("disable");
  menuButton.disable = false;

  shopButton.classList.remove("disable");
  shopButton.disable = false;
}

function updateHatchButton(buttonId) {
  const button = document.getElementById(buttonId);
  const isDisabled = gameState.playerAntHill.resources.eggs === 0;

  button.classList.toggle("disable", isDisabled);
  button.disabled = isDisabled;

  const eggCountButton = document.getElementById("eggCount");
  eggCountButton.classList.toggle("noEggs", isDisabled);
}

function startNewGame() {
  gameState = JSON.parse(JSON.stringify(defaultGameState));
  localStorage.setItem("antWarsGameState", JSON.stringify(gameState));
  startTimer();
  updateResourceStats();
  addToLog("New game started.");
  closeMenu("newGameConfirmationPopup");
  closeMenu("menuPopup");
}

function saveGame(saveFileName) {
  const savedGames =
    JSON.parse(localStorage.getItem("antWarsSavedGames")) || [];

  const existingSaveIndex = savedGames.findIndex(
    (game) => game.name === saveFileName
  );

  if (existingSaveIndex !== -1) {
    savedGames[existingSaveIndex] = { name: saveFileName, state: gameState };
    addToLog(`Overwritten save file: "${saveFileName}".`);
  } else {
    savedGames.push({ name: saveFileName, state: gameState });
    addToLog(`Game saved as "${saveFileName}".`);
  }

  localStorage.setItem("antWarsSavedGames", JSON.stringify(savedGames));
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

function confirmNewGame() {
  startNewGame();
  closeNewGameConfirmationPopup();
  closeMenu();
}

function loadSavedGame(index) {
  const savedGames =
    JSON.parse(localStorage.getItem("antWarsSavedGames")) || [];
  if (savedGames[index]) {
    gameState = savedGames[index].state;
    updateResourceStats();
    closeMenu("savedGamesPopup");
    closeMenu("menuPopup");
    console.log(`Loaded saved game: ${savedGames[index].name}`);
  } else {
    console.log("No saved game found at index", index);
  }
}

let saveGameIndexToDelete = null;

function confirmSaveGame() {
  const saveFileNameInput = document.getElementById("saveFileNameInput");
  const saveFileName = saveFileNameInput.value.trim();

  if (!saveFileName) {
    addToLog("Please enter a name for your save file.");
    return;
  }

  saveGame(saveFileName);
  closeMenu("nameSavePopup");
  saveFileNameInput.value = "";
}

function confirmDeleteGame() {
  if (saveGameIndexToDelete !== null) {
    deleteSavedGame(saveGameIndexToDelete);
    closeMenu("deleteConfirmationPopup");
    openMenu("savedGamesPopup");
  }
}

function deleteSavedGame(index) {
  const savedGames =
    JSON.parse(localStorage.getItem("antWarsSavedGames")) || [];
  if (index >= 0 && index < savedGames.length) {
    savedGames.splice(index, 1);
    localStorage.setItem("antWarsSavedGames", JSON.stringify(savedGames));

    addToLog("Saved game deleted.");
  } else {
    addToLog("Error: Invalid game index.");
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

  const hatchingSound = document.getElementById("hatchingSound");
  const raidSuccess = document.getElementById("raidSuccess");
  const raidFailed = document.getElementById("raidFailed");
});
