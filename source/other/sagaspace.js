const SagaSpace = {};
module.exports = SagaSpace;
SagaSpace.prefix = "!ss."

SagaSpace.Handles = [
    "help",
    "tpj",
    "atk",
]

SagaSpace.Send = function(ch, txt){
    ch.send(txt);
};

SagaSpace.MessageHandler = async function(message){
    let ch = message.channel;

    let args = message.content.slice(SagaSpace.prefix.length).trim().split(/ +/g);
    let fn = args.shift();
    if(!fn) return;
    if(!SagaSpace[fn]) return SagaSpace.Send(ch,`No handle found for: \`${fn}\`.\nPossible Handles: \`${SagaSpace.Handles.join("`, `")}\``);

    if(SagaSpace[fn].args && args.length < SagaSpace[fn].args) return SagaSpace.Send(ch,`Required args length: \`${SagaSpace[fn].args}\`\n\`${SagaSpace.prefix}${SagaSpace[fn].help}\``);

    let msg = await SagaSpace[fn].execute(args);
    return SagaSpace.Send(ch,msg);
};


SagaSpace.help = {
    help: `help [ssCmd]`,
    desc: `Provide additional information about the SagaSpace Module's commands.`,
    execute: function(args){
        if(args.length == 0) return `Available commands are: \`${SagaSpace.Handles.join('`, `')}\``;
        if(!SagaSpace[args[0]]) return `No handle found for: \`${args[0]}\`.\nPossible Handles: \`${SagaSpace.Handles.join("`, `")}\``;

        let x = SagaSpace[args[0]];
        return `\`Command:\` ${args[0]}\n\`Description:\` ${x.desc}\n\`Help:\` \`${x.help}\``;
    }
};


SagaSpace.tpj = {
    help: `tpj <SIZ> <THR>`,
    desc: `Returns "tpj", or "Turn Per Jump" ('Move' button.)`,
    args: 2,
    execute: function(args){
        let SIZ = args[0]; let THR = args[1];
        if(isNaN(SIZ)) return `SIZ must be a number.`;
        if(isNaN(THR)) return `THR must be a number.`;

        let TPJ = (SIZ*15)/(THR);
        return `\`\`\`js\nTPJ: ${Math.floor(TPJ)}\`\`\``;
    }
};


SagaSpace.atk = {
    help: `atk <YourShipSize> <TargetShipSize> <YourACC>`,
    desc: `Returns your "Hit Chance"`,
    args: 3,
    execute: function(args){
        let ACC = args[2]; let mySize = args[0]; let targetSize = args[1];
        let hitChance = 0;

        targetSize = Number(targetSize) +Number(ACC);

        if(mySize > targetSize){ //I'm larger than the target.
            hitChance = 50 *(targetSize /mySize);
        }else if(mySize < targetSize){ //I'm smaller than the target.
            hitChance = 100 -(50 *(mySize /targetSize));
        }else{ //We're the same size.
            hitChance = 50;
        };

        return `\`\`\`js\nYour hit chance: ${hitChance}\n====\nACC:${ACC}\nmySize:${mySize}\ntargetSize:${targetSize}\`\`\``;
    }
};
