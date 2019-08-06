let path = require('path');

module.exports = (controllerAction) =>{
    let parts = controllerAction.trim().split('.');
    return require(path.join(__dirname, `/${parts[0]}`))[parts[1]];
}
