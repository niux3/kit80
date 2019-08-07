let path = require('path');

module.exports = (controllerAction) =>{
    let [ controller, action ] = controllerAction.trim().split('.');
    return require(path.join(__dirname, `/${controller}`))[action];
}
