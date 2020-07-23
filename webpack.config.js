
module.exports = {
  mode: "development",
  watch: false,
  entry: {
    e2ee: './example/main.js'
  },

  output: {
    path: __dirname + '/example/build',
    filename: '[name]-bundle.js'
  },
  plugins: [
  ],

}