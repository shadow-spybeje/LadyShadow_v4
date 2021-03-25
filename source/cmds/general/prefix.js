module.exports = {
    coded : "2021-03-24",

    name : "prefix",
    description : "Checks or changes the prefixes.",
    usage: "[newPrefix|pprefix] [newPPrefix]]",
    help : "general",

    async execute (message,args){
        bot = message.client;
        let msg;

        if(args.length <= 0) msg = await this.checkPrefixes(message); //check prefixes;
        //if(args.length == 1) msg = await this.setServerPrefix(args[0]); //set server prefix;
        //if(args.length >= 2 && args[0].toLowerCase() == "pprefix") msg = await this.setServerPrefix(args[1]); //set pprefix;

        e = new discord.MessageEmbed();
        e.setTitle(msg.title);
        e.setColor(bot.config.settings.color);
        e.setDescription(msg.txt);
        e.setFooter(`\`${bot.config.settings.prefix}prefix <newPrefix>\` or \`${bot.config.settings.prefix}prefix pprefix <newPprefix>\``);

        message.channel.send(e);
    },


    async checkPrefixes(message){
        let prefixes = {
            global: bot.config.settings.prefix,
            server: bot.settings.g.get(message.guild.id).settings.config.prefix,
            user: bot.settings.u.get(message.author.id).settings.config.prefix,
        };

        let p = [];
        if(prefixes.global) p.push(`Global: ${prefixes.global}`);
        if(prefixes.server) p.push(`Server: ${prefixes.server}`);
        if(prefixes.user) p.push(`pPrefix: ${prefixes.user}`);

        let ps = await bot.functions.get("bufferSpace").execute(p);

        let txt = `\`\`\`\n${ps.join("\n")}\`\`\``;

        return {title:"Prefixes", txt: txt};
    },


    async setServerPrefix(newPrefix){},


    async setPersonalPrefix(newPrefix){},
};
