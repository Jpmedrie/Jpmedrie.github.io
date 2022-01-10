'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

///////////////////////////////////////////////////////////////////Creating DOM elements

const displayMovements = function(movements, sort = false) { //its best practice to pass the data to the function (not a global variable)
  containerMovements.innerHTML = '';
  //.textContent = 0;
  
  const movs = sort ? movements.slice().sort((a,b) => a-b) : movements; //slice creates a copy of the array

  movs.forEach(function(mov, i){
    const type = mov > 0 ? 'deposit':'withdrawal';

    const html = `
    <div class="movements__row">
      <div class="movements__type movements__type--${type}">${i + 1} ${type}</div>
      <div class="movements__date">3 days ago</div>
      <div class="movements__value">${mov}€</div>
    </div>`;

    //.insertAdjacentHTML
    containerMovements.insertAdjacentHTML('afterbegin', html);
    //The first string is the position in which we want to atacth the html (placer are descripted in the documentation)
    //the second string 
  });
};
displayMovements(account1.movements);
//console.log(containerMovements.innerHTML);

const calcDisplayBalance = function(acc){
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
  labelBalance.textContent = `${acc.balance} €`;
};
//console.log(calcDisplayBalance(account1.movements));

const calcDisplaySummary = function(acc){
  const incomes = acc.movements.filter(mov => mov > 0).reduce((acc, mov) => acc+mov, 0);
  labelSumIn.textContent = `${incomes}€`;

  const out = acc.movements.filter(mov => mov < 0).reduce((acc, mov) => acc+mov, 0);
  labelSumOut.textContent = `${Math.abs(out)}€`;

  const interests = acc.movements
  .filter(mov => mov > 0)
  .map(deposit => deposit * acc.interestRate/100)
    .filter((int, i, arr) => {
      console.log(arr);
      return int >= 1;
    })
  .reduce((acc, int) => acc+int, 0);
  labelSumInterest.textContent = `${interests}€`;
}


const createUsernames = function(acc) {
  acc.forEach(function(acc){
    acc.username = acc.owner.toLowerCase().split(' ').map((word) => word[0]).join('');
  }) 
}
createUsernames(accounts);
//console.log(accounts);

//Update UI
const updateUI = function(acc) {
  //Display movements
  displayMovements(acc.movements);

  //Dsiplay balance
  calcDisplayBalance(acc);

  //Display summary
  calcDisplaySummary(acc);
};

//Event handlers
let currentAccount;
btnLogin.addEventListener('click', function(e) {
  e.preventDefault(); //Prevent form from submiting
  console.log('Log In');

  currentAccount = accounts.find(acc => acc.username === inputLoginUsername.value);
  console.log(currentAccount);
// Remember ?. Optional Chaining to check if the property/value exist, if not, its not excecuted
//pin will only be read if currentAccount exist
  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    //Display UI and message
    labelWelcome.textContent = `Welcome back, ${currentAccount.owner.split(' ')[0]}`;
    containerApp.style.opacity = 100;
  
    //Clear input fields
    inputLoginUsername.value = inputLoginPin.value = ''; //from right to left, empty is settet to loginpin and then to username
    inputLoginPin.blur(); //makes the type bar to stop blinking
  }
  updateUI(currentAccount);
});

btnTransfer.addEventListener('click', function(e){
  e.preventDefault(); //because its a form, it would reaload the page
  const amount = Number(inputTransferAmount.value); //value the user puts in the box
  const receiverAcc = accounts.find(acc => acc.username === inputTransferTo.value); //return the matching value 
                                                    //argument is a boolean

  inputTransferAmount.value = inputTransferTo.value = '';

  if (amount > 0 && receiverAcc && currentAccount.balance >= amount && 
    receiverAcc?.username !== currentAccount.username) {
      console.log('Valid transaction');
      currentAccount.movements.push(-amount);
      updateUI(currentAccount);
  }
});

