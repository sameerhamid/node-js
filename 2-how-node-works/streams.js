const fs = require('fs');

const server = require('http').createServer();


server.on('request', (req, res)=>{
    // solution 1
    // fs.readFile('test-file.txt', (err, data)=>{
    //     if(err) console.log(err);
    //     res.end(data);
    // })

    // Soluton 2 -> Streams
    // const readable = fs.createReadStream('test-file.txt');
    // readable.on('data', chunck=>{
    //     res.write(chunck);
    // })

    // readable.on('end', ()=>{
    //     res.end();
    // })

    // readable.on('error', err=>{
    //     console.log("Error>>>", err);
    //     res.statusCode = 500;
    //     res.end('File not found');
    // })

    // Solution 3

    const readable = fs.createReadStream('test-file.txt');
    readable.pipe(res);
    // readableStream.pipe(writableDest);
})

server.listen(9000, '127.0.0.1', ()=>{
     console.log("Listening....");
})
