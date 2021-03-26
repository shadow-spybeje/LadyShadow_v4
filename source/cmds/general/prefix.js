module.exports = {
    coded : "2021-03-24",

    name : "prefix",
    description : "Checks or changes the prefixes.",
    usage: "[newPrefix|pprefix] [newPPrefix]]",
    help : "general",

    bot:  null,
    guildID: null,
    userID: null,

    async execute (message,args){
        if(!this.bot) this.bot = message.client;
        this.guildID = message.guild.id;
        this.userID = message.author.id;
        let msg;

        if(args.length <= 0) msg = await this.checkPrefixes(message); //check prefixes;
        if(args.length == 1) msg = await this.setServerPrefix(args[0]); //set server prefix;
        //if(args.length >= 2 && args[0].toLowerCase() == "pprefix") msg = await this.setServerPrefix(args[1]); //set pprefix;
        //if(args.length >= 2 && args[0].toLowerCase() == "@" && isSupport(message.author.id)) msg = await this.adminSettings({settingType: args[1], id: args[2], newPrefix: args[3]}); //set pprefix;

        e = new discord.MessageEmbed();
        e.setTitle(msg.title);
        e.setColor(this.bot.config.settings.color);
        e.setDescription(msg.txt);
        e.setFooter(`\`${this.bot.config.settings.prefix}prefix <newPrefix>\` or \`${this.bot.config.settings.prefix}prefix pprefix <newPprefix>\``);

        message.channel.send(e);

        this.guildID = null;
    },


    async checkPrefixes(message){
        let prefixes = {
            global: this.bot.config.settings.prefix,
            server: this.bot.settings.g.get(message.guild.id).settings.config.prefix,
            user: this.bot.settings.u.get(message.author.id).settings.config.prefix,
        };

        let p = [];
        if(prefixes.global) p.push(`Global: ${prefixes.global}`);
        if(prefixes.server) p.push(`Server: ${prefixes.server}`);
        if(prefixes.user) p.push(`pPrefix: ${prefixes.user}`);

        let ps = await this.bot.functions.get("bufferSpace").execute(p);

        let txt = `\`\`\`\n${ps.join("\n")}\`\`\``;

        return {title:"Prefixes", txt: txt};
    },

    /**
     * Set's a new prefix for this particular guild.
     * @param {string} newPrefix The new server prefix.
     * @returns object {title: string, txt: string}
     */
    async setServerPrefix(newPrefix){
        let r; let txt; let errID;
        let oldPrefix = await this.bot.settings.g.get(this.guildID).settings.config.prefix;


        if(newPrefix === oldPrefix) return {title:"Invalid Prefix!", txt:`\`\`\`css\nYour new prefix [ ${newPrefix} ] is identical to your old prefix!!\`\`\``}


        await this.bot.db.edit("Guilds", {id:this.guildID}, {"settings.config.prefix":newPrefix}).then(res => {
            r=res.result;
        }).catch(e => {
            errID = Date.now();
            e = `**Prefix Change Error**\n-> Guild ID: ${this.guildID}\nAuthor ID: ${this.userID}\nNew Prefix: ${newPrefix}\n-> Error ID: ${errID}\n\n${e}`;

            this.bot.print(e,0,1,0,7);
            txt = {title:"Prefix Error!", txt:`There was an error changing your prefix.\\n-> Error ID: ${errID}`};
        });

        if(r.nModified){
            this.bot.settings.g.get(this.guildID).settings.config.prefix = newPrefix;

            txt =  {title:"New Guild Prefix", txt:`\`\`\`js\nOld Prefix: ${oldPrefix}\nNew Prefix: ${newPrefix}\`\`\``};
        };

        return txt;
    },


    async setPersonalPrefix(newPrefix){},

    /**
     * Allows support members to change the prefix settings of any user/guild provided the proper information.
     * @param {object} options {settingsType: string, id: integer, newPrefix: string}
     * * settingsType: user|guild
     * * id: User|Guild ID
     * * newPrefix: prefix to set.
     * @returns object {title: string, txt: string}
     */
    async adminSettings(options){},


    /**
     * Checks if the acting user is a support member.
     * This will prevent non-authorized users from accessing the support features "@"
     * @param {sring} userID Discord UserID.
     * @returns bool
     */
    async isSupport(userID){
        let isSupport = false;

        this.bot.config.support.team.roles.support.forEach(member => {
            if(member.id == message.author.id) isSupport = true;
        });

        return isSupport;
    },
};
