
const playersDefault = [
  { name: 'NinjaBR', game: 'Solo', matches: 120, wins: 35, losses: 85, kd: 4.8, ranking: 1 },
  { name: 'StormX', game: 'Duos', matches: 98, wins: 22, losses: 76, kd: 3.9, ranking: 4 },
  { name: 'ShadowFox', game: 'Solo', matches: 110, wins: 30, losses: 80, kd: 4.5, ranking: 2 },
  { name: 'LunarGG', game: 'Squads', matches: 87, wins: 18, losses: 69, kd: 3.2, ranking: 7 },
  { name: 'ZeroBuild', game: 'Duos', matches: 105, wins: 27, losses: 78, kd: 4.1, ranking: 3 },
  { name: 'RapidShot', game: 'Solo', matches: 92, wins: 20, losses: 72, kd: 3.7, ranking: 5 },
  { name: 'BoxMaster', game: 'Squads', matches: 80, wins: 15, losses: 65, kd: 2.9, ranking: 8 },
  { name: 'VictoryRoyale', game: 'Duos', matches: 99, wins: 24, losses: 75, kd: 3.8, ranking: 6 }
];

let players = loadPlayers();

const playersContainer = document.getElementById('playersContainer');
const gameFilter = document.getElementById('gameFilter');
const playerForm = document.getElementById('playerForm');

const totalPlayersEl = document.getElementById('totalPlayers');
const averageKDEl = document.getElementById('averageKD');
const bestRankingEl = document.getElementById('bestRanking');

function loadPlayers() {
  const savedPlayers = localStorage.getItem('fortnitePlayers');

  if (savedPlayers) {
    return JSON.parse(savedPlayers);
  }

  return [...playersDefault];
}

function savePlayers() {
  localStorage.setItem('fortnitePlayers', JSON.stringify(players));
}

function getFilteredPlayers() {
  const selectedGame = gameFilter.value;

  if (selectedGame === 'Todos') {
    return players;
  }

  return players.filter(player => player.game === selectedGame);
}

function calculateIndicators(filteredPlayers) {
  const totalPlayers = filteredPlayers.length;

  let totalKD = 0;
  let bestRanking = Infinity;

  for (let i = 0; i < filteredPlayers.length; i++) {
    totalKD += filteredPlayers[i].kd;

    if (filteredPlayers[i].ranking < bestRanking) {
      bestRanking = filteredPlayers[i].ranking;
    }
  }

  const averageKD = totalPlayers > 0 ? (totalKD / totalPlayers).toFixed(2) : '0.00';

  if (bestRanking === Infinity) {
    bestRanking = '-';
  }

  return {
    totalPlayers,
    averageKD,
    bestRanking
  };
}

function renderPlayers() {
  const filteredPlayers = getFilteredPlayers();

  playersContainer.innerHTML = '';

  for (let i = 0; i < filteredPlayers.length; i++) {
    const player = filteredPlayers[i];

    const card = document.createElement('div');
    card.className = 'player-card';

    card.innerHTML = `
      <h3>${player.name}</h3>
      <p><strong>Modo:</strong> ${player.game}</p>
      <p><strong>Partidas:</strong> ${player.matches}</p>
      <p><strong>Vitórias:</strong> ${player.wins}</p>
      <p><strong>Derrotas:</strong> ${player.losses}</p>
      <p><strong>K/D Ratio:</strong> ${player.kd}</p>
      <p class="ranking"><strong>Ranking:</strong> #${player.ranking}</p>
    `;

    playersContainer.appendChild(card);
  }

  updateIndicators(filteredPlayers);
}

function updateIndicators(filteredPlayers) {
  const indicators = calculateIndicators(filteredPlayers);

  totalPlayersEl.textContent = indicators.totalPlayers;
  averageKDEl.textContent = indicators.averageKD;
  bestRankingEl.textContent = indicators.bestRanking;
}

gameFilter.addEventListener('change', renderPlayers);

playerForm.addEventListener('submit', function (event) {
  event.preventDefault();

  const newPlayer = {
    name: document.getElementById('name').value,
    game: document.getElementById('game').value,
    matches: Number(document.getElementById('matches').value),
    wins: Number(document.getElementById('wins').value),
    losses: Number(document.getElementById('losses').value),
    kd: Number(document.getElementById('kd').value),
    ranking: Number(document.getElementById('ranking').value)
  };

  players.push(newPlayer);

  savePlayers();
  renderPlayers();
  playerForm.reset();
});

renderPlayers();
