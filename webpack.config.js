
module.exports = {
    mode:"development", 
    watch: false,
    entry: {
      e2ee: './test/main.js'
    },
    
    output: {
      path: __dirname + '/test/build',
      filename: '[name]-bundle.js'
    },
    plugins: [
    ],
   
  }