btnLoan.addEventListener('click', function(e) {
  e.preventDefault();
  const amount = Number(inputLoanAmount.value);

  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * .1)) {
    //Add movement
    currentAccount.movements.push(amount);
    //Update UI
    updateUI(currentAccount);
  }
  else {
    alert(`The loan is to high`);
  }
  inputLoanAmount.value = '';
});

btnClose.addEventListener('click', function(e){
  e.preventDefault();
  console.log(currentAccount);
  if (currentAccount.username === inputCloseUsername.value && currentAccount.pin === Number(inputClosePin.value)) {
    const index = accounts.findIndex(acc => acc.username === currentAccount.username);
    console.log(index);

    //Delete account
    accounts.splice(index, 1);//splice modifies the original array

    //Hide UI
    containerApp.style.opacity = 0;
  }
  inputCloseUsername.value = inputClosePin.value = '';
})

let sorted = false;
btnSort.addEventListener('click', function(e) {
  e.preventDefault();
  displayMovements(currentAccount.movements, !sorted); //does the opposit of sorted (!)
  sorted = !sorted;
});

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES


const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

///////////////////////////////////////////////// Simple array methods
/*
//Methods are functions attached to methods

let arr = ['a', 'b', 'c', 'd', 'e'];
//Slice
console.log(arr.slice(2));
console.log(arr.slice(2, 4));
console.log(arr.slice(-2));
console.log(arr.slice(1, -2)); //beggins to extract on b and it extracts everything except the last two
console.log(arr.slice()); //the whole array
console.log(arr);
console.log(...arr);

//Splice (this one modifies the original array)
//console.log(arr.splice(2));
arr.splice(-1)
console.log(arr);
arr.splice(1,2); //the second parameter is the number of elements we want to delete (not the limit position)
console.log(arr);

//Reverse (does mutate the original array)
arr = ['a', 'b', 'c', 'd', 'e'];
const arr2 = ['j', 'i', 'h', 'g', 'f'];
console.log(arr2.reverse());
console.log(arr2);

//Concat
const letters = arr.concat(arr2);
console.log(letters);
console.log([...arr, ...arr2]);

//Join
console.log(letters.join(' - '));
*/
/////////////////////////////////////////////// The new At method
/*
const arr = [23, 11, 64];
console.log(arr[0]);
console.log(arr.at(0));
//getting the last element
console.log(arr[arr.length - 1]);
console.log(arr.slice(-1)[0]);
console.log(arr.at(-1));

console.log('jonas'.at(0));
*/
//////////////////////////////////////////////Looping arrrays: For each
/*
for (const [i, movement] of movements.entries()) {
  if (movement > 0) {
    console.log(`Movement ${i + 1} You deposited ${movement}`);
  }
  else {
    console.log(`Movement ${i + 1} You withdrew ${Math.abs(movement)}`);
  }
}
console.log('For each'.padEnd(20, '*').padStart(30, '*'));
movements.forEach(function(movement, index, array){ //It will pass the current element of the array as an argument
   //what matters is the order, first is passed the element, the second is the index and third the array
   if (movement > 0) {
      console.log(`Movement ${index + 1} You deposited ${movement}`);
    }
    else {
      console.log(`Movement ${index + 1} You withdrew ${Math.abs(movement)}`);
    }
})
*/
//////////////////////////////////////////////////////////For Each with maps and sets
/*
//MAP
const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);

currencies.forEach(function(value, key, map){//current value, respective key and entire map
//order in the parameters matters
  console.log(`${key}: ${value}`);
});

//SET
const currenciesUnique = new Set(['USD', 'GBP', 'USD', 'EUR', 'EUR']);
console.log(currenciesUnique);
currenciesUnique.forEach(function(value, _, set){
  console.log(`${value}: ${value}`);
})
// _ is a name variable unimportant
*/
/*
/////////////////////////////////////////////////// The MAP method
const euroToUsd = 1.1;
const movementsUSD = movements.map(function(mov){  //Requires a callback funciton
  return mov * euroToUsd;
  });

const movementsUSDArr = movements.map((mov) => mov*euroToUsd); //the shorter alternative with arrow functions
console.log(movementsUSDArr);

console.log(movements);
console.log(movementsUSD);

const movementsDescriptions = movements.map((mov, i, arr) => `Movement ${i + 1} You ${mov>0?'deposited':'withdrew'} ${Math.abs(mov)}`);
console.log(movementsDescriptions);

/////////////////////////////////////////////////////The filter method
const deposits = movements.filter(function(mov) {return mov>0}); //it returns a boolean (the condition)
console.log(movements);
console.log(deposits);

const withdrawals = movements.filter((mov) => mov<0);
console.log(withdrawals);

/////////////////////////////////////////////////////The reduce method
//reduces all the elements in an array to one single value
const balance = movements.reduce(function(acc, curr, i, arr){
  //the first parameter is the acumulator
  console.log(`Iteration: ${i}: ${acc}`);
  return acc + curr;
}, 0)//0 is the initial value of the accumulator on the first iteration
console.log(balance);

//Maximum value
const max = movements.reduce((acc, mov) => {
  if (acc > mov) return acc; 
  else return mov;  
}, movements[0]);
console.log(max);
*/
/////////////////////////////////////////////////////////The magic of chaining methods
/*
const eurToUsd = 1.1;
const totalDepositsUSD = movements
    .filter((mov) => mov > 0)
    .map((mov, i, arr) => {
      console.log(arr);
      return mov*eurToUsd})
    //.map((mov) => mov*eurToUsd)
    .reduce((acc, mov) => acc+mov, 0);
console.log(totalDepositsUSD);
*/
/////////////////////////////////////////////////////////The find method
/*
const firstWithdrawal = movements.find(mov => mov < 0) //requires a boolean
//only return the first element thtat satisfies the condition
console.log(firstWithdrawal);

const account = accounts.find(acc => acc.owner === 'Jessica Davis');
console.log(account);
*/

