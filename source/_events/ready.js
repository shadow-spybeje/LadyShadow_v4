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
        let wasEvalRestart = null;

        //#region DisplayConfig
        cc = bot.config
        //#region prettify
        o = JSON.stringify(cc.owners).split("[{").join("[\n\ \ \ \ {").split("},{").join("},\n\ \ \ \ {").split("}]").join("}\n\ \ ],");
        o = `owners: ${o}`;
        s = JSON.stringify(cc.support).split("[{").join("[\n\ \ \ \ {").split("},{").join("},\n\ \ \ \ {").split("}]").join("}\n\ \ ],");
        s = `support: ${s}`;
        ss = JSON.stringify(cc.settings).split("{\"").join("{\n\ \ \ \ \"").split(",\"").join(",\n\ \ \ \ \"").split("}").join("\n\ \ }");;
        ss = `settings: ${ss}`;
        sss = JSON.stringify(cc.system).split("{\"").join("{\n\ \ \ \ \"").split(",\"").join(",\n\ \ \ \ \"").split("}").join("\n\ \ }");
        sss = `system: ${sss}`;
        //#endregion
        c = `{\n\ \ ${o}\n\ \ ${s}\n\ \ ${ss}\n\ \ ${sss}\n}`;

        //#endregion

        //#region GetUserCount
        let usercount = 0;
        bot.guilds.cache.forEach(guild => { usercount = usercount+guild.memberCount });
        //#endregion

        //#region Configuration Formating. //"conf"
        conf = [];

        if(bot.config.system.exitCode == 1){
            //#region modify the console-ready
            conf.push(`Client exited with a non-zero exit-code.`);
            conf.push(`bot.system.exitReason[${bot.config.system.exitCode}]: "${bot.system.exitReason[bot.config.system.exitCode]}"`);
            conf.push("|\ \ ----------------------------------------");
            //#endregion
            //#region System.ExitCode ConfigModifications
            if(bot.config.system.exitCode==1){
                if(bot.config.system.restart.channelID){
                    wasEvalRestart = true;

                    bot.db.edit("Config", {}, { "system.restart.channelID": 0, "system.restart.messageID": 0 })
                    .catch(err => bot.print(`Error reseting the system.exitCode: ${err}`));
                };
            };
            //#endregion

            bot.db.edit("Config", {}, {"system.exitCode": 0})
            .catch(err => bot.print(`Error reseting the system.exitCode: ${err}`));
        };

        conf2 = [
            `Took ${readyTimer}.ms`,
            `Database took: ${bot.startUp.DataBase_Retrieval}`,
            `Loaded ${bot.settings.g.size} guild settings for ${bot.guilds.cache.size} guilds.`,
            `Loaded ${bot.settings.u.size} user settings for ${usercount} users.`,
            `Loaded ${bot.cmds.general.size + bot.cmds.owner.size} commands.`
        ];
        conf = conf.concat(conf2);

        conf = await bot.functions.get("bufferSpace").execute(conf);
        //#endregion
        bot.print(`Client Configuration:\n${c}`, 1);
        bot.print(`Client Ready\n>>\ \ \ \ ${conf.join("\ \ |\n>>\ \ \ \ ")}\ \ |`);

        bot.functions.get("_").init({ bot:bot });
        //SRPG.init();

        bot.startUp.Event_Ready = readyTimer+".ms";

        //If the bot was restarted via an eval command, edit the "Restarting...." message to let the author know when the restart completes.
        // //(I tried to run a time, i kept getting `-` and/or "+" numbers.... i just decided to remove it....)
        if(wasEvalRestart){
            bot.channels.cache.get(bot.config.system.restart.channelID).messages.fetch(bot.config.system.restart.messageID)
            .then(msg => msg.edit(`Restarting....\n• Restarted Successfully.`));
        }
    },
};
