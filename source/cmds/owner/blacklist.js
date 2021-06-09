
module.exports = {
    coded : "2021-01-05",
    name : "blacklist",
    description : "In progress",
    usage : "<string:reason for the blacklist>\n<numbers: a list of User.ID's to blacklist (Each new ID on a newLine)>",
    //args : true,
    help : "owner",
    owner: true,

    execute(message, args){
        let db = message.client.db;
        //if(!message.client.config.owners.includes(message.author.id)) return;

        switch(args[0]){
            case("delete"):
            case("del"):
            case("remove"):
            case("-"):
                return db.delete("Blacklist", {blacklisted_id: args[1]})
                    .then(result => { message.channel.send(JSON.stringify(result.result)); })
                    .catch(err => { console.log(err); message.channel.send(err, {code:"JS", split:true}); });

                break;
            case("add"):
            case("+"):
                let data = {
                    blacklisted_id: args[1],
                    executedBy_id: message.author.id,
                    executedBy_tag: message.author.username,
                    reason: args.splice(2).join(" "),
                    date: Date.now(),
                    datePacific: message.client.functions.get("date").execute(Date.now())
                };

                if(data.executedBy_id == "213250789823610880")data.executedBy_tag = "Scion Spy";

                return db.post("Blacklist", data).then(() => {
                    message.channel.send(`:ok_hand: Blacklisted ${data.blacklisted_id} for ${data.reason}`);
                    db.get("Blacklist").then(async results=>{
                        await results.forEach( x => { message.client.config.blacklist.set(x.blacklisted_id, x) });


                        let title = {
                            text: "(Lilith-Shadow_Database)",
                            date: data.datePacific,
                            //output: `${title.text} [${title.date}]`
                        };
                        let enforcer = {
                            id: data.executedBy_id,
                            tag: data.executedBy_tag,
                            //output: `**${enforcer.tag}** (${enforer.id})`
                        };
                        let accused = {
                            id: data.blacklisted_id,
                            reason: data.reason,
                            //output: `(${accused.id}) for: ${accused.reason}`
                        };

                        let msgObject = `${title.text} [${title.date}]\n• **${enforcer.tag}** (${enforcer.id}) has blacklisted\n•• (${accused.id}) for: ${accused.reason}`;

                        message.client.channels.cache.get(message.client.minme.channels.staff).send(msgObject, {code:'css'});
                    });
                }).catch(err =>{ message.channel.send(err) });
                break;
            case("view"):
                let blacklist = JSON.stringify(message.client.config.blacklist);
                blacklist = blacklist.split("},{").join("},\n    {").split("[{").join("{\n    {").split("}]").join("}\n]");

                if(blacklistToDM){
                    message.author.send(blacklist, {split:require, code:"js"}).then(() => {
                        message.channel.send(`Okay <@${message.author.id}> the raw blacklist database is in your DirectMessages.`);
                    });
                }else{
                    message.channel.send(blacklist, {split:require, code:"js"})
                };
                break;
            default:
                let msg = "This command is in progress:\n\n`blacklist add <userID> <reason>`\n• :warning: **Warning** There are zero checks, what you input now may break features if done improperly!\n**1.** Make sure your ID (the first word after \"add\") is a UserID.\n**2.** Make sure to include a reason. (Everything after the first word), if you wish no reason then say `False`.\n> - Example of \"no reason\": (Using Your ID, do not copy/paste)\n> ``` m!blacklist add "+message.author.id+" false ```\n`m!blacklist view` -> Sends to DM [SPAMMY!!!]\n`m!blacklist remove <userID>` -> Removes a user from the blacklist. (Same rules apply as `add`";

                /*let e = new discord.MessageEmbed();
                e.setTitle("This command is in progress");
                e.setDescription(msg);*/
                message.channel.send(msg);
        };
    }
};
