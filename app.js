import 'dotenv/config';
const BOT_TOKEN = process.env.DISCORD_TOKEN;
import express from 'express';
import {
  ButtonStyleTypes,
  InteractionResponseFlags,
  InteractionResponseType,
  InteractionType,
  MessageComponentTypes,
  verifyKeyMiddleware,
} from 'discord-interactions';
import { getRandomEmoji, DiscordRequest } from './utils.js';
import { getShuffledOptions, getResult, getRPSChoices } from './game.js';
import { getRandomFish } from './fishingGame.js';

const app = express();
const PORT = process.env.PORT || 3000;
const activeGames = {};

app.post('/interactions', verifyKeyMiddleware(process.env.PUBLIC_KEY), async function (req, res) {
  const { id, type, data } = req.body;
  const reqStart = Date.now();

  if (type === InteractionType.PING) {
    return res.send({ type: InteractionResponseType.PONG });
  }

  if (type === InteractionType.APPLICATION_COMMAND) {
    const { name } = data;

    if (name === 'test') {
      return res.send({
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
          flags: InteractionResponseFlags.IS_COMPONENTS_V2,
          components: [
            {
              type: MessageComponentTypes.TEXT_DISPLAY,
              content: `hello world ${getRandomEmoji()}`
            }
          ]
        },
      });
    }

    if (name === 'ping') {
      const latency = Date.now() - reqStart;
      return res.send({
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
          content: `Pong! ${latency}ms`,
        }
      });
    }

    if (name === 'challenge') {
      const { options } = data;
      const userChoice = options[0].value;
      const botChoice = getRPSChoices()[Math.floor(Math.random() * getRPSChoices().length)];
      const context = req.body.context;
      const userId = context === 0 ? req.body.member.user.id : req.body.user.id;
      const result = getResult(
        { id: userId, objectName: userChoice },
        { id: process.env.APP_ID, objectName: botChoice }
      );

      return res.send({
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
          content: `You chose ${userChoice}, I chose ${botChoice}. ${result}`,
        }
      });
    }

    if (name === 'fishing') {
        const caughtFish = getRandomFish();
        return res.send({
            type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
            data: {
                content: `You caught a ${caughtFish}!`
            }
        });
    }

    console.error(`unknown command: ${name}`);
    return res.status(400).json({ error: 'unknown command' });
  }

  console.error('unknown interaction type', type);
  return res.status(400).json({ error: 'unknown interaction type' });
});

app.get('/', (req, res) => {
  res.send('OK');
});

app.listen(PORT, () => {
  console.log('Listening on port', PORT);
});

