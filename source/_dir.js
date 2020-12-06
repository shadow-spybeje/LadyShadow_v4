module.exports = {

    async collections_general(bot, discord){
        /**
         * General items.
         * * ..eval bot.
         */
      //commands.
        bot.cmds = new discord.Collection();
      //General Commands.
        bot.cmds.general = new discord.Collection();
      //Support Team Commands.
        bot.cmds.support = new discord.Collection();
      //Owner Team Commands.
        bot.cmds.owner = new discord.Collection();

        /**
         * Settings
         * * ..eval bot.settings.
         */
      //Settings Files
        bot.settings = new discord.Collection();
      //server setting files.
        bot.settings.g = new discord.Collection();
      //User Settings Files
        bot.settings.u = new discord.Collection();

      //event handler
        bot.events = new discord.Collection();
      //shadow's toys.
        bot.functions = new discord.Collection();

        return bot;
    },

    async collections(bot, discord){

        await this.collections_general(bot, discord);

        return bot;
    }

};
