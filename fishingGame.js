const fish = ['🐟', '🐠', '🐡', '🦈', '🐬', '🐳', '🐋', '🦑', '🦐', '🦞'];

export function getRandomFish() {
  return fish[Math.floor(Math.random() * fish.length)];
}