const createCounter = () =>{
    let count = 0;

    increment = ()=>{
        count ++;
        return count;
    }
    decrement = () =>{
        count--;
         return count;
    }
    get = ()=>{
        return count;
    }
    return {increment, decrement, get}

}

// const counter = createCounter();
// console.log(counter.increment())
// console.log(counter.decrement())
// console.log(counter.decrement())
// console.log(counter.decrement())
// console.log(counter.decrement())
// console.log(counter.get())

// const multiplyBy =  (x) =>{
//     return (y) =>{
//         return x * y
//     }
// }

// const double = multiplyBy(2);
// console.log(double(3))


for (var i = 1; i <= 3; i++) {
  setTimeout(() => {
    console.log(i);
  }, 1000);
}