/////////////////////////////////////////////////////////Some and every
/*
console.log(movements);
//Equality
console.log(movements.includes(-130)); //Test for existence, returns boolean

//SOME: Condition
console.log(movements.some(mov => mov === -130));

const anyDeposits = movements.some(mov => mov > 0);
console.log(anyDeposits);

//EVERY
//Only if every elements pass the test, it returns true
console.log(movements.every(mov => mov > 0));

//Separate callbacks
const deposit = mov => mov > 0;
console.log(movements.some(deposit));
console.log(movements.every(deposit));
console.log(movements.filter(deposit));
*/

//////////////////////////////////////////////////////////Flat and flatMap
/*
const arr = [[1,2,3],[4,5,6],7,8];
console.log(arr.flat());

const arrDeep = [[[1,2],3],[4,[5,6]],7,8];
console.log(arrDeep.flat(2)); //The two indicates the level depth

//flat
const overalBalance = accounts.map(acc => acc.movements).flat().reduce((acc, mov) => acc+mov, 0);
//Access the accounts array, which is sorted trough the map that creates a copy of the movements in the accounts
//only by then be extracted by .flat and summed
console.log(overalBalance);

//flatMap   better for performance, but it can only go one depth level
const overalBalance2 = accounts.flatMap(acc => acc.movements).reduce((acc,mov) => acc+mov, 0);
console.log(overalBalance2);
*/

/////////////////////////////////////////////////////////Sorting arrrays
const owners = ['Jonas', 'Zach', 'Adam', 'Martha'];
console.log(owners.sort()); //Sorted alphabetically
//Mutates the original array
console.log(owners);

//Numbers
console.log(movements);
console.log(movements.sort()); //sorts everything as if they were strings (the result have logic from then on)

//return < 0, A, B (keep order)
//return > 0, B, A (switch order)

//Ascending
//movements.sort((a,b) => {
//  if (a > b) return 1;
//  if (a < b) return -1;
//});
movements.sort((a,b) => a - b);
console.log(movements);

//Descending
//movements.sort((a,b) => {
//  if (a > b) return -1;
//  if (a < b) return 1;
//});
movements.sort((a,b) => b - a);
console.log(movements);