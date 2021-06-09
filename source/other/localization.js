locale = {};
module.exports = locale;

locale.languageCodes = {
    "en": "English",    //English
    "da": "Dansk",      //Danish
    "de": "Deutsche",   //German
    "fr": "français",   //French
};
locale.languageCodes_array = ['en','da','de','fr'];

locale.languages = {};
locale.languages._ = { //template

    "$cmds-flip__Description": false,
    "$cmds-flip__Usage": false,
    "$cmds-flip_Coin": false, //"{}!!"
    "$cmds-flip_Heads": false,
    "$cmds-flip_Tails": false,
    "$cmds-flip_Upside": false,

    "$cmds-ping__Description": false,
    "$cmds-ping__Usage": false,
    "$cmds-ping_Pinging": false, //"{}..."
    "$cmds-ping_Pong": false,
    "$cmds-ping_Bot": false,

    "$cmds-todo__Description": false,
    "$cmds-todo__Usage": false,
};
locale.languages.en = { //English

    "$cmds-flip__Description": "Flips a coin.",
    "$cmds-flip__Usage": false,
    "$cmds-flip_Coin": "The coin is in the air!!",
    "$cmds-flip_Heads": "Heads",
    "$cmds-flip_Tails": "Tails",
    "$cmds-flip_Upside": "Upside is",

    "$cmds-ping__Description": "Ping Pong",
    "$cmds-ping__Usage": false,
    "$cmds-ping_Pinging": "Pinging...",
    "$cmds-ping_Pong": "Pong",
    "$cmds-ping_Bot": "Bot",

    "$cmds-todo__Description": `Make your self todo notes!`,
    "$cmds-todo__Usage": `add text | or | delete #`,
};
locale.languages.da = { //Danish

    "$cmds-flip__Description": "mønt",
    "$cmds-flip__Usage": false,
    "$cmds-flip_Coin": "Mønten er i luften!!",
    "$cmds-flip_Heads": "Hoveder",
    "$cmds-flip_Tails": "haler",
    "$cmds-flip_Upside": "øverste er",

    "$cmds-ping__Description": false,
    "$cmds-ping__Usage": false,
    "$cmds-ping_Pinging": "Pinging...",
    "$cmds-ping_Pong": "Placeret",
    "$cmds-ping_Bot": "klient",

    "$cmds-todo__Description": false,
    "$cmds-todo__Usage": false,
};
locale.languages.de = { //German

    "$cmds-flip__Description": "Münze",
    "$cmds-flip__Usage": false,
    "$cmds-flip_Coin": "Die Münze liegt in der Luft!!",
    "$cmds-flip_Heads": "Köpfe",
    "$cmds-flip_Tails": "Schwänze",
    "$cmds-flip_Upside": "Vorteil ist",

    "$cmds-ping__Description": "klingeln",
    "$cmds-ping__Usage": false,
    "$cmds-ping_Pinging": "Lokalisieren...",
    "$cmds-ping_Pong": "Gelegen",
    "$cmds-ping_Bot": "Klientin",

    "$cmds-todo__Description": false,
    "$cmds-todo__Usage": false,
};
locale.languages.fr = { //French

    "$cmds-flip__Description": "pièce",
    "$cmds-flip__Usage": false,
    "$cmds-flip_Coin": "La pièce est dans l'air!!",
    "$cmds-flip_Heads": "Têtes",
    "$cmds-flip_Tails": "Queues",
    "$cmds-flip_Upside": "Le côté haut est",

    "$cmds-ping__Description": false,
    "$cmds-ping__Usage": false,
    "$cmds-ping_Pinging": "localisateur...",
    "$cmds-ping_Pong": "situé",
    "$cmds-ping_Bot": "Cliente",

    "$cmds-todo__Description": false,
    "$cmds-todo__Usage": false,
};

locale.translate = async function(code, txt){
    translated = locale.languages[code][txt];
    if(!translated) translated = `$${code}_${txt}`;
    return translated;
};

locale.execute = async function(message, txt){
    if(!txt.startsWith("$")){
        console.error(`${txt} is not a decipher!`);
        return txt;
    };

    let code;
    if(locale.languageCodes[message]) code = message;
    if(!code) code = message.client.settings.u.get(message.author.id).settings.config.langCode;
    let newTxt = await locale.translate(code, txt);
    return newTxt;
};
