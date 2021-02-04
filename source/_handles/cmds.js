module.exports = {
  coded : "2019-03-16",

  name : "cmds",
  description : "Logs all of the bots Main Cmds.",


  execute(bot){
    const fs = require("fs");
    const generalCmds = fs.readdirSync('./source/cmds/general').filter(file => file.endsWith('.js'));
    const ownerCmds = fs.readdirSync('./source/cmds/owner').filter(file => file.endsWith('.js'));

    let general = [];
    let owner = [];

    for (const file of generalCmds) { 	const cmd = require(`.././cmds/general/${file}`);
      bot.cmds.general.set(cmd.name, cmd);
      general.push(cmd.name);
    };
    for (const file of ownerCmds) { 	const cmd = require(`.././cmds/owner/${file}`);
    bot.cmds.owner.set(cmd.name, cmd);
    owner.push(`[★]`+cmd.name);
    };

    array = general.concat(owner);

    console.log(`System:  Commands   :: Loaded : ${array.length} Type : [★] - Owner\n• • ${array.join(', ')}\n`)
  }
};
