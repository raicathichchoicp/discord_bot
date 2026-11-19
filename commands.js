import 'dotenv/config';
const BOT_TOKEN = process.env.DISCORD_TOKEN;
import { getRPSChoices } from './game.js';
import { capitalize, InstallGlobalCommands } from './utils.js';

// Get the game choices from game.js
function createCommandChoices() {
  const choices = getRPSChoices();
  const commandChoices = [];

  for (let choice of choices) {
    commandChoices.push({
      name: capitalize(choice),
      value: choice.toLowerCase(),
    });
  }

  return commandChoices;
}

// Simple test command
const TEST_COMMAND = {
  name: 'test',
  description: 'Basic command',
  type: 1,
  integration_types: [0, 1],
  contexts: [0, 1, 2],
};

// Command containing options
const CHALLENGE_COMMAND = {
  name: 'challenge',
  description: 'Challenge to a match of rock paper scissors',
  options: [
    {
      type: 3,
      name: 'object',
      description: 'Pick your object',
      required: true,
      choices: createCommandChoices(),
    },
  ],
  type: 1,
  integration_types: [0, 1],
  contexts: [0, 2],
};

const PING_COMMAND = {
  name: 'ping',
  description: 'Ping the bot',
  type: 1,
}

const FISHING_COMMAND = {
  name: 'fishing',
  description: 'Go fishing',
  type: 1,
  integration_types: [0, 1],
  contexts: [0, 2],
}

const statsCommand = {
  name: 'stats',
  description: 'View your fishing stats',
  type: 1,
  integration_types: [0, 1],
  contexts: [0, 2],
};

const shop ={
   name: 'shop',
   description: 'buy new rods and baits',
   type: 1,
   integration_types: [0, 1],
   contexts: [0, 2],
   options: [
      {
         type: 3,
         name: 'item',
         description: 'Choose an item to buy',
         required: true,
         choices: [
            { name: 'Rusty Rod 100$', value: 'rusty_rod' },
            { name: 'Wooden Rod 200$', value: 'wooden_rod' },
            { name: 'Iron Rod 500$', value: 'iron_rod' },
            { name: 'Golden Rod 1000$', value: 'golden_rod' },
            { name: 'Diamond Rod 2000$', value: 'diamond_rod' },
            { name: 'Legendary Rod 5000$', value: 'legendary_rod' },
         ],
      }
   ]
};

const inventory = {
   name: 'inventory',
   description: 'View your inventory',
   type: 1,
   integration_types: [0, 1],
   options: [
    {
      type: 3,
      name: 'action',
      description: 'Choose an action',
      required: true,
      choices: [
        { name: 'View Inventory', value: 'view' },
        { name: 'Equip Rod', value: 'equip' },
      ],
    },
    {
      type: 3,
      name: 'rod',
      description: 'Rod to equip',
      required: false,
      choices: [
        { name: 'Rusty Rod', value: 'rusty_rod' },
        { name: 'Wooden Rod', value: 'wooden_rod' },
        { name: 'Iron Rod', value: 'iron_rod' },
        { name: 'Golden Rod', value: 'golden_rod' },
        { name: 'Diamond Rod', value: 'diamond_rod' },
        { name: 'Legendary Rod', value: 'legendary_rod' },
      ],
    },
   ],
};

const ALL_COMMANDS = [TEST_COMMAND, CHALLENGE_COMMAND, PING_COMMAND, FISHING_COMMAND, statsCommand, shop, inventory];

console.log('App ID:', process.env.APP_ID);
InstallGlobalCommands((process.env.APP_ID || '').trim(), ALL_COMMANDS);
