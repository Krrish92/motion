var express = require('express');
const crypto = require('crypto');
var router = express.Router();
var {
    createUser,
    getUserByEmail,
    getUserList,
    editUser,
    deleteUsr
} = require('../services/user.service');

router.post("/signup", signupUser);
router.post("/admin/login", adminLogin);
router.get("/admin/users", getUsers);
router.put("/admin/editUser/:id", editUsers);
router.delete("/admin/delete/:id", deleteUser);

async function signupUser(req, res) {
    try {
        let document = { ...req.body };
        if (!document.name) res.status(400).json({ error: "Bad request", message: "Invalid Name" });
        if (!document.mobile) res.status(400).json({ error: "Bad request", message: "Invalid mobile number" });
        if (!document.email) res.status(400).json({ error: "Bad request", message: "Invalid email" });
        if (!document.address) res.status(400).json({ error: "Bad request", message: "Invalid address" });
        let isUserExists = await getUserByEmail(document.email);
        if (isUserExists.length) {
            res.status(400).json({ error: "Bad request", message: "User already exists" });
            return;
        }
        let result = await createUser(document);
        res.status(200).send("User enrolled");
    } catch (err) {
        console.error("error in conroller ::", err);
        res.status(500).json({ error: "Internal Server Error", message: "Something went wrong!" });
    }
}

async function adminLogin(req, res) {
    let document = { ...req.body };
    if (!document.username) res.status(400).json({ error: "Bad request", message: "Please enter username" });
    if (!document.password) res.status(400).json({ error: "Bad request", message: "Please enter a password" });
    if (document.username !== 'motion@gmail.com' && document.password !== 'motion?123') {
        res.status(401).json({ error: "unauthorized", message: "Invalid username or password" });
        return;
    }
    res.status(200).json({ name: "Motion Admin", token: crypto.randomBytes(16).toString("hex") });
};

async function getUsers(req, res) {
    let queries = req.query;
    let users = await getUserList(queries);
    res.status(200).json({ message: 'Students retrived successfully', data: users });
}

async function editUsers(req, res) {
    let documents = { ...req.body, ...req.params };
    await editUser(documents)
    res.status(200).json({ message: 'Edited Successfully' });
}

async function deleteUser(req, res) {
    let documents = req.params;
    await deleteUsr(documents)
    res.status(200).json({ message: 'Deleted Successfully' });
}

module.exports = router;
