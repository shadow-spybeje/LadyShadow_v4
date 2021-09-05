const phasmo = {};

//#region phasmo.options description
  // They're options dumbass!! What else do you need to know?!?!
  //#endregion
phasmo.options = {
    //Developer thing.
    debug: false,

    // This module's interactor.
    prefix: ",,",

    // How to split your words/evedince. (Probably should leave this alone...)
    msgSpliiter: " ",

    // If we choose to lock it to a single server.
    server: "",

    // Lock this module to ONLY these userid's.
    // (If any are provided, ONLY they can use the module.) **
    whitelist: [],

    // Blacklist these userid's from this module. **
    blacklist: [],

    // ** If a user is BOTH whitelisted AND blacklisted, they still cannot use the module.
    // // If they are the ONLY user whitelisted, [NO ONE] can use the module!!
};

/**
 * Our built-in ghost database!
 */
phasmo.ghosts = [
    /*{
        type: "",
        evidence: [],
        strength: "",
        weakness: "",
        tip: ""
    },*/
    {
        "type": "Demon",
        "evidence": [ "Freezing Temps", "Ghost Writing", "Fingerprints" ],
        "strength": "Will attack aggressively",
        "weakness": "Asking a question on a ouija board won’t lower a player’s sanity.",
        "tip": ""
    },
    {
        "type": "Mare",
        "evidence": [ "Spirit Box", "Ghost Writing", "Ghost Orb" ],
        "strength": "Increased attacks in the dark",
        "weakness": "Light",
        "tip": "Turn on lights in the Ghost's room to decrease the chance of a hunt."
    },
    {
        "type": "Jinn",
        "evidence": [ "EMF 5", "Fingerprints", "Freezing Temps" ],
        "strength": "The further you are away, the faster a Jinn is",
        "weakness": "Turning off a location’s power source will make the Jinn slower.",
        "tip": ""
    },
    {
        "type": "Poltergeist",
        "evidence": [ "Spirit Box", "Ghost Writing", "Fingerprints" ],
        "strength": "Can throw multiple objects at once",
        "weakness": "Empty rooms",
        "tip": ""
    },
    {
        "type": "Revenant",
        "evidence": [ "Ghost Orbs", "Ghost Writing", "Freezing Temps" ],
        "strength": "Fast when hunting.",
        "weakness": "Slow when you are hidden.",
        "tip": "You **Cannot** outrun a Revenant!"
    },
    {
        "type": "Shade",
        "evidence": [ "EMF 5", "Ghost Writing", "Freezing Temps" ],
        "strength": "Hard to find.",
        "weakness": "A shade won’t hunt if players are in groups.",
        "tip": "Stay together in the ghost's room!"
    },
    {
        "type": "Spirit",
        "evidence": [ "EMF 5", "Spirit Box", "Ghost Writing" ],
        "strength": "None",
        "weakness": "Using smudge sticks to prevent attacks; for about 180s.",
        "tip": ""
    },
    {
        "type": "Hantu",
        "evidence": [ "Ghost Orbs", "Freezing Temps", "Fingerprints" ],
        "strength": "Lower temperatures make the ghost faster!",
        "weakness": "Hantu moves slower in warm areas.",
        "tip": "Keep the power on to avoid the house getting cold!"
    },
    {
        "type": "Phantom",
        "evidence": [ "Spirit Box", "Fingerprints", "DOTS Projector" ],
        "strength": "Looking at a phantom will cause your sanity to drop",
        "weakness": "Taking its photo will cause it to disappear",
        "tip": "Trying to take it's photo during a hunt is not only a bad idea, but is not effective."
    },
    {
        "type": "Yurei",
        "evidence": [ "Ghost Orbs", "Freezing Temps", "DOTS Projector" ],
        "strength": "Affects player sanity more than normal",
        "weakness": "Using a smudge stick to prevent it from moving",
        "tip": ""
    },
    {
        "type": "Banshee",
        "evidence": [ "Ghost Orbs", "Fingerprints", "DOTS Projector" ],
        "strength": "Targets one player at a time (that is terrifying)",
        "weakness": "The crucifix",
        "tip": "A Banshee can spontaneously start a hunt if it's target is out of sight for 20s after teleporting to them.\n  Due to this, it's a good cause to believe you're dealing with a Banshee if a Hunt starts while everyone is 80% Sanity or more."
    },
    {
        "type": "Oni",
        "evidence": [ "EMF 5", "Freezing Temps", "DOTS Projector" ],
        "strength": "Can move objects quickly",
        "weakness": "Active when more players are nearby",
        "tip": ""
    },
    {
        "type": "Wraith",
        "evidence": [ "EMF 5", "Spirit Box", "DOTS Projector" ],
        "strength": "Footsteps cannot be traced",
        "weakness": "Reacts to salt",
        "tip": ""
    },{
        "type": "Goryo",
        "evidence": ["EMF 5", "Fingerprints", "DOTS Projector"],
        "strength": "Usually shows on camera when alone",
        "weakness": "Rarely wanders far from favorite room",
        "tip": "Aim a camera at the DOTS, Goryos can only be seen through them!"
    },{
        "type": "Myling",
        "evidence": ["EMF 5", "Ghost Writing", "Fingerprints"],
        "strength": "Quieter when hunting",
        "weakness": "Frequently makes paranormal sounds",
        "tip": "Be quiet! They are more sensitive to player noises, and it angers them!!!"
    },{
        "type": "Yokai",
        "evidence": ["Ghost Orbs", "Spirit Box", "DOTS Projector"],
        "strength": "Talking near it makes it angrier and more likely to attack",
        "weakness": "When hunting, it can only hear close to it",
        "tip": "It appears this ghost can hunt above 50% sanity if you make it angry enough by talking."
    }
];

