'use strict';
//#region Database_Options
let MongoDB_URL = null;
let database = null;
let debug = false;

// Don't edit the below..

const mongo = require('mongodb').MongoClient;

//#endregion

//#region db

/**
 * Opens a connection to the Database.
 * @returns `db` -- MongoDB.
 */
function open(){
    return new Promise((resolve, reject)=>{
        mongo.connect(MongoDB_URL, {useUnifiedTopology:true}, (err, db) => {
            if (err) {
                reject(err);
            } else {
                resolve(db);
            }
        });
    });
};

function close(db){
    //Close connection
    if(db){
        db.close();
    }
};

function post(collection, data){
    let database = null;
    if(!data) data = {} ;

    let promise = new Promise(function(resolve, reject){

        db.open()
        .then((db)=>{
            database = db;
            db = db.db();
            return db.collection(collection);
        })
        .then(async (collection)=>{
            data.createdAt = await db.getIsoTime();
            return collection.insertOne(
                    data
                );
        })
        .then((result)=>{
            database.close();
            db.print(`[Post] Collection: ${collection} Created entry.`);
            resolve(result);
        })
        .catch((err)=>{
            console.error(err);
            reject(err);
        });
    });
    return promise;
};

function get(collection, query, _projection){
    let database = null;
    if(!query){ query = {} };

    let promise = new Promise(function(resolve, reject){
        db.open()
        .then((db)=>{
            database = db;
            db = db.db();
            return db.collection(collection);
        })
        .then((collection)=>{
            if(!_projection){
                return collection.find(query).toArray();
            }else{
                return collection.find(query).project(_projection).toArray();
            }
        })
        .then((result)=>{
            database.close();
            db.print(`[Get] Collection: ${collection} Fetched entry.`);
            resolve(result);
        })
        .catch((err)=>{
            console.error(err);
            reject(err);
        });
    });
    return promise;
};

/**
 *
 * @param {string} collection Collection to post to/edit.
 * @param {object|null} searchQuery Look for the first object with these key/value pairs.* If none found, or set as null, a new entry will be posted.
 * @param {object} newData Data to change or add.
 */
async function edit(collection, searchQuery, newData){
    let database = null;
    if(!searchQuery){ searchQuery = {} };
    if(!newData) throw `\n\n> (!) Database Warning: Trying to edit data without newData!\n\n    Collection: ${collection}\n    SearchQuery: ${JSON.stringify(searchQuery)}\n`;

    //let oldData = await get(collection, searchQuery);

    let promise = new Promise(function(resolve, reject){
        db.open()
        .then((db)=>{
            database = db;
            db = db.db();
            return db.collection(collection);
        })
        .then(async (collection)=>{
            newData.lastModified = await db.getIsoTime();
            return collection.updateOne(
                searchQuery,
                {
                    $set: newData,
                },
                {
                    upsert: true //if the document {searchQuery} returns null/false, the ncreate a new one with the {newData} obeject.
                }
                );
        })
        .then(async (result)=>{
            if(result.upsertedId){ //We just created this doc -- we've got to add "createdAt"...
                db.print(`[Edit] Collection: ${collection} -> Added new entry.`);
                await db.edit(collection,
                    {_id:result.upsertedId._id},
                    { createdAt: await db.getIsoTime() }
                );// db.edit();
                database.close();
                //console.log(result)
                resolve(result);
            }else{
                db.print(`[Edit] Collection: ${collection} Modified entry.`);
                database.close();
                //console.log(result)
                resolve(result);
            };
        })
        .catch((err)=>{
            console.error(err);
            reject(err);
        });
    });
    return promise;
};

async function _delete (collection, searchQuery){
    let database = null;
    if(!searchQuery) throw "No query provided!! Cannot delete DB Entires!!"

    let promise = new Promise(function(resolve, reject){
        db.open()
        .then((db)=>{
            database = db;
            db = db.db();
            return db.collection(collection);
        })
        .then((collection)=>{
            return collection.deleteOne(searchQuery);
        })
        .then((result)=>{
            //db.print()
            database.close();
            //console.log(result)
            resolve(result);
        })
        .catch((err)=>{
            console.error(err);
            reject(err);
        });
    });
    return promise;
};
//#endregion

//#region Functions
/**
 * Prints a debug message to the console log (Only when ${debug} == true).
 * @param {string} msg Something to print to the console.
 */
function print(msg){
    if(!debug) return
    console.log(`(DataBase) ${msg}`);
};

/**
 * Returns the Date of local time in the following format:
 * * `YYYY-MM-DDThh:mm:ss[+|-]hh:mm`
 */
async function getIsoTime(){
    let time = Date.now();

    date = (time) => {
        d = new Date();

      //Lets grab all of our relivant Date and Time information.
        yyyy = d.getFullYear(time);
        mm = d.getMonth(time) + 1;
        dd = d.getDate(time);
        HH = `${d.getHours(time)}`;
        MM = `${d.getMinutes(time)}`;
        SS = `${d.getSeconds(time)}`;


      //If our Hour, Minute, or Second is in the "ones" add a zero before the number.
        if(HH.length == 1) HH = `0${HH}`;
        if(MM.length == 1) MM = `0${MM}`;
        if(SS.length == 1) SS = `0${SS}`;


      //Lets set our TimeZone to Pacific Time.
        pstDay = [3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30];
        pdtDay = [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31];
        zone = " [zone]";

        switch(mm){
            case(11): case(12): case(1): case(2): case(3):
                zone = " PST(-8.GMT)";

                if(mm == 11 && dd == 1 || dd == 2) zone = " PDT(-7.GMT)";
                if(mm == 3 && pdtDay.includes(dd)) zone = " PDT(-7.GMT)";
            break;

            case(3): case(4): case(5): case(6): case(7):
            case(8): case(9): case(10): case(11):
                zone = " PDT(-7.GMT)";

                if(mm == 11 && pstDay.includes(dd)) zone = " PST(-8.GMT)";
            break;
            default: zone = "[**]";
        };



      //Lets put all of tis information into a readable string.
        if(mm < 10) mm = `0${mm}`;
        return `${yyyy}-${mm}-${dd}T${HH}:${MM}:${SS}${zone}`;
    };

    return date(time);
};
//#endregion


//This needs to be removed, and transfered to the events/ready.js file....
/**
 * Initialize the Discord Client's Database.
 * @param {String} username Database authentication Username.
 * @param {String} password Database authentication Password.
 * @param {object} options Database initializing options.
 */
async function init(creds, options){
    let promise = new Promise(async function(res, rej){
        if(!creds) rej(`Database.init: No Credentials provided.`);
        if(!options.database) rej(`Database.init: No database parameter set..`);
        database = options.database;
        MongoDB_URL = `mongodb://${creds[0]}:${creds[1]}@localhost:27017/${database}?authSource=admin&readPreference=primary&appname=MongoDB%20Compass&ssl=false`


        res(options);
    });

    return promise;
};


let db = {
    init: init,
    //Functions
    print: print,
    getIsoTime: getIsoTime,

    //DB -> _db
    open : open,
    close: close,

    post: post,
    get: get,
    edit: edit,
    delete: _delete
};

let _db = {
    post: post,
    get: get,
    edit: edit,
    delete: _delete,

    init: init
};//moved init() to ready.js event. -- not related to DB functionalities.

module.exports = db;
