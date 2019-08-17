let path = require('path');

module.exports = (controllerAction) =>{
    let [ controller, action ] = controllerAction.split('.').map((item)=> item.trim());
    return require(path.join(__dirname, `/${controller}`))[action];
}
