/**
 * {HSF}LadyShadow#7111
 * * V.4.0.0a
 * * December 5'th, 2020
 * * Developed By: "Shadow_Spy#1904" (ScionSpy), and "Bejebajay#1904"
 * * Support Invite: https://discord.gg/9FUpBPQ
 * * * LadyShadow is a basic Discord Moderation bot with other logging features.
 * * * Shadow includes other "fun" commands, as well as being the central hub for a Server to Server "Rift" and the main place for the "Shadow RPG".
*/
let readyTimer = Date.now();
const system = require("./_system");
const discord = require("discord.js");
const bot = new discord.Client({ ws: { intents: 515 } });
bot.readyTimer = readyTimer;
bot.db = require("../DataBase/main");

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
 */
bot.print = function(msg, debugOnly, error, preReady){
    let post = "";

    if(debugOnly){
        if(!bot.config.debug) return;
        post = `>> [${bot.functions.get("date").execute(Date.now())}] -> (Debug) ${msg}`
    }else{
        post = `>  [${bot.functions.get("date").execute(Date.now())}] -> ${msg}`
    };

    if(!preReady) spmCh = bot.channels.cache.get("806398879787909131");

    if(error){
        post = `>  [${bot.functions.get("date").execute(Date.now())}] -> \n---> Error -> `;
        console.error(post, msg);
        if(!preReady) spmCh.send(`\`\`\`js\n${post} ${msg}\`\`\``);
    }else{
        console.log(post);
        if(!preReady) spmCh.send(`\`\`\`js\n${post}\`\`\``);
    };
};

bot.startUp = async function(bot){
    //bot.startUp = {};
    let time = Date.now();
    await system.collections(bot, discord);

    const db = require('../../.././tokens.json').db;
    await bot.db.init([db.username, db.password], {database: "LilithShadow"})
    .then(op => bot.print(`Initialized the database with the options:\n>> ${JSON.stringify(op)}`, 0, 0, 1))
    .catch(err => { return bot.print(err, 0, 1, 1) });

    let sus = false; //is only True if db fails to load.
    let config, team, blacklist

    await bot.db.get("Config").then(r => { config = r[0] }).catch(err => { return bot.print(err, 0, 1, 1) });
    await bot.db.get("SupportTeam").then(r => { team = r }).catch(err => { return bot.print(err, 0, 1, 1) });
    await bot.db.get("Blacklist").then(r => { blacklist = r }).catch(err => { return bot.print(err, 0, 1, 1) });

    if(sus) throw "Throwing [sus] :: Database Error!!!";

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
        }
    };

    bot.print("Loaded Configuration Files....",0,0,1)
    if(config.debug) console.log(bot.config)


    await bot.db.get("Settings_Guilds").then(guild => {
        bot.settings.g.set(guild.id, guild);
    });

    await bot.db.get("Settings_Users").then(user => {
        bot.settings.u.set(user.id, user);
    });

    time = Date.now() - time;
    bot.print(bot.config,1);

    bot.print(`> Database retrieval finished. (Took ${time}.ms)`, 0, 0, 1);
    bot.startUp.DataBase_Retrieval = time+".ms";
};

try{
    bot.startUp(bot);

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
//#endregion
