const conn = require("../models/mongoConnect");
const bcrypt = require("bcrypt");

const entryManage = {
    register: async (req, res) => {
        try {
            var username = req.body.username;
            var password = req.body.password;
            if(!username || !password){
                return res.status(400).json({
                    status: false,
                    message: 'Some required parameter missing',
                }); 
            }
            var passwordhash = bcrypt.hashSync(password, 5)
        }catch (err){
            console.log("hash errror : " +err);
            return res.status(500).json({
                status: false,
                message: 'Something went wrong',
            }); 
        }

        try {
            const coll = await conn("users");
            // coll.createIndex( { "username": 1 }, { unique: true } );
            const data = {
                username: username,
                passwordhash: passwordhash,
                data: {

                }
            };
            const result = await coll.insertOne(data);
            var responce = {
                status: true,
                message: "user inserted",
                data: result
            };
            return res.status(200).json(responce);
        } catch (err) {
            var responce = {
                status: false,
                message: err.message,
            };
            return res.status(400).json(responce);
        }
    },

    login: async (req, res) => {
        try {
            var username = req.body.username;
            var password = req.body.password;
            if(!username || !password){
                return res.status(400).json({
                    status: false,
                    message: 'Some required parameter missing',
                }); 
            }

            const coll = await conn("users");

            const query = {
                username: username
            };
            const result = await coll.findOne(query);

            if(result!=null) {
                const checkLogin = bcrypt.compareSync(password, result.passwordhash);
                if (checkLogin){
                    var responce = {
                        status: true,
                        message: "login successfull",
                    };
                }else{
                    var responce = {
                        status: false,
                        message: "Invalid password",
                    };                
                }
            }else {
                var responce = {
                    status: false,
                    message: "Invalid username",
                };  
            }
            return res.status(200).json(responce);
        } catch (err) {
            var responce = {
                status: false,
                message: err.message,
            };
            return res.status(400).json(responce);
        }
    }
};

module.exports = entryManage;
