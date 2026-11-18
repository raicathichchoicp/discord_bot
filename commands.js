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

const ALL_COMMANDS = [TEST_COMMAND, CHALLENGE_COMMAND, PING_COMMAND, FISHING_COMMAND];

console.log('App ID:', process.env.APP_ID);
InstallGlobalCommands((process.env.APP_ID || '').trim(), ALL_COMMANDS);
