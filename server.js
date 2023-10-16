//const { chooseRandomElement }  =require('./port_check.js');
//var child = require('child_process').execFile;
const { spawn } = require('child_process');
//var executablePath = "AtlantsServer/AtlantisServer.exe";
//var executablePath = "AtlantisServer.exe";
//var parameters = ["PVPMap?Id=1","-server","-port=3000","-log"];
// Set the path to the Unreal Server executable
const executablePath = 'AtlantisServer.sh'; // Update with the correct path

const fetch = require('node-fetch');
let url = "http://www.rumbling-games.com/atlants/GetReadyMatchesList.php";
//let url = "http://www.vartola.net/football/GetReadyMatchesList.php";


let settings = { method: "Get" };
var port_fx;
var map;
var parameters;
const server_ip="149.28.53.149";

///////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////Get Ip ///////////////////////////////////////////////////////////////
async function getIP() {
  const response = await fetch('https://api.ipify.org?format=json');
  const data = await response.json();
  console.log(data.ip);
}


///////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////get random port////////////////////////////////////////////////////////
const range = Array.apply(null, {length: 100}).map(Function.call, Number);
 
const PortsArray = Array.from(range, x => x + 5000);
const usedArray = [];
let index = 0;

function addToUsedArray(element) {
  usedArray.push(element);
}

function removeFromUsedArray(element) {
  const index = usedArray.indexOf(element);
  if (index > -1) {
    usedArray.splice(index, 1);
  }
}

function chooseRandomElement() {
  let element;
  do {
    index = (index + 1) % PortsArray.length;
    element = PortsArray[index];
  } while (usedArray.includes(element));
  usedArray.push(element);
  setTimeout(removeFromUsedArray, 360000, element); // remove the element from the used array after 6 minutes
  return element;
}

///////////////////////////////////////////////////////////////////////////////////////
setInterval(()=>{
  //  bat.on('exit');
    fetch(url, settings)
        .then(res => res.json())
        .then((json) => {
            if(json.id==0){
                console.log("do nothing")
				
            }
            else {
				 // do something with JSON
				 // pattern url ex.. id=10,127.0.0.1:3000
				port_fx=chooseRandomElement();
				map=json.map
				parameters = [map+"?Id="+json.id,"-server","-port="+port_fx,"id="+json.id+","+server_ip+":"+port_fx,"-log"]; 
				 console.log(parameters);
			
startUnrealServer();
       
            }
        });


 
}, 5000);
const startUnrealServer = () => {
  console.log('Starting Unreal Server...');
  const unrealServer = spawn(executablePath, parameters);
  unrealServer.stdout.on('data', (data) => {
    console.log(`stdout: ${data}`);
  });
  unrealServer.stderr.on('data', (data) => {
    console.error(`stderr: ${data}`);
  });
  unrealServer.on('close', (code) => {
    console.log(`Unreal Server exited with code ${code}`);
  });
  unrealServer.on('error', (error) => {
    console.error(`Failed to start Unreal Server: ${error.message}`);
  });
};
