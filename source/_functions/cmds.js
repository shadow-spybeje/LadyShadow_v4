const discord = require('discord.js');

module.exports = {
    coded : "2019-05-11",

    name : "cmds",
    description : "Execute the Command Identifier and cmd if applicable.",
    usage : "bot.functions.get('cmds').execute(message, args);",

    async execute(message, args){
        const bot = message.client;
        const prefix = bot.config.settings.prefix;
		let isOwner; // used only if general can't find anything.

        const cmdName = args.shift().toLowerCase();

        //Check our general commands for {cmdName}
        let cmd = bot.cmds.general.get(cmdName) || bot.cmds.general.find(c => c.aliases && c.aliases.includes(cmdName));


        //If we still don't have a command, check if the user is an owner,
        //If the user is an owner, check the Owner Commands.

        if(!cmd){
			//if(!bot.config.support.team.roles.owner.forEach(owner => { if(owner.id == message.author.id) return true })) return;

			bot.config.support.team.roles.owner.forEach(owner => {
				if(owner.id == message.author.id) isOwner = true;
			});

			if(!isOwner) return;

          	cmd = bot.cmds.owner.get(cmdName) || bot.cmds.owner.find(c => c.aliases && c.aliases.includes(cmdName));
        };

		//If we STILL don't have a command. Stop. It doesn't exist.
        if(!cmd) return;


        // We have a command, now, that we know this user is trying to use the client.
        // Check if we have a dbEntry. If not, crete one.

        // ToDo: create "awknoledment" posts.

        //We only want to save people who "use" our bot in the User Database.
        // This may be changed to above this if we want a blargbot "names" feature.

        if(!message.client.settings.u.get(message.author.id)){ //this user isn't saved or cached!!
            await bot.events.get("userManager").execute(bot, 1,message.author);
        };


        let e = new discord.MessageEmbed();
        e.setTitle(`${cmdName} Flag`)
        e.setColor("ff0000")

        //guildOnly
          if (cmd.guildOnly && message.channel.type !== 'text'){
              e.setDescription("**Guild Only**\n• This Command can only be used Server-Side.")
              return message.channel.send(e);
          };

          //Args
        if (cmd.args && !args.length){
            let reply = `**Arguments**\n• You didn't provide any arguments!`;

            //Usage
            if (cmd.usage){
            reply += `\n\n**Usage**\n• The proper usage would be: \`${prefix}${cmd.name} ${cmd.usage}\``;

            //Example
            if(cmd.example) reply += `\n\n**Example**\n• \`${prefix}${cmd.name} ${cmd.example}\``

            e.setDescription(reply)
            return message.channel.send(e);
            };
        };

        try {
            bot.config.stats.cmdCount = bot.config.stats.cmdCount +1;
            if(!bot.config.stats.uniqueUsers.includes(message.author.id)) bot.config.stats.uniqueUsers.push(message.author.id);

            cmd.execute(message, args);
        } catch (error) {

			console.error(error);
			message.channel.send(bot.functions.get("err").execute(message, error));
			message.reply(`there was an error trying to execute \`${cmdName}\`!!`);
        };
    }
}
