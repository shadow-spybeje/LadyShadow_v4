module.exports = {
  coded : "2019-02-25",

  name : "ping",
  description : "Ping Pong.",
  usage: "",
  help : "general",

  execute (message){
    bot = message.client;

    e = new discord.MessageEmbed()

    message.channel.send("Pinging...")
      .then(msg => {
        msg.edit("Pong!!");
        e.setColor("00FFFF");
        e.setDescription(`\`\`\`css\nBot : ${msg.createdTimestamp - message.createdTimestamp}ms\nAPI : ${Math.round(bot.ws.ping)}ms\`\`\``);
        msg.edit(e);
      });
  },
};
