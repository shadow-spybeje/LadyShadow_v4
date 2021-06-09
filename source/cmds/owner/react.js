module.exports = {
    coded: "2021-06-09",

    name:"react",
    aliases: ["r"],
    args:true,
    usage: "<messageID> <reaction>",

    execute(message,args){
        let del = false;
        if(args[0] == "-d"){ del = true; args.shift(); };
        if(del) message.delete();
        let mID = args.shift(); console.log(mID)
        message.channel.messages.fetch(mID).then(msg => {
            args.forEach(emote =>{
                try{
                    msg.react(emote).catch(e => {console.error(e);});
                }catch(e){
                    console.log(e);
                };
            });
        });
    }
};
