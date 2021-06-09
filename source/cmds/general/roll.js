module.exports = {
    coded : "2021-05-18",

    name : "roll",
    description : "rolls a die between 1 and 6(or maxNum)",
    usage: "[maxNum]",
    help : "fun",

    execute (message, args){
        let maxNum;
        if(args[0]){
            if(isNaN(args[0])) return message.channel.send(`Paramater must be a number. You entered: \`${args[0]}\``);
            maxNum = args[0];
        };

        let die = message.client.functions.get("_").rand(maxNum);
        message.channel.send(`You rolled a: ${die}`);
    },
  };
