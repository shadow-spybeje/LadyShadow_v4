module.exports = {
  coded : "2019-02-25",

  name : "sayd",
  description : "Say and delete.",
  usage: "<message>",
  //help : "general",

  execute (message){
    let bot = message.client;
    let msg = message.content.slice(bot.config.settings.prefix.length).slice(this.name.length);
    message.channel.send(msg).then(m =>{
      try{
        message.delete();
      }catch(e){
        message.react(":x:");
        message.author.send("I lack the permissions to delete your message.");
      };
    })
  },
};
