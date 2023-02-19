

let gameover = false;
let row = 0;
let col = 0;
let width = 4;
let height = 4;
var word;
let wordDictionary;
let hint;
let index;
let randWord;


function generateSquares(grid, row, col, letter = ''){
  const square = document.createElement('div');
  square.className = 'gameBox';
  square.id = `gameBox${row}${col}`;
  square.textContent = letter;
  grid.appendChild(square);
  return square;
}
function generateGrid(gameContainer){ 
  const grid = document.createElement('div'); // draws more versions of grid instead of typing in html
  grid.className = 'gameGrid';
  //for loop to create grid
  for(let i = 0; i<4; i++){
    for(let j = 0; j < 4; j++){
      generateSquares(grid, i , j);
    }
  }
  gameContainer.appendChild(grid);
}
function userInputs(){
  document.addEventListener("keyup", (e)=>{
    const keyPress = e.code;
    if(gameover) return;

    // INPUT FOR LETTERS
    if("KeyA" <= keyPress && keyPress <= "KeyZ"){
      if(col<width){
        let tile = document.getElementById(`gameBox${row}${col}`);
        if(tile.innerText==""){
          tile.innerText = event.key;
          col+=1;
        } 
      } 
    }
    

    // BACKSPACE
    else if (keyPress=="Backspace"){
      if(0<col&&col<=width){  //backspace from column 0-5
        col -= 1;
      }
      let tile = document.getElementById(`gameBox${row}${col}`);
      if(tile.innerText!=""){
        tile.innerText = "";
      }
    }

    // ENTER
    else if(keyPress == "Enter"){
      let userWord="";
      for(let d = 0; d < width; d++){
        let tile = document.getElementById(`gameBox${row}${d}`);
        let letter = tile.innerText;
        userWord += letter
      }
      let listWord = [];
      for(let i = 0; i < wordDictionary.length; i++){
        listWord.push(wordDictionary[i].word)
      }
      // for(let d = 0; d < width; d++){

      //   userWord += letter
      // }
      if(col == width){
      newEnter();
      row += 1;
      col = 0;
      }
      else if(col!=width){
        window.alert("first complete the word");
      }
    }

    if(!gameover &&(row)==height){
      gameover=true;
      let solutions = document.getElementById("solution");
      solutions.innerText = "You Missed the Word " + word + " and Lost!";
    }
  })
}



function newEnter(){ 
  let correct = 0;
  for(let d = 0; d < width; d++){
    let tile = document.getElementById(`gameBox${row}${d}`);
    let letter = tile.innerText;
    if(word[d] == letter){
      tile.classList.add("correct");
      correct += 1;
    }
    else if(word.includes(letter)){
      tile.classList.add("almost");
    }
    else{
      tile.classList.add("none");
    }
    if (correct == width){
      gameover = true;
      setTimeout(congrats, 600);  //delay the call to the congrats so the word can be revealed fully
    }
  }
}


//  THIS FUNCTION GETS HINTS
function getHint(){
  let myHint = document.querySelector(".hints");
  myHint.innerHTML = hint;  
}
function resetGame() {
  
  let solutions = document.getElementById("solution");
      solutions.innerText = "";
  
  gameover = false;
  row = 0;
  col = 0;
  word = '';
  hint = '';
  index = 0;
  randWord = null;
  const gameContainer = document.getElementById('gameContainer');
  gameContainer.innerHTML = '';
  document.removeEventListener("keyup", userInputs); // remove the event listener
  getDictionaryWord();

}

async function getDictionaryWord(){
  const buttonStartOver = document.getElementById(`startOverButton`);
  buttonStartOver.disabled = true;
  buttonStartOver.innerText = "Loading..";
  

  // api call to get dictionary, use await 
  let data = 0;
  if(!wordDictionary){ 

    const res = await fetch("https://api.masoudkf.com/v1/wordle", {
      headers: {
      "x-api-key": "sw0Tr2othT1AyTQtNDUE06LqMckbTiKWaVYhuirv",
      },
  });

  if(res.ok){
    data = await res.json();
    // data = {0:{word: "Pain", hint: "hurt"}, 1:{word: "HTML", hint: "coding"}, 2:{word:"RAIN", hint: "water water"}};
    wordDictionary = data.dictionary;
    }
    else {
      console.log("API call failed:", res.status, res.statusText);
    }
  }
  if(wordDictionary){
    index = Number.parseInt(Math.random() * wordDictionary.length)
    randWord = wordDictionary[index];
    word = randWord.word.toUpperCase();
    hint = randWord.hint;

    console.log(hint)
    getHint();

  buttonStartOver.innerText = "Start Over";

  const startOver = document.querySelector(`.startOverButton`)
  startOver.removeAttribute('disabled');
  const gameGrid = document.querySelector('.gameGrid');
  startOver.addEventListener('click', ()=> {
  if (gameGrid) {
    resetGame(); // add this line
    generateGrid(gameContainer);
    // userInputs();

    // col = 0;
    // row = 0;
    // const gameContainer = document.getElementById('gameContainer');
    // gameContainer.removeChild(gameGrid);
    // document.getElementById("solution").innerText = ""
    // startGame();
  }

  });
    startOver.addEventListener('keydown', (event) => {
      if (event.keyCode === 13) {
        event.preventDefault(); // prevent the default button click behavior
      }
    });
}}



  // After word is guessed, a popup will be shown to congratulate user
function congrats(){
  document.querySelector('.ending').classList.add('active');
  document.querySelector('.overlay').classList.add('active');
  let answer = document.querySelector(".endingBody");
  answer.innerHTML = word;


  const closeButtons = document.querySelector('.endClose');
  closeButtons.addEventListener('click', ()=> {
  document.querySelector('.ending').classList.remove('active');
  document.querySelector('.overlay').classList.remove('active');
  });
  closeButtons.addEventListener('keydown', (event) => {
    if (event.keyCode === 13) {
      event.preventDefault(); // prevent the default button click behavior
    }
  });
  
}



function startGame() {
  resetGame();
  generateGrid(gameContainer);
  userInputs();

}
   // button for dark/lightmode
   const buttons = document.querySelector('.theme-toggle-button');
   buttons.addEventListener('click', ()=> {
     document.body.classList.toggle('dark')
   });
   buttons.addEventListener('keydown', (event) => {
     if (event.keyCode === 13) {
       event.preventDefault(); // prevent the default button click behavior
     }
   });
 
 //button to close
 const closeButton = document.querySelector('.close');
 closeButton.addEventListener('click', ()=> {
 document.querySelector('.modal').classList.remove('active');
 document.querySelector('.overlay').classList.remove('active');
 });
 closeButton.addEventListener('keydown', (event) => {
   if (event.keyCode === 13) {
     event.preventDefault(); // prevent the default button click behavior
   }
 });
 
 
   //button for HELP
   const openButton = document.querySelector('.help-toggle-button');
   openButton.addEventListener('click', ()=> {
   document.querySelector('.modal').classList.add('active');
   document.querySelector('.overlay').classList.add('active');
 });
   openButton.addEventListener('keydown', (event) => {
     if (event.keyCode === 13) {
       event.preventDefault(); // prevent the default button click behavior
     }
 });
 
 
 // button for Hint
 const button = document.querySelector('.hint-toggle-button');
 
 button.addEventListener('click', ()=> {
 document.querySelector('.hints').classList.toggle('show')});
 button.addEventListener('keydown', (event) => {
   if (event.keyCode === 13) {
     event.preventDefault(); // prevent the default button click behavior
   }
 
 });

startGame();

 

