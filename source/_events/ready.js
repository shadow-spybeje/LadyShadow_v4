module.exports = {
    coded : "2019-05-05",

    name : "ready",
    description : "This is the \"Ready Event\" handler",
    usage : "`bot.events.get(\"ready\").execute(bot)`",

    async execute(bot){

        //#region Bot.user.setPresence
        //#region BotPresences Key
        /*
         * [0] PLAYING
         * • {type: ' '}
         * [1] STREAMING
         * • {type: ' ', url: ' '}
         * [2] LISTENING
         * • {type: ' '}
         * [3] WATCHING
         * • {type: ' '}
         * [4] CUSTOM_STATUS
         * • {}
         * [5] COMPETING
         * •
         */
        //#endregion
        bot.user.setPresence({
            status: "idle",
            activity: {
                type: "STREAMING",
                name: `the Beta Version. | ${bot.config.settings.prefix}help`,
                url: "https://www.twitch.tv/scion_spy"
            }
        });
        //#endregion

        readyTimer = Date.now() - bot.readyTimer;
        bot.readyTime = null;

        //#region DisplayConfig
        cc = bot.config
        //#region prettify
        o = JSON.stringify(cc.owners).split("[{").join("[\n\ \ \ \ {").split("},{").join("},\n\ \ \ \ {").split("}]").join("}\n\ \ ],");
        o = `owners: ${o}`;
        s = JSON.stringify(cc.support).split("[{").join("[\n\ \ \ \ {").split("},{").join("},\n\ \ \ \ {").split("}]").join("}\n\ \ ],");
        s = `support: ${s}`;
        ss = JSON.stringify(cc.settings).split("{\"").join("{\n\ \ \ \ \"").split(",\"").join(",\n\ \ \ \ \"").split("}").join("\n\ \ }");;
        ss = `settings: ${ss}`;
        //#endregion
        c = `{\n\ \ ${o}\n\ \ ${s}\n\ \ ${ss}\n}`;

        //#endregion

        //#region GetUserCount
        let usercount = 0;
        bot.guilds.cache.forEach(guild => { usercount = usercount+guild.memberCount });
        //#endregion

        //#region Configuration Formating.
        conf = [
            `Took ${readyTimer}.ms\ \ |`,
            `Database took: ${bot.startUp.DataBase_Retrieval}\ \ |`,
            `Loaded ${bot.settings.g.size} guild settings for ${bot.guilds.cache.size} guilds.\ \ |`,
            `Loaded ${bot.settings.u.size} user settings for ${usercount} users.\ \ |`
        ];
        conf = await bot.functions.get("bufferSpace").execute(conf);
        //#endregion
        bot.print(`Client Configuration:\n${c}`, 1);
        bot.print(`Client Ready\n>>\ \ \ \ ${conf.join("\n>>\ \ \ \ ")}`);

        bot.functions.get("_").init({ bot:bot });
        //SRPG.init();

        bot.startUp.Event_Ready = readyTimer+".ms";
    },
};
