const mongoose = require("mongoose");
var mongodb = require('mongodb');
const path = require("path");
const fs = require("fs");
const userModel = require('../model/Users');

async function createUser(params) {
    if (params.file1) {
        params.doc1 = await getDocPath(params.file1);
        delete params.file1;
    }
    if (params.file2) {
        params.doc2 = await getDocPath(params.file2);
        delete params.file2;
    }
    let model = new userModel({ ...params });
    model.save();
    return;
}

async function getUserByEmail(email) {
    let user = await userModel.find({ email: email }).exec();
    return user;
}

async function getUserList(params) {
    let query = {};
    if (params.searchText) {
        query['name'] = new RegExp(params.searchText.replace(/\\/g, ''), 'gi')
    }
    if (params.from && params.to) {
        query['createdAt'] = { $gte: from }
        query['createdAt'] = { $lte: to }
    }
    let users = await userModel.find(query).exec();
    return users;
}

async function editUser(params) {
    let users = await userModel.findOneAndUpdate({ _id: mongodb.ObjectId(params.id) }, {
        name: params.name,
        mobile: params.mobile,
        email: params.email,
        address: params.address
    }).exec();
    return users;
}

async function deleteUsr(params) {
    let users = await userModel.remove({ _id: mongodb.ObjectId(params.id) }).exec();
    return users;
}

function getDocPath(base64Url) {
    let dir = `./uploads`;
    !fs.existsSync(dir) && fs.mkdirSync(dir);
    let fileName = `accedmic_document_${new Date().getTime()}.pdf`;
    return new Promise((resolve, reject) => {
        var base64 = base64Url.replace(/^data:application\/\w+;base64,/, "");
        let buff = Buffer.from(base64, 'base64');
        fs.writeFile(`${dir}/${fileName}`, buff, (err) => {
            if (err) { reject(err); return; };
            resolve(fileName);
        });
    })
}

module.exports = {
    createUser,
    getUserList,
    getUserByEmail,
    editUser,
    deleteUsr
}