const fs = require('fs');
const crypto = require('crypto');

process.env.UV_THREADPOOL_SIZE = 5;

const start = Date.now()
setTimeout(() => {console.log("Timer 1 Finished")}, 0);
setImmediate(()=> console.log("Imidiate 1 Finished"))

fs.readFile('test-file.txt', ()=>{

    console.log("I/O finised");

    setTimeout(() => {console.log("Timer 2 Finished")}, 0);
    setTimeout(() => {console.log("Timer 3 Finished")}, 3000);
    setImmediate(()=> console.log("Imidiate 2 Finished"))

    process.nextTick(()=>console.log("process.nextTick"))

    crypto.pbkdf2('password', 'salt', 100000, 1024, 'sha512',()=>{
        console.log(Date.now() - start, "Password ecrypted");
    })
     crypto.pbkdf2('password', 'salt', 100000, 1024, 'sha512',()=>{
        console.log(Date.now() - start, "Password ecrypted");
    })
    crypto.pbkdf2('password', 'salt', 100000, 1024, 'sha512',()=>{
        console.log(Date.now() - start, "Password ecrypted");
    })
    crypto.pbkdf2('password', 'salt', 100000, 1024, 'sha512',()=>{
        console.log(Date.now() - start, "Password ecrypted");
    })
})

console.log("Hello from the top level code");
