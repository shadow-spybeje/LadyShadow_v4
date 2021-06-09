module.exports = {
    coded: "2021-05-28",

    name:"delete",
    aliases: ["del", "d"],
    args:true,
    usage: "<messageID>",

    execute(message,args){
        message.channel.messages.fetch(args[0]).then(msg => {
            try{
                msg.delete().then(() => {
                    message.react("✅").then( setTimeout(function(){ message.delete(); }, 1500));
                }).catch((e) => {
                    message.react("❌").then( setTimeout(function(){ message.delete(); }, 1500));
                    console.error(e);
                });
            }catch(err){
                console.error(err);
            };
        });
    }
};