/**
 * checks for misstpyes -- usefull with the new Grammar module.
 */
phasmo.evidence = [
    /*
    {
        title: "",
        alias: []
    },
    */
    {
        title: "prints",
        alias: ["fingers", "prints"]
    },{
        title: "box",
        alias: ["spiritbox", "box"]
    },{
        title: "writing",
        alias: ["ghostwriting", "ghostw", "gw", "writing"]
    },{
        title: "orbs",
        alias: ["ghostorb","ghosto", "go"]
    },{
        title: "temps",
        alias: ["freezingtemperatures", "freezingtemps", "temps", "freezing", "freeze"]
    },{
        title: "5",
        alias: ["emflevel5", "emf", "5"]
    },{
        title:"dots",
        alias: ["dot", "projector", "project", "proj"]
    }
];


/**
 * the "Message Handler" for this module.
 * @param {*} bot `discord.client`
 * @param {object} msg {channel, msg:string}
 */
phasmo.msg = async function(bot, msg){
    if(phasmo.options.debug) console.log("logged with: "+JSON.stringify(msg.msg))
    //msg = {channel:msg.channel, msg:msg.content};
    let message = msg.msg;
    if(!message.startsWith(phasmo.options.prefix)){
        return;
    }else{
        if(phasmo.options.whitelist.length > 0){
            if(!phasmo.options.whitelist.includes(msg.userid)) return;
        };
        if(phasmo.options.blacklist.length > 0){
            if(phasmo.options.blacklist.includes(msg.userid)) return;
        };

        message = message.slice(phasmo.options.prefix.length).trim().split(/ +/g).join(" "); //"ph. ";
        if(!message) return;
    };

    if(message == "help")return msg.channel.send(`\`${phasmo.options.prefix}<evedince1>${phasmo.options.msgSpliiter}[evidence2]${phasmo.options.msgSpliiter}[evidence3]\` Search for a ghost with these as evidence.\n\`${phasmo.options.prefix}type${phasmo.options.msgSpliiter}<Ghost type>\` Look up this ghost type.`);

    if(message == "bugs") return msg.channel.send(`**What happened:**\n**What did you expect to happen:**\n**What map was it:**\n**Was it in multiplayer:** Yes\n**VR or non-vr:** Non-VR`, {code:"JS"});

    let ghosts = null;
    let evidence = message.toLowerCase()/*.replace(/../gi, "-")*/.split(phasmo.options.msgSpliiter);
    if(!evidence) return;

    if(evidence[0] =="type"){
        let type = evidence[1];
        let ghost = await phasmo.ghostType(type);

        if(ghost.length == 0) { ghost[0]="-1"; ghost[1] = "No ghost type found with this criteria!"; }
        return phasmo.send(message, msg.channel, ghost);
    };

    evidence = await this.evidenceGrammar(evidence); // ????
    ghosts = await this.ghostSearch(evidence);
    if(ghosts.length == 0) { ghosts[0]="-1"; ghosts[1] = "No ghost type found with this criteria!"; }
    phasmo.send(message, msg.channel, ghosts);
};

