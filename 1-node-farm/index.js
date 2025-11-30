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

// <figure class="card">
//           <div class="card__emoji">{%IMAGE%}{%IMAGE%}</div>
//           <div class="card__title-box">
//             <h2 class="card__title">{%PRODUCTNAME%}</h2>
//           </div>

//           <div class="card__details">
//             <div class="card__detail-box {%NOT_ORGANIC%}">
//               <h6 class="card__detail">{%QUANTITY%} per 📦</h6>
//             </div>

//             <div class="card__detail-box">
//               <h6 class="card__detail card__detail--price">{%PRICE%}€</h6>
//             </div>
//           </div>

//           <a class="card__link" href="/product?id={%ID %}">
//             <span>Detail <i class="emoji-right">👉</i></span>
//           </a>
// </figure>

const replaceTemplate = (temp, product) => {
    let output = temp;
    output = output.replace(/{%PRODUCTNAME%}/g, product.productName);
    output = output.replace(/{%IMAGE%}/g, product.image);
    output = output.replace(/{%PRICE%}/g, product.price);
    output = output.replace(/{%FROM%}/g, product.from);
    output = output.replace(/{%NUTRIENTS%}/g, product.nutrients);
    output = output.replace(/{%QUANTITY%}/g, product.quantity);
    output = output.replace(/{%DESCRIPTION%}/g, product.description);
    output = output.replace(/{%ID%}/g, product.id);

    if (!product.organic) {
        output = output.replace(/{%NOT_ORGANIC%}/g, 'not-organic');
    }

    return output;
};


const tempOverview = fs.readFileSync(`${__dirname}/templates/template-overview.html`, 'utf-8');
const tempCard = fs.readFileSync(`${__dirname}/templates/template-card.html`, 'utf-8');
const tempProduct = fs.readFileSync(`${__dirname}/templates/template-product.html`, 'utf-8');

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8');
const parsedData = JSON.parse(data);

const server = http.createServer((req, res)=>{
    console.log(req.url)
    const pathName = req.url;
    // ---------- overview page -------------
    if(pathName === '/' || pathName === '/overview') {
        res.writeHead(200, {"Content-type": "text/html"});

        const cardsHtml = parsedData.map(el => replaceTemplate(tempCard, el)).join('');
        const output = tempOverview.replace('{%PRODUCT_CARDS%}', cardsHtml);
        res.end(output);

        // ---------- product page -------------
    }else if(pathName === '/product') {
        res.end('This is the PRODUCT');

        // ---------- API -------------
    }else if(pathName ===`/api`) {
        res.end(data);

        // ---------- Not Found -------------
    }else {
        res.writeHead(404, {"Content-type": "text/html"});
        res.end("<h1 style='color:red; text-align: center;'>Page not found!</h1>");
    }
})

server.listen(9600, '127.0.0.1', ()=>{
    console.log("Server listening on port 9600");
})
