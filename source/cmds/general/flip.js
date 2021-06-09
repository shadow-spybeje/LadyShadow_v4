const _l = require("../../other/localization").execute;
const l = async function(message, txt){
  return await _l(message, `$cmds-flip_${txt}`);
};

module.exports = {
    coded : "2021-05-18",

    name : "flip",
    aliases: [
        "coinflip",
        "mønt", //Danish
        //"", //German
        //"", //French
    ],
    description : "Flips a coin.",
    descriptions : {
        'en':true,
        'da':true,
        'de':true,
        'fr':true,
    },
    usage: "",
    help : "fun",

    async execute(message){
        let bot = message.client;
        e = new discord.MessageEmbed()

        e.setColor("00FFFF");
        e.setDescription(`**${await l(message,'Coin')}**`);
        e.setImage(`https://media.discordapp.net/attachments/779370916735352843/844471055309340672/coin3.gif?width=200&height=115`)

        message.channel.send(e)
        .then(async (msg) => {

            let x = bot.functions.get("_").rand(1,true);
            let coin = "";
            if(x === 0) coin = await l(message,'Tails');
            if(x === 1) coin = await l(message,'Heads')

            setTimeout(async function(){
                msg.delete();
                e.setColor("00FFFF");
                e.setDescription(`\`\`\`\n${await l(message,'Upside')}....\`\`\``);
                e.setImage(null);
                message.channel.send(e).then(m => {
                    setTimeout(async function(){
                        m.edit(e.setDescription(`\`\`\`\n${await l(message,'Upside')}: ${coin}!!\`\`\``))
                    },1500);
                });
            }, 2500);
        });
    },
  };
