const DataBase = {
    defualt: null

};

module.exports = {

    async init(database){
        if(!database) return console.log("DataBase Initilizing error: Database not defined.");
        DataBase.defualt = database;
        return true;
    },

    /**
     * Open a connection to the DataBase.
     * @returns MongoClient
     */
    async Open(){
        if(!DataBase.defualt) return console.log("Cannot open Database. Database not defined.");

        let MongoClient = require('mongodb').MongoClient;
        MongoClient = new MongoClient("mongodb://localhost:27017/", {useUnifiedTopology:true});
        return MongoClient;
    },


    async search_query(_db, database, collection, query){
        let p = new Promise(async function(resolve, reject){
            _db.collection(collection).find(query).toArray(async function(err,result){
                if(err){
                    fn.print(`DataBase ERR: ${err}`);
                    reject(err);
                };
                database.close();

                if(result && result[0]){
                    result = result[0]
                    resolve(results);
                }else{
                    resolve(false);
                };
            });
        });
        return p;
    },


    async search_projection(_db, database, collection, projection){
        let p = new Promise(async function(resolve, reject){
            _db.collection(collection).find({}, projection).toArray(async function(err,results){
                if(err){
                    fn.print(`DataBase ERR: ${err}`);
                    reject(err);
                };
                database.close();

                if(results){
                    resolve(results);
                }else{
                    resolve(false);
                };
            });
        });
        return p;
    },


    async search_all(_db, database, collection, ){
        let p = new Promise(async function(resolve, reject){
            _db.collection(collection).find({}).toArray(async function(err,results){
                if(err){
                    fn.print(`DataBase ERR: ${err}`);
                    reject(err);
                };
                database.close();

                if(results){
                    resolve(results);
                }else{
                    resolve(false);
                };
            });
        });
        return p;
    },


    /**
     * Search the database collection for the query or projection.
     * Only one, not both, may be defined.
     * @param {string} collection of the [database]
     * @param {object} query to search the [collection] for.
     * @param {pbject} projection to search the [collection] for.
     * @param {string} database
     * @returns search result or false
     */
    async search(collection, query, projection, database){
        let search_query = this.search_query;
        let search_projection = this.search_projection;
        let search_all = this.search_all;
        let MongoClient = await this.Open();

        let p = new Promise(async function(resolve, reject){
            if(!DataBase.defualt && !database) return console.log("Cannot search Database. Database not defined.");
            if(!DataBase.defualt && database) DataBase.defualt = database;
            if(!collection) return console.log("Cannot search Database. Database.Collection not defined.");
            if(query && projection) return console.log("Cannot serach Database. Only one, query or projection, may be defined...");

            MongoClient.connect(async function(err, database) {
                if(err) throw reject(err);
                let _db = database.db(DataBase.defualt);
                let data = null;
                if(query && !projection){
                    data = await search_query(_db, database, collection, query);
                }else if(!query && projection){
                    data = await search_projection(_db, database, collection, projection);
                }else if(!query && !projection){
                    data = await search_all(_db, database, collection);
                };

                resolve(data);
            });
        });
        return p;
    },


    async insert(collection, insert, database){
        let MongoClient = await this.Open();
        let p = new Promise(async function(resolve, reject){
            if(!DataBase.defualt && !database) return console.log("Cannot insert item. Database not defined.");
            if(!DataBase.defualt && database) DataBase.defualt = database;
            if(!collection) return console.log("Cannot insert item. Database.Collection not defined.");
            if(!insert) return console.log("Cannot insert item. Item not defined.");

            MongoClient.connect(async function(err, database) {
                if(err) throw reject(err);
                let _db = database.db(DataBase.defualt);

                _db.collection(collection).insertOne(insert, function(err, res) {
                    if(err){
                        fn.print(`DataBase ERR: ${err}`);
                        reject(err);
                    };
                    resolve(res)
                });
            });
        });
        return p;
    }
};
