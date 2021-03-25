module.exports = {
    coded : "2019-05-05",

    name : "message",
    description : "This is the \"Message Event\" handler",
    usage : "`bot.events.get(\"message\").execute(bot, message)`",

    async execute(bot, message){

        //Lock the bot to "Shadow Communirty" and "Gamer's Fan Server"
        //if(message.channel.type == "text" && message.guild.id != "416906584900239370" && message.guild.id != "787576597233532928") return;
        if(message.author.bot) return;

		//#region External Modules

        // Phasmo module.
        if(message.content.startsWith(bot.phasmo.options.prefix)){
            return bot.phasmo.msg(bot, {channel:message.channel, msg:message.content, userid:message.author.id});
        };

		//#endregion

		//#region Prefix Check
		let prefix = bot.config.settings.prefix;
		let sPrefix = bot.settings.g.get(message.guild.id).settings.config.prefix;
		let pPrefix = false; //false, in case we don't have a setting for this user.
		let args;

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
