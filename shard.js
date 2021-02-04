/*
 * {HSF}LadyShadow#7111
 *  v.3.0.0
 *  Feburary 25'th, 2019
 *
*/

const token = require('../.././tokens.json').Beta;//LadyShadow;
const { ShardingManager } = require('discord.js');

const shard = new ShardingManager('./source/shadow.js', { token: token,
  respawn: true
});

shard.spawn();
shard.on('launch', shard => console.log(`Launched shard ${shard.id + 1}`));
