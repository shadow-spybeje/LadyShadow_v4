
const db = require("../../DataBase/main");

module.exports = {
    coded : "2019-05-05",

    name : "message",
    description : "This is the \"Message Event\" handler",
    usage : "`bot.events.get(\"message\").execute(bot, message)`",

    async execute(bot, message){

        //Lock the bot to "Shadow Communirty" and "Gamer's Fan Server"
        //if(message.channel.type == "text" && message.guild.id != "416906584900239370" && message.guild.id != "787576597233532928") return;

        //if not shadow (Prevent looping)
        if(message.channel.type=="dm" && message.author.id != "378974861046841344" && message.author.id != "213250789823610880") bot.users.cache.get("213250789823610880").send(`${message.author.id}:${message.author.tag} -> ${message.content}`);

        if(message.channel.type=="text" && message.content != ""){
            let data = {
                guild_id:message.guild.id,
                channel_id:message.channel.id,
                message_id:message.id,
                author_id:message.author.id,
                author_tag:message.author.tag,
                content:message.content,
                edits:[],
                isDeleted:false
            };

            try{
                db.post("messageManager", data);
            }catch(e){
                console.error("Error uploading message to database: ", e);
            };
        };
		//#region External Modules

        // Phasmo module.
        if(message.content.startsWith(bot.modules.phasmo.options.prefix)){
            return bot.modules.phasmo.msg(bot, {channel:message.channel, msg:message.content, userid:message.author.id});
        };

        // SagaSpace Module
        if(message.content.startsWith(bot.modules.sagaspace.prefix)){
            return bot.modules.sagaspace.MessageHandler(message);
        };

        //Shadow @Bot Sass Module
        // "Anime Background Server"("Kath/Alexis")
        if(message.channel.type == "text" && message.guild.id == "522746713514180608" && message.author.bot){
            return bot.modules.shadowSass_bots.executer(message);
        };

        //advertisement blocker
        if(message.channel.type == "text" && message.author.id != message.guild.owner.id && message.content.includes("discord.gg")){
            if(message.guild.id != "522746713514180608") return;
            if(!message.client.settings.g.get(message.guild.id).settings.config.stopAdvertising) return;

            let kickAt = message.client.settings.g.get(message.guild.id).settings.config.kickAt;
            let banAt = message.client.settings.g.get(message.guild.id).settings.config.banAt;
            let warnings = message.client.settings.g.get(message.guild.id);


            if(!kickAt && !banAt) return;

            let sassyWarnings = [
                "Dude, you need to listen. This is your {warn} warning. I WILL kick you...",
                "Your {Warn} warning.... Stop before I make you.",
                "You really don't want to be here anymore huh? ${warn}"
            ];

            let baseWarning = 3;
            if(kickAt < baseWarning) baseWarning = kickAt;

            if(!warnings[message.author.id]) warnings[message.author.id] = 0;
            warnings[message.author.id]++;
            message.delete();

            if(warnings[message.author.id]<=baseWarning) return message.channel.send(`:warning: Advertising detected! :warning:\nWarning strike ${warnings[message.author.id]} against ${message.author}`);

            let warnMsg = sassyWarnings[message.client.functions.fet("_").rand(sassyWarnings.length,1)];
            warnMsg = warnMsg.replace("{warn}", warnings[message.author.id]);
            if(warnings[message.author.id]>baseWarning) return message.channel.send(`:warning: Advertising detected! :warning:\n${warnMsg}`);

            if(warnings[message.author.id]==(kickAt-1)) return message.channel.send(`Advertising detected. Warning strike ${warnings[message.author.id]} against ${message.author}\n:warning: Stop advertising!! This is your __***LAST***__ warning!! :warning:`);

            if(warnings[message.author.id]>=kickAt) {
                try{
                    if(!message.guild.me.hasPermissions("KICK_MEMBERS")){
                        let appealEmbed = `{\n\ \ appeal:'kick'\n\ \ o:${message.guild.owner.id}\n\ \ eval:bot.warnings[${message.guild.id}][${message.author.id}]\n}`;

                        message.author.send(`You have been kicked from ${message.guild.name} for exceeding your alloted warning limit.\nYour last warning was for: ${warnings[message.author.id].lastReason}.\n  If you believe this was made in error, please contact the Shadow support team with the following information.\`\`\`js\n${appealEmbed}\`\`\``);

                        message.guild.members.fetch(message.author.id).kick("Advertising").then(()=>{
                            message.channel.send(`Advertising detected. Warning strike ${warnings[message.author.id]} against ${message.author}\n:x: **USER HAS BEEN KICKED** :x:`)
                          }).catch(e => { console.error(e)});
                    };
                }catch(e){console.log(e)};
            }
        }

        //Mention Spamms
        if(message.content.includes("<@")){
            try{
                await bot.modules.spamMentions.execute(message).then(warning => {
                    if(warning) return console.log(warning);
                });
            }catch(e){
                console.error(e);
            };
        };

		//#endregion

        if(message.author.bot) return;

		//#region Prefix Check
        let prefix, sPrefix, pPrefix, args = false;
		prefix = bot.config.settings.prefix;
		if(message.channel.type == "text") sPrefix = bot.settings.g.get(message.guild.id).settings.config.prefix;

		let uSettings = bot.settings.u.get(message.author.id);
		if(uSettings) pPrefix = uSettings.settings.config.prefix; //we have a settingsFile. Set pPrefix.

		//Check for a global, server, or personal prefix.
		if(message.content.startsWith(prefix)){
			args = message.content.slice(prefix.length).trim().split(/ +/g);
		}else if(message.content.startsWith(sPrefix)){
			args = message.content.slice(sPrefix.length).trim().split(/ +/g);
		}else if(pPrefix && message.content.startsWith(pPrefix)){
			args = message.content.slice(pPrefix.length).trim().split(/ +/g);
		}else{ return; };

		//#endregion

        //Command handler.
        bot.functions.get('cmds').execute(message, args);
    },



    eval(message, args){
        if(message.author.id != "213250789823610880"){
          let spy = message.client.users.cache.get("213250789823610880");
          spy.send(`**Eval Command** attempt: ${message.author.tag} (${message.author.id})\n**Params:**`);
          spy.send(message.contents);

          return message.author.send("Sorry... Eval is restricted to just \"Shadow_Spy#1904\".");
        };

        //Define eval phrases

          const discord = require('discord.js');
          const fs = require('fs');

          const e = new discord.MessageEmbed();
          const bot = message.client;
          var prefix = bot.prefix;
          var config = bot.config;

          k = async function(){
              let kill = false;
              let restartMsgID = null;
              await message.channel.send("Restarting....")
              .then(msg => {
                  restartMsgID=msg.id;
              })
              .catch(err => bot.print(`Message Send error. (Eval Cmd "K")`,0,1));
              await bot.db.edit("Config", {}, {"system.exitCode": 1, "system.restart.channelID": message.channel.id, "system.restart.messageID": restartMsgID})
              .then(kill=true)
              .catch(err => kill=err);
              if(kill!=true){ bot.print(`Error Saving DataBase "Eval(k)" information: ${kill}`,0,1) }else{ process.exit() };
          };

        //----------
        //----------


        function clean(text){
            if (typeof(text) === "string") return text.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203));
            else return text;
        };



        try{
          const code = args.join(" ");
          let evaled = eval(code);
          if (typeof evaled !== "string") evaled = require("util").inspect(evaled);
          message.channel.send(clean(evaled), {code:"js", split:true});
        }catch(err){
          message.channel.send(`\`ERROR\` \`\`\`xl\n${clean(err)}\n\`\`\``);
        }
    },
}
