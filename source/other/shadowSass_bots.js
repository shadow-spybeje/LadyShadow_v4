shadowSass_bots = {};
module.exports = shadowSass_bots;
shadowSass_bots.mood = 2; //bot.modules.shadowSass_bots.mood

shadowSass_bots.executer = function(message){

    switch(message.author.id){
        case("270904126974590976"): return shadowSass_bots.dankMemer(message); break;
        case("280497242714931202"): return shadowSass_bots.yui(message); break;
        //case(""): return shadowSass_bots.<botName>(message); break;
        default: return;
    };

};

shadowSass_bots.dankMemer_phrases = ["..eval", "..sayd", "..d"];
shadowSass_bots.dankMemer = function(message){

    //Snipe
    /**
     * Gets, and reposts, the last deleted message on the server.
     */
    if(message.embeds[0] && message.embeds[0].description){
        let embed = message.embeds[0];
        let del;

        /*shadowSass_bots.dankMemer_phrases.forEach(phrase =>{
            if(del) return;
            if(embed.description.toLowerCase().includes(phrase)) del = true;
        });
        if(!del) return;*/

        let names = ["#1904", "alexisykath#3672"];

        names.forEach(name => {
            if(!embed.author.name.toLowerCase().includes(name)) return;
            return message.delete();
        });
    };
};

shadowSass_bots.yuiKillEmotes = ["🔫", "🔪", "🗡", "💣", "⚔️"];
    shadowSass_bots.yuiKillNames = ["{HSF}Shadow_Kath (#3)", "{HSF}Beje'akath", "Beje'akath II", "The Tsundere Kath Doctor", "K͌͒ͮa̩̅t̤h͚͉̣e͜r̶i҉̟̟̖to͑̐̀™ͫ̋̑"]; //Ppl to defend.
