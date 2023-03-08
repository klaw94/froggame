
let tiles = new Array();
let board = document.querySelector("#board");
const visualTiles = new Array(12);
const userPosition = [11, 8];
let gameOver = false;
let didIWin = false;
const timer = ms => new Promise(res => setTimeout(res, ms));
const image = document.createElement("img");



//Creates a 2D array
for (i = 0; i < visualTiles.length; i++){
   visualTiles [i] = new Array(16);
}



class Tile {
    constructor(x, y){
        this.left = x;
        this.top = y;
        this.rightCorner = x + 30;
        this.bottom = 480 - y - 30;
    }
}

class Car {
    constructor(velocity, y, x, color){
        this.velocity = velocity;
        this.currentPCarFront = [y, x];
        this.currentPCarBack = [y, x + 1];
        this.color = color;
    }
}

class Trunk {
    constructor(velocity, y, x, length){
        this.velocity = velocity;
        this.currentPTrunkFront = [y, x];
        this.currentPTrunkBack = [y, x + length - 1];
        this.color = "brown";
    }
}

const carY10 = new Car(200, 10, 15, "red");
const carY9 = new Car(200, 9, 8, "yellow");
const carY7 = new Car(200, 7, 2, "red"); 
const carY6 = new Car(170, 6, 7, "black");
const carY5 = new Car(100, 5, 3, "yellow");
const trunkY2 = new Trunk(300, 2, 2, 3);
const trunkY1 = new Trunk(200, 1, 7, 3);


populateTheBoard();
moveCar(carY9);
moveCar(carY10);
moveCar(carY7);
moveCar(carY6);
moveCar(carY5);
moveTrunk(trunkY1);
moveTrunk(trunkY2);
paintUser();



function populateTheBoard(){
    for (i = 0; i < 12; i++){
        for (x = 0; x < 16; x++){
        //I give the absolute position which is x and y * the height and length of the tiles.
        let tile = new Tile(30 * x, 30 * i);
        tiles.push(tile);
        }
    }

   for (i = 0; i < 12; i++){
       for (x = 0; x < 16; x++){
           let tile = document.createElement("div");
           tile.classList.add("tile");
           tile.style.left = tiles[x + i*16].left + "px";
           tile.style.top = tiles[x + i*16].top + "px";
           //color the tiles per line
           if ((i == 0) || (i == 3) || (i == 4) || (i == 8) || (i ==11)){
               tile.style.backgroundColor = "green";
           } else if (i > 0 && i < 3) {
               tile.style.backgroundColor = "blue";
   
           } else {
               tile.style.backgroundColor = "grey"
           }
           visualTiles[i][x] = tile;
       
           board.appendChild(tile);
       }
   
   }


}



function moveCar(car){
    if(!gameOver && !didIWin){  
        if (car.currentPCarFront[1]  == 0){
            car.currentPCarFront[1] = 16;
        } else {
            car.currentPCarFront[1]--;
            paintTile(car.currentPCarFront[0], car.currentPCarFront[1], car.color)
            checkCarHit(car);
        }

        if (car.currentPCarBack[1] == 0){
            eraseTheBack(car.currentPCarBack[0], car.currentPCarBack[1] - 1, "grey");
            car.currentPCarBack[1] = 16;
        
        } else {
            car.currentPCarBack[1]--;
            paintTile(car.currentPCarBack[0], car.currentPCarBack[1], car.color);
            eraseTheBack(car.currentPCarBack[0], car.currentPCarBack[1], "grey");
        }

        setTimeout(moveCar, car.velocity, car);
    }

}

function moveTrunk(trunk){
    if(!gameOver && !didIWin){  
        if (trunk.currentPTrunkFront[1]  == 0){
            if(userPosition[0] === trunk.currentPTrunkFront[0] && userPosition[1] > trunk.currentPTrunkFront[1] && userPosition[1] < trunk.currentPTrunkBack[1]){
                userPosition[1]--;
                paintUser();
            }
            trunk.currentPTrunkFront[1] = 16;
        } else {
            if(userPosition[0] === trunk.currentPTrunkFront[0] && userPosition[1] >= trunk.currentPTrunkFront[1] && userPosition[1] < trunk.currentPTrunkBack[1]){
                userPosition[1]--;
                paintUser();
            }
            trunk.currentPTrunkFront[1]--;
            paintTile(trunk.currentPTrunkFront[0], trunk.currentPTrunkFront[1], trunk.color);
        }

        if (trunk.currentPTrunkBack[1] === 0){
            eraseTheBack(trunk.currentPTrunkBack[0], trunk.currentPTrunkBack[1] - 1, "blue");
            if(userPosition[0] === trunk.currentPTrunkBack[0] && userPosition[1] === trunk.currentPTrunkBack[1]){
                youLose();
            }
            trunk.currentPTrunkBack[1] = 16;
        } else {
            if(userPosition[0] === trunk.currentPTrunkFront[0] && userPosition[1] === trunk.currentPTrunkBack[1]){
                userPosition[1]--;
                paintUser();
            }
            trunk.currentPTrunkBack[1]--;
            paintTile(trunk.currentPTrunkBack[0], trunk.currentPTrunkBack[1], trunk.color);
            eraseTheBack(trunk.currentPTrunkBack[0], trunk.currentPTrunkBack[1], "blue");
        }
        setTimeout(moveTrunk, trunk.velocity, trunk);
    }
}

