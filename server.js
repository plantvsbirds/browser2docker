var express = require('express');
var Docker = require('dockerode');
var fs = require('fs');



/*
Writing /Users/henry/.boot2docker/certs/boot2docker-vm/ca.pem
Writing /Users/henry/.boot2docker/certs/boot2docker-vm/cert.pem
Writing /Users/henry/.boot2docker/certs/boot2docker-vm/key.pem

To connect the Docker client to the Docker daemon, please set:
    export DOCKER_HOST=tcp://192.168.59.103:2376
    export DOCKER_CERT_PATH=/Users/henry/.boot2docker/certs/boot2docker-vm
    export DOCKER_TLS_VERIFY=1
*/


var dockerConfig = {
  host: '192.168.59.103',
  port: 2376,
  ca: fs.readFileSync('/Users/henry/.boot2docker/certs/boot2docker-vm/ca.pem'),
  cert: fs.readFileSync('/Users/henry/.boot2docker/certs/boot2docker-vm/cert.pem'),
  key: fs.readFileSync('/Users/henry/.boot2docker/certs/boot2docker-vm/key.pem')
};


var ourDocker = new Docker(dockerConfig);

function stopAndRemoveAll (callback) {
  ourDocker.listContainers(function (err, containers) {
    console.log(JSON.stringify(containers));
    console.log(JSON.stringify(err));
    if (containers.length == 0) callback();
    containers.forEach(function (containerInfo) {
      ourDocker.getContainer(containerInfo.Id).stop(function (err, data) {
              console.log(err);
        ourDocker.getContainer(containerInfo.Id).remove(function (err, data) {
              console.log(err);
              callback();
        });
      });
    });
  });
}
stopAndRemoveAll(function (){

console.log('hi')
ourDocker.createContainer({
 Tty: true  , 
 Image: 'ubuntu', 
 Cmd: ['bash'], 
 name: (Math.random()*100000).toString(),
  'OpenStdin': true,
}, function(err, container) {

  console.log(err);
  console.log(JSON.stringify(container));
  container.attach({stream: true, stdout: true, stderr: true, stdin:true}, function (err, stream) {
    stream.pipe(process.stdout);
    var isRaw = process.isRaw;
    process.stdin.resume();
    process.stdin.setRawMode(true);
    process.stdin.pipe(stream);

    process.stdin.on('data', function (chunk) {
      if ((new String(chunk)).charCodeAt(0) === 3) {
        process.exit();
      }
    })
  });
  container.start(function (err, data) {
  });
});


})
