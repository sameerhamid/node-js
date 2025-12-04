const Events = require('events');
const http = require('http');

class Sales extends Events{
    constructor(){
        super();
    }
}

const myEmmiter = new Sales();

const MyEventNames = {
    newSale: 'newSale',
}

myEmmiter.on(MyEventNames.newSale, ()=>{
    console.log("There was a new sale");
});

myEmmiter.on(MyEventNames.newSale, ()=>{
    console.log("Customer name Sameer ");
});

myEmmiter.on(MyEventNames.newSale, (stock)=>{
    console.log(`There are n ${stock} left items in stock`);
});


myEmmiter.emit(MyEventNames.newSale, 9, 10)

// --------------------------------------------

const server = http.createServer()

server.on('request', (req, res)=>{
    console.log('Request Recieved');
    res.end('Request Recieved');
})

server.on('request', (req, res)=>{
    console.log('Another request 😊');
})

server.on('close', ()=>{
    console.log("Server closed");
})

server.listen(9600, '127.0.0.1', ()=>{
    console.log('Server listening on port 9600')
})
