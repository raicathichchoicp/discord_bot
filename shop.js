import { addPlayerRewards, addRodToInventory, getPlayerStats } from './playerStore.js';

const rods = {
    rusty_rod: {
        name: 'Rusty Rod 100$',
        price: 100,
        luck: 1
    },
    wooden_rod: {
        name: 'Wooden Rod 200$',
        price: 200,
        luck: 5
    },
    iron_rod: {
        name: 'Iron Rod 500$',
        price: 500,
        luck: 25
    },
    golden_rod: {
        name: 'Golden Rod 1000$',
        price: 1000,
        luck: 125
    },
    diamond_rod: {
        name: 'Diamond Rod 2000$',
        price: 2000,
        luck: 128
    },
    legendary_rod: {
        name: 'Legendary Rod 5000$',
        price: 5000,
        luck: 256
    },
}

export function getRodByName(name) {
    return rods[name] || null;
}

export function getRodLuck(name) {
    return getRodByName(name)?.luck || 0;
}

export function buyRod(userId, rodName) {
    const rod = getRodByName(rodName);
    if (!rod) {
        throw new Error(`Rod "${rodName}" does not exist`);
    }
    const playerStats = getPlayerStats(userId);
    if (playerStats.gold < rod.price) {
        throw new Error(`Not enough gold to buy "${rod.name}". You need ${rod.price} gold.`);
    }
    if (playerStats.rods.includes(rodName)) {
        throw new Error(`You already own the "${rod.name}".`);
    }
    addPlayerRewards(userId, { gold: -rod.price, xp: 0 });
    const updatedStats = addRodToInventory(userId, rodName);
    return {
        message: `You bought a "${rod.name}" for ${rod.price} gold.`,
        updatedStats,
    };
}