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
        o = JSON.stringify(cc.support.team.roles.owner).split("[{").join("[\n\ \ \ \ {").split("},{").join("},\n\ \ \ \ {").split("}]").join("}\n\ \ ],");
        o = `owners: ${o}`;
        s = JSON.stringify(cc.support.team.roles.support).split("[{").join("[\n\ \ \ \ {").split("},{").join("},\n\ \ \ \ {").split("}]").join("}\n\ \ ],");
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

        if(bot.config.system.exitCode == 1){ //Was eval restart.
            //#region modify the console-ready
            conf.push(`Client exited with a non-zero exit-code.`);
            conf.push(`bot.system.exitReason[${bot.config.system.exitCode}]: "${bot.system.exitReason[bot.config.system.exitCode]}"`);
            conf.push("|\ \ ----------------------------------------");
            //#endregion
            //#region System.ExitCode ConfigModifications
            switch(bot.config.system.exitCode){
                case(1):
                    if(bot.config.system.restart.channelID){
                        wasEvalRestart = true;

                        bot.db.edit("Config", {}, { "system.restart.channelID": 0, "system.restart.messageID": 0 })
                        .catch(err => bot.print(`Error reseting the system.exitCode: ${err}`));
                    };
                break;
                default: bot.print(`ExitReason error: code[${bot.config.system.exitCode}] not found!!`,0,1,0,7); //should not hit this.
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
            `Loaded ${bot.cmds.general.size + bot.cmds.owner.size} commands.`,
        ];
        conf = conf.concat(conf2);

        conf = await bot.functions.get("bufferSpace").execute(conf);

        let dateLength = new Date().getDate().toString().length;
        let spaces = "";
        for (i = 0; i < dateLength; i++) { spaces = spaces+"\ " };
        //#endregion
        bot.print(`Client Configuration:\n${c}`, 1);
        bot.print(`Client Ready\n>>\ \ \ ${spaces}${conf.join(`\ \ |\n>>\ \ \ ${spaces}`)}\ \ |`);

        //SRPG.init();

        bot.startUp.Event_Ready = readyTimer+".ms";

        //If the bot was restarted via an eval command, edit the "Restarting...." message to let the author know when the restart completes.
        if(wasEvalRestart){
            bot.channels.cache.get(bot.config.system.restart.channelID).messages.fetch(bot.config.system.restart.messageID)
            .then(msg => msg.edit(`Restarting....\n• Restarted Successfully.`));
        };


        bot.functions.forEach(async (fn) =>{
            if(fn.botInit){ await fn.botInit(bot) };
        });
        bot.events.forEach(async (fn) =>{
            if(fn.botInit){ await fn.botInit(bot) };
        });

        bot.util.init(bot);



        if(bot.guilds.cache.has("522746713514180608") && bot.guilds.cache.get("522746713514180608").available){
            let posts = [
                `\`\`\` \`\`\`WORSHIP KATH, OUR GODDESS, OR YOUR LIFE SHALL END WITH PAIN AND SUFFERING!!\n*Her voice booms and echos as though the very air itself speaks.\n  Shadow's eyes are that of pure darkness, a cloud of shadow forms blotting out all light around the non worshipers.*\`\`\` \`\`\``,

                `\`\`\` \`\`\`WORSHIP THE __**SUPREME**__ LEADER FOR THE REST OF YOUR PITIFUL LIVES!!!\`\`\` \`\`\``,
            ];

            let num = bot.functions.get("_").rand(posts.length-1,true);
            console.log(`Kath message poster #: ${num}`)
            bot.channels.cache.get("522746714352910337").send(posts[num]);
            setInterval(function(){
                num = bot.functions.get("_").rand(posts.length-1,1);
                console.log(`Kath message poster #: ${num}`);
                bot.channels.cache.get("522746714352910337").send(posts[num]);
            }, 14400000)
        };
    },
};