shadowSass_bots.yuiKillActions = { //actions to take on defense.
    defense: {
        0: [
            "Wraps {user} in a cloak of shadows preventing you from hitting your mark."
        ],
        1:[
            "Wraps {user} in a cloak of shadows preventing you from hitting your mark."
        ],
        2:[
            "Attacks you, bearing large thick plumes of shadow behind her while it emanates around er pouring from her eyes and hands. You feel great pain and sorrow for what you've done as you lay bleeding in the night."
        ]
    },
    retaliate: {
        0:["Is immune."],
        1:["Laughs as she watches your futile attemps to hurt her knowing that there's nothing you can do in the end. 😈"],
        2: {
            "🔪 **{HSF}Shadow Beta** struggles as your blade digs deep.": [
                "{me} fights you for control, realizing it as a futile attempt, she trasnforms into black mist burning your skin as she vanishes from sight.",
            ],
            "🔪 You lunge at **{HSF}Shadow Beta** but clearly misjudged the distance.": [
                "{me} glares at you; Eyes turning midnight black.",
            ],
            "🔪 Your blade digs deep into **{HSF}Shadow Beta**.": [
                "{me} laughs as your knife plunges into her. \"Weak!!\""
            ],
            "🗡 You stab **{HSF}Shadow Beta** in the back of the heart!": [
                "{me} laughs as black blood pours from the wound.",
            ],
            "🗡 You brought a knife to a gunfight, **{HSF}Shadow Beta** takes you out.": [
                "{me} shoots you in the chest as you draw your weapon."
            ],
            "🔫 You shoot **{HSF}Shadow Beta** point blank. No remorse.": [
                "{me} looks down at her chest. Then slowly back to you, eyes turning black as she encases you in blackness suffocating you.",
            ],
            "🔫 You shoot at **{HSF}Shadow Beta** piercing them with bullets!": [
                "As you look from your gun sights, you see a cloud of blackness charge towards you as you're hit with the same bullets you shot.",
            ],
            "💣 You throw a bomb at **{HSF}Shadow Beta** 💥💥💥": [
                "Catches it, swiftly tossing it back in your direction."
            ],
        },
    },
};
shadowSass_bots.yuiKissActions = {
    0: [ //actions to take when kissed (by Plauge).
        "Blushes brightly.",
        "Giggles.",
        "Watches you intently.",
        "Looks around nervously.",
    ],
    1: [
        "Plants a soft kiss on your cheek.",
        "Hugs you.",
        "Her eyes temporarily change color from a solid black to a normal, with azure iris as she looks at you.",
    ],
    2: [
        "Tenses slightly.",
        "Glares at you.",
        "https://tenor.com/bcw0h.gif"
    ],
};
shadowSass_bots.yuiPetActions = {
    0:{
        "https://data.yuibot.app/reactions/pet/3.gif": ["Blushes."]
    },
    1:{
        "https://data.yuibot.app/reactions/pet/3.gif": ["Blushes brightly."]
    },
    2:{
        "https://data.yuibot.app/reactions/pet/3.gif": ["Stares at you.."]
    },
}
shadowSass_bots.yuiHugActions = {
    0:{
        "https://data.yuibot.app/reactions/hug/aisudsioa.gif": ["*is squished!!*"]
    },
    1:{
        "https://data.yuibot.app/reactions/hug/aisudsioa.gif": ["*giggles!!*"]
    },
    2:{
        "https://data.yuibot.app/reactions/hug/aisudsioa.gif": ["*plots on ways to silently murder you.*"]
    },
}
shadowSass_bots.yui = async function(message){
    //kill <@Shadow>
    /**
     *
    */
    if(message.embeds[0] && message.embeds[0].description){
        let desc; let image; let mood = shadowSass_bots.mood;
        desc = message.embeds[0].description;
        if(message.embeds[0].image) image = message.embeds[0].description;

        if(desc == "**The Tsundere Kath Doctor** kisses **{HSF}Shadow Beta**..."){
            let num = await message.client.functions.get("_").rand(shadowSass_bots.yuiKissActions[mood].length -1,true);
            let action = shadowSass_bots.yuiKissActions[mood][num];
            message.channel.send(`*${action}*`);
        };

        if(desc == "** pets **{HSF}Shadow Beta**..."){
            let num; let action;
            if(!shadowSass_bots.yuiKissActions[mood][image]) if(mood != 2){
                action = `Smiles.`;
                message.client.users.fetch().send(`There's a new image!!\n\`shadowSass_bots.yui_HUG\`: ${image}`);
            }else{action = "Get your HANDS *AWAY FROM ME PERVERT!!*"};
            if(!action){
                num = await message.client.functions.get("_").rand(shadowSass_bots.yuiKissActions[mood][image].length -1,true);
                action = shadowSass_bots.yuiKissActions[mood][image][num];
            };
            message.channel.send(`*${action}*`);
        };

        if(desc == "** hugs **{HSF}Shadow Beta**..."){
            let num; let action;
            if(!shadowSass_bots.yuiKissActions[mood][image]) if(mood != 2){
                action = `*is hugged*`;
                message.client.users.fetch().send(`There's a new image!!\n\`shadowSass_bots.yui_HUG\`: ${image}`);
            }else{action = "Get your HANDS *AWAY FROM ME PERVERT!!*"};
            if(!action){
                num = await message.client.functions.get("_").rand(shadowSass_bots.yuiKissActions[mood][image].length -1,true);
                action = shadowSass_bots.yuiKissActions[mood][image][num];
            };
            message.channel.send(`*${action}*`);
        };

        if(desc.includes("{HSF}Shadow Beta")){
            let pass = false;
            shadowSass_bots.yuiKillEmotes.forEach(emote => {
                if(pass) return;
                if(desc.includes(emote)) return pass = true;
            });
            if(!pass) return;
            let target;
            let retaliate = shadowSass_bots.yuiKillActions['retaliate'][mood]

            if(mood == 2){
                await message.channel.messages.fetch({limit:5}).then(results =>{

                    results.forEach(msg =>{
                        if(msg.content.toLowerCase().includes("yui kill")) target = msg.author;
                    });
                    if(!target) return;

                }).catch(e =>{ console.error(e); });
            };


            let action;
            if(mood==2 && !retaliate[desc]){ action = "Is Immune."; console.log(`"${desc}": [],`); };
            if(!action){
                let num = await message.client.functions.get("_").rand(retaliate.length -1,true);
                action = retaliate[num];
                console.log(action)
            };
            console.log(action)
            action = await action.replace("{target}", target)
            action = await action.replace("{me}", message.guild.me.displayName);
            message.channel.send(`*${action}*`);
        };

        let hasDefendee = false;
        shadowSass_bots.yuiKillNames.forEach(defendee =>{
            if(hasDefendee) return;
            if(desc.includes(defendee)){
                let emotes = shadowSass_bots.yuiKillActions['defense'][mood];
                hasDefendee = true;

                let pass = false;
                shadowSass_bots.yuiKillEmotes.forEach(emote => {
                    if(pass) return;
                    if(desc.includes(emote)) return pass = true;
                });
                if(pass){
                    let num = message.client.functions.get("_").rand(emotes.length -1,true);
                    let action = emotes[num];
                    action = action.replace("{user}", defendee);
                    action = `*${action}*`;
                    if(action.includes("http")) action.replace("*", "");
                    message.channel.send(action);
                };
            };
        });
    };
};
