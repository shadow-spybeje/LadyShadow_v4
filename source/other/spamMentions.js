spamMentions = {};
module.exports = spamMentions;

spamMentions.mentionCache = {
    /*
    `${guild1.id}`: {
        `${user1.id}`: {
            `${mention.id}`:[date1.time, date2.time, date3.time],
            `{R}${role.id}`:[date1.time, date2.time, date3.time]
        },
        `${user2.id}`: {
            `${mention.id}`:[date1.time, date2.time, date3.time],
            `{R}${role.id}`:[date1.time, date2.time, date3.time]
        },
    }
    */
};

spamMentions.execute = async function(message){
    let gs = message.client.settings.g.get(message.guild.id).settings
    if(!gs.config.stopMentionSpam || gs.config.mentionSpamCount <= 0) return;

    let gID = message.guild.id;
    let aID = message.author.id;

    let p = new Promise(async function(resolve, reject) {
        //if guild doesn't yet exist, add guild.
        if(!spamMentions.mentionCache[gID]) spamMentions.mentionCache[gID] = {};
        //if user doesn't yet exist, add user.
        if(!spamMentions.mentionCache[gID][aID]) spamMentions.mentionCache[gID][aID] = {};

        let msg = message.content.split(" ");
        let mentions = [];

        for(i=0; i<msg.length; i++){
            if(msg[i].startsWith("<@")){
                let mention;
                mention = await message.client.functions.get("_").getUserFromMention(msg[i]);
                if(!mention){
                    mention = await message.client.functions.get("_").getRoleFromMention(message.guild, msg[i]);
                };

                if(!mention) return; //No valid mention. (User or 'this guild roles')

                //message.channel.send();

                let m = "";
                if(mention.name){//role
                    m=`{R}`;
                    if(mention.name == "everyone") m=m+mention.name;
                };
                if(m!="{R}everyone") m=m+mention.id;

                try{ mentions.push(m); }catch(e){ console.error(e); };
            };
        };

        if(!mentions) return;
        let _mentions = [];



        mentions.forEach(async (mentionID) => {
            // _mentions == "This messages mentions".

            if(mentionID=="213250789823610880" && message.author.id=="295404527308242944") return;//beje @spy
            if(mentionID=="295404527308242944" && message.author.id=="213250789823610880") return;//spy @beje
            if(_mentions.includes(mentionID)) return; //Check if this messsage already had this ID.
            _mentions.push(mentionID); //add this id to our "ThisMessage" ID's

            //If the (mentioned) doesn't exist in our cache, add them.
            if(!spamMentions.mentionCache[gID][aID][mentionID]){
                spamMentions.mentionCache[gID][aID][mentionID] = [];
            };

            if(mentionID.startsWith("{R}")){//stricter for roles.
                if(mentionID=="{R}everyone"){//stricter for everyone mentions
                    await spamMentions.mentionCache[gID][aID][mentionID].push(Date.now());
                }else{
                    await spamMentions.mentionCache[gID][aID][mentionID].push(Date.now());
                };
            }else{
                await spamMentions.mentionCache[gID][aID][mentionID].push(Date.now());
            };


            if(spamMentions.mentionCache[gID][aID][mentionID].length >= message.client.settings.g.get(message.guild.id).settings.config.mentionSpamCount){
                let firstMention = spamMentions.mentionCache[gID][aID][mentionID].shift();
                if(firstMention > (Date.now() -5000)){

                    let g = message.client.settings.g.get(message.guild.id);
                    let warnings = g.settings.warnings;
                    if(!warnings[message.author.id]) warnings[message.author.id] = 0;
                    warnings[message.author.id]++;
                    g.settings.warnings = warnings;

                    await message.client.db.edit("__Guilds", {id:message.guild.id}, g).then(r => {
                        resolve({warnings:warnings[message.author.id], thisReason: "$mention_spam"});
                    }).catch(e=>{
                        reject(e);
                    });

                    //return resolve("WARN");//resolve(await spamMentions.warn(message));
                };
            };

            return resolve(false); //we didn't trip the censors.
        });
    });

    return p;
};



spamMentions.warn = async function(message){


};
