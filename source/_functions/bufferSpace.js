module.exports = {
    name: "bufferSpace",
    description: "Add whitespace buggering to an array of items based on the longest item in the array.\nA good way to make an even middle among items.",
    usage: "bot.functions.get('bufferSpace').execute(array)",

    async execute(array){

        bufferNumber = 0;
        array.forEach(item => {
            if(item.length > bufferNumber) bufferNumber = item.length;
        });

        let returnArray = [];
        array.forEach(item => {
            let bufferedItem = item.padStart(bufferNumber);
            returnArray.push(bufferedItem);
        });

        return returnArray;
    }
};
