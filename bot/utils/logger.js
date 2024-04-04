

const log = (message) => {
    console.log(`[Bot : Main] [ ${new Date().toLocaleString()} ] ${message}`);
};

const error = (message) => {
    console.log(`[Bot : Error] [ ${new Date().toLocaleString()} ] ${message}`);
};

const warn = (message) => {
    console.log(`[Bot : Warn] [ ${new Date().toLocaleString()} ] ${message}`);
};

const debug = (message) => {
    console.log(`[Bot : Debug] [ ${new Date().toLocaleString()} ] ${message}`);
};

module.exports = { log, error, warn, debug };
