const fish = {
    Bass: {
        name: 'Bass',
        rarity: 'Common',
        xp: 10,
        gold: 5,
        catchRate: 0.5,
    },
    Salmon: {
        name: 'Salmon',
        rarity: 'Uncommon',
        xp: 20,
        gold: 10,
        catchRate: 0.3,
    },
    Tuna: {
        name: 'Tuna',
        rarity: 'Uncommon',
        xp: 25,
        gold: 12,
        catchRate: 0.2,
    },
    Trout: {
        name: 'Trout',
        rarity: 'Common',
        xp: 15,
        gold: 7,
        catchRate: 0.4,
    },
    Catfish: {
        name: 'Catfish',
        rarity: 'Rare',
        xp: 30,
        gold: 15,
        catchRate: 0.1,
    },
    Carp: {
        name: 'Carp',
        rarity: 'Common',
        xp: 12,
        gold: 6,
        catchRate: 0.45,
    },
    Pike: {
        name: 'Pike',
        rarity: 'Uncommon',
        xp: 25,
        gold: 12,
        catchRate: 0.25,
    },
    Perch: {
        name: 'Perch',
        rarity: 'Common',
        xp: 10,
        gold: 5,
        catchRate: 0.5,
    },
    Walleye: {
        name: 'Walleye',
        rarity: 'Uncommon',
        xp: 20,
        gold: 10,
        catchRate: 0.3,
    },
    Sturgeon: {
        name: 'Sturgeon',
        rarity: 'Rare',
        xp: 35,
        gold: 20,
        catchRate: 0.15,
    },
    Bluegill: {
        name: 'Bluegill',
        rarity: 'Common',
        xp: 8,
        gold: 4,
        catchRate: 0.55,
    },
    Crappie: {
        name: 'Crappie',
        rarity: 'Common',
        xp: 12,
        gold: 6,
        catchRate: 0.45,
    },
    Muskellunge: {
        name: 'Muskellunge',
        rarity: 'Rare',
        xp: 40,
        gold: 25,
        catchRate: 0.1,
    },
    RainbowTrout: {
        name: 'Rainbow Trout',
        rarity: 'Uncommon',
        xp: 20,
        gold: 10,
        catchRate: 0.3,
    },
    RedearSunfish: {
        name: 'Redear Sunfish',
        rarity: 'Common',
        xp: 10,
        gold: 5,
        catchRate: 0.5,
    },
    SmallmouthBass: {
        name: 'Smallmouth Bass',
        rarity: 'Uncommon',
        xp: 25,
        gold: 12,
        catchRate: 0.2,
    },
    LargemouthBass: {
        name: 'Largemouth Bass',
        rarity: 'Uncommon',
        xp: 25,
        gold: 12,
        catchRate: 0.2,
    }
}
function getFishWeight(f, luck) {
  const luckBonus = Math.max(0, Number(luck) || 0) / 100;

  if (f.rarity === 'Common') {
    return 1;
  }
  if (f.rarity === 'Uncommon') {
    return 2 * (1 + luckBonus);
  }
  return 5 * (1 + luckBonus * 2);
}

export function getRandomFish(luck = 0) {
  const fishList = Object.values(fish);
  const weights = fishList.map((f) => getFishWeight(f, luck));
  const totalWeight = weights.reduce((sum, weight) => sum + weight, 0);
  let random = Math.random() * totalWeight;

  for (let i = 0; i < fishList.length; i++) {
    if (random < weights[i]) {
      return fishList[i];
    }
    random -= weights[i];
  }
  return fishList[0];
}