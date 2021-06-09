const _l = require("../other/localization");
const l = async function(message, txt){
  return await _l.execute(message, `$cmds-${txt}`);
};

module.exports = {
  coded : "2019-03-16",

  name : "cmds",
  description : "Logs all of the bots Main Cmds.",


  async code(cmd, langCode, text){
    return await l(langCode,`${cmd.name}__${text}`);
  },

  execute(bot){
    const fs = require("fs");
    const generalCmds = fs.readdirSync('./source/cmds/general').filter(file => file.endsWith('.js'));
    const ownerCmds = fs.readdirSync('./source/cmds/owner').filter(file => file.endsWith('.js'));

    let general = [];
    let owner = [];

    for (const file of generalCmds) { 	const cmd = require(`.././cmds/general/${file}`);
      bot.cmds.general.set(cmd.name, cmd);
      if(cmd.descriptions){
        _l.languageCodes_array.forEach(async (code) => {
          if(cmd.descriptions){
            if(cmd.descriptions[code]){cmd.descriptions[code] = await this.code(cmd, code, "Description");
            }else{ cmd.descriptions[code] = await this.code('en', code, "Description"); }; };
          if(cmd.usages){ if(cmd.usages[code]){ cmd.usages[code] = await this.code(cmd, code, "Usage");
            }else{ cmd.usages[code] = await this.code('en', code, "Usage"); }};
        });
      };
      general.push(cmd.name);
    };
    for (const file of ownerCmds) { 	const cmd = require(`.././cmds/owner/${file}`);
    bot.cmds.owner.set(cmd.name, cmd);
    if(cmd.descriptions){
      _l.languageCodes_array.forEach(async (code) => {
        if(cmd.descriptions){
          if(cmd.descriptions[code]){cmd.descriptions[code] = await this.code(cmd, code, "Description");
          }else{ cmd.descriptions[code] = await this.code('en', code, "Description"); }; };
        if(cmd.usages){ if(cmd.usages[code]){ cmd.usages[code] = await this.code(cmd, code, "Usage");
          }else{ cmd.usages[code] = await this.code('en', code, "Usage"); }};
      });
    };
    owner.push(`[★]`+cmd.name);
    };

    array = general.concat(owner);

    console.log(`System:  Commands   :: Loaded : ${array.length} Type : [★] - Owner\n• • ${array.join(', ')}\n`)
  }
};
