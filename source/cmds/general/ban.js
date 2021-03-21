module.exports = {
    coded : "2019-04-05",
    name : "ban",
    aliases : [],
    description : "Bans the desired hostile member.\n`BAN_MEMBERS` permission.",
    usage : "<@user> [reason]",
    guildOnly : true,
    args : true,

    help : "staff",

    async execute(message, args){
        bot = message.client;

      //ModLog setting
        type = "Ban";

        let returnMessage = ["You cannot ban this user for the following reasons:"];
        let memberCanBan = message.member.hasPermission("BAN_MEMBERS");
        let shadowCanBan = message.guild.me.hasPermission("BAN_MEMBERS");

        if(!memberCanBan || !shadowCanBan){

          if(!memberCanBan) returnMessage.push("• You do not have the required permissions to ban users!\n•• At least one of your roles MUST have the \"Ban Members\" permission set to `true`!!");
          if(!shadowCanBan) returnMessage.push("• I do not have the required permissions to ban users!\n•• At least one of my roles or my bot role: [shadowRoleHere] need to have the \"Ban Members\" permission set to `true`!!");



        };

        let member = await bot.functions.get("_").getUserFromMention(args[0]);

        if(!member) return message.reply(`Please mention a user to ban.\n\`${bot.config.prefix}ban <@user> [reason]\``);
        //if(!message.guild.members.has(member)) return ,essage.reply("The mentioned user isn't on this server.")

        //ToDo: Check if the mentioned user's highest role is equal or greater than Shadow's highest role.
        //ToDo: Check if the mentioned user is the server owner.

        let reason = args.slice(1).join(' ');
        reason = `Banned by "${message.author.tag}" for "${reason}"`

        message.guild.members.ban(member, { reason })
        .then( message.react("👌") )
        .catch(err => {
          message.channel.send(`There was an error trying to ban ${member.tag}!`);
          /*let ch = bot.channels.cache.get("416906777049825292")
          ch.send(`<@${bot.config,owners[0]}> -> Error Executing \`ban\` on ${message.guild.name} (${message.guild.id})`)
          .then(ch.send(err));*/
          bot.print(err, 0, 1);
        })
    }
};
