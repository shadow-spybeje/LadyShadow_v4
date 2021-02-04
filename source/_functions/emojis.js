module.exports = {
    name: "emojis",
    description:"",
    usage: "bot.functions.get('emojis').execute(bot, emote)",

    /**
     * Call any emote the bot has access to. -- we will only call pre-saved ID's on the database however...
     *
     * Available Emotes: (Hardcoded)
     * * yes
     * * no
     *
     * @param {string} emote The emote to collect.
     * @returns {string} `emoji` the {emote}
     */
    execute(bot, emote){
        if(!bot.minme.emotes[emote]) return; //No Emote known/found.

        let emoji = bot.emojis.cache.get(bot.minme.emotes[emote]);

        return emoji;
    }
};
