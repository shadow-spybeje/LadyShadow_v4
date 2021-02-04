module.exports = {
    coded : "2019-05-05",

    name : "events",
    description : "Logs all of the Events.",


    execute(bot){
      const fs = require("fs");
      const eventFiles = fs.readdirSync('./source/_events').filter(file => file.endsWith('.js'));

      for (const file of eventFiles) { 	const event = require(`.././_events/${file}`);
        bot.events.set(event.name, event);
      };

      console.log(`System:   Events    :: Loaded : ${bot.events.size} Type : \n• • ${bot.events.map(e => e.name).join(', ')}\n`)
    }
};
