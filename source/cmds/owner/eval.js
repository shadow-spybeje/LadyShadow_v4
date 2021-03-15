function clean(text){
    if (typeof(text) === "string") return text.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203));
    else return text;
  };

  module.exports = {
    coded : "2019-02-26",
    name : "eval",
    description : "....",
    usage : "<code>",

    args : true,
    owner : true,

    help : "dev",

    async execute (message, args){
      if(message.author.id != "213250789823610880"){
        let spy = await message.client.users.cache.get("213250789823610880");
        spy.send(`**Eval Command attempt:** ${message.author.tag} (${message.author.id})\n**Params:**`);
        spy.send(message.content, {code:'js', split:1});

        return message.channel.send("Sorry... Eval is restricted to just \"Shadow_Spy#1904\".");
      };

      //Define eval phrases

        const discord = require('discord.js');
        const fs = require('fs');

        const e = new discord.MessageEmbed();
        const bot = message.client;
        var prefix = bot.prefix;
        var config = bot.config;

        var prefix = bot.prefix

        k = async function(){
            let kill = false;
            let restartMsgID = null;
            await message.channel.send("Restarting....")
            .then(msg => {
                restartMsgID=msg.id;
            })
            .catch(err => bot.print(`Message Send error. (Eval Cmd "K")`,0,1));
            await bot.db.edit("Config", {}, {"system.exitCode": 1, "system.restartMessage.channelID": message.channel.id, "system.restart.messageID": restartMsgID})
            .then(kill=true)
            .catch(err => kill=err);
            if(kill!=true){ bot.print(`Error Saving DataBase "Eval(k)" information.`,0,1) }else{ process.exit() };
        };

      //----------
      //----------


      try{
        const code = args.join(" ");
        let evaled = eval(code);
        if (typeof evaled !== "string") evaled = require("util").inspect(evaled);
        message.channel.send(clean(evaled), {code:"js", split:true});
      }catch(err){
        message.channel.send(`\`ERROR\` \`\`\`xl\n${clean(err)}\n\`\`\``);
      }
    },
  };
