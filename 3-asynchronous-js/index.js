const fs = require('fs');
const superagent = require('superagent');


// fs.readFile(`${__dirname}/dog.txt`, (err, data)=>{
//     console.log("data>>", data.toString())
//     superagent.get(`https://dog.ceo/api/breed/${data.toString()}/images/random`).end((err, result)=>{
//         if(err) return console.log(err.message);
//         console.log("result>>>", JSON.stringify(result.body.message));
//         fs.writeFile(`${__dirname}/dog-image.txt`, result.body.message, (err)=>{
//             if(err) console.log('error>>>', err)
//         });
//     });
// })


// fs.readFile(`${__dirname}/dog.txt`, (err, data)=>{
//     console.log("data>>", data.toString())
//     // From Callback Hell to Promises
//     superagent.get(`https://dog.ceo/api/breed/${data.toString()}/images/random`)
//     .then((res)=>{
//         console.log("result>>>", JSON.stringify(res.body.message));
//         fs.writeFile(`${__dirname}/dog-image.txt`, res.body.message, (err)=>{
//             if(err) console.log('error>>>', err)
//         });
//     }).catch(err =>{
//         console.log(err.message);
//     });
// })



const readFilePro = (file)=>{
    return new Promise((resolve, reject)=>{
        fs.readFile(file, (err, data)=>{
            if(err) reject(err);
            resolve(data);
        })
    })
}

const writeFilePro = (file, data)=>{
    return new Promise((resolve, reject)=>{
        fs.writeFile(file, data, (err)=>{
            if(err) reject(err);
            resolve('Data written in the file successfull!');
        });
    })
}

readFilePro(`${__dirname}/dog.txt`).then(data => {
    console.log(data.toString());
    return superagent.get(`https://dog.ceo/api/breed/${data.toString()}/images/random`)
}).then((res) => {
    console.log("result>>>", JSON.stringify(res.body.message));
    return writeFilePro(`${__dirname}/dog-image.txt`, res.body.message)
}).then(data => { console.log(data) }).catch(err => {
    console.log(err)
})
