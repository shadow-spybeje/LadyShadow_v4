module.exports = {
    coded : "2019-04-13",
    name : "unban",
    description : "Unbans the desired Discord-User.\n`BAN_MEMBERS` permission.",
    usage : "<@user> [reason]",
    guildOnly : true,
    args : true,

    help : "staff",

    async execute(message, args){
      bot = message.client;

    //ModLog setting
      type = "UnBan";


      if(!message.member.permissions.has("BAN_MEMBERS")) return message.reply("You require `BAN_MEMBERS` permission to do that.");
      if(!message.guild.members.cache.get(message.client.user.id).permissions.has("BAN_MEMBERS")) return message.reply("I require the `BAN_MEMBERS` permission to Unban somebody!!\nYou can by going clicking on the server name, going to `Server Settings` then `Bans` tehn search by the username, or find them manually.\nOnce you find the user in question, select them, then select `Revoke Ban`");

      let member = await bot.functions.get("_").getUserFromMention(args[0]);

      if(!member) return message.reply(`Please mention a user to unban.\n\`${bot.config.prefix}unban <@user> [reason]\``);

      let reason = args.slice(1).join(' ');
      reason = `Unbanned by "${message.author.tag}" for "${reason}"`

      message.guild.members.unban(member, { reason })
      .then( message.react("👌") )
      .catch(err => {
        message.channel.send(`There was an error trying to unban ${member.tag}!`);
        /*let ch = bot.channels.cache.get("416906777049825292")
        ch.send(`<@${bot.config,owners[0]}> -> Error Executing \`unban\` on ${message.guild.name} (${message.guild.id})`)
        .then(ch.send(err));*/
        bot.print(err, 0, 1);
      })
  }
};
