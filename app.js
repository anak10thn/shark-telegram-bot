'use strict';

var shark = require('shark.io');
var fs = require('fs');
var _ = require('lodash');
var stripAnsi = require('strip-ansi');

shark.init('127.0.0.1:6969');
var setup = shark.setup;

setup.on('open',function(event){
    event.sys.exec('startbot',function(spwn){
      spwn.out.connect(function(data,err){
        var lines = data.toString().split('\n');
        if (lines.length > 1) {
          lines = _.map(lines, function(line) {
              return stripAnsi(line);
          });

          // Message output should always be in the first line of data
          if (lines[0].indexOf('>>>') > -1) {
              console.log(lines[0]);
              var parseCLI = parseCLIOutput(lines[0]);
              var cmd = parseCLI.message.toLowerCase().split(" ");
              if(cmd[0] == "echo"){
                  var msg = parseCLI.message.replace(cmd[0],"")
                  spwn.write("msg "+parseCLI.sendTo+" juriko ["+cmd[0]+"] : "+msg+"\n");
              }
          }
        }

	   });
    });
});

function parseCLIOutput(data) {
    var splitData = data.split(' >>> ');
    var message = splitData[splitData.length - 1];
    var metaData = splitData[0].split(' ');

    var sendTo = metaData[2];
    var user = metaData[metaData.length - 1];
    return {
        sendTo: sendTo,
        user: user,
        message: message
    };
}
