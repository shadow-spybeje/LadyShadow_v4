const { init } = require("../other/SRPG/main");

module.exports = {
    name: "support",
    description: "",

    bot: null,
    DB: null,
    supprtServers: null,
    unsupportedServers: [],

    async init(bot){//initializer method.
        if(!bot) return false;

        this.bot = bot;
        this.DB = bot.db;
        this.supportServers = bot.config.supportServers;

        return true;
    },

    /**
     *
     * @param {array} channels array of channel ID's to send a message to.
     * @param {*} msg The message to send.
     */
    async _send(channels, msg){
        await channels.forEach(async(ch) => {
            await this.bot.channels.cache.get(ch).send(msg).catch(e => this.bot.print(`${e.name} > ${e.message}`,0,1));
        });
    },

    /**
     *
     * @param {string} ch the channel type to send messages to.
     * * serverStatus - Guild Join/Leave Event.
     * * logging - console logging.
     * @param {*} msg  The message to send.
     */
    async send(ch, msg){
        //settings.support[ch]

        let channels = [];
        await this.supportServers.forEach(async (server) =>{
            if(this.unsupportedServers.includes(server)) return; //if unsupported STOP NOW

            let set = this.bot.settings.g.get(server);
            if(!set) return this.unsupportedServers.unshift(server); //No server settings found;
            //set = set.settings;

            if(set.settings.support && !set.supportError){
                set = set.settings.support;
                if(set.listening){
                    if(set[ch]){
                        channels.push(set[ch]);
                    }else{
                        this.supportError(`Support Settings ${ch} not setup!!`,server,7);
                    };
                }else{
                    this.supportError(`Server not listening to Support Messages`,server,7);
                };
            }else{
                this.supportError(`Support settings not found`,server,10);
            };

        });//sprt.forEach

        this._send(channels, msg);
    },

    async supportError(reason, serverID, logging){
        this.unsupportedServers.push(serverID);

        await this.DB.edit("Guilds", {id:serverID}, {supportError:reason}).then(async (r) => {
            await this.DB.get("Guilds", {id:serverID}).then(async (r) =>{
                if(![0]) return; //
                await this.bot.settings.g.set(serverID, r[0]);
                this.bot.print(`${reason}!!\nID:${serverID}`,0,1,0,logging);
            }).catch(e => this.bot.print(e,0,1));
        }).catch(e => this.bot.print(e,0,1));


        //this.bot.print(`${reason}!!\nID:${serverID}`,0,1,0,logging);
    },
};
