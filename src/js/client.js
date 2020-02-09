import lastIndexOf from "lodash/lastIndexOf";
import indexOf from "lodash/indexOf";
import zip from "lodash/zip";
import flatten from "lodash/flatten";
// import transpose from "mathjs/transpose"
//  1 Representa pieza blanca
// -1 Representa pieza negra

// Turno 1 representa turno de blanca
// Turno -1 representa turno de negra

// TO TRANSPOSE A MATRIX USE _.zip(...MATRIX)

const state = {
    matriz: [
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, -1, 1, 0, 0, 0],
        [1, 0, 0, 1, -1, 0, 0, 1],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0]
    ],
    turno: -1
}

function  transpose(matrix){
    return matrix.map((col, i) => matrix.map(row => row[i]));
}

function cambiarTurno({ matriz, turno }) {
    let player = "";
    state.turno = state.turno * -1;
    const root = document.getElementById('root');
    player = state.turno == -1 ? "Turno piezas negras" : "Turno piezas blancas"
    let div = document.getElementById('turn')
    div.innerHTML = player;
}
    
function renderCasilla(pos, estado, size = '50px', color = 'rebeccaPurple'){
    const casilla = document.createElement('div')
    casilla.id=pos
    casilla.style.width=size
    casilla.style.height=size
    casilla.style.boderRadius = '25px'
    casilla.style.border='1px solid black'
    casilla.style.backgroundColor= estado == 1 ? 'white' : (estado == -1 ? 'black' : color)
    casilla.style.float = 'left'
    casilla.onclick = () =>{
        console.log("Hiciste clic en "+casilla.id)
        isValidH(casilla.id,state)
        console.log('Ahora en vertical')
        isValidV(casilla.id,state)
    }
    return casilla
}

function render({matriz,turno}, root){
    root.innerHTML=''
    let line = document.createElement('div')
    const grid  = document.createElement('div')
    grid.style.width = '416px'
    grid.style.height = '416px'
    let algo = matriz.map(
        (linea,i) => linea.map(
            (col,j) => renderCasilla(i.toString()+j.toString(),matriz[i][j])
            ).forEach(
                elemento => grid.appendChild(elemento)
            )
    )
    root.appendChild(grid)
}

// Obtenida de la Web
const range = (start, end)  =>  {
    let ret = []
    if (start < end) {
        ret = [start, ...range(start + 1, end)];
    }
    else if (start === end) return [start];
    else {
        ret = [end, ...range(end + 1, start)];
    }
    return ret
}

function isValidH(box,{matriz,turno}){
    // let turno  = state.turno
    // let matriz = state.matriz
    let buscar = turno==1 ? 1 : -1
    const position = box
    const fila = position[0]
    const izquierda = lastIndexOf(matriz[fila],buscar,position[1])
    const derecha = indexOf(matriz[fila], buscar, position[1])
    let porLaIzquierda = false, porLaDerecha = false

    if (izquierda != position[1] && izquierda != -1 && izquierda != parseInt(position[1]-1)){
        let contador = 0
        for (let i = izquierda+1;i<position[1];i++){
            if (matriz[position[0]][i] == -buscar) {
                contador++
            }
            if (contador == -buscar*(position[1]-(izquierda+1))){
                porLaIzquierda = true
            }
        }
    }

    if (derecha != position[1]  && derecha != -1 && derecha != parseInt(position[1])+1){
        let contador = 0
        for (let j = parseInt(position[1]) + 1;j<derecha; j++){
            if (matriz[position[0]][j] == -buscar){
                contador++
            }
        }
        if (contador == -buscar*(derecha - (parseInt(position[1])+1))){
            porLaDerecha = true
        }
    }
    console.log('Por la izquierda: '+porLaIzquierda)
    console.log('Por la derecha: '+porLaDerecha)
    return (porLaIzquierda, porLaDerecha)
}

function isValidV (box,{matriz,turno}){
    let matrix = transpose(matriz)
    let buscar = turno == 1 ? 1 : -1
    const position = box
    let columna = position[1]
    const arriba = lastIndexOf(matrix[columna], buscar, position[0]) 
    const abajo = indexOf(matrix[columna], buscar, position[0]) 
    let porArriba = false, porAbajo = false
    if (arriba != position[0] && arriba != -1 && arriba != parseInt(position[0])-1){
        let contador = 0
            if(matrix[position[1]][i] == -buscar){
                contador ++
            }
            if (contador == -buscar*(position[0] -(arriba-1))){
                porArriba = true
            }
        }
    }
    console.log('Por arriba: '+porArriba)
    console.log('Por abajo: '+porAbajo)
    return (porArriba, porAbajo)
}

// Aqui comienza la acción
const root = document.getElementById('root');
const letras = document.createElement('div')
letras.id="tagTurno"
letras.style.color="RebeccaPurple"
letras.innerHTML="Turno piezas negras"
letras.style.fontFamily="Sans-Seriff"
letras.style.fontSize="40px"
root.appendChild(letras)

render(state,root)
const azip = {
    matriz: flatten(zip(state.matriz)),
    turno: state.turno
}
console.log(state.matriz)
console.log(transpose(state.matriz))