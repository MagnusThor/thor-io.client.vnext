
module.exports = {
    mode:"development", 
    watch: false,
    entry: {
      dc: './test/testChannel.js'
    },
    
    output: {
      path: __dirname + '/test/build',
      filename: '[name]-bundle.js'
    },
    plugins: [
    ],
   
  }