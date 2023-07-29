const UserModel = require('../models/users.model');
const crypto = require('crypto');

exports.insert = (req, res) => {
    let salt = crypto.randomBytes(16).toString('base64');
    let hash = crypto.createHmac('sha512', salt).update(req.body.password).digest("base64");
    req.body.password = salt + "$" + hash;
    req.body.permissionLevel = 1;
    UserModel.createUser(req.body)
        .then((result) => {
            res.status(201).send({id: result._id});
        });
};

exports.list = (req, res) => {
    let limit = req.query.limit && req.query.limit <= 100 ? parseInt(req.query.limit) : 10;
    let page = 0;
    if (req.query) {
        if (req.query.page) {
            req.query.page = parseInt(req.query.page);
            page = Number.isInteger(req.query.page) ? req.query.page : 0;
        }
    }
    UserModel.list(limit, page)
        .then((result) => {
            res.status(200).send(result);
        })
};

exports.getById = (req, res) => {
    UserModel.findById(req.params.userId)
        .then((result) => {
            res.status(200).send(result);
        });
};

exports.patchById = (req, res) => {
    if (req.body.password) {
        let salt = crypto.randomBytes(16).toString('base64');
        let hash = crypto.createHmac('sha512', salt).update(req.body.password).digest("base64");
        req.body.password = salt + "$" + hash;
    }

    UserModel.patchUser(req.params.userId, req.body)
        .then((result) => {
            res.status(204).send({});
        });

};

exports.removeById = (req, res) => {
    UserModel.removeById(req.params.userId)
        .then((result)=>{
            res.status(204).send({});
        });
};

exports.addFriend = async (req, res) => {
    const userId = req.params.userId;
    if (!req.body.friendId) {
        res.status(400).send('friendId is require')
    }

    const friendId = req.body.friendId;
    const user = await UserModel.addFriend(userId, friendId);

    res.status(200).send(user);
}

exports.removeFriend = async (req, res) => {
    const userId = req.params.userId;
    if (!req.body.friendId) {
        res.status(400).send('friendId is required')
    }

    const friendId = req.body.friendId;
    const user = await UserModel.removeFriend(userId, friendId);

    res.status(200).send(user);
}

exports.listFriends = async (req, res) => {
    const userId = req.params.userId;
    const friendsList = UserModel.friendsList(userId);

    res.send(friendsList);
}
