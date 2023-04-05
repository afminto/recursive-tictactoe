const canvas = document.getElementById('canvas');
const canv_left = canvas.offsetLeft;
const canv_top = canvas.offsetTop;
const context = canvas.getContext('2d');
context.globalAlpha = 1;
const backward_mapping = {};
const forward_mapping = {};

function create_backward_mapping(mapping) {
    mapping[30] = [0,0];
    mapping[60] = [0,1];
    mapping[90] = [0,2];
    mapping[150] = [1,0];
    mapping[180] = [1,1];
    mapping[210] = [1,2];
    mapping[270] = [2,0];
    mapping[300] = [2,1];
    mapping[330] = [2,2];
}

function create_forward_mapping(mapping) {
    mapping[30] = 30;
    mapping[60] = 30;
    mapping[90] = 30;
    mapping[150] = 150;
    mapping[180] = 150;
    mapping[210] = 150;
    mapping[270] = 270;
    mapping[300] = 270;
    mapping[330] = 270;
}

function check_winner(arr) {
    for(let i = 0; i < 3; i++){
        if((arr[i][0] === arr[i][1]) && (arr[i][1] === arr[i][2])){
            return arr[i][0];
        }
        else if((arr[0][i] === arr[1][i]) && (arr[1][i] === arr[2][i])){
            return arr[0][i];
        }
    }
    if((arr[0][0] === arr[1][1]) && (arr[1][1] === arr[2][2])){
        return arr[0][0];
    }
    else if((arr[2][0] === arr[1][1]) && (arr[1][1] === arr[0][2])){
        return arr[2][0];
    }
    return -1;
}

function declare_victory(winner){
    let color = winner ? 'Blue' : 'Red';
    alert(`Good game! ${color} won!`);
    let winnerlist = document.getElementById('list');
    let node = document.createElement("li");
    node.innerHTML = color;
    winnerlist.appendChild(node);
}

class mini_results {
    constructor(x, y){
        this.x = x;
        this.y = y;
        this.arr = [[-1,-1,-1],[-1,-1,-1],[-1,-1,-1]];
    }
    update_mini(x, y) {
        if(this.arr[x][y] === -1){
            this.arr[x][y] = current_player;
            return true;
        }
        else{
            return false;
        }
        
    }
    mini_winner(){
        const winner = check_winner(this.arr);
        if(winner != -1){
            if(main_results[this.x][this.y] === -1){
                main_results[this.x][this.y] = winner;
                return winner;
            }
            else {
                return -1;
            }
            
        }
        return -1;
    }

}
//mini_winner updates main results if check_winner is not -1. We need to also check that it hasn't already been won
function buildBoard() {
    context.strokeStyle = 'black';
    const start_coords = [[30,30], [30,150], [30,270], [150,30], [150,150], [150,270], [270,30], [270,150], [270,270]];
    for(let i = 0; i < 9; i++){
        buildSingleBoard(start_coords[i]);
    }
    context.save();
}

function buildSingleBoard(coords) {
    buildLine([coords[0] + 30, coords[1]], true);
    buildLine([coords[0] + 60, coords[1]], true);
    buildLine([coords[0], coords[1] + 30], false);
    buildLine([coords[0], coords[1] + 60], false);
}

function buildLine(start, isVertical){
    context.beginPath();
    context.moveTo(start[0], start[1]);
    context.lineTo(start[0] + !isVertical * 90, start[1] + isVertical * 90);
    context.stroke();
    context.save();
}

function clickOnCanvas(event){
    const xVal = event.pageX - canv_left;
    const yVal = event.pageY - canv_top;
    console.log(xVal, yVal);
    const xFloor = xVal - (xVal % 30);
    const yFloor = yVal - (yVal % 30);
    console.log(xFloor, yFloor);
    const xNull = xVal % 120;
    const yNull = yVal % 120;
    if(xNull < 30 || yNull < 30) {
        return 0;
    }
    const xIndices = backward_mapping[xFloor];
    const yIndices = backward_mapping[yFloor];
    console.log(xIndices, yIndices);
    const isUpdated = boardSet[xIndices[0]][yIndices[0]].update_mini(xIndices[1], yIndices[1]);
    console.log(isUpdated);
    if(isUpdated) {
        context.beginPath();
        context.fillStyle = current_player ? '#8888FF' : '#FF8888';
        context.fillRect(xFloor, yFloor, 30, 30);
        context.stroke();
        context.save();
        current_player = 1 - current_player;
    }
    const winner = boardSet[xIndices[0]][yIndices[0]].mini_winner();
    console.log(winner);
    if(winner === 0 || winner === 1){
        context.beginPath();
        context.strokeStyle = winner ? '#0000FF' : '#FF0000';
        context.rect(forward_mapping[xFloor], forward_mapping[yFloor], 90, 90);
        context.stroke();
        context.save();
        let overall_winner = check_winner(main_results);
        console.log(main_results);
        if(overall_winner != -1){
            declare_victory(overall_winner);
        }
    }
    
    //console.log(current_player);
    return 1;
}

function initBoardSet(){
    const boardSet = [];
    for(i = 0; i < 3; i++){
        boardSet.push([]);
        for(j = 0; j < 3; j++){
            const mini = new mini_results(i, j);
            boardSet[i].push(mini);
        }
    }
    return boardSet;
}

function initialize(){
    context.clearRect(0, 0, canvas.width, canvas.height);
    buildBoard();
    current_player = 0;
    main_results = [[-1,-1,-1],[-1,-1,-1],[-1,-1,-1]];
    boardSet = initBoardSet();
}

buildBoard();
let current_player = 0;
let main_results = [[-1,-1,-1],[-1,-1,-1],[-1,-1,-1]];
let boardSet = initBoardSet();
create_backward_mapping(backward_mapping);
create_forward_mapping(forward_mapping);
canvas.addEventListener('click', clickOnCanvas);
const reset = document.getElementById('reset');
reset.addEventListener('click', initialize);