/**
 * Check spelling, is there any SH (Short hand) ??
 * * * * PROTOTYPE
 * @param {*} evidence
 * @returns
 */
phasmo.evidenceGrammar = async function(evidence){

    let evid = [];
    evidence.forEach(arrayList => {
        let found = false;

        phasmo.evidence.forEach(phasmoEvidence => {

            if(found) return;
            if(phasmoEvidence.alias.includes(arrayList)){
                evid.push(phasmoEvidence.title);
                found=true;
            };

        });
        if(!found) evid.push(arrayList); // We're trying for the default.
    });

    if(!evid) evid = evidence; //we didn't find any matches..... we'll try it....
    return evid;
};

/**
 * The player wnats to know about a specific type of ghost... Let's share!!
 * @param {*} type
 * @returns
 */
phasmo.ghostType = async function(type){
    let theseGhosts = [];
    phasmo.ghosts.forEach(Ghost => {
        //if(theseGhosts.length==1) return;
        let Type = Ghost.type.toLowerCase();
        if(Type.includes(type)) return theseGhosts.push(Ghost);
    });

    return theseGhosts;
};

/**
 * Search our built-in database to see if any of the evedince provided matches any of our ghosts.
 * @param {*} evidence
 * @returns
 */
phasmo.ghostSearch = async function(evidence){
    let ev = evidence; let _ev = [];
    ev.forEach(e => {
        if(e.includes("orbs")) e="orb";
        if(e.includes("temps")) e="temp";
        if(e.includes("gw")) e="ghostwriting";
        if(e.includes("gw")) e="ghostwriting";
        if(e.includes("dot")) e="dots";

        _ev.push(e);
    });evidence=_ev;
    let someGhosts = [];

    let someGhosts1 = [];
    phasmo.ghosts.forEach(Ghost =>{ //this is ran default.
        Ghost.evidence.forEach(Evidence =>{
            let lowered = Evidence.toLowerCase();
            if(lowered.includes(evidence[0])){ someGhosts1.push(Ghost) }
            //else{  };
        });

    });

    let someGhosts2 = [];
    if(evidence.length>1){//we have TWO evidence.
        //Search our running list.
        someGhosts1.forEach(Ghost => {
            Ghost.evidence.forEach(Evidence =>{
                let lowered = Evidence.toLowerCase();
                if(lowered.includes(evidence[1])) someGhosts2.push(Ghost)
            });
        });
    };

    let someGhosts3 = [];
    if(evidence.length>2){//we have THREE evidence.
        //Search our running list.
        someGhosts2.forEach(Ghost => {
            Ghost.evidence.forEach(Evidence =>{
                let lowered = Evidence.toLowerCase();
                if(lowered.includes(evidence[2])) someGhosts3.push(Ghost)
            });
        });
    };

    //GREAT!!!
    //Now check all the arrays, and assign the last one as our "Ghosts" array.
    if(someGhosts3.length>0){
        someGhosts = someGhosts3;
    }else if(someGhosts2.length>0){
        someGhosts = someGhosts2;
    }else if(someGhosts1.length>0){
        someGhosts = someGhosts1;
    };

    return someGhosts;
};

/**
 * Retunr a list of possible ghosts to the channel.
 * @param {*} query
 * @param {*} channel
 * @param {*} ghosts
 */
phasmo.send = function(query, channel, ghosts){
    let TheGhosts = [];

    if(ghosts[0]!="-1"){
        ghosts.forEach(ghost => {
            let msg = [
                `[Type]: ${ghost.type}`,
                `[Evidence]: ${ghost.evidence.join(", ")}`,
                `[Strength]: ${ghost.strength}`,
                `[Weakness]: ${ghost.weakness}`
            ];
            if(ghost.tip!="") msg.push(`[Tips]: ${ghost.tip}`);
            TheGhosts.push(msg.join("\n"));
        });
    }else{
        TheGhosts[0] = ghosts[1];
    };

    channel.send(`Ghost Results for: **${query}**\`\`\`css\n${TheGhosts.join("``````css\n")}\`\`\``, {split: true});
};

module.exports = phasmo;
