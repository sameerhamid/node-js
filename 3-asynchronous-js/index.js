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

// readFilePro(`${__dirname}/dog.txt`).then(data => {
//     console.log(data.toString());
//     return superagent.get(`https://dog.ceo/api/breed/${data.toString()}/images/random`)
// }).then((res) => {
//     console.log("result>>>", JSON.stringify(res.body.message));
//     return writeFilePro(`${__dirname}/dog-image.txt`, res.body.message)
// }).then(data => { console.log(data) }).catch(err => {
//     console.log(err)
// })


// const getDogPic = async () => {
//     try {
//         const data = await readFilePro(`${__dirname}/dog.txt`);
//         console.log(data.toString());
//         const res = await superagent.get(`https://dog.ceo/api/breed/${data.toString()}/images/random`);
//         console.log("result>>>", JSON.stringify(res.body.message));
//         const writFileData = await writeFilePro(`${__dirname}/dog-image.txt`, res.body.message);
//         console.log(writFileData)
//     } catch (error) {
//         console.log(error);
//         throw error(error)
//     }
//     return 'Ready!'
// }

// console.log("1: Will get dog pics");
// // const x = getDogPic();
// // console.log(x);
// getDogPic().then(data=>{
//     console.log(data);
//     console.log("2: Done getting dog pics");
// }).catch(err=>{
//     console.log(err)
// })
// // console.log("1: Done getting dog pics");

// -------------------- waiting for multiple promises simultanously-------------------

const getDogPic = async () => {
    try {
        const data = await readFilePro(`${__dirname}/dog.txt`);
        console.log(data.toString());
        const res1 = superagent.get(`https://dog.ceo/api/breed/${data.toString()}/images/random`);
        const res2 = superagent.get(`https://dog.ceo/api/breed/${data.toString()}/images/random`);
        const res3 = superagent.get(`https://dog.ceo/api/breed/${data.toString()}/images/random`);
        const all = await Promise.all([res1, res2, res3]);
        const imagesArr = all.map(it => it.body.message);
        console.log("result>>>", JSON.stringify(imagesArr));
        const writFileData = await writeFilePro(`${__dirname}/dog-image.txt`, imagesArr.join('\n'));
        console.log(writFileData)
    } catch (error) {
        console.log(error);
        throw error(error)
    }
    return 'Ready!'
}


(async()=>{
    try {
        console.log("1: will get the dog pics")
        const x = await getDogPic();
        console.log(x);
        console.log("2: Done getting dog pics")
    } catch (error) {
        console.log(error)
    }
})()
