import lastIndexOf from "lodash/lastIndexOf";
import indexOf from "lodash/indexOf";
import flatten from "lodash/flatten";
// import transpose from "mathjs/transpose"
//  1 Representa pieza blanca
// -1 Representa pieza negra

// Turno 1 representa turno de blanca
// Turno -1 representa turno de negra

function isOver({matriz, turno}){
    let m = flatten(matriz)
    let isOver =true
    for (let i = 0;i<m.length;i++){
        if (m[i]==0) isOver = false
    }
    return isOver
}

function  transpose(matrix){
    return matrix.map((col, i) => matrix.map(row => row[i]));
}
    
const state = {
    matriz: [
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, -1, 1, 0, 0, 0],
        [0, 0, 0, 1, -1, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0]
    ],
    turno: -1
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
        if (isValidH(casilla.id,state).izquierda[0] ||
        isValidH(casilla.id,state).derecha[0] ||
        isValidV(casilla.id,state).arriba[0] ||
        isValidV(casilla.id, state).abajo[0] ||
        isValidD(casilla.id, state).diagonal1[0] ||
        isValidD(casilla.id, state).diagonal2[0] ||
        isValidD(casilla.id, state).diagonal3[0] ||
        isValidD(casilla.id, state).diagonal4[0]){
            let m = actualizarGrid(isValidH(casilla.id, state), isValidV(casilla.id, state), isValidD(casilla.id, state), casilla.id, state)
            state.matriz =m 
            state.turno = -state.turno
            let t = ''
            if (isOver(state)){
                let contador1 =0, contador_1 = 0
                let m = flatten(state.matriz)
                for (let i = 0;i<m.length;i++){
                    if (m[i]==1) contador1++
                    else contador_1++
                }
                if (contador1>contador_1) t = 'Blancas ha ganado'
                else if (contador1 < contador_1) t = 'Negras ha ganado'
                else t = 'EMPATE'

                let divi = document.createElement('div')
                divi.style.fontSize = '70px'
                divi.style.color='red'
                divi.innerHTML = t
                render(state, document.getElementById('root'))
                document.getElementById('root').appendChild(divi)
            }else{
                render(state,document.getElementById('root'))
            }
        }
    }
    return casilla
}

function actualizarGrid(horizontal, vertical,diagonal,pos,{matriz,turno}){
    let m = matriz
    const fila = parseInt(pos[0])
    const columna = parseInt(pos[1])
    //Veo la parte horizontal
    console.log(horizontal.izquierda[0])
    if (horizontal.izquierda[0]){
        console.log('HI')
        for(let i = horizontal.izquierda[1];i<=columna;i++){
            m[fila][i] = turno
        }
    }
    if (horizontal.derecha[0]) {
        console.log('HD')
        for (let i = columna; i <= horizontal.derecha[1]; i++) {
            m[fila][i] = turno
        }
    }

    //Veo la parte vertical
    if(vertical.arriba[0]){
        console.log('VA')
        for(let i = vertical.arriba[1];i<=fila;i++){
            m[i][columna] = turno
        }
    }
    if (vertical.abajo[0]) {
        console.log('VAb')
        for (let i = fila; i <= vertical.abajo[1]; i++) {
            m[i][columna] = turno
        }
    }
    // console.log('DIAGONALES')
    //Veo la parte diagonal
    if (diagonal.diagonal1[0]){
        console.log('DIAGONAL1')
        for (let i = 0; i <= diagonal.diagonal1[1];i++){
            m[fila - i][columna - i] = turno
        }
    }

    if(diagonal.diagonal2[0]){
        console.log('DIAGONAL2')
        for (let i = 0;i<=diagonal.diagonal2[1];i++){
            m[fila - i][columna + i] = turno
        }
    }

    if (diagonal.diagonal3[0]){
        console.log('DIAGONAL3')
        for (let i = 0;i<=diagonal.diagonal3[1];i++){
            m[fila + i][columna + i] = turno
        }
    }

    console.log(diagonal.diagonal4)
    if (diagonal.diagonal4[0]) {
        console.log('DIAGONAL4')
        for (let i = 0; i <= diagonal.diagonal4[1]; i++) {
            m[fila + i][columna - i] = turno
        }
    }
    return m
}

