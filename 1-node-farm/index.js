const fs = require('fs');
const http = require('http');
const url = require('url');

// ----------------- FILES ------------------

// -------------- Blocking synchronous way ----------

// const textIn = fs.readFileSync('./txt/input.txt', 'utf-8');

// console.log('textIn', textIn)

// const textOut = `This is what we know about the avacado:  ${textIn}.\nCreated on ${Date.now()}`

// fs.writeFileSync('./txt/output.txt', textOut, 'utf-8');

// -------------- Non-Blocking asynchronous way ----------

// fs.readFile('./txt/start.txt', 'utf-8', (err, data1) => {
//     console.log(data1)
//     fs.readFile(`./txt/${data1}.txt`, 'utf-8', (err, data2)=>{
//         console.log(data2);
//         fs.readFile('./txt/append.txt', 'utf-8', (err, data3) => {
//             console.log(data3);
//             fs.writeFile('./txt/final.txt', `${data2}\n${data3}`, 'utf-8', err => {
//                 console.log('Your file has been written');
//             });
//         })
//     })
// });

// console.log('Will read file')

// ----------------------- SERVER -----------------

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8', (err, data));
const parsedData = JSON.parse(data);

const server = http.createServer((req, res)=>{
    console.log(req.url)
    const pathName = req.url;
    if(pathName === '/' || pathName === '/overview') {
        res.end("This is the OVERVIEW");
    }else if(pathName === '/product') {
        res.end('This is the PRODUCT');
    }else if(pathName ===`/api/products`) {
        res.end(data);
    }else {
        res.writeHead(404, {"Content-type": "text/html"});
        res.end("<h1 style='color:red; text-align: center;'>Page not found!</h1>");
    }
})

server.listen(9600, '127.0.0.1', ()=>{
    console.log("Server listening on port 9600");
})
