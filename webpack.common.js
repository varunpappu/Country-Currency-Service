const path = require('path');
const glob = require('glob');
const fs = require('fs');
const entryPaths = glob.sync('./src/client/*');
let entries = {};
for (let i = 0; i < entryPaths.length; i += 1) {
    const parsedPath = path.parse(entryPaths[i]);
    if (parsedPath.base === 'index.tsx') {
        entries[parsedPath.name] = `${parsedPath.dir}/index.tsx`;
    }
}


module.exports = {
    entry: entries,
    resolve: {
        extensions: ['.ts', '.tsx', '.js', '.css', '.scss'],
    },
    module: {
        rules: [
            {
                test: /\.ts(x?)$/,
                exclude: /node_modules/,
                use: [
                    { loader: 'babel-loader' },
                    {
                        loader: 'ts-loader',
                        options: {
                            configFile: 'tsconfig.json',
                        },
                    },
                ],
            },
            {
                test: /\.s?css$/,
                use: [{ loader: "style-loader" }, { loader: "css-loader" }, { loader: "sass-loader" }]
            },
        ],
    },
    output: {
        path: path.join(__dirname, 'dist/client'),
        filename: '[name].js',
        sourceMapFilename: '[name].js.map',
        publicPath: '/',
    },
};
