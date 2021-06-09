module.exports = {
    coded : "2021-05-30",

    name : "renick",
    aliases: ["rename"],
    description : "Renicks a desired user.",
    args: true,
    usage: "<userID | @user> <NewNick>",
    help : "staff",

    async execute (message,args){
        if(!message.member.hasPermission("ADMINISTRATOR")) return;

        if(args.length<2) return message.channel.send(`I require both a user, and a new nickname.\n\`${this.usage}\``);

        let user = await message.client.functions.get("_").getUserFromMention(args.shift());

        let member = await message.guild.members.fetch(user.id);
        if(!member) return message.channel.send(`There's no user on this server \`${args[0]}\``);

        try{
            member.setNickname(args.join(" ")).then(() =>{
                message.react("✅");
            });
        }catch(e){
            console.log(e);
            message.react("❌");
        };
    },
  };
