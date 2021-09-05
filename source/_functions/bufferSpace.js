module.exports = {
    name: "bufferSpace",
    description: "Add whitespace buggering to an array of items based on the longest item in the array.\nA good way to make an even middle among items.",
    usage: "bot.functions.get('bufferSpace').execute(array)",

    async execute(array, padStart, floatLeft){
        let bufferNumber = 0;
        if(padStart) bufferNumber = padStart;
        await array.forEach(item => {
            item = item.toString();
            if(item.length > bufferNumber){
                if(!padStart){
                    bufferNumber = item.length;
                }else{
                    bufferNumber = (item.length +padStart);
                };
            };
        });

        let returnArray = [];
        await array.forEach(item => {
            item = item.toString();
            let bufferedItem;
            if(!floatLeft){
                bufferedItem= item.padStart(bufferNumber);
            }else{
                bufferedItem= item.padEnd(bufferNumber);
            };
            returnArray.push(bufferedItem);
        });

        return returnArray;
    }
};
