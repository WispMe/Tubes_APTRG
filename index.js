const SerialPort = require('serialport');//import package
const PortNumber = process.argv[2];//ambil argument ke-2 di command
console.log("Connect Port " + PortNumber);// nampilin port number
const myPort = new SerialPort(PortNumber, {
	baudRate : 57600
});//buat object serial port

//parser biar ga nampilin buffer
const parsers = SerialPort.parsers;
const parser = new parsers.Readline({
	delimiter : '\r\n'
});

myPort.pipe(parser); //using parser

//event yang dipanggil ketika serial port kebuka. pake 'open'
myPort.on('open', callport);

function callport(){
	console.log("Arduino Connected on " + PortNumber);

	let timeOut = 3000; // 3detik
	setTimeout(()=>{
		//kirim command 1 ke arduino
		myPort.write('1', (err)=>{
			if(err)
				contsole.log(err); // munculin error
			else
				console.log("success write 1");// kalo ga error kasih notif
		});
	},timeOut);
}


// event yang munculin data dari arduino.pake 'data'
/*parser.on('data', showdata); 

function showdata(data){
	console.log(data);
	let hasilParsing=parsingRAWData(data, ",");
	console.log(hasilParsing);
}*/


// EXPREES DAN SOCKET IO
const express = require('express');//import package express
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io').listen(server);// import package socket.io
const path = require('path');// import package path (sudah default ada)


app.use(express.static(path.join(__dirname,'gui')));// untuk nempation file web kita di folder gui
const portlisten = 8000;
server.listen(portlisten);



//buat socket event
let jumlahClient = 0;
io.on('connection' , (socket)=>{
	jumlahClient++;
	console.log('New Client Connected...\n' + "Total :" + jumlahClient);

	parser.on('data', (data)=>{
		//panggil si parsing
		let hasilParsing = parsingRAWData(data, ",");
		if(hasilParsing[0] == "OK"){
			socket.emit('socketData', {datahasil : hasilParsing});
			//console.log("send to client");
		}
		//console.log(hasilParsing);
	});

	socket.on('disconnect', ()=>{
		jumlahClient--;
		console.log('Client disconnected \n' + 'Total :' + jumlahClient)
	});
});


// FUNCTION UNTUK PARSING
// argument 1 : data yang diparsing ex: 123 434 5334
// argument 2 : pemisah
// return array data [0] =123 [1] = 434 [2] =5334
function parsingRAWData(data,delimiter){
	let result;
	result = data.toString().replace(/(\r\n|\n|\r)/gm,"").split(delimiter);

	return result;

}