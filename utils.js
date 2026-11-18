import 'dotenv/config';

export async function DiscordRequest(endpoint, options) {
  // append endpoint to root API URL
  const url = 'https://discord.com/api/v10/' + endpoint;
  // Stringify payloads
  if (options.body) options.body = JSON.stringify(options.body);
  // Use fetch to make requests
  console.log('Token thực tế:', process.env.DISCORD_TOKEN ? process.env.DISCORD_TOKEN.slice(0, 7) + '...' : 'CHƯA NẠP DỮ LIỆU (UNDEFINED)');
  const res = await fetch(url, {
    headers: {
      Authorization: `Bot ${(process.env.DISCORD_TOKEN || '').trim()}`,
      'Content-Type': 'application/json; charset=UTF-8',
      'User-Agent': 'DiscordBot (https://github.com/discord/discord-example-app, 1.0.0)',
    },
    ...options
  });
  // throw API errors
  if (!res.ok) {
    const data = await res.json();
    console.log(res.status);
    throw new Error(JSON.stringify(data));
  }
  // return original response
  return res;
}


export async function InstallGlobalCommands(appId, commands) {
  const cleanAppId = appId.trim();
  if (!cleanAppId) {
    throw new Error('APP_ID is required to register application commands');
  }

  // const endpoint = `applications/${cleanAppId}/guilds/${process.env.GUILD_ID}/commands`;

  const endpoint = `applications/${cleanAppId}/commands`;
  
  try {
    await DiscordRequest(endpoint, { method: 'PUT', body: commands });
  } catch (err) {
    console.error(err);
  }
}

// Simple method that returns a random emoji from list
export function getRandomEmoji() {
  const emojiList = ['😭','😄','😌','🤓','😎','😤','🤖','😶‍🌫️','🌏','📸','💿','👋','🌊','✨'];
  return emojiList[Math.floor(Math.random() * emojiList.length)];
}

export function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
