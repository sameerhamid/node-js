const fs = require('fs');
const superagent = require('superagent');


fs.readFile(`${__dirname}/dog.txt`, (err, data)=>{
    console.log("data>>", data.toString())
    superagent.get(`https://dog.ceo/api/breed/${data.toString()}/images/random`).end((err, result)=>{
        if(err) return console.log(err.message);
        console.log("result>>>", JSON.stringify(result.body.message));
        fs.writeFile(`${__dirname}/dog-image.txt`, result.body.message, (err)=>{
            if(err) console.log('error>>>', err)
        });
    });
})
