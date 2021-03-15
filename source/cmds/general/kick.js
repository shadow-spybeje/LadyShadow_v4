module.exports = {
    coded : "2019-04-05",
    name : "kick",
    aliases : ["boot"],
    description : "Kicks the desired cranky member.\n`KICK_MEMBERS` permission.",
    usage : "<@user> [reason]",
    guildOnly : true,
    args : true,

    help : "staff",

    async execute(message, args){
      bot = message.client;

    //ModLog setting
      type = "Kick";


      if(!message.member.permissions.has("KICK_MEMBERS")) return message.reply("You require `BAN_MEMBERS` permission to do that.");
      if(!message.guild.members.cache.get(message.client.user.id).permissions.has("KICK_MEMBERS")) return message.reply("I require the `KICK_MEMBERS` permission to kick somebody!!\nYou can by right-clicking (tap+hold) the user in question and selecting `Kick Member`");

      let member = await bot.functions.get("_").getUserFromMention(args[0]);

      if(!member) return message.reply(`Please mention a user to kick.\n\`${bot.config.prefix}kick <@user> [reason]\``);

      let reason = args.slice(1).join(' ');
      reason = `Kicked by "${message.author.tag}" for "${reason}"`

      message.guild.members.cache.get(member.id).kick(reason)
      .then( message.react("👌") )
      .catch(err => {
        message.channel.send(`There was an error trying to kick ${member.tag}!`);
        /*let ch = bot.channels.cache.get("416906777049825292")
        ch.send(`<@${bot.config.owners[0]}> -> Error Executing \`kick\` on ${message.guild.name} (${message.guild.id})`)
        .then(ch.send(err));*/
        bot.print(err, 0, 1);
      })
  }
};
