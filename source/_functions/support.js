module.exports = {
    name: "support",
    description: "",

    bot: null,
    DB: null,
    supportServers: null,
    unsupportedServers: [],

    async botInit(bot){//initializer method.
        this.bot = bot;
        this.DB = bot.db;
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
        await this.bot.config.support.servers.forEach(async (server) =>{
            if(this.unsupportedServers.includes(server)) return; //if unsupported STOP NOW

            let set = this.bot.settings.g.get(server);
            if(!set) return this.unsupportedServers.push(server); //No server settings found;
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

    /**
     * Throws a support setting for the provided guild.
     * @param {string} reason Reason for the support error.
     * @param {string} serverID ID of the support server that has the error.
     * @param {int} logging Logging Level.
     */
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
