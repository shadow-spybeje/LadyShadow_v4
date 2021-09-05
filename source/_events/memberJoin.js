module.exports = {
    coded : "2021-06-10",

    name : "memberJoin",
    description : "This is the \"Member Join\" handler",
    usage : "`bot.events.get(\"memberJoin\").execute(bot)`",

    async execute(bot, member){
        let settings = await bot.functions.get("getSettings").getServer(bot, member.guild.id);
    },
};
