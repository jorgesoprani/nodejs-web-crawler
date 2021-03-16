const fs = require('fs');
const path = require('path');

const getConfig = async () => {
    const dir = './config';
    const jsonsInDir = fs.readdirSync(dir)
        .filter(file => path.extname(file) === '.json')
        .map(file => path.join(dir, file));

    return jsonsInDir.map(filePath => {
        const fileData = fs.readFileSync(filePath);
        const json = JSON.parse(fileData.toString());
        return json;
    });
}

module.exports = getConfig;