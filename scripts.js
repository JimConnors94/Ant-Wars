let isTimerRunning = true;
let timerInterval;

const defaultGameState = {
  gameTimer: 0,
  raidAvailable: false,
  spiderInCamp: false,
  encounteredCharacters: [],

  attackMultiplier: 1,
  defenceMultiplier: 1,
  enemyAttackMultiplier: 1,
  enemyDefenceMultiplier: 1,

  spiderVenom: false,

  playerAntHill: {
    resources: {
      eggs: 0,
      sticks: 1000,
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

  console.log(savedState ? "Loaded saved game." : "Starting a new game.");
}

function openMenu(menuId) {
  if (menuId === "merchantPopup") {
    document.getElementById("merchantPopup").style.display = "flex";

    const merchantPopup = document.getElementById("merchantPopup");
    merchantPopup.innerHTML = "";

    if (gameState.spiderInCamp) {
      const spiderButton = document.createElement("button");
      spiderButton.textContent = "Angoliant the Terrible";
      spiderButton.onclick = () => openMenu("spiderPopup");
      merchantPopup.appendChild(spiderButton);
    }

    if (gameState.heraclesInCamp) {
      const heraclesButton = document.createElement("button");
      heraclesButton.textContent = "Heracles the Mighty";
      heraclesButton.onclick = () => openMenu("heraclesPopup");
      merchantPopup.appendChild(heraclesButton);
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
    closeMenu("shopPopup"); // Close the shop when opening the spider popup
  }

  if (menuId === "heraclesPopup") {
    if (gameState.heraclesInCamp) {
      document.getElementById("heraclesPopup").style.display = "flex";
    }
    closeMenu("shopPopup"); // Close the shop when opening the Heracles popup
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
      deleteButton.onclick = () => openMenu("deleteConfirmationPopup");
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
  }

  if (menuId === "eventPopup") {
    document.getElementById("eventPopup").style.display = "flex";
  }
}

function closeMenu(menuId) {
  document.getElementById(menuId).style.display = "none";

  if (menuId === "merchantPopup") {
    document.getElementById("shopPopup").style.display = "flex";
  }

  if (menuId === "shopPopup") {
    resumeTimer();
    menuButtonOff();
  }

  if (menuId === "spiderPopup") {
    
  }

  if (menuId === "heraclesPopup") {
    
  }

  if (menuId === "eventPopup") {
    resumeTimer();
  }
}

function openSpider() {
  if (gameState.spiderInCamp) {
    document.getElementById("spiderPopup").style.display = "flex";
  }

  closeShop();
}

function closeSpider() {
  document.getElementById("spiderPopup").style.display = "none";
}

function openHeracles() {
  if (gameState.heraclesInCamp) {
    document.getElementById("heraclesPopup").style.display = "flex";
  }

  closeShop();
}

function closeHeracles() {
  document.getElementById("heraclesPopup").style.display = "none";
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
  if (gameState.playerAntHill.resources.sticks >= 100) {
    gameState.attackMultiplier += 0.5;
    gameState.playerAntHill.resources.sticks -= 100;

    console.log("Attack increased!");

    calculateCombatStats();
  } else {
    console.log("Not enough sticks available!");
  }
}

function upgradeDefence() {
  if (gameState.playerAntHill.resources.sticks >= 100) {
    gameState.defenceMultiplier += 0.5;
    gameState.playerAntHill.resources.sticks -= 100;

    console.log("Defence increased!");

    calculateCombatStats();
  } else {
    console.log("Not enough sticks available!");
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

function hatchAnt(type) {
  if (gameState.playerAntHill.resources.eggs >= 1) {
    gameState.playerAntHill.ants[type] += 1;
    gameState.playerAntHill.resources.eggs -= 1;
    playSound(hatchingSound);

    console.log(`A ${type} was hatched!`);

    updateResourceStats();
    updateHatchButton(
      `hatch${type.charAt(0).toUpperCase() + type.slice(1, -1)}`
    );
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

function openNewGameConfirmationPopup() {
  document.getElementById("newGameConfirmationPopup").style.display = "flex";
}

function closeNewGameConfirmationPopup() {
  document.getElementById("newGameConfirmationPopup").style.display = "none";
}

function confirmNewGame() {
  startNewGame();
  closeNewGameConfirmationPopup();
  closeMenu();
}

function openSavedGamesPopup() {
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
    deleteButton.onclick = () => openMenu("deleteConfirmationPopup");
    gameItem.appendChild(deleteButton);

    savedGamesList.appendChild(gameItem);
  });

  savedGamesPopup.style.display = "flex";
  pauseTimer();
}

function closeSavedGamesPopup() {
  document.getElementById("savedGamesPopup").style.display = "none";
}

function loadSavedGame(index) {
  const savedGames =
    JSON.parse(localStorage.getItem("antWarsSavedGames")) || [];
  if (savedGames[index]) {
    gameState = savedGames[index].state;
    updateResourceStats();
    closeSavedGamesPopup();
    console.log(`Loaded saved game: ${savedGames[index].name}`);
  } else {
    console.log("No saved game found at index", index);
  }
}

let saveGameIndexToDelete = null;

function openNameSavePopup() {
  document.getElementById("nameSavePopup").style.display = "flex";
}

function closeNameSavePopup() {
  document.getElementById("nameSavePopup").style.display = "none";
}

function confirmSaveGame() {
  const saveFileNameInput = document.getElementById("saveFileNameInput");
  const saveFileName = saveFileNameInput.value.trim();

  if (!saveFileName) {
    addToLog("Please enter a name for your save file.");
    return;
  }

  saveGame(saveFileName);
  closeNameSavePopup();
  saveFileNameInput.value = "";
}

function openDeleteConfirmationPopup(index) {
  saveGameIndexToDelete = index;
  document.getElementById("deleteConfirmationPopup").style.display = "flex";
}

function closeDeleteConfirmationPopup() {
  saveGameIndexToDelete = null;
  document.getElementById("deleteConfirmationPopup").style.display = "none";
}

function confirmDeleteGame() {
  if (saveGameIndexToDelete !== null) {
    deleteSavedGame(saveGameIndexToDelete);
    closeDeleteConfirmationPopup();
  }
}

function deleteSavedGame(index) {
  const savedGames =
    JSON.parse(localStorage.getItem("antWarsSavedGames")) || [];
  savedGames.splice(index, 1);
  localStorage.setItem("antWarsSavedGames", JSON.stringify(savedGames));
  openSavedGamesPopup(); // Refresh the saved games list
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