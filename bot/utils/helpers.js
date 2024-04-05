// helpers.js
const fs = require('fs');

const UserDataPath = './server/data/accounts.json';

function readUsers() {
    try {
        const usersData = fs.readFileSync(UserDataPath, 'utf8');
        return JSON.parse(usersData);
    } catch (err) {
        console.error('Error reading users file:', err);
        return {};
    }
}

function writeUsers(users) {
    try {
        fs.writeFileSync(UserDataPath, JSON.stringify(users, null, 4));
    } catch (err) {
        console.error('Error writing users file:', err);
    }
}

function getUserData(userId) {
    const users = readUsers();
    return users[userId];
}

function setUserData(userId, userData) {
    const users = readUsers();
    users[userId] = userData;
    writeUsers(users);
}

function isValidFriendCode(code) {
    const numericCode = Number(code);
    return !isNaN(numericCode) && Number.isInteger(numericCode) && numericCode >= 0 && numericCode <= 9999999999999999;
}

module.exports = { readUsers, writeUsers, getUserData, setUserData, isValidFriendCode };
