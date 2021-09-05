module.exports = {

    async collections_general(bot, discord){
    //#region Commands

      //commands.
        bot.cmds = new discord.Collection();
      //General Commands.
        bot.cmds.general = new discord.Collection();
      //Support Team Commands.
        bot.cmds.support = new discord.Collection();
      //Owner Team Commands.
        bot.cmds.owner = new discord.Collection();

    //#endregion
    //#region Settings
      //System Stuff
        bot.system = {};
      //Settings Files
        bot.settings = new discord.Collection();
      //server setting files.
        bot.settings.g = new discord.Collection();
      //User Settings Files
        bot.settings.u = new discord.Collection();

    //#endregion
    //#region Handles.

      //Collection handler
        bot.collections = new discord.Collection();
      //event handler
        bot.events = new discord.Collection();
      //shadow's toys.
        bot.functions = new discord.Collection();

    //#endregion
    //#region Other

      bot.modules = {};
      bot.modules.locale = require("./other/localization");
      bot.modules.phasmo = require("./other/phasmo");
      bot.modules.sagaspace = require("./other/sagaspace");
      bot.modules.shadowSass_bots = require("./other/shadowSass_bots");
      bot.modules.spamMentions = require("./other/spamMentions");
      bot.modules.altFinder = require('./other/AltFinder/AltFinder.js');
      bot.modules.tos_roleCards = require('./other/tosRoleCards.js');
      bot.sectors = require("./vo_sectorid.js");

    //#endregion
        return bot;
    },

    async collect(bot){
      let standard = [];
      const fs = require("fs");

      const collectionss = await fs.readdirSync('./source/_handles').filter(file => file.endsWith('.js'));
      for (const file of collectionss) {
          const collection = require(`./_handles/${file}`);
          bot.collections.set(collection.name, collection);
          standard.push(collection.name);
      };

      console.log(`System: Collections :: Loaded : ${standard.length}\n`)

      //=============
        /*function standardCollections(bot){

          const collectionss = fs.readdirSync('./source/_handles').filter(file => file.endsWith('.js'));
          for (const file of collectionss) { 	const collection = require(`./_handles/${file}`);
              bot.collections.set(collection.name, collection);
              standard.push(collection.name)
          };

          return bot;
        }
        await standardCollections(bot, fs);
        let array = standard;
        console.log(sys+` Collections :: Loaded : ${array.length}\n`)*/

    },

    async collections(bot, discord){

        await this.collections_general(bot, discord);
        await this.collect(bot);
        await bot.collections.forEach(collection => {
          collection.execute(bot)
        });

        bot.print(`\n---==☆ End System ☆==---\n`,0,0,1);

        return bot;
    }

};