function render({matriz,turno}, root){
    let player = turno == -1 ? "Turno piezas negras" : "Turno piezas blancas"
    let jugador = document.createElement('div')
    jugador.style.fontSize='50px'
    jugador.innerHTML= player
    root.innerHTML=''
    root.appendChild(jugador)
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
    //let turno = turno//==1 ? 1 : -1
    const position = box
    const fila = position[0]
    const izquierda = lastIndexOf(matriz[fila],turno,position[1])
    const derecha = indexOf(matriz[fila], turno, position[1])
    let porLaIzquierda = false, porLaDerecha = false

    if (izquierda != position[1] && izquierda != -1 && izquierda != parseInt(position[1]-1)){
        let contador = 0
        for (let i = izquierda+1;i<position[1];i++){
            if (matriz[position[0]][i] == -1*turno) {
                contador++
                // console.log(contador)
            }
        }
        console.log('Contador, horizonal Izquierda: '+contador)
        console.log('Comparacion con contador: ' +( -1 * turno * (position[1] - (izquierda + 1))))
        if (contador == (position[1]-(izquierda+1))){
            porLaIzquierda = true
        }
    }

    if (derecha != position[1]  && derecha != -1 && derecha != parseInt(position[1])+1){
        let contador = 0
        for (let j = parseInt(position[1]) + 1;j<derecha; j++){
            if (matriz[position[0]][j] == -1*turno){
                contador++
            }
        }
        if (contador == (derecha - (parseInt(position[1])+1))){
            porLaDerecha = true
        }
    }
    // console.log('Por la izquierda: '+porLaIzquierda)
    // console.log('Por la derecha: '+porLaDerecha)
    let ret = {
        izquierda: [porLaIzquierda,izquierda],
        derecha: [porLaDerecha,derecha]
    }
    return ret
}

function isValidV (box,{matriz,turno}){
    let matrix = transpose(matriz)
    //let turno = state.turno //== 1 ? 1 : -1
    const position = box
    let columna = position[1]
    const arriba = lastIndexOf(matrix[columna], turno, position[0]) 
    const abajo = indexOf(matrix[columna], turno, position[0]) 
    let porArriba = false, porAbajo = false
    if (arriba != position[0] && arriba != -1 && arriba != parseInt(position[0])-1){
        let contador = 0
        for (let i = arriba+1; i < parseInt(position[0]);i++){
            if (matriz[i][position[1]] == -1*turno){
                contador ++
            }
        }
        if (contador == (parseInt(position[0]) -(arriba+1))){
            porArriba = true
        }
    }

    if (abajo != position[0] && abajo != -1 && abajo != parseInt(position[0])+1){
        let contador = 0
        for (let j  = parseInt(position[0])+1;j<abajo;j++){
            if (matriz[j][position[1]]== -1*turno){
                contador ++
            }
        }
        if (contador == (abajo - parseInt(position[0]) -1)){
            porAbajo = true
        }
    }
    let ret = {
        arriba: [porArriba, arriba],
        abajo: [porAbajo, abajo]
    }
    return ret
}

function isValidD(box, {matriz,turno}){
    //let turno = state.turno == 1 ? 1 : -1
    let contador1 = 0, contador2 = 0 , contador3 = 0,contador4 =0 
    let d1 = false, d2 = false, d3 = false, d4 = false
    let columna = parseInt(box[0])
    let fila = parseInt(box[1])
    let sigue1 = true, sigue2=true,sigue3=true,sigue4=true
    // DIagonal 1 \^
    while(sigue1 && columna>0 && fila > 0){
        // console.log(columna)
        // console.log(fila)
        // console.log(matriz[columna][fila])
        if (matriz[columna-1][fila-1] == -1*turno){
            //console.log(contador1)
            contador1++
        } else if (matriz[columna - 1][fila - 1] == turno && contador1 > 0){
            sigue1 = false
            d1=true
        }else{
            sigue1 = false
        }
        columna--
        fila--
    }

    // Diagonal 2 /^
    columna = parseInt(box[0])
    fila = parseInt(box[1])
    while(sigue2 && columna>0 && fila<8){
        if (matriz[columna-1][fila+1] == -1*turno){
            contador2++
        } else if (matriz[columna - 1][fila + 1] == turno && contador2 > 0){
            sigue2=false
            d2 = true
        } else{
            sigue2 = false
        }
        fila++
        columna--
    }

    // Diagonal 3 \_
    columna = parseInt(box[0])
    fila = parseInt(box[1])
    while(sigue3 && columna<7 && fila<7){
        if (matriz[columna+1][fila+1] == -1*turno){
            contador3++
        } else if (matriz[columna + 1][fila + 1] == turno && contador3 > 0){
            sigue3=false
            d3 = true
        }else{
            sigue3 = false
        }
        columna++
        fila++
    }

    // Diagonal 4 /_
    columna = parseInt(box[0])
    fila = parseInt(box[1])
    while (sigue4 && columna < 7 && fila > 0) {
        if (matriz[columna+1][fila-1] == -1*turno) {
            contador4++
        } else if (matriz[columna + 1][fila - 1] == turno && contador4>0){
            sigue4 = false
            d4 = true
        }else{
            sigue4=false
        }
        columna++
        fila--
    }


    let ret = {
        diagonal1: [d1, contador1],
        diagonal2: [d2, contador2],
        diagonal3: [d3, contador3],
        diagonal4: [d4, contador4]
    }
    //console.log(ret)
    return ret
}

// Aqui comienza la acción
const root = document.getElementById('root');
render(state,root)