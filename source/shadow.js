/**
 * {HSF}LadyShadow#7111
 * * V.4.0.2a
 * * December 5'th, 2020
 * * Developed By: "Shadow_Spy#1904" (ScionSpy), and "Bejebajay#1904"
 * * Support Invite: https://discord.gg/9FUpBPQ
 * * * LadyShadow is a basic Discord Moderation bot with other logging features.
 * * * Shadow includes other "fun" commands, as well as being the central hub for a Server to Server "Rift" and the main place for the "Shadow RPG".
*/
let readyTimer = Date.now();
const discord = require("discord.js");
const bot = new discord.Client({ ws: { intents: 515 } });
bot.readyTimer = readyTimer;

var trimer = async function(array){
    newArray = [];
    array.forEach(listing => {
        newArray.push({ id: listing.id, name: listing.name });
    });
    return newArray;
};

/**
 * Prints a message to the console.
 * @param {string} msg Message to print to console.
 * @param {bool} debugOnly Should this only show during debugging?
 * @param {string} error Error to display (Good for stack traces)
 * @param {boolean} preReady is this a console post before "ready" event?
 * @param {integer} logging logging levels for varying information.
 * * 2 Info
 * * 5 Notice
 * * 7 Moderate
 * * 10 Severe
 */
bot.print = function(msg, debugOnly, error, preReady, logging){
    let post = ""; let spmCh, isFound = false;;


    if(debugOnly){
        if(!bot.config.settings.debug) return;
        post = `>> [${bot.functions.get("date").execute(Date.now())}] -> (Debug) ${msg}`
    }else{
        post = `>  [${bot.functions.get("date").execute(Date.now())}] -> ${msg}`
    };

    if(!preReady) spmCh = bot.channels.cache.get("806398879787909131");
    if(!preReady && spmCh) isFound = true;

    if(!preReady && !isFound) console.log(`\n(!) (!) (!) Dedicated discord console notFound!! (!) (!) (!)`);

    if(error){
        post = `>  [${bot.functions.get("date").execute(Date.now())}] -> \n---> Error -> `;
        console.error(post, msg);
        if(!preReady && isFound) spmCh.send(`\`\`\`js\n${post} ${msg}\`\`\``);
    }else{
        console.log(post);
        if(!preReady && isFound) spmCh.send(`\`\`\`js\n${post}\`\`\``);
    };

    if(logging){// return bot.print(`Level ${logging} Logging was enabled, but rejected. [support] functions not setup!!`);
        let atch = "";
        switch(logging){
            case(2): atch = `\`[2] Info\``+post; break;
            case(5): atch = `\`[5] Notice\``+post; break;
            case(7): atch = `<@${bot.config.owners[0].id}>, \`[7] Moderate\`\n`+post; break;
            case(10): atch = `<@${bot.config.owners[0].id}>, \`[10] Severe\`\n`+post; break;
            default: atch = `\`[${logging}] Unknown level\`\n`+post;
        };
        bot.functions.get("support").send("logging", atch);
    };

};

bot.startUp = async function(bot){
    //bot.startUp = {};
    let time = Date.now();

    const system = require("./_system");
    await system.collections(bot, discord);

    //Attach external modules here.
    bot.db = require("../DataBase/main");
    bot.phasmo = require("./other/phasmo");
    bot.srpg = require("./other/SRPG/main");


    const db = require('../../.././tokens.json').db; //database credentials.
    await bot.db.init([db.username, db.password], {database: "LilithShadow"})
    .then(op => bot.print(`Initialized the database with the options: ${JSON.stringify(op)}`, 0, 0, 1))
    .catch(err => { return bot.print(err, 0, 1, 1) });

    let sus = false; //is only True if db fails to load. //How do we set this?!? vvv
    let config, team, blacklist

    await bot.db.get("Config").then(r => { config = r[0] }).catch(err => { return bot.print(err, 0, 1, 1) });
    await bot.db.get("SupportTeam").then(r => { team = r }).catch(err => { return bot.print(err, 0, 1, 1) });
    await bot.db.get("Blacklist").then(r => { blacklist = r }).catch(err => { return bot.print(err, 0, 1, 1) });

    if(sus) throw "Throwing [sus] :: Database Error!!!"; //How do we set this?!? ^^^

    owners = [];
    support = [];

    await team.forEach(member => {
        if(member._roles.includes("Owner")) owners.push({id:member.id, tag:member._tag});
        if(member._roles.includes("Support")) support.push({id:member.id, tag:member._tag});
    });

    bot.blacklist = await trimer(blacklist);


    bot.config = {
        owners: owners,
        support: support,
        settings:{
            prefix: config.prefix,
            debug: config.debug,
            dmHelp: config.dmHelp
        },
        system: config.system,
        version: {
            str: `${config.version.major}.${config.version.minor}.${config.version.patch}`,
            v: config.version,
            type: config.version.type
        },

        stats: {
            cmdCount: 0,
            uniqueUsers: []
        },

        supportServers:config.supportServers,


    };

    bot.print("Loaded Configuration Files....",0,0,1)
    if(config.debug) console.log(bot.config)


    await bot.db.get("Guilds", {}, {_id:0}).then(guilds => {
        guilds.forEach(guild => {
            bot.settings.g.set(guild.id, guild);
        });
    });

    bot.config.supportServers.forEach(server => {
        let set = bot.settings.g.get(server);
        if(!set) return;
        if(set.supportError){
            let err = set.supportError;
            bot.db.edit("Guilds", {id:server}, {supportError:null}).then(r => {
                bot.print(`Resetting SupportError for server \`${server}\`. Err: ${err}`,0,0,1);
            }).catch(e => { bot.print(`Error resseting supportError on server \`${server}\`\n${e}`,0,1,1) });
        };
    });

    await bot.db.get("Settings_Users").then(users => {
        users.forEach(user => {
            bot.settings.u.set(user.id, user);
        });
    });

    let s = await bot.functions.get("support").init(bot);
    if(!s) bot.config.s = `{msg:"Support failed to initialize!!",debugOnly:0,err:1,preReady:0,logging:10}`;

    time = Date.now() - time;

    bot.print(`Database retrieval finished. (Took ${time}.ms)`, 0, 0, 1);
    bot.startUp.DataBase_Retrieval = time+".ms";
};

try{
    bot.startUp(bot);
    bot.system.exitReason = {
        ["1"]: "Eval kill"
    };

    const token = require('../../.././tokens.json').Beta;//LadyShadow;
    bot.login(token)
}catch(err){
    bot.print(err,0,1);
};


//#region Listeners
bot.on('ready', () => { bot.events.get('ready').execute(bot); });


//Message Stuff.
bot.on('message', (message) => {
	if(message.partial){
        message.fetch().then(msg => { message=msg }).catch(err => { return console.log(err) })
    };
	bot.events.get('message').execute(bot, message);
});


/**
 *
 * @param {boolean} type Type of GuildManager to fire.
 * * 0 = Old/Deleted guild.
 * * 1 = New/Created guild.
 * @param {*} guild The guild in question.
 */
 let guildManager = async function(type, guild){

    if(guild.partial){
        guild.fetch().then(g => { guild=g }).catch(err => { return console.log(err) })
    };

    try{
        bot.events.get("guildManager").exevute(bot, type, guild);
    }catch(err){
        bot.print(err,0,1);
    };
};

//Guild Stuff.
//bot.on('guildCreate', (guild) => { guildManager(1, guild); });
//bot.on("guildDelete", (guild) => { guildManager(0, guild); });

//#endregion
