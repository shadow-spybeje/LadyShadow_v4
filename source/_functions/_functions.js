module.exports = {
    bot: null,

    /**
     *
     * @param {object} params
     * * bot {*} discord.client;
     */
    init(params){
        if(params.bot) this.bot = params.bot
    },

    /**
     * Parses an @user discord mention, and returns the ID of that mention.
     * @param {string} mention Discord User <@[!]DiscordID>
     */
    async getUserFromMention(mention) {
        let isMention = null;
        if(isNaN(mention)){ isMention = true; }else{ isMention = false; };
        //#region Check for an ID.
        // The id is the first and only match found.
        let matches = null;
        if(isMention){
            matches = mention.match(/^<@!?(\d+)>$/);
            if(!matches) return;
        }else{
            matches = ["", mention];
        };

        // However the first element in the matches array will be the entire mention, not just the ID,
        // so use index 1.
        const id = matches[1];
        //#endregion
        //#region Get User
        //Grab the user. If we don't know who they are, ask discord.
        let u = null;
        try{
            u = await this.bot.users.fetch(id);
        }catch(err){
            this.bot.print(`${err.name} -> ${err.message}`, 1);
        };
        //#endregion
        //If the user isn't a true discord user, return undefined.
        if(!u) return;
        return u;
    },


    /**
     * Parses an @role discord mention, and returns the ID of that mention.
     * @param {string} mention Discord Role <@[!]DiscordID>
     */
         async getRoleFromMention(guild, mention) {
             if(!guild || !mention) throw new TypeError("'guild' or 'mention' cannot be undefined!");

            let isMention = null;
            if(isNaN(mention)){ isMention = true; }else{ isMention = false; };
            //#region Check for an ID.
            // The id is the first and only match found.
            let matches = null;
            if(isMention){
                matches = mention.match(/^<@&?(\d+)>$/);
                if(!matches) return;
            }else{
                matches = ["", mention];
            };

            // However the first element in the matches array will be the entire mention, not just the ID,
            // so use index 1.
            const id = matches[1];
            //#endregion
            //#region Get Role
            //Grab the role. If we don't know what it is, ask discord.
            let r = null;
            try{
                r = await guild.roles.fetch(id);
            }catch(err){
                this.bot.print(`${err.name} -> ${err.message}`, 1);
            };
            //#endregion
            //If the role isn't a true discord role on this guild, return undefined.
            if(!r) return;
            return r;
        },


    /**
     * Request a random number between 1 and num, if num is not defined num = 6
     * @param {int} num Maximum number to roll.
     * @returns {int} a number between 1 and num
     */
    rand(maxNum, allowZero){
        if(maxNum===undefined || maxNum===false) maxNum = 6;
        minNum = 1;
        if(allowZero){ minNum = 0; }else{ minNum = 1 };
        let t = Math.floor(Math.random() * (maxNum - minNum + 1)) + minNum;
        return t
    },


    async isSupport(userID){
        let isSupport = false;
        await this.bot.config.support.team.members.forEach(member =>{
            if(isSupport) return;
            if(userID == member.id) isSupport = true;
        });
        return isSupport;
    },


    /*dbLogging = {
        async create(options){
            let r = false;
            this.bot.db.post("Log", options).then(res => {
                r=res;
            }).catch(e => { this.bot.print(e,0,1,0,7)});
            return r;
        },
    },*/
};
