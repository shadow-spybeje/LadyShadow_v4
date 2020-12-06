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
const system = require("./_dir");
const DataBase = require("../DataBase/main")
const discord = require("discord.js");
const bot = new discord.Client({ ws: { intents: 515 } });

var trimer = async function(array){
    newArray = [];
    array.forEach(listing => {
        newArray.push({ id: listing.id, name: listing.name });
    });
    return newArray;
};

var startUp = async function(bot){
    bot.startUp = {};
    let time = Date.now();
    await system.collections(bot, discord);
    await DataBase.init("LilithShadow");

    let owners = await DataBase.search("Owners");
    let support = await DataBase.search("SupportTeam");
    let blacklist = await DataBase.search("Blacklist");
    owners = await trimer(owners);
    support = await trimer(support);
    bot.blacklist = await trimer(blacklist);

    bot.config = {
        owners: owners,
        support: support,
        prefix: "..."
    };


    let guilds = await DataBase.search("Settings_Guilds");
    guilds = await trimer(guilds);
    guilds.forEach(guild => { bot.settings.g.set(guild.id, guild); });

    let users = await DataBase.search("Settings_Users");
    users = await trimer(users);
    users.forEach(user => { bot.settings.u.set(user.id, user); });

    time = Date.now() - time;
    //console.log(bot.config);

    console.log(`> Database retrieval finished. (Took ${time}.ms)`);
    bot.startUp.DataBase_Retrieval = time+".ms";
};
startUp(bot);

bot.once("ready", async () => {
    readyTimer = Date.now() - readyTimer;
    console.log(`> Client Ready. (Took ${readyTimer}.ms)`);
    bot.startUp.Event_Ready = readyTimer+".ms";
});

bot.on("message", async (message) => {
    const args = message.content.slice(bot.config.prefix.length).trim().split(/ +/g);
    const cmd = args.shift();

    if(cmd=="eval"){
        function clean(text){
            if (typeof(text) === "string") return text.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203));
            else return text;
        };

        try{
            const code = args.join(" ");
            let evaled = eval(code);
            if (typeof evaled !== "string") evaled = require("util").inspect(evaled);
            message.channel.send(clean(evaled), {code:"js", split:true});
          }catch(err){
            message.channel.send(`\`ERROR\` \`\`\`xl\n${clean(err)}\n\`\`\``);
          }
    }
});

const token = require('../../.././tokens.json').LadyShadow;
bot.login(token)
