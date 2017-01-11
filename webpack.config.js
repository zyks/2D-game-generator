var path = require('path');

module.exports = {
    entry: './client.js',
    devtool: 'source-map',
    output: {
        path: __dirname,
        filename: 'bundle.js'
    },
    module: {
        loaders: [
            {
                test: path.join(__dirname),
                loader: 'babel-loader'
            },
        ]
    }
};
