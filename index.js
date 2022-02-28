//Initializing global variables
let CANVAS = null;
let CXT = null;
let SCALER = 0.8;
let SIZE = {x:0, y:0, width:0, height:0, rows:3, columns:3};
let PUZZLE_IMAGE = new Image();
let PIECES = [];
let SELECTED_PIECE= null;
let START_TIME = null;
let END_TIME = null;


function main(src){
    CANVAS=document.getElementById("imageCanvas");
    CANVAS.style.display = "block";
    document.getElementById("startBtn").style.display = "inline";
    CXT = CANVAS.getContext("2d");
    addEventListeners();
    
    PUZZLE_IMAGE.onload = function() {
        handleResize();
        initPieces(SIZE.rows,SIZE.columns)
        updatePuzzle();
    }
    PUZZLE_IMAGE.src = src;
    
}

//resize the canvas and the image by window size
function handleResize(){
    CANVAS.width  = window.innerWidth;
    CANVAS.height = window.innerHeight;
    let reziser = SCALER*
    Math.min(CANVAS.width/PUZZLE_IMAGE.width, CANVAS.height/PUZZLE_IMAGE.height);
    SIZE.width = reziser*PUZZLE_IMAGE.width;
    SIZE.height = reziser*PUZZLE_IMAGE.height;
    SIZE.x = window.innerWidth/2-SIZE.width/2;
    SIZE.y = window.innerHeight/2-SIZE.height/2;
}

//create puzzle piece objects
function initPieces(rows, columns){
    SIZE.rows = rows;
    SIZE.columns = columns; 
    PIECES = [];
    for(let i = 0; i<SIZE.rows; i++){
        for(let j=0; j<SIZE.columns; j++){
            PIECES.push(new Piece(i,j));
        }
    }
}

//Clears the canvas and draws a semi transparent image in the background and updates frame and time
function updatePuzzle(){
    CXT.clearRect(0,0,CANVAS.width,CANVAS.height)
    CXT.globalAlpha = 0.3;
    CXT.drawImage(PUZZLE_IMAGE, SIZE.x, SIZE.y, SIZE.width, SIZE.height);
    CXT.globalAlpha = 1;
    for(let i=0; i<PIECES.length;i++){
        PIECES[i].drawPiece(CXT)
    }
    updateTime()
    window.requestAnimationFrame(updatePuzzle)
}

//updates the time during the game and set the total time
function updateTime(){
    let time = new Date().getTime();
    if(START_TIME!=null){
        if(END_TIME !=null){
            document.getElementById("time").innerHTML = Math.floor((END_TIME - START_TIME)/1000);
        } else{
        document.getElementById("time").innerHTML = Math.floor((time - START_TIME)/1000);
        } 
    }
}

function setDifficulty(){
    let difficulty = document.getElementById("difficulty").value;
    //Switch case structure to avoid too many if else-statements
    switch(difficulty){
        case "easy":
            initPieces(3,3);
            break;
        case "medium":
            initPieces(5,5);
            break;
        case "hard":
            initPieces(6,6)
            break;    
    }
}

//starts the game
function startGame(){
    START_TIME = new Date().getTime();
    END_TIME = null;
    randomPieces();
    document.getElementById("menuContainer").style.display = "none";
}

//when restarting the game, this display the correct content
function restartGame(){
    document.getElementById("afterGameScreen").style.display = "none";
    document.getElementById("menuContainer").style.display = "block";
    document.getElementById("imageCanvas").style.display = "none";
    document.getElementById("startBtn").style.display = "none";   
}

//randomize the pieces on the lower part of the window
function randomPieces(){
    for(let i=0; i<PIECES.length;i++){
        let location ={
        x: Math.random()*(CANVAS.width-PIECES[i].width),
        y: (Math.random()*(CANVAS.height-PIECES[i].height-400))+400} //pieces only below 400px
    
        PIECES[i].x = location.x;
        PIECES[i].y = location.y;
        PIECES[i].correctLocation = false;
        }
}

