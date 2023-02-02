

const {spawn} = require('child_process');
const path = require('path')

class UserController {
  async getScript (req, res) {
    let file = path.join(__dirname,'../files/main.py');

    // Reading Python files
    var dataToSend;
    // spawn new child process to call the python script
    const python = spawn('python', [file]);
    console.log(file);
    
    // collect data from script
    python.stdout.on('data', function (data) {
        dataToSend = data.toString();
        console.log(dataToSend);
        res.send(dataToSend);
    });

    python.stderr.on('data', data => {
        console.error(`stderr: ${data}`);
    }); 

    // in close event we are sure that stream from child process is closed
    python.on('exit', (code) => {
        console.log(`child process exited with code ${code}, ${dataToSend}`);
    }); 

  }
}

module.exports = new UserController();
