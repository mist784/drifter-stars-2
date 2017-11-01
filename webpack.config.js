var path = require('path');

module.exports = {
    entry: './src/DrifterStars2',
    output: {
        path: path.resolve(__dirname, 'dist/umd'),
        libraryTarget: 'umd',
        library: 'DrifterStars2'
    }
};