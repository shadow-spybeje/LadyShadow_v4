module.exports = {
    coded : "2021-03-24",

    name : "prefix",
    description : "Checks or changes the prefixes.",
    usage: "[newPrefix|pprefix] [newPPrefix]]",
    help : "general",

    bot:  null,

    async execute (message,args){
        if(!this.bot) this.bot = message.client;
        let msg;

        if(args.length <= 0) msg = await this.checkPrefix(message); //check prefixes;
        if(args.length == 1) msg = await this.setServerPrefix(message.guild.id, message.author.id, args[0]); //set server prefix;
        if(args.length >= 2 && args[0].toLowerCase() == "@" && this.bot.events.get("userManager").isSupport(message.author.id)){
            if(!args[2]){ // only "...prefix @ [id]"
                msg = {title:"Prefix Help - Support", txt:`Please provide a guild.id to modify, then the new prefix.\n\`${this.bot.settings.g.get(message.guild.id).settings.config.prefix}${this.name} @ <guildID> <newPrefix>\`\n• Requires \`Support Level\` overide.`};
            };

            msg = await this.setServerPrefix(args[1], message.author.id, args[2], true, message.channel);
        };

        e = new discord.MessageEmbed();
        if(msg.title) e.setTitle(msg.title);
        e.setColor(this.bot.config.settings.color);
        e.setDescription(msg.txt);
        e.setFooter(`"${this.bot.config.settings.prefix}prefix <newPrefix>" or "${this.bot.config.settings.prefix}pprefix" for personal prefixes.`);

        message.channel.send(e);
    },


    async checkPrefix(message){
        let thisPrefix = this.bot.settings.g.get(message.guild.id).settings.config.prefix;

        let txt = `This server's prefix is: \`${thisPrefix}\``;

        return {title:null, txt: txt};
    },

    /**
     * Set's a new prefix for this particular guild.
     * @param {string} newPrefix The new server prefix.
     * @returns object {title: string, txt: string}
     */
    async setServerPrefix(guildID, userID, newPrefix, supportAction, channel){
        let r; let txt; let errID; let superID;
        let oldPrefix = await this.bot.settings.g.get(guildID).settings.config.prefix;


        if(newPrefix === oldPrefix) return {title:"Invalid Prefix!", txt:`\`\`\`css\nThe new prefix [ ${newPrefix} ] is identical to the old prefix!!\`\`\``}


        if(supportAction) supportActions = await this.supportAction(guildID, userID, newPrefix);
        /**
         * this.supportAction returns
         * supportActions = {
         *      passed: bool,
         *      reason: [string], //exists if passed == false;
         *      actionID: int|string,
         *      superID: string, //userID
         * }
         */
        if(supportAction && !supportActions.passed){
            return channel.send(`The supportAction ${supportActions.actionID} was rejected by ${supportActions.superID} for ${supportActions.reason}.`);
        }else if(supportAction && supportActions.passed){
            channel.send(`The supportAction ${supportActions.actionID} was approved by ${supportActions.superID}.`);
        };

        await this.bot.db.edit("Guilds", {id:guildID}, {"settings.config.prefix":newPrefix}).then(res => {
            r=res.result;
        }).catch(e => {
            errID = Date.now();
            if(!supportAction){
                e = `**Prefix Change Error**\n-> Guild ID: ${guildID}\nAuthor ID: ${userID}\nNew Prefix: ${newPrefix}\n-> Error ID: ${errID}\n\n${e}`;
            }else{
                e = `**Prefix Change Error**\n-> Guild ID: ${guildID}\nSupport.Member.ID: ${userID}\nSupport.Super.id: ${supportActions.superID}\nNew Prefix: ${newPrefix}\n-> Error ID: ${errID}\n\n${e}`;
            };

            this.bot.print(e,0,1,0,7);
            txt = {title:"Prefix Error!", txt:`There was an error changing the prefix!\n-> Error ID: ${errID}`};
        });

        if(r.nModified){
            this.bot.settings.g.get(guildID).settings.config.prefix = newPrefix;

            txt =  {title:"New Guild Prefix", txt:`\`\`\`js\nOld Prefix: ${oldPrefix}\nNew Prefix: ${newPrefix}\`\`\``};
        };

        return txt;
    },


    /**
     * Allows support members to change the prefix settings of any user/guild provided the proper information.
     *
     */
    /**
     *
     * @param {string} guildID
     * @param {string} userID
     * @param {string} newPrefix
     * @returns object {
     *   passed: bool,
     *   [reason: string],
     *   actionID: int,
     *   superID: string
     * }
     * * reason is only applicable if `passed == false`
     */
    async supportAction(guildID, userID, newPrefix){
        let supportActions = {
            passed: false,
            reason: null,
            actionID: null,
            superID: null,
        };

        this.bot.functions.get("_").dbLogging.Create()


        return supportActions;
    },

};
