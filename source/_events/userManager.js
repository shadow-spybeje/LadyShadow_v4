module.exports = {
    coded : "2021-03-21",

    name : "userManager",
    description : "This is the \"User Manager\" event handler",

    evalArgs : "bot, 0|1|2|3, guild",
    usage : `\`bot.events.get("${this.name}").execute(${this.evalArgs})\``,

    bot: null,
    DB: null,

    async init(bot){
        this.bot = bot;
    },

    async execute(bot, type, user){
        let exeErr = [];
        if(!type && type != 0) exeErr.push("Type not specified!");
        if(!user) exeErr.push("User not specified!");
        if(exeErr.size > 0) return bot.print("User Manager:\n>> "+exeErr.join("\n>> "),0 ,1);

        this.bot = bot;
        this.DB = bot.db;

        /*if(type == 0){ // Old/Deleted User.
            this.oldUser(user);
        }else*/
        if(type == 1){ // New/Created User.
            this.newUser(user);
        }else{ // This shouldn't happen.
            return;
        };
    },

    /**
     * @param {object} user discord user object
     * @returns integer
     * * 0 = error
     * * 1 = created settings
     * * 2 = has settings
     */
    async hasDbEntry(user){
        let server = false; // this will be our "results", if this remains null, create new user setting.

        //Check if this user has a DB entry.
        await this.DB.get("Users", {id:user.id}).then( results => {
            server = results[0]; //settings found.
        }).catch(e => { this.bot.print(e,0,1); });


        let status; //status will be true or false. if false, the user was either not created, or an error occured in editing the status.

        if(!server){ //server=null, create a new DB entry.
            status = await this.dbAdd(user);
        };

        /**
         * 0 = error
         * 1 = firstJoin
         */
        let type;
        if(status.result.ok){
            //Created Settings
            type = 1;
        }else{
            //ERR -- did NOT return [status.result.ok] !!
            type = 0;
            this.bot.print(`UserManager.hasDbEntry [status.result] error!!\n${status}`,0,1);
        };

        return type;
    },

    /**
     * Creates a database entry in the "Users" database for thie user.
     * @param {object} user discord user object
     * @returns object
     */
    async dbAdd(user){

        let userDatabaseEntry = {
            id: user.id,

            settings: {
                config: {
                    prefix: this.bot.config.settings.prefix,
                    langCode: "en",
                },
                todo: { count:0 },
            },
        };

        let r;
        await this.DB.post("Users", userDatabaseEntry).then(res => {
            r=res;
        }).catch(e => { this.bot.print(e, 0, 1); });

        await this.DB.get("Users", {id:user.id}).then(res =>{
            if(!res[0]) return;

            this.bot.settings.u.set(user.id, res[0]);
        }).catch(e => { this.bot.print(e, 0, 1); });

        return r;
    },


    async newUser(user){

        let type = await this.hasDbEntry(user);


        let u = await this.bot.users.fetch(user.id);
        if(u) user = u;

        let notice = "";

        if(type == 0){
            this.bot.print(`UserManager > ERROR`)
            return this.send(`<@${bot.config.support.team.roles.owner[0]}>\nUserManager.newUser error!!\nID: ${user.id}`);
        }else if(type == 1){
            notice = `New User!`;
        };

        let msg = [
            `Created On: ${user.createdAt}`,
            //`Region: ${user.region}`,
            //`Prefered Locale: ${user.preferredLocale}`,
        ];

        let e = new discord.MessageEmbed();
        e.setTitle(notice);
        e.setAuthor(`${user.tag}, (${user.id})`);
        e.setThumbnail(user.avatarURL("jpeg", true));
        e.setDescription(msg.join("\n"));
        e.setColor(this.bot.config.settings.color);
        e.setTimestamp();

        this.bot.print(`UserManager > ${notice} -> ${user.tag} (${user.id})`)
        this.send('owner', e);

        return type;
    },

    async send(ch, msg){

        switch(ch){
            case("owner"): ch = ["213250789823610880", "295404527308242944"]; break;
            default: return;
        };

        ch.forEach(c => { try{ this.bot.users.cache.get(c).send(msg); }catch(e){ this.bot.print(e,0,1,0,2); } });

        //this.bot.functions.get("supportTeam").send(ch, msg);
    },


    /**
     * Checks if the acting user is a support member.
     * This will prevent non-authorized users from accessing the support features "@"
     * @param {sring} userID Discord UserID.
     * @returns bool
     */
    async isSupport(userID){
        let isSupport = false;

        this.bot.config.support.team.roles.support.forEach(member => {
            if(member.id == userID) isSupport = true;
        });

        return isSupport;
    },

    /**
     * Checks if the acting user is a admin member.
     * This will prevent non-authorized users from accessing the admin features "@"
     * @param {sring} userID Discord UserID.
     * @returns bool
     */
     async isAdmin(userID){
        let isAdmin = false;

        this.bot.config.support.team.roles.admin.forEach(member => {
            if(member.id == userID) isAdmin = true;
        });

        return isAdmin;
    },
};