//checks if the pieces are at the correct place
function isComplete(){
    for(let i=0; i< PIECES.length;i++){
        if(PIECES[i].correctLocation == false) return false;
    }
    return true;
}

function addEventListeners(){
    CANVAS.addEventListener("mousedown", onMouseDown);
    CANVAS.addEventListener("mousemove", onMouseMove);
    CANVAS.addEventListener("mouseup", onMouseUp);

}

//mouse events
function onMouseDown(event){
    SELECTED_PIECE = getPressedPiece(event)
    if(SELECTED_PIECE != null){ //Make the selected piece in front
        const index = PIECES.indexOf(SELECTED_PIECE);
        if(index > -1){
            PIECES.splice(index, 1)
            PIECES.push(SELECTED_PIECE)
        }
        SELECTED_PIECE.offset = {
            x: event.x - SELECTED_PIECE.x,
            y: event.y - SELECTED_PIECE.y
        }
        SELECTED_PIECE.correctLocation = false;
    }
}

function onMouseMove(event){
    if(SELECTED_PIECE != null){
        SELECTED_PIECE.x = event.x - SELECTED_PIECE.offset.x;
        SELECTED_PIECE.y = event.y - SELECTED_PIECE.offset.y;
    }
}

function onMouseUp(event){
    if(SELECTED_PIECE != null){
    if(SELECTED_PIECE.isClose()){
        SELECTED_PIECE.snap();
        if(isComplete() && END_TIME == null) {
            let time = new Date().getTime();
            END_TIME = time;
            showAfterGame();
        }}
    SELECTED_PIECE = null;
}
}

//checks if click is inside any piece
function getPressedPiece(location){
    //opposite direction to get the top piece when several pieces are on eachother
    for(i=PIECES.length-1; i>=0; i--){
        if(location.x > PIECES[i].x && location.x < PIECES[i].x + PIECES[i].width &&
            location.y > PIECES[i].y && location.y < PIECES[i].y + PIECES[i].height){
                return PIECES[i];
            }
    }
    return null;
}

//after game menu showing the result
function showAfterGame(){
    const gameTime = Math.floor((END_TIME - START_TIME)/1000);
    document.getElementById("score").innerHTML = "Time: " + gameTime + " seconds";
    document.getElementById("afterGameScreen").style.display = "block";
    document.getElementById("time").style.display = "none";
}

//class representing every piece object
class Piece {
    constructor(rowIndex,colIndex){
        this.rowIndex = rowIndex;
        this.colIndex = colIndex;
        this.width = SIZE.width/SIZE.columns;
        this.height = SIZE.height/SIZE.rows;
        this.x = SIZE.x + this.width *this.colIndex;
        this.y = SIZE.y + this.height * this.rowIndex;
        this.xCorrect = this.x;
        this.yCorrect = this.y;
        this.correctLocation = true;
    }

    //draws the piece and a border on the canvas 
    drawPiece(ctx){
        ctx.beginPath();
        ctx.drawImage(PUZZLE_IMAGE, 
            this.colIndex*PUZZLE_IMAGE.width/SIZE.columns, 
            this.rowIndex*PUZZLE_IMAGE.height/SIZE.rows,
            PUZZLE_IMAGE.width/SIZE.columns, PUZZLE_IMAGE.height/SIZE.rows,
            this.x,
            this.y,
            this.width,
            this.height)
        ctx.rect(this.x, this.y, this.width, this.height);
        ctx.stroke();
    }

    //checks if picked up piece is close to correct position
    isClose(){
        if(distance({x:this.x, y:this.y},
            {x: this.xCorrect, y: this.yCorrect}) < this.width/3){
                return true;
            }
            return false;
    }

    //snaps puzzle piece into place
    snap(){
        this.x = this.xCorrect;
        this.y = this.yCorrect;
        this.correctLocation = true;
    }  
}

//calculate distance 
function distance(d1, d2){
    return Math.sqrt(
        (d1.x-d2.x)*(d1.x-d2.x)+
        (d1.y-d2.y)*(d1.y-d2.y));
}