//Spy, Beje, Kath
let whitlistedUsers = ["213250789823610880", "295404527308242944", "386068524667371530"];

module.exports = {
  coded : "2019-02-25",

  name : "sayd",
  aliases : ["said"],
  description : "Say and delete.",
  usage: "<message>",
  //help : "general",

  execute (message){
    if(!whitlistedUsers.includes(message.author.id))return message.delete();

    let bot = message.client;
    let msg = message.content.slice(bot.config.settings.prefix.length).slice(this.name.length);
    try{
      message.delete().then( message.channel.send(msg));
    }catch(e){
      message.react(":x:");
      message.author.send("I lack the permissions to delete your message.");
    };
  },
};
