const fish = {
    Bass: {
        name: 'Bass',
        rarity: 'Common',
        xp: 10,
        gold: 5,
    },
    Salmon: {
        name: 'Salmon',
        rarity: 'Uncommon',
        xp: 20,
        gold: 10,
    },
    Trout: {
        name: 'Trout',
        rarity: 'Common',
        xp: 15,
        gold: 7,
    },
    Catfish: {
        name: 'Catfish',
        rarity: 'Rare',
        xp: 30,
        gold: 15,
    },
    Carp: {
        name: 'Carp',
        rarity: 'Common',
        xp: 12,
        gold: 6,
    },
    Pike: {
        name: 'Pike',
        rarity: 'Uncommon',
        xp: 25,
        gold: 12,
    },
    Perch: {
        name: 'Perch',
        rarity: 'Common',
        xp: 10,
        gold: 5,
    },
    Walleye: {
        name: 'Walleye',
        rarity: 'Uncommon',
        xp: 20,
        gold: 10,
    },
    Sturgeon: {
        name: 'Sturgeon',
        rarity: 'Rare',
        xp: 35,
        gold: 20,
    },
    Bluegill: {
        name: 'Bluegill',
        rarity: 'Common',
        xp: 8,
        gold: 4,
    },
    Crappie: {
        name: 'Crappie',
        rarity: 'Common',
        xp: 12,
        gold: 6,
    },
    Muskellunge: {
        name: 'Muskellunge',
        rarity: 'Rare',
        xp: 40,
        gold: 25,
    },
    RainbowTrout: {
        name: 'Rainbow Trout',
        rarity: 'Uncommon',
        xp: 20,
        gold: 10,
    },
    RedearSunfish: {
        name: 'Redear Sunfish',
        rarity: 'Common',
        xp: 10,
        gold: 5,
    },
    SmallmouthBass: {
        name: 'Smallmouth Bass',
        rarity: 'Uncommon',
        xp: 25,
        gold: 12,
    }
}
export function getRandomFish() {
  const fishList = Object.values(fish);
  return fishList[Math.floor(Math.random() * fishList.length)];
}