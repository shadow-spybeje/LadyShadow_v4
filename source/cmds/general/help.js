module.exports = {
    coded : "2021-03-14",
    name : "help",
    aliases: ["segítség", "hjælp", "helfen", "aide"],
    description : "Beta Help.",
    usage : "",
    guildOnly : true,

    //help : "staff",

    async execute(message, args){
        bot = message.client;

        let p = bot.config.settings.prefix;
        let cmds = [`kick`, `ban`, `unban`];
        let commands = [`kick <@user | userID> [reason]`, `ban <@user | userID> [reason]`, `unban <@user | userID> [reason]`];

        let list = [];
        let o = 0;
        commands.forEach(c => {
        list.push(`• ${c}`);
        list.push(`•• ${bot.cmds.general.get(cmds[o]).description}\n`);
        o++;
        });

        let e = new discord.MessageEmbed()
        .setColor("00FFFF")
        .setTimestamp()
        .setTitle(`Beta Help - Prefix: ${p}`)
        .setDescription(`\`\`\`js\n${list.join("\n")}\`\`\``)

        message.channel.send(e);
    }
};
