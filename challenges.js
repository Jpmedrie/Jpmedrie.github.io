'use strict'

///////////////////////////////////////////////////////////////Challenge 1
//adult >= 3
//poppy < 3

const juliaDogs = [3, 5, 2, 12, 7];
const kateDogs = [4, 1, 15, 8, 3];

const checkDogs = function(dogsJulia, dogsKate){
    //Julias first and last two are cats (remove them in a shallow copy of the array)
    const juliaCopy = dogsJulia.slice(1,-2);
    console.log(juliaCopy);
    //create a new array with Julias and Kates dogs
    const answer = juliaCopy.concat(dogsKate);
    console.log(answer);
    //log to the console if its a poppy or an adult (Dog number 1is an adult, and is 5 years old)
    // or (Dog number 2 is still a puppy )
    answer.forEach(function(dog, i){
        console.log(dog >= 3? `Dog number ${i + 1} is an adult, and is ${dog} years old` : `Dog number ${i + 1} is still a puppy`);
    })
};

checkDogs(juliaDogs, kateDogs);

/////////////////////////////////////////////////////////////////////Challenge 2
const dogAges =  [5, 2, 4, 1, 15, 8, 3];

const calcAverageHumanAge = function(ages) { //array of dogs ages
    //Calculate the dog age in human years if (age <= 2, age *2), else if (age > 2, 16 + age * 4)
    const dogsHumanAges = ages.map(function(ages) {
        if (ages <= 2) return ages*2;
        else return (16 + (ages * 4));
    });
    console.log(dogsHumanAges);
    //Exclude all the dogs that are under 18 human years
    const filtered = dogsHumanAges.filter((ages) => ages >= 18);
    console.log(filtered);
    //Calculate the averge dog human years
    const avg = dogsHumanAges.reduce(function(acc, curr){ return acc + curr}) / dogAges.length;
    console.log(avg);
}; 
calcAverageHumanAge(dogAges);

//////////////////////////////////////////////////////////////////Challenge 3
const chainingPt1 =  [5, 2, 4, 1, 15, 8, 3];
const calcAverageHumanAge2 = function(arr) {
    return arr
    .map(age => {
        if (age <= 2) return age * 2;
        else return age * 4 + 16;
    })
    .filter(age => age >= 18) //right till here
    .reduce((acc, age, i, arr) => acc+age /arr.length, 0);
};
console.log(calcAverageHumanAge2(chainingPt1));