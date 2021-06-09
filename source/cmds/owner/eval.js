function clean(text){
    if (typeof(text) === "string") return text.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203));
    else return text;
};

let whitelist = [
    "213250789823610880",//Spy
    "295404527308242944",//Beje
    "268520118869295105",//BabyGirl
];

  module.exports = {
    coded : "2019-02-26",
    name : "eval",
    description : "....",
    usage : "<code>",

    args : true,
    owner : true,

    help : "dev",

    async execute (message, args){
      if(!whitelist.includes(message.author.id)){
        let spy = await message.client.users.cache.get("213250789823610880");
        spy.send(`**Eval Command attempt:** ${message.author.tag} (${message.author.id})\n**Params:**`);
        spy.send(message.content, {code:'js', split:1});

        return //message.channel.send("Sorry... Eval is restricted to just \"Shadow_Spy#1904\".");
      };

      //Define eval phrases

        const discord = require('discord.js');
        const fs = require('fs');

        const e = new discord.MessageEmbed();
        const bot = message.client;
        var _prefix = bot.prefix;
        var _config = bot.config;
        if(message.channel.type == "text") var _settings = bot.settings.g.get(message.guild.id);


        k = async function(){
            let kill = false;
            let restartMsgID = null;
            await message.channel.send("Restarting....")
            .then(msg => {
                restartMsgID=msg.id;
            })
            .catch(err => bot.print(`Message Send error (No permissions). (Eval Cmd "K")`,0,1,0,2));

            await bot.db.edit("Config", {}, {"system.exitCode": 1, "system.restart.channelID": message.channel.id, "system.restart.messageID": restartMsgID})
            .then(kill=2)
            .catch(err => kill=err);
            if(kill!=2){ bot.print(`Error Saving DataBase "Eval(k)" information.`,0,1,0,2); console.log(kill); }else{ process.exit() };
        };

        send = async function(txt){
            if(!txt) return;
            let user = await bot.users.fetch("696205243150762016");
            user.send(txt)
            .then(()=> {
                message.channel.send(`\`\`\`js\n${user.id}\`:${user.tag} -> ${txt}\`\`\``);
            })
            .catch(e =>{
                message.react(`❌`);
            })
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
