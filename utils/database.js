const fs = require('fs');

const USERS_FILE_PATH = './data/users.json';

function readUsers() {
    try {
        const usersData = fs.readFileSync(USERS_FILE_PATH, 'utf8');
        return JSON.parse(usersData);
    } catch (err) {
        console.error('Error reading users file:', err);
        return {};
    }
}

function writeUsers(users) {
    try {
        fs.writeFileSync(USERS_FILE_PATH, JSON.stringify(users, null, 4));
    } catch (err) {
        console.error('Error writing users file:', err);
    }
}

function getUser(userId) {
    const users = readUsers();
    return users[userId];
}

function setUser(userId, userData) {
    const users = readUsers();
    users[userId] = userData;
    writeUsers(users);
}

module.exports = {
    readUsers,
    writeUsers,
    getUser,
    setUser,
};
