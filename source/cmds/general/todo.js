const { execute } = require("../../other/localization");
const { bot } = require("../../_functions/_functions");

module.exports = {
    coded: "2021-06-02",

    name: "todo",
    aliases: [],

    description: "Make your self todo notes!",
    descriptions: { "en":false, "da":false, "de":false, "fr":false },

    usage: "add text | or | delete #",
    usages: { "en":false, "da":false, "de":false, "fr":false },
    help: "misc",

    async execute(message, args){

        const langCode = message.client.settings.u.get(message.author.id).settings.config.langCode;
        let toDos = message.client.settings.u.get(message.author.id).settings.todo;
        if(!toDos.count) toDos = { count:0 };
        /*
            userSettings = {
                id:"24216351356",
                settings: {
                    config:{ pprefix:"", langCode:"" },
                    todo: {
                    count: 2,
                    1: {status:"x", time:0100, note: "create a shadow todo"},
                    2: {status:"√", time:0200, note: "make a shadow!"},
                    },
                },
            };
        */


        if(!args[0] || args[0].toLowerCase() != "add"){

            if(args[0] == "%" && await message.client.functions.get("_").isSupport(message.author.id)){
                if(!args[1] || isNaN(args[1])) return message.channel.send("NaN").then(msg =>{ setTimeout(msg.delete()), 1500 });
                toDos = message.client.settings.u.get(args[1]).settings.todo;
            };

            if(toDos.count == 0) return message.channel.send(`You don't have any todo's yet ${message.member.displayName}. Try creating one by saying \`${message.client.settings.g.get(message.guild.id).settings.config.prefix}todo add My New Note!!\``);
            /*
            if(toDos.count == 0){
                let txt = await l(langCode, $cmd-todo_helper_NoNotes);
                txt = txt.replace("${member_displayName}", message.member.displayName);
                txt = txt.replace("${gPrefix}", message.client.settings.g.get(message.guild.id).settings.config.prefix);
                return message.channel.send(txt);
            };
            */

            let _toDos1 = [];
            let _toDos2 = [];
            for(i=1; i<(toDos.count+1); i++){
                console.log(toDos[i])
                let td = await toDos[i];
                _toDos1.push(i);
                let status;
                if(td.status === 0){ status = "X"; }else{ status = "√"; };
                _toDos2.push({status:`[${status}]`, note:td.note});
            };

            let array = await message.client.functions.get("bufferSpace").execute(_toDos1,1);
            let _i = 0;
            let newList = [];
            array.forEach(list =>{
                newList.push(`${_toDos2[_i].status}${list}. ${_toDos2[_i].note}`);
                _i++;
            });
            return message.channel.send(`${newList.join("\n")}`, {split:true, code:"js"});
        };


        if(args[0].toLowerCase() == "add"){ //$cmd-todo_subCmd-add
            if(!args[1]) return message.channel.send(`You need to give me some text to save for you! :)`);
            args.shift();

            let thisToDo = {
                time: Date.now(),
                status: 0,
                note: args.join(" "),
            };

            toDos[toDos.count +1] = thisToDo;
            toDos.count++;

            message.client.settings.u.get(message.author.id).settings.todo = toDos;

            return message.client.db.edit("Users", {id:message.author.id}, {"settings.todo":toDos}).then(async (r) =>{
                message.channel.send(`√ ToDo saved, view it with \`${message.client.settings.g.get(message.guild.id).settings.config.prefix}todo\`!`);
            }).catch(e =>{
                console.error(e);
                message.channel.send(`There was an internal error saving your todo!`);
            });
        };

    }
};
