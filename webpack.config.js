
module.exports = {
    mode:"development", 
    watch: false,
    entry: {
      e2ee: './dev/main.js'
    },
    
    output: {
      path: __dirname + '/dev/build',
      filename: '[name]-bundle.js'
    },
    plugins: [
    ],
   
  }