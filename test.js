
/////////////////////////////
/*
const findAllIntegers = (str) => {
    // let newStr= str.match(/(\d+)/);
    // for(let i = 0; i<str.length; i=i+2){
    //     if(str[i] >= '0' && str[i] <= '9')
    //         newStr = newStr.concat(str[i], '-');
        
    // }
    // console.log(newStr.slice(0,-1)); 
    // let matches = str.match(/\d+/g);
    
    // Display output if number extracted
    // if (matches) {
    //     console.log(matches[0] +', '+ matches[1]+', ' + matches[2]);
    // }
    // console.log(newStr[0]); 
    let a = str.split("").filter(char => !(isNaN(parseInt(char)))).join("-");
    console.log(a);
    // console.log( str.split("").filter(char => isNaN(parseInt(char))).join(""));
}

findAllIntegers('1-a-b-2')
*////////////////////////////////////////

/*
process.stdin.resume();
process.stdin.setEncoding("utf-8");
var stdin_input = "";

process.stdin.on("data", function (input) {
    stdin_input += input;                               // Reading input from STDIN
});

process.stdin.on("end", function () {
   main(stdin_input);
});

function main(input) {
    // let input1 = input.slice(0, (input.length)/2);
    // let input2 = input.slice((input.length)/2+1, input.length);
    let input1 = '101010';
    let input2 = '100111';
    // console.log("input1", input1)
    // console.log("input2", input2)
    // process.stdout.write(input + ".\n");       // Writing output to STDOUT
    check(input1, input2);
}

// Warning: Printing unwanted or ill-formatted data to output will cause the test cases to fail


// Write your code here

const check = (str1, str2) => {
    let likes=0, dislikes=0;
    for(let i=0; i<str1.length; i++){
        if(str1[i]===str2[i]){
            if(str1[i]==='1')
                likes++;
            else if(str1[i]==='0')
                dislikes++;
        }
    }
    console.log(likes+dislikes);
    // return likes+dislikes;
}


// const result1 = check('010101','101101');
// console.log("result: ", result1);

// const result2 = check(input1,input2);
// console.log("result2: ", result2);
*/