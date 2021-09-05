module.exports = {
    coded : "2019-03-25",
    name : "functions",
    description : "Logs all of the functions used within the bot.",

    async execute(bot){
      const fs = require("fs");
      const funcFiles = fs.readdirSync('./source/_functions').filter(file => file.endsWith('.js'));

      for (const file of funcFiles) { 	const func = require(`.././_functions/${file}`);
        if(file=="_functions.js") bot.functions.set("_", func);
        if(func.botInit){ await func.botInit(bot); };
        bot.functions.set(func.name, func);
      };

      console.log(`System:  Functions  :: Loaded : ${bot.functions.size} Type : \n• • ${bot.functions.map(c => c.name).join(', ')}\n`)
    }
  };
