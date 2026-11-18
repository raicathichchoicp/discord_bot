import { mkdirSync, readFileSync, renameSync, writeFileSync } from 'node:fs';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const DATA_FILE = fileURLToPath(new URL('./data/players.json', import.meta.url));

function readPlayers() {
  try {
    const players = JSON.parse(readFileSync(DATA_FILE, 'utf8'));
    if (players === null || Array.isArray(players) || typeof players !== 'object') {
      throw new Error('Player data must be a JSON object');
    }
    return players;
  } catch (error) {
    if (error.code === 'ENOENT') {
      return {};
    }
    throw error;
  }
}

function writePlayers(players) {
  mkdirSync(dirname(DATA_FILE), { recursive: true });
  const temporaryFile = `${DATA_FILE}.${process.pid}.tmp`;
  writeFileSync(temporaryFile, `${JSON.stringify(players, null, 2)}\n`, 'utf8');
  renameSync(temporaryFile, DATA_FILE);
}

export function getPlayerStats(userId) {
  if (!userId) {
    throw new Error('A Discord user ID is required');
  }
  const players = readPlayers();
  return players[userId] || { gold: 0, xp: 0 };
}

export function addPlayerRewards(userId, { gold, xp }) {
  if (!userId) {
    throw new Error('A Discord user ID is required');
  }
  if (!Number.isSafeInteger(gold) || gold < 0 || !Number.isSafeInteger(xp) || xp < 0) {
    throw new Error('Gold and XP rewards must be non-negative safe integers');
  }

  const players = readPlayers();
  const currentStats = players[userId] || { gold: 0, xp: 0 };
  const updatedStats = {
    gold: currentStats.gold + gold,
    xp: currentStats.xp + xp,
  };
  players[userId] = updatedStats;
  writePlayers(players);
  return updatedStats;
}
