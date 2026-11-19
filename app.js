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
import { addPlayerRewards,getPlayerStats,equipRod } from './playerStore.js';
import { buyRod,getRodLuck,getRodByName } from './shop.js';

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
      const context = req.body.context;
      const userId = context === 0 ? req.body.member.user.id : req.body.user.id;
      const playerStats = getPlayerStats(userId);
      const rodLuck = getRodLuck(playerStats.equippedRod);
      const caughtFish = getRandomFish(rodLuck);
      const stats = addPlayerRewards(userId, caughtFish);

      return res.send({
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
          content: `<@${userId}> caught a **${caughtFish.name}** (${caughtFish.rarity}) and earned **${caughtFish.gold} gold** and **${caughtFish.xp} XP**. Balance: **${stats.gold} gold**, **${stats.xp} XP**.`,
        }
      });
    }

    if (name === 'stats') {
      const context = req.body.context;
      const userId = context === 0 ? req.body.member.user.id : req.body.user.id;
      const stats = getPlayerStats(userId);
      const fishingLuck = getRodLuck(stats.equippedRod);

      return res.send({
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
          content: `<@${userId}> has **${stats.gold} gold**, **${stats.xp} XP**, and **${fishingLuck} fishing luck**.`,
        }
      });
    }

    if(name === 'shop') {
      const context = req.body.context;
      const userId = context === 0 ? req.body.member.user.id : req.body.user.id;
      const { options } = data;
      const rodName = options?.[0]?.value;

      if (!rodName) {
        return res.send({
          type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
          data: { content: 'Choose a rod to buy.' },
        });
      }

      try {
        const result = buyRod(userId, rodName);
        return res.send({
          type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
          data: {
            content: `<@${userId}> ${result.message} Balance: **${result.updatedStats.gold} gold**.`,
          },
        });
      } catch (error) {
        return res.send({
          type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
          data: { content: error.message },
        });
      }
    }

    if (name === 'inventory') {
      const context = req.body.context;
      const userId = context === 0 ? req.body.member.user.id : req.body.user.id;
      const stats = getPlayerStats(userId);
      const {options} = data;
      const action = options?.[0]?.value;
      
      if(action === 'view') {
        const rodsList = stats.rods.length > 0 ? stats.rods.join(', ') : 'No rods owned.';
        const fishingLuck = getRodLuck(stats.equippedRod);
        return res.send({
          type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
          data: {
            content: `<@${userId}>'s Inventory:\n- Gold: **${stats.gold}**\n- XP: **${stats.xp}**\n- Fishing Luck: **${fishingLuck}**\n- Rods: ${rodsList}\n- Equipped Rod: ${stats.equippedRod || 'None'}`,
          },
        });
      }
      else if(action === 'equip') {
        const rodName = options?.[1]?.value;
        if (!rodName) {
          return res.send({
            type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
            data: { content: 'Choose the rod you want to equip.' },
          });
        }

        try {
          const updatedStats = equipRod(userId, rodName);
          const rod = getRodByName(rodName);
          return res.send({
            type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
            data: {
              content: `<@${userId}> equipped **${rod.name}**. Current fishing luck: **${getRodLuck(updatedStats.equippedRod)}**.`,
            },
          });
        } catch (error) {
          return res.send({
            type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
            data: { content: error.message },
          });
        }
      }
      
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

