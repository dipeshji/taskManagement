const mongoose = require('mongoose');
const schema = mongoose.Schema;
let utils = require('../utils');

var supervisor = new schema({
    userName: {
        type: String,
        required: true
    },
    userEmail: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
});

supervisorModel = mongoose.model('supervisor', supervisor);

module.exports.addSupervisor = user => {
    console.log(user);

    return new Promise((resolve, reject) => {
        let query = { $or: [{ userEmail: user.email }, { userName: user.name }] }

        supervisorModel.findOne(query, (err, euser) => {
            if (euser) {
                reject({ msg: "User already exist" })
            } else {
                utils.encryptpass(user.pass)
                    .then(hash => {
                        let query = {
                            userName: user.name,
                            userEmail: user.email,
                            password: hash
                        }
                        supervisorModel.create(query, (err, user) => {
                            if (user) resolve({ msg: `Supervisor created with user name ${user.userName}` });
                            else reject({ msg: "Something went wrong!! please try again" })

                        });
                    })
                    .catch(err => reject({ msg: "Something went wrong please try again" }))
            }
        })
    });
};


async function loginSupervisor(user) {
    let hash = await get_hash(user);
    console.log(hash);

    return new Promise(async function (resolve, reject) {
        if (hash) {
            var status = await utils.decryptpass(user.pass, hash.password);
            status
                ? resolve(hash)
                : reject({
                    msg: "Incorrect Credentials!!",
                    status: false
                })
        } else reject({
            msg: `${user.email} dosent exists`,
            status: false
        })
    });
};

get_hash = (user => {
    return supervisorModel.findOne({ userEmail: user.email })
        .exec()
});

module.exports.loginSupervisor = loginSupervisor;