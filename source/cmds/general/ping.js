const _l = require("../../other/localization").execute;
const l = async function(message, txt){
  return await _l(message, `$cmds-ping_${txt}`);
};

module.exports = {
  coded : "2019-02-25",

  name : "ping",
  aliases:[
    "klingeln" //de - German.
  ],

  description : "Ping Pong.",
  descriptions :{
    'en':true, //"Ping Pong"
    'da':false,
    'de':true,//German.
    'fr':false,
  },

  async execute(message){
    bot = message.client;


    e = new discord.MessageEmbed()

    message.channel.send(await l(message,"Pinging"))
      .then(async (msg) => {
        msg.edit(await l(message,"Pong"));

        array = [
          `${await l(message,"Bot")} : ${msg.createdTimestamp - message.createdTimestamp}ms`,
          `API : ${Math.round(bot.ws.ping)}ms`
        ];
        let buffer = await message.client.functions.get("bufferSpace").execute(array);

        e.setColor("00FFFF");
        e.setDescription(`\`\`\`css\n${buffer.join("\n")}\`\`\``);
        msg.edit(e);
      });
  },
};