function paintTile(y, x, color){
    visualTiles[y][x].style.backgroundColor = color;
}

function eraseTheBack (y, x, color){
    if (x < 15){
        visualTiles[y][x + 1].style.backgroundColor = color; 
    }
}

function paintUser(){
    image.setAttribute("src", "frog.png");
    image.setAttribute("id", "frog");
    visualTiles[userPosition[0]][userPosition[1]].appendChild(image);
}

document.addEventListener("keydown", (e) => {
    moveUser(e)
});

function moveUser(e){
    switch(e.key){
        case 'ArrowUp':
            if(!gameOver && !didIWin){
                deleteUser(); 
                userPosition[0]--;
                paintUser();
                checkCollision();
                checkForWin();
            }
        break;
        case 'ArrowDown': 
            if(!gameOver && !didIWin){
                if (userPosition[0] != 11){
                    deleteUser(); 
                    userPosition[0]++;
                    paintUser();
                    checkCollision();
                } 
            }    
        break;
        case 'ArrowLeft': 
            if(!gameOver && !didIWin){
                if (userPosition[1] != 0){
                    deleteUser(); 
                    userPosition[1]--;
                    paintUser();
                    checkCollision();
                }
            } 
            break;
        case 'ArrowRight': 
            if(!gameOver && !didIWin){

                if (userPosition[1] != 15){
                    deleteUser(); 
                    userPosition[1]++;
                    paintUser();
                    checkCollision();
                }
            } 
        break;
            case ' ':
            window.location.reload();
            break;      
    }

}

 function deleteUser(){
    visualTiles[userPosition[0]][userPosition[1]].innerHTML = " ";   
}

function checkCarHit(car){
    if (car.currentPCarFront[0] === userPosition[0] && car.currentPCarFront[1]=== userPosition[1]){
        youLose();
    }
}

async function paintEnd(color, foto){
    image.setAttribute("src", foto);
    var row = currentRow = visualTiles.length, column = currentColumn = visualTiles[0].length;
    while(currentRow > row/2 ){

        // traverse row forward
        for(var i = (column - currentColumn); i < currentColumn ; i++) { 
            visualTiles[row - currentRow][i].style.backgroundColor = color; 
        }
      
        // traverse column downward
        for(var i = (row - currentRow + 1); i < currentRow ; i++) { 
            visualTiles[i][currentColumn - 1].style.backgroundColor = color
        }
      
        // traverse row backward
        for(var i = currentColumn - 1; i > (column - currentColumn) ; i--) {
            visualTiles[currentRow - 1][i - 1].style.backgroundColor = color
        }
      
        // traverse column upward
        for(var i = currentRow - 1; i > (row - currentRow + 1) ; i--) { 
            visualTiles[i - 1][column - currentColumn].style.backgroundColor = color 
        }
      
        currentRow--;
        currentColumn--;
        await timer(300);
    }


}


function checkCollision(){
    if(visualTiles[userPosition[0]][userPosition[1]].style.backgroundColor != "grey" 
        && visualTiles[userPosition[0]][userPosition[1]].style.backgroundColor != "green" 
        && visualTiles[userPosition[0]][userPosition[1]].style.backgroundColor != "brown" 
    ){
        youLose();
    }
}

function youLose(){
    document.querySelector("h1").innerHTML = "You lost 😣";
    gameOver = true;
    paintEnd("#8A2BE2", "deadfrog.png"); 
}

function checkForWin(){
    if (userPosition[0] === 0){
        document.querySelector("h1").innerHTML = "You won 😃";
        didIWin = true;
        paintEnd("#FFC0CB", "kingfrog.png");
    }
}

