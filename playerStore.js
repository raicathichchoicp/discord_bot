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
  const stats = players[userId];
  return stats
    ? {
        gold: stats.gold || 0,
        xp: stats.xp || 0,
        luck: stats.luck || 0,
        rods: Array.isArray(stats.rods) ? stats.rods : [],
        equippedRod: stats.equippedRod || null,
      }
    : { gold: 0, xp: 0, luck: 0, rods: [], equippedRod: null };
}

export function addPlayerRewards(userId, { gold, xp }, luck = 0) {
  if (!userId) {
    throw new Error('A Discord user ID is required');
  }

  const players = readPlayers();
  const currentStats = players[userId] || { gold: 0, xp: 0, luck: 0, rods: [], equippedRod: null };
  const rods = Array.isArray(currentStats.rods) ? currentStats.rods : [];
  const updatedStats = {
    gold: currentStats.gold + gold,
    xp: currentStats.xp + xp,
    luck: (currentStats.luck || 0) + luck,
    rods: [...rods],
    equippedRod: currentStats.equippedRod || null,
  };
  players[userId] = updatedStats;
  writePlayers(players);
  return updatedStats;
}

export function addRodToInventory(userId, rodName) {
  if (!userId) {
    throw new Error('A Discord user ID is required');
  }

  const players = readPlayers();
  const currentStats = players[userId] || { gold: 0, xp: 0, luck: 0, rods: [], equippedRod: null };
  const rods = Array.isArray(currentStats.rods) ? currentStats.rods : [];
  const updatedStats = {
    ...currentStats,
    gold: currentStats.gold || 0,
    xp: currentStats.xp || 0,
    luck: currentStats.luck || 0,
    rods: rods.includes(rodName) ? rods : [...rods, rodName],
    equippedRod: currentStats.equippedRod || null,
  };
  players[userId] = updatedStats;
  writePlayers(players);
  return updatedStats;
}

export function equipRod(userId, rodName) {
  if (!userId) {
    throw new Error('A Discord user ID is required');
  }

  const players = readPlayers();
  const currentStats = players[userId] || { gold: 0, xp: 0, luck: 0, rods: [], equippedRod: null };
  const rods = Array.isArray(currentStats.rods) ? currentStats.rods : [];
  if (!rods.includes(rodName)) {
    throw new Error('You do not own that rod.');
  }

  const updatedStats = {
    ...currentStats,
    equippedRod: rodName,
  };
  players[userId] = updatedStats;
  writePlayers(players);
  return updatedStats;
}
