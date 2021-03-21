const { GuildAuditLogs } = require("discord.js");
const { send } = require("../other/phasmo");
const { bot } = require("../_functions/_functions");

module.exports = {
    coded : "2021-03-21",

    name : "guildManager",
    description : "This is the \"Guild Manager\" event handler",

    evalArgs : "bot, 0/1, guild",
    usage : `\`bot.events.get("${this.name}").execute(${this.evalArgs})\``,

    bot: null,
    DB: null,

    async execute(bot, type, guild){
        let exeErr = [];
        if(!type && type != 0) exeErr.push("Type not specified!");
        if(!guild) exeErr.push("Guild not specified!");
        if(exeErr.size > 0) return bot.print("Guild Manager:\n>> "+exeErr.join("\n>> "),0 ,1);

        this.bot = bot;
        this.DB = bot.db;

        if(type == 0){ // Old/Deleted Guild.
            this.oldGuild(guild);
        }else if(type == 1){ // New/Created Guild.
            this.newGuild(guild);
        }else if(type == 2){
            //Add support settings.
            /*
            {
                listening: bool,
                serverStates: string,
                logging: string,
            }
            */
        }else{ // This shouldn't happen.
            return;
        };
    },


    async dbAdd(guild){

        let guildDatabaseEntry = {
            status: 1,
            id: guild.id,

            settings: {
                config: {
                    prefix: this.bot.config.settings.prefix,
                    mentionSpamCount: 0,
                },

                channels: {
                    welcome: "",
                    greet: "",
                    farewell: "",
                },
                roles: {
                    staff: "",
                    mute: "",
                    onJoin: [],
                }
            }
        };

        let r;
        await this.DB.post("Guilds", guildDatabaseEntry).then(res => {
            r=res;
        }).catch(e => { this.bot.print(e, 0, 1); });

        await this.DB.get("Guilds", {id:guild.id}).then(res =>{
            if(!res[0]) return;

            this.bot.settings.g.set(guild.id, res[0]);
        }).catch(e => { this.bot.print(e, 0, 1); });

        return r;
    },


    async newGuild(guild){

        let server = false; // this will be our "results", if this remains null, create new guild setting.

        //Check if this guild has a DB entry.
        await this.DB.get("Guilds", {id:guild.id}).then( results => {
            server = results[0]; //settings found.
        }).catch(e => { this.bot.print(e,0,1); });


        let status; //status will be true or false. if false, the guild was either not created, or an error occured in editing the status.

        if(!server){ //server=null, create a new DB entry.
            status = await this.dbAdd(guild);
        }else{ //server!=null, edit status = 1.
            await this.DB.edit("Guilds", {id:guild.id}, {status: 1}).then(r => {
                status = r;
            }).catch(e => { this.bot.print(e,0,1)});
        };

        /**
         * 0 = error.
         * 1 = firstJoin.
         * 2 = rejoin.
         */
        let type;
        if(status.result.nModified && status.result.ok){
            //Guild Rejoin.
            type = 2;
        }else if(!status.result.nModified && status.result.ok){
            //Guild First Join.
            type = 1;
        }else{
            //ERR -- did NOT return [status.result.ok] !!
            type = 0;
            this.bot.print(`GuildManager.newGuild [status.result] error!!\n${status}`,0,1);
        };


        if(!guild.owner){
            await guild.members.fetch(guild.ownerID) // Fetches owner
            .then(guildMember => owner = guildMember);
            guild.owner = owner;
        };

        let g = await this.bot.guilds.fetch(guild.id);
        if(g) guild = g;

        let e = new discord.MessageEmbed();
        e.setColor("GREEN");
        e.setTimestamp();
        e.setAuthor(guild.name);
        e.setThumbnail(guild.iconURL("jpeg",true));
        e.setFooter(`${guild.owner.user.tag} (${guild.owner.id})`, guild.owner.user.avatarURL("jpeg", true));

        let notice = "";

        if(type == 0){
            this.bot.print(`GuildManager > ERROR`)
            return this.send(`<@${bot.config.owners[0]}>\nGuildManager.newGuild error!!\nID: ${guild.id}`);
        }else if(type == 1){
            notice = "New Guild!";
            e.setTitle(notice);
        }else if(type == 2){
            notice = "Rejoining a Guild!!";
            e.setTitle(notice);
        };

        let msg = [
            `Created On: ${guild.createdAt}`,
            `Region: ${guild.region}`,
            `Prefered Locale: ${guild.preferredLocale}`,
            `Members: ${guild.memberCount}`
        ];
        e.setDescription(msg.join("\n"));

        this.bot.print(`GuildManager > ${notice}`)
        this.send(e);
    },


    async oldGuild(guild){

        let exists;
        let dbAdd;
        let status;

        await this.DB.get("Guilds", {id:guild.id}).then(res => {
            if(!res[0]) return;
            exists = true;
        }).catch(e => { this.bot.print(e, 0, 1); });

        if(!exists){
            dbAdd = await this.dbAdd(guild);
            if(!dbAdd) this.bot.print(`An error occured created a new guildSettings for an old guild.\nID: \`${guild.id}`,0,1,0,7);
        };

        await this.DB.edit("Guilds", {id:guild.id}, {status:0}).then(res =>{
            status=res;
        }).catch(e => { this.bot.print(e, 0, 1); });


        if(status.result.nModified && status.result.ok){
            //Guild First Join.
            type = 1;
        }else{
            //ERR -- did NOT return [status.result.ok] !!
            type = 0;
            this.bot.print(`GuildManager.oldGuild [status.result] error!!\n${status}`,0,1);
        };

        if(!guild.owner){
            guild._owner = {};
            guild._owner.user = await this.bot.users.fetch(guild.ownerID)
        };

        let e = new discord.MessageEmbed();
        e.setColor("RED");
        e.setTimestamp();
        e.setAuthor(guild.name);
        e.setThumbnail(guild.iconURL("jpeg",true));
        if(guild._owner){
            e.setFooter(`${guild._owner.user.tag} (${guild.ownerID})`, guild._owner.user.avatarURL("jpeg", true));
        }else{
            e.setFooter(`${guild.owner.user.tag} (${guild.owner.id})`, guild.owner.user.avatarURL("jpeg", true));
        };

        let notice = "";

        if(type == 0){
            this.bot.print(`GuildManager > ERROR`)
            return this.send(`<@${this.bot.config.owners[0]}>\nGuildManager.newGuild error!!\nID: ${guild.id}`);
        }else if(type == 1){
            notice = "Old Guild!";
            e.setTitle(notice);
        };


        let msg = [
            `Created On: ${guild.createdAt}`,
            `Joined At: ${guild.me.joinedAt}`,
            `Region: ${guild.region}`,
            `Prefered Locale: ${guild.preferredLocale}`,
            `Members: ${guild.memberCount}`
        ];
        e.setDescription(msg.join("\n"));

        this.bot.print(`GuildManager > ${notice}`)
        this.send(e);
    },

    async send(msg){
        this.bot.print("GuildManager > Executing Send.")

        this.bot.functions.get("support").send("serverStatus", msg);
    },
};
