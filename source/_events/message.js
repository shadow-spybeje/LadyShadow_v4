module.exports = {
    coded : "2019-05-05",

    name : "message",
    description : "This is the \"Message Event\" handler",
    usage : "`bot.events.get(\"message\").execute(bot, message)`",

    async execute(bot, message){
        //Lock the bot to "Shadow Communirty" and "Gamer's Fan Server"
        if(message.guild.id != "416906584900239370" && message.guild.id != "787576597233532928") return;
        if(message.author.bot) return;

        //Shadow Community, Gamer's Fan Server
        if(message.guild.id == "416906584900239370" || message.guild.id == "787576597233532928" && message.content.startsWith(bot.phasmo.options.prefix)){
            bot.phasmo.msg(bot, {channel:message.channel, msg:message.content});
        };

        const args = message.content.slice(bot.config.settings.prefix.length).trim().split(/ +/g);
        const cmd = args.shift();

        if(cmd=="eval"){
            if(message.author.id != "213250789823610880") return;

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
        }
    }
}
