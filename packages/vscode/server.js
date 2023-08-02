try {
    module.exports = require('@volar-examples/angular-language-server/bin/angular-language-server.js');
} catch {
    module.exports = require('./dist/node/server');
}
