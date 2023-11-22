const path = require('path'); 
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: './static/index',

    module: {
        rules: [
            {
                test: /\.ts$/,
                exclude: /node-modules/,
                loader: 'babel-loader'

            },

            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader']
            },
            {
                test: /\.(png|jpg|jpeg|gif)$/i,
                type: 'asset/resource'
            }
        ],
    },

    resolve: {
        extensions: ['.js', '.tsx', '.ts', '.json']
    },

    output: {
        filename: 'bundle[contenthash].js',
        
        path: path.resolve(__dirname, 'static', 'dist')

    },

    plugins: [
        new HtmlWebpackPlugin({
            template: './static/index.html',
            publicPath: './static/dist'
        })
    ],
    mode: "development"
};