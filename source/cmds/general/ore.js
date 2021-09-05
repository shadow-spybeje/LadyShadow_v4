module.exports = {
    name:'ore',
    bot: null,

    async execute(message, args){
        if(!this.bot) this.bot = message.client;
        if(!args) return message.channel.send(await this.getList());

        if(!this.bot.x) this.bot.x = {};
        if(!this.bot.x.roids) await this.new();

        if(args[0]=='type'){
            args.shift();
            let n = await this.getList_type(args);
            message.channel.send(n);
        };
    },

    async getList_type(types){
        console.log(types)
        /*let list = [];
        types.forEach(async (item) => {
            for(roid in this.bot.x.roids){
                console.log(`${roid} -> ${item}`);
                if(!roid.includes(item) && !item.includes(roid)) return;
                let x = this.bot.x.roids[roid];
                let n = await this.roidFormat(x);
                list.push(n);
            };
        });
        if(list.length == 0) return false;
        return list;*/
        return types;
    },

    async getList(){
        let list = [];
        for(roid in this.bot.x.roids){
            let x = this.bot.x.roids[roid];
            let n = await this.roidFormat(x);
            list.push(n);
        };
        return list
    },

    roidFormat(roid){
        let sec = [];
        if(roid.maxSecurity['Amarr'] != null) sec.push(`Amarr: ${roid.maxSecurity['Amarr']}`);
        if(roid.maxSecurity['Caldari'] != null) sec.push(`Caldari: ${roid.maxSecurity['Caldari']}`);
        if(roid.maxSecurity['Gallente'] != null) sec.push(`Gallente: ${roid.maxSecurity['Gallente']}`);
        if(roid.maxSecurity['Minmitar'] != null) sec.push(`Minmitar: ${roid.maxSecurity['Minmitar']}`);

        return `__**${roid.name}**__\n**Ores**: ${roid.ores.join(", ")}\n**Security**: ${sec.join(", ")}`;
    },

    async new(){
        if(!this.bot.x) this.bot.x = {};

        /**
         * newList()
         * setOres()
         * setSec()
        */

        newList = async function(bot){
            let m = "Veldspar Scordite Pyroxeres Plagioclase Omber Kernite Jaspet Hemorphite Hedbergite Gneiss Dark-Ochre Crokite Spodumain Bistot Arkonor Mercoxit";

            class Asteroid{
              constructor(AstroidName){
                this.name = AstroidName;
                this.maxSecurity = {
                  "Amarr": 0.0,
                  "Caldari": 0.0,
                  "Gallente": 0.0,
                  "Minmitar": 0.0
                };
                this.ores = [];
                return this;
              };

              setSecurity(stats = {}){
                for(let secStat in stats){
                  this.maxSecurity[secStat] = stats[secStat]
                };
              };

              setOres(ores){
                if(!ores) return;
                this.ores = [];
                ores.forEach(ore => {
                  this.ores.push(ore)
                });
              };

              addOre(ore){
                if(!ore) return;
                this.ores.push(ore);
              };
            };

            let asteroids = {};

            m = m.split(" ");

            m.forEach(roid =>{
              if(roid.includes('-')) roid = roid.replace('-', ' ');
              let newRoid = new Asteroid(roid);
              asteroids[roid] = newRoid;
            });

            bot.x.roids = asteroids;
        }; newList(this.bot);

        setOres = async function(bot){
            let ores = {
             "Tritanium": ["Veldspar", "Scordite", "Plagioclase","Spodumain"],
             "Pyerite": ["Scordite", "Pyroxeres", "Omber", "Hedbergite", "Gneiss", "Crokite", "Bistot", "Arkonor"],
             "Mexallon": ["Pyroxeres", "Plagioclase", "Kernite", "Jaspet", "Gneiss", "Dark Ochre", "Crokite", "Bistot", "Arkonor"],
             "Isogen": ["Omber", "Kernite", "Hemorphite", "Gneiss", "Dark Ochre", "Spodumain"],
             "Nocxium": ["Jaspet", "Hemorphite", "Hedbergite", "Dark Ochre", "Crokite", "Spodumain"],
             "Zydrine": ["Spodumain", "Bistot"],
             "Megacyte": ["Spodumain", "Arkonor"],
             "Morphite": ["Mercoxit"]
            };

            for(ore in ores){
              ores[ore].forEach(rock =>{
                //console.log(`${ore} -> ${rock}`);
                try{
                    bot.x.roids[rock].addOre(ore);
                }catch(err){
                    console.log(`Cannot add ores for rock ${rock}`);
                };
              });
            };
        }; setOres(this.bot);

        setSec = async function(bot){
            const secs = [
              //{name: 'ROCK', sec:[ Amarr: 0, Caldari: 0, Gallente: 0, Minmitar: 0]}
              //1 = 1.0 || -1 = -1.0
              {name: 'Veldspar', sec: [1, 1, 1, 1]},
              {name: 'Scordite', sec: [1, 1, 1, 1]},
              {name: 'Pyroxeres', sec: [0.9, 0.9, 0, 0]},
              {name: 'Plagioclase', sec: [0, 0.7, 0.9, 0.9]},
              {name: 'Omber', sec: [0, 0, 0.7, 0.7]},
              {name: 'Kernite', sec: [0.7, 0.4, 0, 0.4]},
              {name: 'Jaspet', sec: [0.4, 0, 0.4, 0]},
              {name: 'Hemorphite', sec: [0, 0.2, 0, 0.2]},
              {name: 'Hedbergite', sec: [0.2, 0, 0.2, 0]},
              {name: 'Gneiss', sec: [0, 0, 0, 0]},
              {name: 'Dark Ochre', sec: [0, 0, 0, 0]},
              {name: 'Crokite', sec: [0, 0, 0, 0]},
              {name: 'Spodumain', sec: [0, 0, 0, 0]},
              {name: 'Bistot', sec: [0, 0, 0, 0]},
              {name: 'Arkonor', sec: [0, 0, 0, 0]},
              {name: 'Mercoxit', sec: [0, 0, 0, 0]}
            ];
            for(let x = 0; x < secs.length; x++){
              let thisSec = secs[x];
              let status = {
                'Amarr':thisSec.sec[0],
                'Caldari':thisSec.sec[1],
                'Gallente':thisSec.sec[2],
                'Minmitar':thisSec.sec[3],
              };

              bot.x.roids[thisSec.name].setSecurity(status);
            };
        }; setSec(this.bot);

        return true;
    },
};
