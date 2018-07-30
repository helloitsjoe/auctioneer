const { createServer } = require('./serverFactory');

if (process.env.NODE_ENV !== 'test') {
    createServer(3001);
}