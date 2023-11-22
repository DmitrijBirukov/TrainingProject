const path = require('path'); 
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: './static/index.ts',

    module: {
        rules: [
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader']
            },
            {
                test: /\.tsx$/,
                use: 'ts-loader',
                exclude: /node-modules/
            },
            {
                test: /\.(png|jpg|jpeg|gif)$/i,
                type: 'asset/resource'
            }
        ],
    },

    resolve: {
        extensions: ['.js', '.tsx', '.ts']
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