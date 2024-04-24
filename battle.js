var boardW=500;

const laside = document.getElementById('Laside');
const maside = document.getElementById('Maside');
const raside = document.getElementById('Raside');
const haside = document.getElementById('haside');
const faside = document.getElementById('faside');
const main = document.getElementById('main');
const rotate = document.getElementById('rotate');
const cube=document.getElementById('cube');
const messagebox=document.getElementById('messageBox');
const getMessgae=document.getElementById('getMessage');
const promotiondiv = document.getElementById('promotion');
const yTMR=document.querySelectorAll('.opponentTMR');
const xTMR = document.querySelectorAll('.selfTMR'); 
const win=document.getElementById('win');
const winMsg=document.getElementById('winMessage');
var typeOfDevice="other"
var fontS=1;
var tmrid=0;

var r = document.querySelector(':root');
if ( /android|webOS|iPhone|iPad|iPod|blackberry|IEMobile|Opera Mini|Windows Phone/i.test(navigator.userAgent) ){//phone and ipad
    if(screen.width<900){
        boardW=screen.width*0.8;
        raside.style.display="none";
        laside.style.display="none";
        haside.style.display="flex";
        faside.style.display="flex";
        maside.style.width="100%";
        maside.style.height="80%";
        main.style.flexDirection='column';
        getMessgae.style.display="block";
        messagebox.style.display='flex';
        fontS=0.5;
        tmrid=1
    }else{
        var boardW=screen.width*0.5*0.8;
        r.style.setProperty('--portf-width', String(screen.width*0.25*0.8)+'px');
    }
    class Orientation{
        constructor(){
            addEventListener("load",()=>{
                this.orientation(false);
            });
            addEventListener("orientationchange",()=>{
                this.orientation(true);
            });
        }

        orientation(state){
            if(screen.orientation.type =="portrait-primary" || screen.orientation.type =="portrait-secondary"  ){
                if(state){
                    window.location.reload();
                }
            }else if(screen.orientation.type =="landscape-primary" ||  screen.orientation.type =="landscape-landscape-secondary" ){
                // console.log(state+"::::"+screen.width)
                // console.log(state , screen.width)

                if(state && screen.width>=900){ 
                    window.location.reload();
                }else if( screen.width<900 ){
                    rotate.style.display="block"
                    main.style.display="none"
                }
            }
        }
    }
    onload = new Orientation();

}else{
    typeOfDevice="computer"
    var boardW=screen.width*0.5*0.8;
    r.style.setProperty('--portf-width', String(screen.width*0.25*0.8)+'px');
}
r.style.setProperty('--board-width', String(boardW)+'px');

var boardGap=boardW*0.03;

r.style.setProperty('--pawn-scale', ((boardW-2*boardGap)/8) / 80 );

const faceFront = document.getElementById('faceFront');
const boardHead = document.getElementById('boardHead');
const boardFoot = document.getElementById('boardFoot');
const boardRight = document.getElementById('boardRight');
const boardLeft = document.getElementById('boardLeft');
const boardGame = document.getElementById('boardGame');

var abc="ABCDEFGH";
var flp=0;
var j=1;


var indexOfSquare=(verti,hori)=>{
    let horiz=abc.indexOf(hori, 0) + 1;
    let vert=8-verti;
    let index=(horiz+8*vert)-1

    return index ;
}
//    data

var xName='ahmed';
var yName='yosra';

var typeOfPlayer="x"
let data={coordinate:"y0-y0-0-0-0"}
let UserData={coordinate:"y0-y0-0-0-0"}
var gamedata={
    playerx:{
        nobelx:[],
        soldierx:[],
        numOfCheckmate:0,
        threatening:false,
        canClick:typeOfPlayer==="x"?true:false ,
        selectedpiece:{}
    },
    playery:{
        nobely:[],
        soldiery:[],
        numOfCheckmate:0,
        threatening:false,
        canClick:typeOfPlayer==="y"?true:false ,
        selectedpiece:{} 
    },
    death:{
        deadx:[],
        deady:[]
    },
    square:[]
}

// var simulation={};

var localSquareData=[];
var selectedSquareId=[];

var checkWin=0;

var xtmr=15*60;
var ytmr=xtmr;

// var xtmr=10;
// var ytmr=10;

var gameOver=false;

var audio = new Audio('./assets/checkmate.mp3');

//

yTMR[tmrid].innerHTML=`${Math.floor(ytmr/60)}:${Math.floor(ytmr%60)}`;
xTMR[tmrid].innerHTML=`${Math.floor(xtmr/60)}:${Math.floor(xtmr%60)}`;

if(typeOfPlayer==="y"){
    for(var i=0;i<8;i++){
        boardHead.innerHTML+=`<span style="display:inline-block; color:grey; height:${boardGap}px; width:${(boardW-2*boardGap)/8}px; text-align:center; line-height:105%; font-size:${fontS}em; transform:rotate(-180deg); " >${abc[i]}</span>`;
    }
    for(var i=8;i>0;i--){
        boardRight.innerHTML+=`<div style=" color:grey;  width:${boardGap}px; height:${(boardW-2*boardGap)/8}px; text-align:center; line-height:100%; display:flex; align-items:center; justify-content:center; transform:rotate(-180deg) " >${i}</div>`;
    }
}else if(typeOfPlayer==="x"){
    for(var i=0;i<8;i++){
        boardFoot.innerHTML+=`<div style=" color:grey; height:${boardGap}px; width:${(boardW-2*boardGap)/8}px; text-align:center; line-height:100%; font-size:${fontS}em; " >${abc[i]}</div>`;
    }
    for(var i=8;i>0;i--){
        boardLeft.innerHTML+=`<div style=" color:grey;  width:${boardGap}px; height:${(boardW-2*boardGap)/8}px; text-align:center; line-height:100%; display:flex; align-items:center; justify-content:center; " >${i}</div>`;
    }
}

for(var i=1;i<=(8*8);i++){

    var color=i%2==flp ? '#b09e9e00' : '#2e2323' ; 

    boardGame.innerHTML+=`<div  onclick="squareClick(${i-1},${9-j},${(i-1)%8},0,0,0)"  id='square${abc[(i-1)%8]}${9-j}' style=" position:relative; width:${(boardW-2*boardGap)/8}px; height:${(boardW-2*boardGap)/8}px; background:${color}; " ></div>`;
    gamedata.square.push({
        havePiece:false,
        typeOfPiece:"",
        id:-1,
    });

    localSquareData.push({
        pieceCanReach:false,
    });

    if(i%8==0){
        j+=1;
    }
    flp=j%2==0 ? 1 : 0 ;

}


// boardGame.innerHTML+=`<img src="./assets/king.png" style="width:${(boardW-2*boardGap)/8}px; z-index:90;  position:absolute; right:190px; bottom:20px;" />`;

var wwdth=window.innerWidth 
if(typeOfDevice==="computer"){
    if(wwdth>screen.width*0.8){
        raside.style.display="block";
        laside.style.display="flex";
        maside.style.width="50%";
    }else if(wwdth>=screen.width*0.65 && wwdth<=screen.width*0.85){
        raside.style.display="none";
        laside.style.display="flex";
        maside.style.width="75%";
    }else{
        raside.style.display="none";
        laside.style.display="none";
        maside.style.width="100%";
    }
}

window.addEventListener("resize", Resize);
function Resize() {
    wwdth=window.innerWidth 
    if(wwdth>screen.width*0.8){
        raside.style.display="block";
        laside.style.display="flex";
        maside.style.width="50%";
    }else if(wwdth>=screen.width*0.65 && wwdth<=screen.width*0.85){
        raside.style.display="none";
        laside.style.display="flex";
        maside.style.width="75%";
    }else{
        raside.style.display="none";
        laside.style.display="none";
        maside.style.width="100%";
    }
}


//{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{ manage messages }}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}

const inputMsg = tmrid===0 ? document.getElementById('inputMsgPC'):document.getElementById('inputMsgPH') ;
const messages = tmrid===0 ? document.getElementById('messagesPC'):document.getElementById('messagesPH') ;
const sendForm = tmrid===0 ? document.getElementById('sendFormPC'):document.getElementById('sendFormPH') ;

//{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{ backend parametre }}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}
var msgData={
    msg:"<div class='message opp' >hey how's it going</div> <div class='message self' >hey i'm doing great</div>",
    xNewMsg:'',
    yNewMsg:''
}
messages.innerHTML=msgData.msg;
messages.scrollTop = messages.scrollHeight - messages.clientHeight;
//{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}

sendForm.addEventListener("submit", (e)=>{
    e.preventDefault();
    let inputValue=inputMsg.value;
    let classType=typeOfPlayer==='x'?'self':'opp';
    if(inputValue!=''){
        messages.innerHTML+=`<div class="message ${classType}" >${inputValue}</div>`;
        msgData.msg+=`<div class="message ${classType}" >${inputValue}</div>`;
        msgData[typeOfPlayer+"NewMsg"]=`<div class="message ${classType}" >${inputValue}</div>`;
        inputMsg.value='';
    }
    messages.scrollTop = messages.scrollHeight - messages.clientHeight;
});


// --------------------------------    range pices  ------------------------------------

var gameW=boardW-2*boardGap;
nobelPieces=["rook","knight","bishop","queen","king","bishop","knight","rook"]

for(var i=0;i<8;i++){
    let bottom="0px";
    boardGame.innerHTML+=`<img  onclick="XNClick(${i},'x',true)" id="nobelx${i}" style="z-index:8; position:absolute; width:${gameW/8}px; bottom:${bottom}; left:${i*(gameW/8)}px; " src="./assets/${nobelPieces[i]}x.png"  />`;
    gamedata.playerx.nobelx.push({
        vertical:1,
        horizontal:abc[i],
        life:true,
        firstmove:false
    });
    gamedata.square[indexOfSquare(1,abc[i])]={
        havePiece:true,
        typeOfPiece:"nobelx",
        id:i,
    }
}

for(var i=0;i<8;i++){
    let bottom=(gameW/8);
    boardGame.innerHTML+=`<img onclick="XSClick(${i},'x',true)"  id="soldierx${i}"  style=" z-index:7; position:absolute; width:${gameW/8}px; bottom:${bottom}px; left:${i*(gameW/8)}px;" src="./assets/pawnx.png"  />`;
    // cube.innerHTML+=`<div onclick="XSClick(${i},'x',true)"  id="soldierx${i}" class="scene" >${pawn3d}</div>`;
    gamedata.playerx.soldierx.push({
        vertical:2,
        horizontal:abc[i],
        life:true,
        firstmove:false
    });
    gamedata.square[indexOfSquare(2,abc[i])]={
        havePiece:true,
        typeOfPiece:"soldierx",
        id:i,
    }
}

for(var i=0;i<8;i++){
    let bottom=(gameW/8)*7;
    boardGame.innerHTML+=`<img  onclick="XNClick(${i},'y',true)"  id="nobely${i}" style=" z-index:1; position:absolute; width:${gameW/8}px; bottom:${bottom}px; left:${i*(gameW/8)}px; " src="./assets/${nobelPieces[i]}y.png"  />`;
    gamedata.playery.nobely.push({
        vertical:8,
        horizontal:abc[i],
        life:true,
        firstmove:false
    });
    gamedata.square[indexOfSquare(8,abc[i])]={
        havePiece:true,
        typeOfPiece:"nobely",
        id:i,
    }
}

for(var i=0;i<8;i++){
    let bottom=(gameW/8)*6;
    boardGame.innerHTML+=`<img  onclick="XSClick(${i},'y',true)" id="soldiery${i}" style=" z-index:2; position:absolute; width:${gameW/8}px; bottom:${bottom}px; left:${i*(gameW/8)}px;" src="./assets/pawny.png"  />`;
    // cube.innerHTML+=`<div onclick="XSClick(${i},'y',true)"  id="soldiery${i}" class="scene" >${pawn3d}</div>`;
    gamedata.playery.soldiery.push({
        vertical:7,
        horizontal:abc[i],
        life:true,
        firstmove:false
    });

    gamedata.square[indexOfSquare(7,abc[i])]={
        havePiece:true,
        typeOfPiece:"soldiery",
        id:i,
    }

}

// --------------------------------   onclick pieces   ------------------------------------

var ii=null

var GoTimer=(st,typ)=>{

    clearInterval(ii);
    ii = setInterval(timer, 1000);

    function timer () {
        // console.log(xtmr,ytmr)
        if(st && !gameOver){
            if(typ==='x'){
                xtmr-=1;
                xTMR[tmrid].innerHTML=`${Math.floor(xtmr/60)}:${Math.floor(xtmr%60)}`
            }else if(typ==='y'){
                ytmr-=1;
                yTMR[tmrid].innerHTML=`${Math.floor(ytmr/60)}:${Math.floor(ytmr%60)}`
            }

            if(xtmr===0 || ytmr===0  ){
                win.style.display='flex';
                gameOver=true;
                if(typ==="x"){
                    winMsg.innerHTML=yName+"'s win !"
                }else if(typ==="y"){
                    winMsg.innerHTML=xName+"'s win !"
                }
                clearInterval(ii);
            }
        }else{
            clearInterval(ii);
        }
    }
}






var non=(type)=>{
    let tp
    if(type==="x"){
        tp="y"
    }else if(type==='y'){
        tp="x"
    }

    return tp
}


var danger=(squareNdx,action)=>{
    let isInDanger=false

    if(action){
        let simulation = JSON.parse(JSON.stringify(gamedata));
        // console.log(simulation,gamedata)
        let SP=simulation['player'+typeOfPlayer].selectedpiece

        let notplayer=non(typeOfPlayer)
        // console.log(squareNdx)
        if(simulation.square[squareNdx].havePiece && (simulation.square[squareNdx].typeOfPiece==='nobel'+notplayer || simulation.square[squareNdx].typeOfPiece==='soldier'+notplayer) ){
            // console.log(simulation.square[squareNdx].typeOfPiece,notplayer);
            // console.log('------------------------------------')
            let victim= simulation['player'+notplayer][simulation.square[squareNdx].typeOfPiece][simulation.square[squareNdx].id] ;
            victim.life=false;
        } 

        simulation.square[simulation["player"+typeOfPlayer].selectedpiece.indexofsquare].havePiece=false;

        simulation.square[squareNdx]={
            havePiece:true,
            typeOfPiece:SP.typeOfPiece + typeOfPlayer,
            id:SP.id,
        }

        // console.log("--- top:",top,'left:',abc[left])

        simulation["player" + typeOfPlayer][SP.typeOfPiece + typeOfPlayer][SP.id]={
            vertical:8-Math.floor(squareNdx/8),
            horizontal:abc[squareNdx%8],
            life:true,
            firstmove:true
        };


        for(let i=0;i<8;i++){
            let pawn=simulation["player"+notplayer]["soldier"+notplayer][i];
            if(pawn.life){
                let c=1
                if(notplayer==='y'){
                    c=-1
                }else if(notplayer==='x'){
                    c=1
                }
                let possibleMove=[[pawn.vertical+c,abc[abc.indexOf(pawn.horizontal,0)+1]],[pawn.vertical+c,abc[abc.indexOf(pawn.horizontal,0)-1]]];
                if(pawn.vertical+c > 0 && pawn.vertical+c < 9 ){
                    if(abc.indexOf(pawn.horizontal,0)+1 < 8 && abc.indexOf(pawn.horizontal,0)+1 >=0){
                        if(simulation.square[indexOfSquare(possibleMove[0][0],possibleMove[0][1])].havePiece){
                            if(simulation.square[indexOfSquare(possibleMove[0][0],possibleMove[0][1])].typeOfPiece==='nobel'+typeOfPlayer && simulation.square[indexOfSquare(possibleMove[0][0],possibleMove[0][1])].id===4){
                                isInDanger=true;
                                break;
                            }
                        }
                    }

                    if( abc.indexOf(pawn.horizontal,0)-1 < 8 && abc.indexOf(pawn.horizontal,0)-1 >=0){
                        if(simulation.square[indexOfSquare(possibleMove[1][0],possibleMove[1][1])].havePiece){
                            if(simulation.square[indexOfSquare(possibleMove[1][0],possibleMove[1][1])].typeOfPiece==='nobel'+typeOfPlayer && simulation.square[indexOfSquare(possibleMove[1][0],possibleMove[1][1])].id===4){
                                isInDanger=true;
                                break;
                            }
                        }
                    }
                }
            }
        }


        let m=0
        // console.log(nobelPieces)
        while ( isInDanger===false && m < nobelPieces.length ){
            // console.log('m:',gamedata["player"+notplayer]["nobel"+notplayer][m])
           if(simulation["player"+notplayer]["nobel"+notplayer][m]!=undefined){
            if(simulation["player"+notplayer]["nobel"+notplayer][m].life){
                let piece = simulation["player"+notplayer]["nobel"+notplayer][m];
                let vert=piece.vertical;
                let horizontal=piece.horizontal;
                let hori=abc.indexOf(horizontal,0);
                if(nobelPieces[m]==='rook'){
                    for(let i=vert+1 ; i<=8;i++){
                        if(simulation.square[indexOfSquare(i,horizontal)].havePiece){
                            if(simulation.square[indexOfSquare(i,horizontal)].typeOfPiece==='nobel'+typeOfPlayer && simulation.square[indexOfSquare(i,horizontal)].id===4){
                                isInDanger=true;
                            }
                            break;
                        }
                    }
        
                    for(let i=vert-1 ; i>0;i--){
                        if(simulation.square[indexOfSquare(i,horizontal)].havePiece){
                            if(simulation.square[indexOfSquare(i,horizontal)].typeOfPiece==='nobel'+typeOfPlayer && simulation.square[indexOfSquare(i,horizontal)].id===4){
                                isInDanger=true;
                            }
                            break;
                        }
                    }
        
                    for(let i=hori+1 ; i<8;i++){
                        if(simulation.square[indexOfSquare(vert,abc[i])].havePiece){ 
                            // console.log("dddd")                           
                            if(simulation.square[indexOfSquare(vert,abc[i])].typeOfPiece==='nobel'+typeOfPlayer && simulation.square[indexOfSquare(vert,abc[i])].id===4){
                                isInDanger=true;
                            }
                            break;
                        }
                    }
        
                    for(let i=hori-1 ; i>=0;i--){
                        if(simulation.square[indexOfSquare(vert,abc[i])].havePiece){                            
                            if(simulation.square[indexOfSquare(vert,abc[i])].typeOfPiece==='nobel'+typeOfPlayer && simulation.square[indexOfSquare(vert,abc[i])].id===4){
                                isInDanger=true;
                            }
                            break;
                        }
                    }
                }else if(nobelPieces[m]==='bishop'){
                    let i=vert+1
                    let j=hori+1
                    while(i<9 && j<8){
                        if(simulation.square[indexOfSquare(i,abc[j])].havePiece){
                            if(simulation.square[indexOfSquare(i,abc[j])].typeOfPiece==='nobel'+typeOfPlayer && simulation.square[indexOfSquare(i,abc[j])].id===4){
                                isInDanger=true;
                            }
                            break;
                        }

                        j++
                        i++
                    }

                    i=vert-1
                    j=hori-1
                    while(i>0 && j>=0){

                        // console.log(i,j)

                        if(simulation.square[indexOfSquare(i,abc[j])].havePiece){
                            if(simulation.square[indexOfSquare(i,abc[j])].typeOfPiece==='nobel'+typeOfPlayer && simulation.square[indexOfSquare(i,abc[j])].id===4){
                                isInDanger=true;
                            }
                            break;
                        }

                        j--
                        i--
                    }

                    i=vert+1
                    j=hori-1
                    while(i<9 && j>=0){

                        if(simulation.square[indexOfSquare(i,abc[j])].havePiece){
                            if(simulation.square[indexOfSquare(i,abc[j])].typeOfPiece==='nobel'+typeOfPlayer && simulation.square[indexOfSquare(i,abc[j])].id===4){
                                isInDanger=true;
                            }
                            break;
                        }

                        j--
                        i++
                    }

                    i=vert-1
                    j=hori+1
                    while(i>0 && j<8){

                        if(simulation.square[indexOfSquare(i,abc[j])].havePiece){
                            if(simulation.square[indexOfSquare(i,abc[j])].typeOfPiece==='nobel'+typeOfPlayer && simulation.square[indexOfSquare(i,abc[j])].id===4){
                                isInDanger=true;
                            }
                            break;
                        }

                        j++
                        i--
                    }
                }else if(nobelPieces[m]==='queen'){
                    for(let i=vert+1 ; i<=8;i++){
                        if(simulation.square[indexOfSquare(i,horizontal)].havePiece){
                            if(simulation.square[indexOfSquare(i,horizontal)].typeOfPiece==='nobel'+typeOfPlayer && simulation.square[indexOfSquare(i,horizontal)].id===4){
                                isInDanger=true;
                            }
                            break;
                        }
                    }
        
                    for(let i=vert-1 ; i>0;i--){
                        if(simulation.square[indexOfSquare(i,horizontal)].havePiece){
                            if(simulation.square[indexOfSquare(i,horizontal)].typeOfPiece==='nobel'+typeOfPlayer && simulation.square[indexOfSquare(i,horizontal)].id===4){
                                isInDanger=true;
                            }
                            break;
                        }
                    }
        
                    for(let i=hori+1 ; i<8;i++){
                        if(simulation.square[indexOfSquare(vert,abc[i])].havePiece){                            
                            if(simulation.square[indexOfSquare(vert,abc[i])].typeOfPiece==='nobel'+typeOfPlayer && simulation.square[indexOfSquare(vert,abc[i])].id===4){
                                isInDanger=true;
                            }
                            break;
                        }
                    }
        
                    for(let i=hori-1 ; i>=0;i--){
                        if(simulation.square[indexOfSquare(vert,abc[i])].havePiece){                            
                            if(simulation.square[indexOfSquare(vert,abc[i])].typeOfPiece==='nobel'+typeOfPlayer && simulation.square[indexOfSquare(vert,abc[i])].id===4){
                                isInDanger=true;
                            }
                            break;
                        }
                    }

                    let i=vert+1
                    let j=hori+1
                    while(i<9 && j<8){
                        if(simulation.square[indexOfSquare(i,abc[j])].havePiece){
                            if(simulation.square[indexOfSquare(i,abc[j])].typeOfPiece==='nobel'+typeOfPlayer && simulation.square[indexOfSquare(i,abc[j])].id===4){
                                isInDanger=true;
                            }
                            break;
                        }

                        j++
                        i++
                    }

                    i=vert-1
                    j=hori-1
                    while(i>0 && j>=0){

                        // console.log(i,j)

                        if(simulation.square[indexOfSquare(i,abc[j])].havePiece){
                            if(simulation.square[indexOfSquare(i,abc[j])].typeOfPiece==='nobel'+typeOfPlayer && simulation.square[indexOfSquare(i,abc[j])].id===4){
                                isInDanger=true;
                            }
                            break;
                        }

                        j--
                        i--
                    }

                    i=vert+1
                    j=hori-1
                    while(i<9 && j>=0){

                        if(simulation.square[indexOfSquare(i,abc[j])].havePiece){
                            if(simulation.square[indexOfSquare(i,abc[j])].typeOfPiece==='nobel'+typeOfPlayer && simulation.square[indexOfSquare(i,abc[j])].id===4){
                                isInDanger=true;
                            }
                            break;
                        }

                        j--
                        i++
                    }

                    i=vert-1
                    j=hori+1
                    while(i>0 && j<8){

                        if(simulation.square[indexOfSquare(i,abc[j])].havePiece){
                            if(simulation.square[indexOfSquare(i,abc[j])].typeOfPiece==='nobel'+typeOfPlayer && simulation.square[indexOfSquare(i,abc[j])].id===4){
                                isInDanger=true;
                            }
                            break;
                        }

                        j++
                        i--
                    }

                }else if(nobelPieces[m]==='knight'){
                    let possibleMove = [[vert+2,hori+1],[vert+2,hori-1],[vert+1,hori+2],[vert+1,hori-2],[vert-2,hori+1],[vert-2,hori-1],[vert-1,hori+2],[vert-1,hori-2]];
                    for (var v=0;v<possibleMove.length;v++){
                        if(possibleMove[v][0]<9 && possibleMove[v][0]>0 && possibleMove[v][1]<8 && possibleMove[v][1]>=0){
                            let i=possibleMove[v][0];
                            let j=possibleMove[v][1];
                            if(simulation.square[indexOfSquare(i,abc[j])].havePiece){
                                if(simulation.square[indexOfSquare(i,abc[j])].typeOfPiece==='nobel'+typeOfPlayer && simulation.square[indexOfSquare(i,abc[j])].id===4){
                                    isInDanger=true;
                                }
                            }
                        }
                    }
                }else if(nobelPieces[m]==='king'){
                    let possibleMove = [[vert+1,hori+1],[vert+1,hori-1],[vert+1,hori],[vert,hori-1],[vert,hori+1],[vert-1,hori-1],[vert-1,hori+1],[vert-1,hori]];                    
                    for (var v=0;v<possibleMove.length;v++){
                        if(possibleMove[v][0]<9 && possibleMove[v][0]>0 && possibleMove[v][1]<8 && possibleMove[v][1]>=0){
                            let i=possibleMove[v][0];
                            let j=possibleMove[v][1];
                            if(simulation.square[indexOfSquare(i,abc[j])].havePiece){
                                if(simulation.square[indexOfSquare(i,abc[j])].typeOfPiece==='nobel'+typeOfPlayer && simulation.square[indexOfSquare(i,abc[j])].id===4){
                                    isInDanger=true;
                                }
                            }
                        }
                    }
                }
            }

          }







            m++
        }

        // console.log(gamedata)
    }

    // isInDanger=false;

    return isInDanger;
}


async function MovePiece(ID,top_pos,left_pos,reachTop,reachLeft,time) {
    // console.log("dddd")
    let ii = null;
    const elem = document.getElementById(ID);   
    let posy = top_pos;
    let posx = left_pos;

    let dx=(reachLeft-left_pos)/20;
    let dy=(reachTop-top_pos)/20;

    clearInterval(ii);
    ii = setInterval(frame, time);
    function frame() {
        // console.log(Math.abs(posy),Math.abs(reachTop))
      if(Math.round(Math.abs(posx)) == Math.round(reachLeft) && Math.round(Math.abs(posy))==Math.round(reachTop)) {
        clearInterval(ii);
      }else {
        posy+=dy;
        posx+=dx;
        elem.style.top = posy + "px"; 
        elem.style.left = posx + "px"; 
      }
    }
}

async function hidePiece(ID,time){
    let ii=null;
    const elem = document.getElementById(ID); 

    let i=1

    clearInterval(ii);
    ii = setInterval(frame0, time);
    function frame0() {
        // console.log(Math.abs(posy),Math.abs(reachTop))
        // console.log(i);
      if(Math.round(i*100)==0) {
        clearInterval(ii);
        elem.style.display="none";
      }else {
        i-=0.05
        elem.style.opacity = i; 
      }
    }
}

// var somethingClicked=false;
var kingIDD=null
var XNClick=(index,type,action)=>{
    // console.log(localSquareData)
    if(typeOfPlayer==='x'){
        var XSdata=gamedata.playerx.nobelx[index];
        // console.log(index);
        // console.log(XSdata);
        // console.log("x",gamedata.playerx.soldierx[index])
        var XYdata=gamedata.playery.nobely[index];
        var canplay=gamedata.playerx.canClick
        var c=1
        var soldier="soldiery"
        var nobel='nobely'
    }else if(typeOfPlayer==='y'){
        var XSdata=gamedata.playery.nobely[index];
        // console.log("y",gamedata.playery.soldiery[index])
        var XYdata=gamedata.playerx.nobelx[index];
        var canplay=gamedata.playery.canClick
        var c=-1
        var soldier="soldierx"
        var nobel='nobelx'
    }
    if( canplay && type===typeOfPlayer && !gameOver){
        
        if(action){
            for(var i=0;i<selectedSquareId.length;i++){
                let square=document.getElementById(selectedSquareId[i]);
                square.style.border="none";
                square.innerHTML="";
            }
        }


        var squareID='square'+XSdata.horizontal+String(XSdata.vertical);
        var square=document.getElementById(squareID)
        let vert=XSdata.vertical;
        let hori=abc.indexOf(XSdata.horizontal,0);

        if(action){
            square.style.border="3px solid green";
            selectedSquareId.push(squareID);
            gamedata["player"+typeOfPlayer].selectedpiece={
                typeOfPiece:'nobel',
                id:index,
                indexofsquare:indexOfSquare(vert,XSdata.horizontal)
            }

            for(var i=0;i<8*8;i++){
                localSquareData[i].pieceCanReach=false;
            }
        }

        // console.log(vert,hori)

        // console.log(JSON.parse(JSON.stringify(localSquareData)));

        if(nobelPieces[index]==='rook'){
            // console.log(JSON.parse(JSON.stringify(localSquareData)));
            for(var i=vert+1 ; i<=8;i++){ 
                let squareID='square' + XSdata.horizontal + String(i) ;
                let square=document.getElementById(squareID);
                    if(gamedata.square[indexOfSquare(i,XSdata.horizontal)].havePiece){
                        if(danger(indexOfSquare(i,XSdata.horizontal),action)===false  && ( gamedata.square[indexOfSquare(i,XSdata.horizontal)].typeOfPiece===nobel || gamedata.square[indexOfSquare(i,XSdata.horizontal)].typeOfPiece===soldier)){
                            if(action){
                                square.style.border='3px solid red';
                                selectedSquareId.push(squareID);
                                localSquareData[indexOfSquare(i,XSdata.horizontal)]={
                                    pieceCanReach:true,
                                };
                            }
                            if(gamedata.square[indexOfSquare(i,XSdata.horizontal)].typeOfPiece===nobel && gamedata.square[indexOfSquare(i,XSdata.horizontal)].id===4 && action===false){
                                gamedata["player"+non(typeOfPlayer)].threatening=true;
                        audio.play();
                            }
                        }
                        break;
                    }else{
                        if(action && danger(indexOfSquare(i,XSdata.horizontal),action)===false ){
                            square.innerHTML=`<div style="position:absolute; width:${(gameW/8)*0.25}px; height:${(gameW/8)*0.25}px; border-radius:50%; background:green; top:50%; left:50%; transform:translate(-50%,-50%); "  ></div>`;
                            selectedSquareId.push(squareID);
                            localSquareData[indexOfSquare(i,XSdata.horizontal)]={
                                pieceCanReach:true,
                            };
                        }
                    }
            }

            // console.log(JSON.parse(JSON.stringify(localSquareData)));

            for(var i=vert-1 ; i>0;i--){
                let squareID='square' + XSdata.horizontal + String(i) ;
                let square=document.getElementById(squareID);
                    if(gamedata.square[indexOfSquare(i,XSdata.horizontal)].havePiece){
                        if(danger(indexOfSquare(i,XSdata.horizontal),action)===false  && ( gamedata.square[indexOfSquare(i,XSdata.horizontal)].typeOfPiece===nobel || gamedata.square[indexOfSquare(i,XSdata.horizontal)].typeOfPiece===soldier)){
                            if(action){
                                square.style.border='3px solid red';
                                selectedSquareId.push(squareID);
                                localSquareData[indexOfSquare(i,XSdata.horizontal)]={
                                    pieceCanReach:true,
                                };
                            }
                            if(gamedata.square[indexOfSquare(i,XSdata.horizontal)].typeOfPiece===nobel && gamedata.square[indexOfSquare(i,XSdata.horizontal)].id===4 && action===false){
                                gamedata["player"+non(typeOfPlayer)].threatening=true;
                        audio.play();
                            }
                        }
                        break;
                    }else{
                        if(action && danger(indexOfSquare(i,XSdata.horizontal),action)===false ){
                            square.innerHTML=`<div style="position:absolute; width:${(gameW/8)*0.25}px; height:${(gameW/8)*0.25}px; border-radius:50%; background:green; top:50%; left:50%; transform:translate(-50%,-50%); "  ></div>`;
                            selectedSquareId.push(squareID);
                            localSquareData[indexOfSquare(i,XSdata.horizontal)]={
                                pieceCanReach:true,
                            };
                        }
                    }
            }
            // console.log(JSON.parse(JSON.stringify(localSquareData))); 
            for(var i=hori+1 ; i<8;i++){
                let squareID='square' + abc[i] + String(vert) ;
                let square=document.getElementById(squareID);
                    if(gamedata.square[indexOfSquare(vert,abc[i])].havePiece){
                        if(  danger(indexOfSquare(vert,abc[i]),action)===false && ( gamedata.square[indexOfSquare(vert,abc[i])].typeOfPiece===nobel || gamedata.square[indexOfSquare(vert,abc[i])].typeOfPiece===soldier )){
                            if(action){
                                square.style.border='3px solid red';
                                selectedSquareId.push(squareID);
                                localSquareData[indexOfSquare(vert,abc[i])]={
                                    pieceCanReach:true,
                                };
                            }
                            if(gamedata.square[indexOfSquare(vert,abc[i])].typeOfPiece===nobel && gamedata.square[indexOfSquare(vert,abc[i])].id===4 && action===false){
                                gamedata["player"+non(typeOfPlayer)].threatening=true;
                        audio.play();
                            }
                        }
                        break;
                    }else{
                        if(action && danger(indexOfSquare(vert,abc[i]),action)===false ){
                            square.innerHTML=`<div style="position:absolute; width:${(gameW/8)*0.25}px; height:${(gameW/8)*0.25}px; border-radius:50%; background:green; top:50%; left:50%; transform:translate(-50%,-50%); "  ></div>`;
                            selectedSquareId.push(squareID);
                            localSquareData[indexOfSquare(vert,abc[i])]={
                                pieceCanReach:true,
                            };
                        }
                    }
            }
            // console.log(JSON.parse(JSON.stringify(localSquareData)));

            for(var i=hori-1 ; i>=0;i--){
                let squareID='square' + abc[i] + String(vert) ;
                let square=document.getElementById(squareID);
                    if(gamedata.square[indexOfSquare(vert,abc[i])].havePiece){
                        if( danger(indexOfSquare(vert,abc[i]),action)===false && ( gamedata.square[indexOfSquare(vert,abc[i])].typeOfPiece===nobel || gamedata.square[indexOfSquare(vert,abc[i])].typeOfPiece===soldier )){
                            if(action){
                                square.style.border='3px solid red';
                                selectedSquareId.push(squareID);
                                localSquareData[indexOfSquare(vert,abc[i])]={
                                    pieceCanReach:true,
                                };
                            }
                            if(gamedata.square[indexOfSquare(vert,abc[i])].typeOfPiece===nobel && gamedata.square[indexOfSquare(vert,abc[i])].id===4 && action===false){
                                gamedata["player"+non(typeOfPlayer)].threatening=true;
                        audio.play();
                            }
                        }
                        break;
                    }else{
                        if(action && danger(indexOfSquare(vert,abc[i]),action)===false ){
                            square.innerHTML=`<div style="position:absolute; width:${(gameW/8)*0.25}px; height:${(gameW/8)*0.25}px; border-radius:50%; background:green; top:50%; left:50%; transform:translate(-50%,-50%); "  ></div>`;
                            selectedSquareId.push(squareID);
                            localSquareData[indexOfSquare(vert,abc[i])]={
                                pieceCanReach:true,
                            };
                        }
                    }
            }
            // console.log(JSON.parse(JSON.stringify(localSquareData)));
            // console.log("---------------------------------------------")
        }else if(nobelPieces[index]==='bishop'){
            let i=vert+1
            let j=hori+1
            while(i<9 && j<8){

                let squareID='square' + abc[j] + String(i) ;
                let square=document.getElementById(squareID);
                    if(gamedata.square[indexOfSquare(i,abc[j])].havePiece){
                        if( danger(indexOfSquare(i,abc[j]),action)===false && ( gamedata.square[indexOfSquare(i,abc[j])].typeOfPiece===nobel || gamedata.square[indexOfSquare(i,abc[j])].typeOfPiece===soldier)){
                            if(action){
                                square.style.border='3px solid red';
                                selectedSquareId.push(squareID);
                                localSquareData[indexOfSquare(i,abc[j])]={
                                    pieceCanReach:true,
                                };
                            }
                            if(gamedata.square[indexOfSquare(i,abc[j])].typeOfPiece===nobel && gamedata.square[indexOfSquare(i,abc[j])].id===4 && action===false){
                                gamedata["player"+non(typeOfPlayer)].threatening=true;
                        audio.play();
                            }
                        }
                        break;
                    }else{
                        if(action && danger(indexOfSquare(i,abc[j]),action)===false){
                            square.innerHTML=`<div style="position:absolute; width:${(gameW/8)*0.25}px; height:${(gameW/8)*0.25}px; border-radius:50%; background:green; top:50%; left:50%; transform:translate(-50%,-50%); "  ></div>`;
                            selectedSquareId.push(squareID);
                            localSquareData[indexOfSquare(i,abc[j])]={
                                pieceCanReach:true,
                            };
                        }
                    }

                j++
                i++
            }

            i=vert-1
            j=hori-1
            while(i>0 && j>=0){

                // console.log(i,j)

                let squareID='square' + abc[j] + String(i) ;
                let square=document.getElementById(squareID);
                if(gamedata.square[indexOfSquare(i,abc[j])].havePiece){
                    if( danger(indexOfSquare(i,abc[j]),action)===false && ( gamedata.square[indexOfSquare(i,abc[j])].typeOfPiece===nobel || gamedata.square[indexOfSquare(i,abc[j])].typeOfPiece===soldier)){
                        if(action){
                            square.style.border='3px solid red';
                            selectedSquareId.push(squareID);
                            localSquareData[indexOfSquare(i,abc[j])]={
                                pieceCanReach:true,
                            };
                        }
                        if(gamedata.square[indexOfSquare(i,abc[j])].typeOfPiece===nobel && gamedata.square[indexOfSquare(i,abc[j])].id===4 && action===false){
                            
                            gamedata["player"+non(typeOfPlayer)].threatening=true;
                        audio.play();
                        }
                    }
                    break;
                }else{
                    if(action && danger(indexOfSquare(i,abc[j]),action)===false){
                        square.innerHTML=`<div style="position:absolute; width:${(gameW/8)*0.25}px; height:${(gameW/8)*0.25}px; border-radius:50%; background:green; top:50%; left:50%; transform:translate(-50%,-50%); "  ></div>`;
                        selectedSquareId.push(squareID);
                        localSquareData[indexOfSquare(i,abc[j])]={
                            pieceCanReach:true,
                        };
                    }
                }

                j--
                i--
            }

            i=vert+1
            j=hori-1
            while(i<9 && j>=0){

                let squareID='square' + abc[j] + String(i) ;
                let square=document.getElementById(squareID);
                if(gamedata.square[indexOfSquare(i,abc[j])].havePiece){
                    if( danger(indexOfSquare(i,abc[j]),action)===false && ( gamedata.square[indexOfSquare(i,abc[j])].typeOfPiece===nobel || gamedata.square[indexOfSquare(i,abc[j])].typeOfPiece===soldier)){
                        if(action){
                            square.style.border='3px solid red';
                            selectedSquareId.push(squareID);
                            localSquareData[indexOfSquare(i,abc[j])]={
                                pieceCanReach:true,
                            };
                        }
                        if(gamedata.square[indexOfSquare(i,abc[j])].typeOfPiece===nobel && gamedata.square[indexOfSquare(i,abc[j])].id===4 && action===false){
                            
                            gamedata["player"+non(typeOfPlayer)].threatening=true;
                        audio.play();
                        }
                    }
                    break;
                }else{
                    if(action && danger(indexOfSquare(i,abc[j]),action)===false){
                        square.innerHTML=`<div style="position:absolute; width:${(gameW/8)*0.25}px; height:${(gameW/8)*0.25}px; border-radius:50%; background:green; top:50%; left:50%; transform:translate(-50%,-50%); "  ></div>`;
                        selectedSquareId.push(squareID);
                        localSquareData[indexOfSquare(i,abc[j])]={
                            pieceCanReach:true,
                        };
                    }
                }

                j--
                i++
            }

            i=vert-1
            j=hori+1
            while(i>0 && j<8){

                let squareID='square' + abc[j] + String(i) ;
                let square=document.getElementById(squareID);
                if(gamedata.square[indexOfSquare(i,abc[j])].havePiece){
                    if( danger(indexOfSquare(i,abc[j]),action)===false && ( gamedata.square[indexOfSquare(i,abc[j])].typeOfPiece===nobel || gamedata.square[indexOfSquare(i,abc[j])].typeOfPiece===soldier)){
                        if(action){
                            square.style.border='3px solid red';
                            selectedSquareId.push(squareID);
                            localSquareData[indexOfSquare(i,abc[j])]={
                                pieceCanReach:true,
                            };
                        }
                        if(gamedata.square[indexOfSquare(i,abc[j])].typeOfPiece===nobel && gamedata.square[indexOfSquare(i,abc[j])].id===4 && action===false){
                            
                            gamedata["player"+non(typeOfPlayer)].threatening=true;
                        audio.play();
                        }
                    }
                    break;
                }else{
                    if(action && danger(indexOfSquare(i,abc[j]),action)===false){
                        square.innerHTML=`<div style="position:absolute; width:${(gameW/8)*0.25}px; height:${(gameW/8)*0.25}px; border-radius:50%; background:green; top:50%; left:50%; transform:translate(-50%,-50%); "  ></div>`;
                        selectedSquareId.push(squareID);
                        localSquareData[indexOfSquare(i,abc[j])]={
                            pieceCanReach:true,
                        };
                    }
                }

                j++
                i--
            }
        }else if(nobelPieces[index]==='queen'){
            let i=vert+1
            let j=hori+1
            while(i<9 && j<8){

                let squareID='square' + abc[j] + String(i) ;
                let square=document.getElementById(squareID);
                    if(gamedata.square[indexOfSquare(i,abc[j])].havePiece){
                        if( danger(indexOfSquare(i,abc[j]),action)===false && ( gamedata.square[indexOfSquare(i,abc[j])].typeOfPiece===nobel || gamedata.square[indexOfSquare(i,abc[j])].typeOfPiece===soldier)){
                            if(action){
                                square.style.border='3px solid red';
                                selectedSquareId.push(squareID);
                                localSquareData[indexOfSquare(i,abc[j])]={
                                    pieceCanReach:true,
                                };
                            }
                            if(gamedata.square[indexOfSquare(i,abc[j])].typeOfPiece===nobel && gamedata.square[indexOfSquare(i,abc[j])].id===4 && action===false){
                                
                                gamedata["player"+non(typeOfPlayer)].threatening=true;
                        audio.play();
                            }
                        }
                        break;
                    }else{
                        if(action && danger(indexOfSquare(i,abc[j]),action)===false){
                            square.innerHTML=`<div style="position:absolute; width:${(gameW/8)*0.25}px; height:${(gameW/8)*0.25}px; border-radius:50%; background:green; top:50%; left:50%; transform:translate(-50%,-50%); "  ></div>`;
                            selectedSquareId.push(squareID);
                            localSquareData[indexOfSquare(i,abc[j])]={
                                pieceCanReach:true,
                            };
                        }
                    }

                j++
                i++
            }

            i=vert-1
            j=hori-1
            while(i>0 && j>=0){

                // console.log(i,j)

                let squareID='square' + abc[j] + String(i) ;
                let square=document.getElementById(squareID);
                if(gamedata.square[indexOfSquare(i,abc[j])].havePiece){
                    if( danger(indexOfSquare(i,abc[j]),action)===false && ( gamedata.square[indexOfSquare(i,abc[j])].typeOfPiece===nobel || gamedata.square[indexOfSquare(i,abc[j])].typeOfPiece===soldier)){
                        if(action){
                            square.style.border='3px solid red';
                            selectedSquareId.push(squareID);
                            localSquareData[indexOfSquare(i,abc[j])]={
                                pieceCanReach:true,
                            };
                        }
                        if(gamedata.square[indexOfSquare(i,abc[j])].typeOfPiece===nobel && gamedata.square[indexOfSquare(i,abc[j])].id===4 && action===false){
                            
                            gamedata["player"+non(typeOfPlayer)].threatening=true;
                        audio.play();
                        }
                    }
                    break;
                }else{
                    if(action && danger(indexOfSquare(i,abc[j]),action)===false){
                        square.innerHTML=`<div style="position:absolute; width:${(gameW/8)*0.25}px; height:${(gameW/8)*0.25}px; border-radius:50%; background:green; top:50%; left:50%; transform:translate(-50%,-50%); "  ></div>`;
                        selectedSquareId.push(squareID);
                        localSquareData[indexOfSquare(i,abc[j])]={
                            pieceCanReach:true,
                        };
                    }
                }

                j--
                i--
            }

            i=vert+1
            j=hori-1
            while(i<9 && j>=0){

                let squareID='square' + abc[j] + String(i) ;
                let square=document.getElementById(squareID);
                if(gamedata.square[indexOfSquare(i,abc[j])].havePiece){
                    if( danger(indexOfSquare(i,abc[j]),action)===false && ( gamedata.square[indexOfSquare(i,abc[j])].typeOfPiece===nobel || gamedata.square[indexOfSquare(i,abc[j])].typeOfPiece===soldier)){
                        if(action){
                            square.style.border='3px solid red';
                            selectedSquareId.push(squareID);
                            localSquareData[indexOfSquare(i,abc[j])]={
                                pieceCanReach:true,
                            };
                        }
                        if(gamedata.square[indexOfSquare(i,abc[j])].typeOfPiece===nobel && gamedata.square[indexOfSquare(i,abc[j])].id===4 && action===false){
                            
                            gamedata["player"+non(typeOfPlayer)].threatening=true;
                        audio.play();
                        }
                    }
                    break;
                }else{
                    if(action && danger(indexOfSquare(i,abc[j]),action)===false){
                        square.innerHTML=`<div style="position:absolute; width:${(gameW/8)*0.25}px; height:${(gameW/8)*0.25}px; border-radius:50%; background:green; top:50%; left:50%; transform:translate(-50%,-50%); "  ></div>`;
                        selectedSquareId.push(squareID);
                        localSquareData[indexOfSquare(i,abc[j])]={
                            pieceCanReach:true,
                        };
                    }
                }

                j--
                i++
            }

            i=vert-1
            j=hori+1
            while(i>0 && j<8){

                let squareID='square' + abc[j] + String(i) ;
                let square=document.getElementById(squareID);
                if(gamedata.square[indexOfSquare(i,abc[j])].havePiece){
                    // console.log(danger(indexOfSquare(i,abc[j]),action),"gl");
                    // console.log("''''''''''''''''''''''''''''''''''''''''''''''''''''")
                    if( danger(indexOfSquare(i,abc[j]),action)===false && ( gamedata.square[indexOfSquare(i,abc[j])].typeOfPiece===nobel || gamedata.square[indexOfSquare(i,abc[j])].typeOfPiece===soldier)){
                        // console.log(danger(indexOfSquare(i,abc[j]),action),"ggg")
                        if(action){
                            square.style.border='3px solid red';
                            selectedSquareId.push(squareID);
                            localSquareData[indexOfSquare(i,abc[j])]={
                                pieceCanReach:true,
                            };
                        }
                        if(gamedata.square[indexOfSquare(i,abc[j])].typeOfPiece===nobel && gamedata.square[indexOfSquare(i,abc[j])].id===4 && action===false){
                            
                            gamedata["player"+non(typeOfPlayer)].threatening=true;
                        audio.play();
                        }
                    }
                    break;
                }else{
                    if(action && danger(indexOfSquare(i,abc[j]),action)===false){
                        square.innerHTML=`<div style="position:absolute; width:${(gameW/8)*0.25}px; height:${(gameW/8)*0.25}px; border-radius:50%; background:green; top:50%; left:50%; transform:translate(-50%,-50%); "  ></div>`;
                        selectedSquareId.push(squareID);
                        localSquareData[indexOfSquare(i,abc[j])]={
                            pieceCanReach:true,
                        };
                    }
                }

                j++
                i--
            }



            for( i=vert+1 ; i<=8;i++){
                let squareID='square' + XSdata.horizontal + String(i) ;
                let square=document.getElementById(squareID);
                    if(gamedata.square[indexOfSquare(i,XSdata.horizontal)].havePiece){
                        if(danger(indexOfSquare(i,XSdata.horizontal),action)===false  && ( gamedata.square[indexOfSquare(i,XSdata.horizontal)].typeOfPiece===nobel || gamedata.square[indexOfSquare(i,XSdata.horizontal)].typeOfPiece===soldier)){
                            if(action){
                                square.style.border='3px solid red';
                                selectedSquareId.push(squareID);
                                localSquareData[indexOfSquare(i,XSdata.horizontal)]={
                                    pieceCanReach:true,
                                };
                            }
                            if(gamedata.square[indexOfSquare(i,XSdata.horizontal)].typeOfPiece===nobel && gamedata.square[indexOfSquare(i,XSdata.horizontal)].id===4 && action===false){
                                
                                gamedata["player"+non(typeOfPlayer)].threatening=true;
                        audio.play();
                            }
                        }
                        break;
                    }else{
                        if(action && danger(indexOfSquare(i,XSdata.horizontal),action)===false ){
                            square.innerHTML=`<div style="position:absolute; width:${(gameW/8)*0.25}px; height:${(gameW/8)*0.25}px; border-radius:50%; background:green; top:50%; left:50%; transform:translate(-50%,-50%); "  ></div>`;
                            selectedSquareId.push(squareID);
                            localSquareData[indexOfSquare(i,XSdata.horizontal)]={
                                pieceCanReach:true,
                            };
                        }
                    }
            }

            // console.log(JSON.parse(JSON.stringify(localSquareData)));

            for( i=vert-1 ; i>0;i--){
                let squareID='square' + XSdata.horizontal + String(i) ;
                let square=document.getElementById(squareID);
                    if(gamedata.square[indexOfSquare(i,XSdata.horizontal)].havePiece){
                        if(danger(indexOfSquare(i,XSdata.horizontal),action)===false  && ( gamedata.square[indexOfSquare(i,XSdata.horizontal)].typeOfPiece===nobel || gamedata.square[indexOfSquare(i,XSdata.horizontal)].typeOfPiece===soldier)){
                            if(action){
                                square.style.border='3px solid red';
                                selectedSquareId.push(squareID);
                                localSquareData[indexOfSquare(i,XSdata.horizontal)]={
                                    pieceCanReach:true,
                                };
                            }
                            if(gamedata.square[indexOfSquare(i,XSdata.horizontal)].typeOfPiece===nobel && gamedata.square[indexOfSquare(i,XSdata.horizontal)].id===4 && action===false){
                                
                                gamedata["player"+non(typeOfPlayer)].threatening=true;
                        audio.play();
                            }
                        }
                        break;
                    }else{
                        if(action && danger(indexOfSquare(i,XSdata.horizontal),action)===false ){
                            square.innerHTML=`<div style="position:absolute; width:${(gameW/8)*0.25}px; height:${(gameW/8)*0.25}px; border-radius:50%; background:green; top:50%; left:50%; transform:translate(-50%,-50%); "  ></div>`;
                            selectedSquareId.push(squareID);
                            localSquareData[indexOfSquare(i,XSdata.horizontal)]={
                                pieceCanReach:true,
                            };
                        }
                    }
            }
            // console.log(JSON.parse(JSON.stringify(localSquareData))); 
            for( i=hori+1 ; i<8;i++){
                let squareID='square' + abc[i] + String(vert) ;
                let square=document.getElementById(squareID);
                    if(gamedata.square[indexOfSquare(vert,abc[i])].havePiece){
                        if( danger(indexOfSquare(vert,abc[i]),action)===false && ( gamedata.square[indexOfSquare(vert,abc[i])].typeOfPiece===nobel || gamedata.square[indexOfSquare(vert,abc[i])].typeOfPiece===soldier )){
                            if(action){
                                square.style.border='3px solid red';
                                selectedSquareId.push(squareID);
                                localSquareData[indexOfSquare(vert,abc[i])]={
                                    pieceCanReach:true,
                                };
                            }
                            if(gamedata.square[indexOfSquare(vert,abc[i])].typeOfPiece===nobel && gamedata.square[indexOfSquare(vert,abc[i])].id===4 && action===false){
                                
                                gamedata["player"+non(typeOfPlayer)].threatening=true;
                        audio.play();
                            }
                        }
                        break;
                    }else{
                        if(action && danger(indexOfSquare(vert,abc[i]),action)===false ){
                            square.innerHTML=`<div style="position:absolute; width:${(gameW/8)*0.25}px; height:${(gameW/8)*0.25}px; border-radius:50%; background:green; top:50%; left:50%; transform:translate(-50%,-50%); "  ></div>`;
                            selectedSquareId.push(squareID);
                            localSquareData[indexOfSquare(vert,abc[i])]={
                                pieceCanReach:true,
                            };
                        }
                    }
            }
            // console.log(JSON.parse(JSON.stringify(localSquareData)));

            for( i=hori-1 ; i>=0;i--){
                let squareID='square' + abc[i] + String(vert) ;
                let square=document.getElementById(squareID);
                    if(gamedata.square[indexOfSquare(vert,abc[i])].havePiece){
                        if( danger(indexOfSquare(vert,abc[i]),action)===false && ( gamedata.square[indexOfSquare(vert,abc[i])].typeOfPiece===nobel || gamedata.square[indexOfSquare(vert,abc[i])].typeOfPiece===soldier )){
                            if(action){
                                square.style.border='3px solid red';
                                selectedSquareId.push(squareID);
                                localSquareData[indexOfSquare(vert,abc[i])]={
                                    pieceCanReach:true,
                                };
                            }
                            if(gamedata.square[indexOfSquare(vert,abc[i])].typeOfPiece===nobel && gamedata.square[indexOfSquare(vert,abc[i])].id===4 && action===false){
                                
                                gamedata["player"+non(typeOfPlayer)].threatening=true;
                        audio.play();
                            }
                        }
                        break;
                    }else{
                        if(action && danger(indexOfSquare(vert,abc[i]),action)===false ){
                            square.innerHTML=`<div style="position:absolute; width:${(gameW/8)*0.25}px; height:${(gameW/8)*0.25}px; border-radius:50%; background:green; top:50%; left:50%; transform:translate(-50%,-50%); "  ></div>`;
                            selectedSquareId.push(squareID);
                            localSquareData[indexOfSquare(vert,abc[i])]={
                                pieceCanReach:true,
                            };
                        }
                    }
            }

        }else if(nobelPieces[index]==='knight'){
            let possibleMove = [[vert+2,hori+1],[vert+2,hori-1],[vert+1,hori+2],[vert+1,hori-2],[vert-2,hori+1],[vert-2,hori-1],[vert-1,hori+2],[vert-1,hori-2]];
            for (var v=0;v<possibleMove.length;v++){
                if( possibleMove[v][0]<9 && possibleMove[v][0]>0 && possibleMove[v][1]<8 && possibleMove[v][1]>=0){
                    if(danger(indexOfSquare(possibleMove[v][0],abc[possibleMove[v][1]]),action)===false){
                        let i=possibleMove[v][0];
                        let j=possibleMove[v][1];
                        let squareID='square' + abc[j] + String(i) ;
                        let square=document.getElementById(squareID);
                        if(gamedata.square[indexOfSquare(i,abc[j])].havePiece){
                            if(gamedata.square[indexOfSquare(i,abc[j])].typeOfPiece===nobel || gamedata.square[indexOfSquare(i,abc[j])].typeOfPiece===soldier){
                                if(action){
                                    square.style.border='3px solid red';
                                    selectedSquareId.push(squareID);
                                    localSquareData[indexOfSquare(i,abc[j])]={
                                        pieceCanReach:true,
                                    };
                                }
                                if(gamedata.square[indexOfSquare(i,abc[j])].typeOfPiece===nobel && gamedata.square[indexOfSquare(i,abc[j])].id===4 && action===false){

                                    gamedata["player"+non(typeOfPlayer)].threatening=true;
                        audio.play();
                                }
                            }
                        }else{
                            if(action){
                                square.innerHTML=`<div style="position:absolute; width:${(gameW/8)*0.25}px; height:${(gameW/8)*0.25}px; border-radius:50%; background:green; top:50%; left:50%; transform:translate(-50%,-50%); "  ></div>`;
                                selectedSquareId.push(squareID);
                                localSquareData[indexOfSquare(i,abc[j])]={
                                    pieceCanReach:true,
                                };
                            }
                        }
                    }
                }
            }
        }else if(nobelPieces[index]==='king'){
                let possibleMove = [[vert+1,hori+1],[vert+1,hori-1],[vert+1,hori],[vert,hori-1],[vert,hori+1],[vert-1,hori-1],[vert-1,hori+1],[vert-1,hori]];
                for (var v=0;v<possibleMove.length;v++){
                    if(possibleMove[v][0]<9 && possibleMove[v][0]>0 && possibleMove[v][1]<8 && possibleMove[v][1]>=0){
                        // console.log("position:",possibleMove[v][0],abc[possibleMove[v][1]],'danger:',danger(indexOfSquare(possibleMove[v][0],abc[possibleMove[v][1]]),action));
                        if(danger(indexOfSquare(possibleMove[v][0],abc[possibleMove[v][1]]),action)===false){
                            let i=possibleMove[v][0];
                            let j=possibleMove[v][1];
                            let squareID='square' + abc[j] + String(i) ;
                            let square=document.getElementById(squareID);
                            if(gamedata.square[indexOfSquare(i,abc[j])].havePiece){
                                if(gamedata.square[indexOfSquare(i,abc[j])].typeOfPiece===nobel || gamedata.square[indexOfSquare(i,abc[j])].typeOfPiece===soldier){
                                    if(action){
                                        square.style.border='3px solid red';
                                        selectedSquareId.push(squareID);
                                        localSquareData[indexOfSquare(i,abc[j])]={
                                            pieceCanReach:true,
                                        };
                                    }
                                    // if(gamedata.square[indexOfSquare(i,abc[j])].typeOfPiece===nobel && gamedata.square[indexOfSquare(i,abc[j])].id===4 && action===false){

                                    //     if(typeOfPlayer==="x"){
                                    //         gamedata.playery.numOfCheckmate+=1
                                    //         gamedata.playery.threatening=true;
                                    //     }else if(typeOfPlayer==="y"){
                                    //         // console.log("dddd")
                                    //         gamedata.playerx.numOfCheckmate+=1
                                    //         gamedata.playerx.threatening=true; //use memory
                                    //     }
                                    // }
                                }
                            }else{
                                if(action){
                                    square.innerHTML=`<div style="position:absolute; width:${(gameW/8)*0.25}px; height:${(gameW/8)*0.25}px; border-radius:50%; background:green; top:50%; left:50%; transform:translate(-50%,-50%); "  ></div>`;
                                    selectedSquareId.push(squareID);
                                    localSquareData[indexOfSquare(i,abc[j])]={
                                        pieceCanReach:true,
                                    };
                                }
                            }
                        }
                    }
                }

                if(danger(indexOfSquare(vert,abc[hori]),action)===false  && XSdata.firstmove===false && gamedata['player'+typeOfPlayer]['nobel'+typeOfPlayer][7].firstmove===false && gamedata.square[indexOfSquare(vert,abc[hori+1])].havePiece===false  && gamedata.square[indexOfSquare(vert,abc[hori+2])].havePiece===false  && action ){  //gamedata['player'+typeOfPlayer].numOfCheckmate===0
                    // console.log("yyyyy")
                    if(danger(indexOfSquare(vert,abc[hori+2]),action)===false  && danger(indexOfSquare(vert,abc[hori+1]),action)===false){
                        let squareID='square' + abc[hori+2] + String(vert) ;
                        let square=document.getElementById(squareID);
                        // console.log(indexOfSquare(vert,abc[hori+2]))
                        if(gamedata.square[indexOfSquare(vert,abc[hori+2])].havePiece===false  && action){
                            // console.log("yyyyy")
                            square.innerHTML=`<div style="position:absolute; width:${(gameW/8)*0.25}px; height:${(gameW/8)*0.25}px; border-radius:50%; background:green; top:50%; left:50%; transform:translate(-50%,-50%); "  ></div>`;
                            selectedSquareId.push(squareID);
                            localSquareData[indexOfSquare(vert,abc[hori+2])]={
                                pieceCanReach:true,
                            };
                        }
                    }
                }else if(danger(indexOfSquare(vert,abc[hori]),action)===false && XSdata.firstmove===false && gamedata['player'+typeOfPlayer]['nobel'+typeOfPlayer][0].firstmove===false && gamedata.square[indexOfSquare(vert,abc[hori-1])].havePiece===false && gamedata.square[indexOfSquare(vert,abc[hori-2])].havePiece===false && gamedata.square[indexOfSquare(vert,abc[hori-3])].havePiece===false && action ){ //gamedata['player'+typeOfPlayer].numOfCheckmate===0
                    if(danger(indexOfSquare(vert,abc[hori-2]),action)===false  && danger(indexOfSquare(vert,abc[hori-1]),action)===false){
                        let squareID='square' + abc[hori-2] + String(vert) ;
                        let square=document.getElementById(squareID);
                        // console.log(indexOfSquare(vert,abc[hori+2]))
                        if(gamedata.square[indexOfSquare(vert,abc[hori-2])].havePiece===false){
                            // console.log("yyyyy")
                            square.innerHTML=`<div style="position:absolute; width:${(gameW/8)*0.25}px; height:${(gameW/8)*0.25}px; border-radius:50%; background:green; top:50%; left:50%; transform:translate(-50%,-50%); "  ></div>`;
                            selectedSquareId.push(squareID);
                            localSquareData[indexOfSquare(vert,abc[hori-2])]={
                                pieceCanReach:true,
                            };
                        }
                    }
                }
        }
    }else if(type!==typeOfPlayer){   //!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
        squareClick(indexOfSquare(XYdata.vertical,XYdata.horizontal),XYdata.vertical,abc.indexOf(XYdata.horizontal, 0),XYdata,"nobel",index)
        // console.log('---',XYdata.vertical,XYdata.horizontal,"---")
    }
}

var XSClick=(index,type,action)=>{
    // console.log(index,type)
    if(typeOfPlayer==='x'){
        var XSdata=gamedata.playerx.soldierx[index];
        // console.log("x",gamedata.playerx.soldierx[index])
        var XYdata=gamedata.playery.soldiery[index];
        var canplay=gamedata.playerx.canClick
        var c=1
        var soldier="soldiery"
        var nobel='nobely'
    }else if(typeOfPlayer==='y'){
        var XSdata=gamedata.playery.soldiery[index];
        // console.log("y",gamedata.playery.soldiery[index])
        var XYdata=gamedata.playerx.soldierx[index];
        var canplay=gamedata.playery.canClick
        var c=-1
        var soldier="soldierx"
        var nobel='nobelx'
    }

    if( canplay && type===typeOfPlayer && !gameOver){
        if(action){
            for(var i=0;i<selectedSquareId.length;i++){
                let square=document.getElementById(selectedSquareId[i]);
                square.style.border="none";
                square.innerHTML="";
            }
        }


        var squareID='square'+XSdata.horizontal+String(XSdata.vertical);
        // console.log("--------------------------")
        // console.log("square id : ",squareID);
        // console.log("xsdata : ",XSdata)
        var square=document.getElementById(squareID)
        square.style.border="3px solid green";
        selectedSquareId.push(squareID);
        let vert=XSdata.vertical;
        let hori=abc.indexOf(XSdata.horizontal,0);
        // let horiz=XSdata.horizontal;
        let possibleMove=[[vert+c,hori+1],[vert+2*c,hori+1],[vert+c,hori],[vert+c,hori+2]];
        // console.log(possibleMove);
        let st=0

        if(action){
            gamedata["player"+typeOfPlayer].selectedpiece={
                typeOfPiece:'soldier',
                id:index,
                indexofsquare:indexOfSquare(vert,XSdata.horizontal)
            }
            for(var i=0;i<8*8;i++){
                localSquareData[i].pieceCanReach=false;
            }
        }

        // console.log("possible move : ",possibleMove);
        // console.log("--------------------------")
        for(var i=0;i<possibleMove.length;i++){
            // console.log(gamedata.square[indexOfSquare(3,"E")])
            // console.log(possibleMove[i][0],abc[possibleMove[i][1] - 1]);
            // console.log( danger(indexOfSquare(possibleMove[i][0],abc[possibleMove[i][1] - 1]))===false && possibleMove[i][0]>0 && possibleMove[i][0]<9 && possibleMove[i][1]<9 && possibleMove[i][1]>0 )
            if( possibleMove[i][0]>0 && possibleMove[i][0]<9 && possibleMove[i][1]<9 && possibleMove[i][1]>0 ){
                // console.log(possibleMove);
                // console.log("iiiiii+++iiiiiiii",i)
                st+=1
                let squareID='square' + abc[possibleMove[i][1] - 1] + String(possibleMove[i][0]) ;
                let square=document.getElementById(squareID);


                if(danger(indexOfSquare(possibleMove[i][0],abc[possibleMove[i][1] - 1]),action)===false && i >= possibleMove.length-2 && gamedata.square[indexOfSquare(possibleMove[i][0],abc[possibleMove[i][1] - 1])].havePiece && (gamedata.square[indexOfSquare(possibleMove[i][0],abc[possibleMove[i][1] - 1])].typeOfPiece===nobel || gamedata.square[indexOfSquare(possibleMove[i][0],abc[possibleMove[i][1] - 1])].typeOfPiece===soldier  )){
                    
                    // console.log("gggggggggggg")
                    if(action){
                        square.style.border='3px solid red';
                        selectedSquareId.push(squareID);
                        localSquareData[indexOfSquare(possibleMove[i][0],abc[possibleMove[i][1] - 1])]={
                            pieceCanReach:true,
                        };
                    }
                    
                    if(gamedata.square[indexOfSquare(possibleMove[i][0],abc[possibleMove[i][1] - 1])].typeOfPiece===nobel && gamedata.square[indexOfSquare(possibleMove[i][0],abc[possibleMove[i][1] - 1])].id===4 && action===false){
                        gamedata["player"+non(typeOfPlayer)].threatening=true;
                        audio.play();
                    }
                }

                if(XSdata.firstmove==false && action ){
                    if(gamedata.square[indexOfSquare(vert+2*c,abc[hori])].havePiece && gamedata.square[indexOfSquare(vert+c,abc[hori])].havePiece==false   && st<2){

                        st+=1

                        if(danger(indexOfSquare(possibleMove[i][0],abc[possibleMove[i][1] - 1]),action)===false){
                            
                            square.innerHTML=`<div style="position:absolute; width:${(gameW/8)*0.25}px; height:${(gameW/8)*0.25}px; border-radius:50%; background:green; top:50%; left:50%; transform:translate(-50%,-50%); "  ></div>`;
                            selectedSquareId.push(squareID);
                            localSquareData[indexOfSquare(possibleMove[i][0],abc[hori])]={
                                pieceCanReach:true,
                            };
                        }
                        
                    }else if(danger(indexOfSquare(possibleMove[i][0],abc[possibleMove[i][1] - 1]),action)===false && gamedata.square[indexOfSquare(vert+c,abc[hori])].havePiece==false && st<3){
                        
                       
                        square.innerHTML=`<div style="position:absolute; width:${(gameW/8)*0.25}px; height:${(gameW/8)*0.25}px; border-radius:50%; background:green; top:50%; left:50%; transform:translate(-50%,-50%); "  ></div>`;
                        selectedSquareId.push(squareID);
                        localSquareData[indexOfSquare(possibleMove[i][0],abc[hori])]={
                            pieceCanReach:true,
                        };
                    }
                }else if(XSdata.firstmove && action){
                    if( gamedata.square[indexOfSquare(vert+c,abc[hori])].havePiece==false  && st<2){
                        // console.log('ff')
                        st+=1
                        i+=1
                        // console.log(possibleMove[i][0],' ',abc[possibleMove[i][1] - 1],' ',indexOfSquare(possibleMove[i][0],abc[possibleMove[i][1] - 1]));
                        // console.log(XSdata);
                        let y =possibleMove[i][0],x=abc[possibleMove[i][1] - 1] ;
                        if(y >0 && y<9 && x <"I" && x >="A"){
                            if(danger(indexOfSquare(y,x),action)===false){
                            
                                square.innerHTML=`<div style="position:absolute; width:${(gameW/8)*0.25}px; height:${(gameW/8)*0.25}px; border-radius:50%; background:green; top:50%; left:50%; transform:translate(-50%,-50%); "  ></div>`;
                                selectedSquareId.push(squareID);
                                localSquareData[indexOfSquare(vert+c,abc[hori])]={
                                    pieceCanReach:true,
                                };
                            }
                        }
                        
                    }
                }
            }
        }



    }else if(type!==typeOfPlayer && action){   //!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
        squareClick(indexOfSquare(XYdata.vertical,XYdata.horizontal),XYdata.vertical,abc.indexOf(XYdata.horizontal, 0),XYdata,"soldier",index)
        // console.log('---',XYdata.vertical,XYdata.horizontal,"---")
    }

}

// -------------------------------  castling --------------------------------------------------------------

var shortCastling=(kingID,rookID,time)=>{
    let ii=null;
    const king = document.getElementById(kingID); 
    const rook = document.getElementById(rookID);

    let leftReachRook=5*(gameW/8);
    let leftReachKing=6*(gameW/8);

    let r=7*(gameW/8);
    let k=4*(gameW/8);

    let dxr=(leftReachRook-r)/20;
    let dxk=(leftReachKing-k)/20;

    clearInterval(ii);
    ii = setInterval(frame0, time);
    function frame0() {
        // console.log(Math.abs(posy),Math.abs(reachTop))
        // console.log(i);
      if(Math.round(Math.abs(r)) == Math.round(leftReachRook) && Math.round(Math.abs(k))==Math.round(leftReachKing)) {
        clearInterval(ii);
      }else {
        r+=dxr;
        k+=dxk;
        king.style.left=`${k}px`;
        rook.style.left=`${r}px`;
      }
    }
}

var longCastling=(kingID,rookID,time)=>{
    let ii=null;
    const king = document.getElementById(kingID); 
    const rook = document.getElementById(rookID);

    let leftReachRook=3*(gameW/8);
    let leftReachKing=2*(gameW/8);

    let r=0;
    let k=4*(gameW/8);

    let dxr=leftReachRook/20;
    let dxk=(leftReachKing-k)/20;

    clearInterval(ii);
    ii = setInterval(frame0, time);
    function frame0() {
        // console.log(Math.abs(posy),Math.abs(reachTop))
        // console.log(i);
      if(Math.round(Math.abs(r)) == Math.round(leftReachRook) && Math.round(Math.abs(k))==Math.round(leftReachKing)) {
        clearInterval(ii);
      }else {
        r+=dxr;
        k+=dxk;
        king.style.left=`${k}px`;
        rook.style.left=`${r}px`;
      }
    }
}


// --------------------------------  square click -----------------------------------------------------------

// localSquareData.push({
//     pieceCanReach:false,
//     typeOfPiece:"",
//     id:-1 
// });


var promotion={
    id:-1,
    ID:-1
}
var beginoftimer=false;
var squareClick=(index,top,left,deadPiece,typeofdead,indexofpiece)=>{
    if(localSquareData[index].pieceCanReach){
        gamedata["player"+typeOfPlayer].threatening=false;
        if(!beginoftimer){
            GoTimer(true,"y");
            beginoftimer=true;
        }else{
            GoTimer(false,typeOfPlayer);
            GoTimer(true,non(typeOfPlayer));
            if(typeOfPlayer==='x'){
                xtmr+=5;
                xTMR[tmrid].innerHTML=`${Math.floor(xtmr/60)}:${Math.floor(xtmr%60)}`;
            }else if(typeOfPlayer==='y'){
                ytmr+=5;
                yTMR[tmrid].innerHTML=`${Math.floor(ytmr/60)}:${Math.floor(ytmr%60)}`;
            }
        }
        if(kingIDD!==null){
            kingIDD.style.border='none';
        }
        let SP=gamedata['player'+typeOfPlayer].selectedpiece
        // console.log(left)
        gamedata.square[gamedata["player"+typeOfPlayer].selectedpiece.indexofsquare].havePiece=false
        for(var i=0;i<8*8;i++){
            localSquareData[i].pieceCanReach=false;
        }
        // console.log(localSquareData);

        let pieceID=SP.typeOfPiece+ typeOfPlayer + String(SP.id);
        // console.log("top:",top,'left:',left)
        // console.log(deadPiece)
        let vert0=gamedata['player'+typeOfPlayer][SP.typeOfPiece+ typeOfPlayer][SP.id].vertical
        let top0=(8-vert0)*(gameW/8)
        let hori0=abc.indexOf(gamedata['player'+typeOfPlayer][SP.typeOfPiece+ typeOfPlayer][SP.id].horizontal,0)
        let left0=hori0*(gameW/8)

        // console.log(SP.typeOfPiece==='nobel' && SP.id==4  && left==6 && gamedata['player'+typeOfPlayer]['nobel'+typeOfPlayer][SP.id].firstmove===false && gamedata['player'+typeOfPlayer]['nobel'+typeOfPlayer][7].firstmove===false)
        

        if(SP.typeOfPiece==='nobel' && SP.id==4  && left==6 && gamedata['player'+typeOfPlayer]['nobel'+typeOfPlayer][SP.id].firstmove===false && gamedata['player'+typeOfPlayer]['nobel'+typeOfPlayer][7].firstmove===false && gamedata.square[indexOfSquare(top,abc[left])].havePiece===false && gamedata.square[indexOfSquare(top,abc[left-1])].havePiece===false ){
            let verrt=typeOfPlayer==='x'?1:8;
            gamedata.square[indexOfSquare(verrt,"H")].havePiece=false
            gamedata.square[indexOfSquare(verrt,"F")]={
                havePiece:true,
                typeOfPiece:'nobel' + typeOfPlayer,
                id:7,
            };
            gamedata["player" + typeOfPlayer]['nobel' + typeOfPlayer][7]={
                vertical:verrt,
                horizontal:'F',
                life:true,
                firstmove:false
            };


            let rookID="nobel"+typeOfPlayer+"7" ;
            shortCastling(pieceID,rookID,15);
        }else if(SP.typeOfPiece==='nobel' && SP.id==4  && left==2 && gamedata['player'+typeOfPlayer]['nobel'+typeOfPlayer][SP.id].firstmove===false && gamedata['player'+typeOfPlayer]['nobel'+typeOfPlayer][0].firstmove===false && gamedata.square[indexOfSquare(top,abc[left])].havePiece===false && gamedata.square[indexOfSquare(top,abc[left-1])].havePiece===false && gamedata.square[indexOfSquare(top,abc[left+1])].havePiece===false  ){
            let verrt=typeOfPlayer==='x'?1:8;
            gamedata.square[indexOfSquare(verrt,"A")].havePiece=false
            gamedata.square[indexOfSquare(verrt,"D")]={
                havePiece:true,
                typeOfPiece:'nobel' + typeOfPlayer,
                id:0,
            };
            gamedata["player" + typeOfPlayer]['nobel' + typeOfPlayer][0]={
                vertical:verrt,
                horizontal:'D',
                life:true,
                firstmove:false
            };


            let rookID="nobel"+typeOfPlayer+"0" ;
            longCastling(pieceID,rookID,15);
        }else{
            MovePiece(pieceID,top0,left0,(8-top)*(gameW/8),left*(gameW/8),15);
            if(typeOfPlayer==="x"){
                UserData.coordinate=`${String.fromCharCode(97+hori0)}${vert0}-${String.fromCharCode(97+left)}${top}-0-0-0`;
            }
            // console.log("--------",String.fromCharCode(97+hori0),'-',vert0,'-',String.fromCharCode(97+left),'-',top);
        }


        if(SP.typeOfPiece==='soldier' && (top==1 || top==8) ){
            promotion={
                id:SP.id,
                ID:pieceID
            };
            for(var w=0;w<4;w++){
                promotiondiv.innerHTML+=`<img onclick="pawnPromotion('${nobelPieces[w]}','${typeOfPlayer}')" src="./assets/${nobelPieces[w]+typeOfPlayer}.png" />`;
            }
            promotiondiv.style.display="grid";
        }
        
        // let piece=document.getElementById(pieceID);
        // piece.style.top=`${(8-top)*(gameW/8)}px`;
        // piece.style.left=`${left*(gameW/8)}px`;

        gamedata.square[index]={
            havePiece:true,
            typeOfPiece:SP.typeOfPiece + typeOfPlayer,
            id:SP.id,
        }

        // console.log("--- top:",top,'left:',abc[left])
        gamedata["player" + typeOfPlayer][SP.typeOfPiece + typeOfPlayer][SP.id]={
            vertical:top,
            horizontal:abc[left],
            life:true,
            firstmove:true
        };

        if(SP.typeOfPiece==='soldier'){
            XSClick(SP.id,typeOfPlayer,false);
        }else{
            XNClick(SP.id,typeOfPlayer,false);
        }

        // console.log('soldier data : ',gamedata["player" + typeOfPlayer][SP.typeOfPiece + typeOfPlayer][SP.id])

        for(var i=0;i<selectedSquareId.length;i++){
            let square=document.getElementById(selectedSquareId[i]);
            square.style.border="none";
            square.innerHTML="";
        }

        if(typeof(deadPiece)==='object'){
            let tpofplyr='x'
            if(typeOfPlayer==='x'){
                tpofplyr='y'
            }else if(typeOfPlayer==='y'){
                tpofplyr='x'
            }
            const deadPieceId=typeofdead+tpofplyr+String(indexofpiece)
            deadPiece.life=false;

            hidePiece(deadPieceId,15);

            if(typeofdead==="nobel"){
                var deadPiecePic='./assets/'+nobelPieces[indexofpiece]+tpofplyr+".png"
            }else{
                var deadPiecePic='./assets/pawn'+tpofplyr+".png"
            }
            gamedata.death["dead"+tpofplyr].push(deadPiecePic);
            // console.log(deadPieceId)
        }


        //#################  checkwin #########################

        typeOfPlayer=non(typeOfPlayer);


        let st=true;
        for(let j=0;j<nobelPieces.length;j++){
            if(gamedata["player"+typeOfPlayer]['nobel'+typeOfPlayer][j]!=undefined){
                if(gamedata["player"+typeOfPlayer]['nobel'+typeOfPlayer][j].life){
                    // console.log(checkWin0(j,typeOfPlayer,true))
                    st = checkWin0(j,typeOfPlayer,true) && st
                }
            }
        }

        if(st){
            for(let j=0;j<8;j++ ){
                if(gamedata["player"+typeOfPlayer]['soldier'+typeOfPlayer][j].life){
                    // console.log(checkWin1(j,typeOfPlayer,true))
                    st = checkWin1(j,typeOfPlayer,true) && st
                }
            }
        }

        typeOfPlayer=non(typeOfPlayer);

        // console.log('----------------------------------')

        if(st){
            win.style.display='flex';
            gameOver=true;
            if(typeOfPlayer==="x"){
                winMsg.innerHTML=xName+"'s win !"
            }else if(typeOfPlayer==="y"){
                winMsg.innerHTML=yName+"'s win !"
            }
        }

        //########################################################



        // somethingClicked=false
        if(typeOfPlayer==='x'){
            gamedata.playerx.canClick=false
            gamedata.playery.canClick=true
            typeOfPlayer='y'
        }else if(typeOfPlayer==='y'){
            gamedata.playery.canClick=false
            gamedata.playerx.canClick=true
            typeOfPlayer='x'
        }


        // console.log(localSquareData); 
    }
}

//----------------------- promotion -----------------------------------------------------------
var pawnPromotion=(nblpiece,typplyr)=>{
    // console.log(typplyr)
    let pieceID=document.getElementById(promotion.ID);
    pieceID.src='./assets/'+nblpiece+typplyr+'.png'
    let id=gamedata['player'+typplyr]['nobel'+typplyr].length;
    // pieceID.onclick=XNClick(id,typeOfPlayer);
    nobelPieces.push(nblpiece);
    pieceID.addEventListener('click',()=>{
        XNClick(id,typplyr,true);
    });
    pieceID.id='nobel'+typplyr+String(id);
    // console.log(gamedata['player'+typeOfPlayer]['soldier'+typeOfPlayer][promotion.id])
    gamedata['player'+typplyr]['nobel'+typplyr].push(gamedata['player'+typplyr]['soldier'+typplyr][promotion.id]);
    promotiondiv.style.display="none";












    //#################  checkwin #########################

    typeOfPlayer=non(typeOfPlayer);


    let st=true;
    for(let j=0;j<nobelPieces.length;j++){
        if(gamedata["player"+typeOfPlayer]['nobel'+typeOfPlayer][j]!=undefined){
            if(gamedata["player"+typeOfPlayer]['nobel'+typeOfPlayer][j].life){
                // console.log(checkWin0(j,typeOfPlayer,true))
                st = checkWin0(j,typeOfPlayer,true) && st
            }
        }
    }

    if(st){
        for(let j=0;j<8;j++ ){
            if(gamedata["player"+typeOfPlayer]['soldier'+typeOfPlayer][j].life){
                // console.log(checkWin1(j,typeOfPlayer,true))
                st = checkWin1(j,typeOfPlayer,true) && st
            }
        }
    }

    typeOfPlayer=non(typeOfPlayer);

    // console.log('----------------------------------')
}
//----------------------- show dead -----------------------------------------------------------

var displayState=true
const deadx=document.getElementById('deathx');
const deady=document.getElementById('deathy');
if(typeOfPlayer==="x"){
    deadx.style.background="#007c0080";
    deady.style.background="#a5000099";
}else if(typeOfPlayer==="y"){
    deady.style.background="#007c0080";
    deadx.style.background="#a5000099";
}else{
    deady.style.background="#007c7c80";
    deadx.style.background="#007c7c80";
}

var showDead=()=>{
    displayState=!displayState;
    const deathDiv=document.getElementById("death");
    if(displayState){
        deathDiv.style.display='none'
    }else{
        deathDiv.style.display='flex'
        let deathpicsx=gamedata.death.deadx;
        let deathpicsy=gamedata.death.deady;
    

        deadx.innerHTML="";
        deady.innerHTML="";
        for(let x = 0 ; x<deathpicsx.length ; x++){
            deadx.innerHTML+=`<img  src=${deathpicsx[x]} style="width:${gameW/8}px;" />`;
        }

        for(let y = 0 ; y<deathpicsy.length ; y++){
            deady.innerHTML+=`<img  src=${deathpicsy[y]} style="width:${gameW/8}px;" />`;
        }
    }
}

//-----------------------   pointer control position x y ------------------------------------

const ele = document.getElementById('Maside');
    ele.style.cursor = 'grab';

    let pos = { x: 0, y: 0 };
    let ddx=0
    let ddy=0
    let mouseState=false

    const mouseDownHandler = function (e) {
        ele.style.cursor = 'grabbing';
        ele.style.userSelect = 'none';

        pos = {
            x: e.clientX,
            y: e.clientY,
        };

        document.addEventListener('mousemove', mouseMoveHandler);
        document.addEventListener('mouseup', mouseUpHandler);
    };

    const mouseMoveHandler = function (e) {
        // How far the mouse has been moved
        var dx = e.clientX - pos.x;
        var dy = e.clientY - pos.y;

        dx=dx+ddx
        dy=dy+ddy



        // Scroll the element
        r.style.setProperty('--cube-rotate-x', (-dy/3 + 40 ) + 'deg');
        r.style.setProperty('--cube-rotate-z', (-dx/3) + 'deg');


    };

    const mouseUpHandler = function (e) {
        mouseState=true
        ele.style.cursor = 'grab';
        ele.style.removeProperty('user-select');

        const dx = e.clientX - pos.x;
        const dy = e.clientY - pos.y;

        ddx+=dx
        ddy+=dy

        document.removeEventListener('mousemove', mouseMoveHandler);
        document.removeEventListener('mouseup', mouseUpHandler);
    };

    // Attach the handler
    ele.addEventListener('mousedown', mouseDownHandler);



































    var checkWin1=(index,type,action)=>{
        return false ;
        // console.log(index,type)
        let lose=true;
        if(typeOfPlayer==='x'){
            var XSdata=gamedata.playerx.soldierx[index];
            // console.log("x",gamedata.playerx.soldierx[index])
            var XYdata=gamedata.playery.soldiery[index];
            var canplay=gamedata.playerx.canClick
            var c=1
            var soldier="soldiery"
            var nobel='nobely'
        }else if(typeOfPlayer==='y'){
            var XSdata=gamedata.playery.soldiery[index];
            // console.log("y",gamedata.playery.soldiery[index])
            var XYdata=gamedata.playerx.soldierx[index];
            var canplay=gamedata.playery.canClick
            var c=-1
            var soldier="soldierx"
            var nobel='nobelx'
        }


        if( !canplay && type===typeOfPlayer && !gameOver){
    
    
            var squareID='square'+XSdata.horizontal+String(XSdata.vertical);
            // // console.log("--------------------------")
            // // console.log("square id : ",squareID);
            // // console.log("xsdata : ",XSdata)
            // var square=document.getElementById(squareID)
            // square.style.border="3px solid green";
            selectedSquareId.push(squareID);
            let vert=XSdata.vertical;
            let hori=abc.indexOf(XSdata.horizontal,0);
            // let horiz=XSdata.horizontal;
            let possibleMove=[[vert+c,hori+1],[vert+2*c,hori+1],[vert+c,hori],[vert+c,hori+2]];
            let st=0


            gamedata["player"+typeOfPlayer].selectedpiece={
                typeOfPiece:'soldier',
                id:index,
                indexofsquare:indexOfSquare(vert,XSdata.horizontal)
            }


            // console.log("possible move : ",possibleMove);
            // console.log("--------------------------")
            for(var i=0;i<possibleMove.length;i++){
                // console.log(gamedata.square[indexOfSquare(3,"E")])
                // console.log(possibleMove[i][0],abc[possibleMove[i][1] - 1]);
                // console.log( danger(indexOfSquare(possibleMove[i][0],abc[possibleMove[i][1] - 1]))===false && possibleMove[i][0]>0 && possibleMove[i][0]<9 && possibleMove[i][1]<9 && possibleMove[i][1]>0 )
                if( possibleMove[i][0]>0 && possibleMove[i][0]<9 && possibleMove[i][1]<9 && possibleMove[i][1]>0 ){
                    
                    // console.log("iiiiii+++iiiiiiii",i)
                    st+=1
    
                    if(danger(indexOfSquare(possibleMove[i][0],abc[possibleMove[i][1] - 1]),action)===false && i >= possibleMove.length-2 && gamedata.square[indexOfSquare(possibleMove[i][0],abc[possibleMove[i][1] - 1])].havePiece && (gamedata.square[indexOfSquare(possibleMove[i][0],abc[possibleMove[i][1] - 1])].typeOfPiece===nobel || gamedata.square[indexOfSquare(possibleMove[i][0],abc[possibleMove[i][1] - 1])].typeOfPiece===soldier  )){
                        lose=false ;
                    }
    
                    if(XSdata.firstmove==false && action ){
                        if(gamedata.square[indexOfSquare(vert+2*c,abc[hori])].havePiece && gamedata.square[indexOfSquare(vert+c,abc[hori])].havePiece==false   && st<2){
    
                            st+=1
    
                            if(danger(indexOfSquare(possibleMove[i][0],abc[possibleMove[i][1] - 1]),action)===false){
                                
                                lose=false ;
                            }
                            
                        }else if(danger(indexOfSquare(possibleMove[i][0],abc[possibleMove[i][1] - 1]),action)===false && gamedata.square[indexOfSquare(vert+c,abc[hori])].havePiece==false && st<3){
                            
                            lose=false ;
                        }
                    }else if(XSdata.firstmove && action){
                        if( gamedata.square[indexOfSquare(vert+c,abc[hori])].havePiece==false  && st<2){
                            // console.log('ff')
                            st+=1
                            i+=1
    
                            if(danger(indexOfSquare(possibleMove[i][0],abc[possibleMove[i][1] - 1]),action)===false){
                                
                                lose=false ;
                            }
                            
                        }
                    }
                }
            }
    
    
    
        }



        return lose ;
    
    }





































































    var checkWin0=(index,type,action)=>{
        return false ;
        let lose=true;
        
        if(typeOfPlayer==='x'){
            var XSdata=gamedata.playerx.nobelx[index];
            // console.log(index);
            // console.log(XSdata);
            // console.log("x",gamedata.playerx.soldierx[index])
            var XYdata=gamedata.playery.nobely[index];
            var canplay=gamedata.playerx.canClick
            var c=1
            var soldier="soldiery"
            var nobel='nobely'
        }else if(typeOfPlayer==='y'){
            var XSdata=gamedata.playery.nobely[index];
            // console.log("y",gamedata.playery.soldiery[index])
            var XYdata=gamedata.playerx.nobelx[index];
            var canplay=gamedata.playery.canClick
            var c=-1
            var soldier="soldierx"
            var nobel='nobelx'
        }
        if( !canplay && type===typeOfPlayer && !gameOver){
            // console.log('gggggggggggggggg')
    
            let vert=XSdata.vertical;
            let hori=abc.indexOf(XSdata.horizontal,0);

            gamedata["player"+typeOfPlayer].selectedpiece={
                typeOfPiece:'nobel',
                id:index,
                indexofsquare:indexOfSquare(vert,XSdata.horizontal)
            }
    
            // console.log(vert,hori)
    
            if(nobelPieces[index]==='rook'){
                for(var i=vert+1 ; i<=8;i++){
                    if(gamedata.square[indexOfSquare(i,XSdata.horizontal)].havePiece){
                        if(danger(indexOfSquare(i,XSdata.horizontal),action)===false && ( gamedata.square[indexOfSquare(i,XSdata.horizontal)].typeOfPiece===nobel || gamedata.square[indexOfSquare(i,XSdata.horizontal)].typeOfPiece===soldier)){
                            lose=false;
                        }
                        break;
                    }else{
                        if(danger(indexOfSquare(i,XSdata.horizontal),action)===false){
                            lose=false;
                        }
                    }
                }
    
                for(var i=vert-1 ; i>0;i--){
                        if(gamedata.square[indexOfSquare(i,XSdata.horizontal)].havePiece){
                            if(danger(indexOfSquare(i,XSdata.horizontal),action)===false && ( gamedata.square[indexOfSquare(i,XSdata.horizontal)].typeOfPiece===nobel || gamedata.square[indexOfSquare(i,XSdata.horizontal)].typeOfPiece===soldier)){
                                lose=false;
                            }
                            break;
                        }else{
                            if(danger(indexOfSquare(i,XSdata.horizontal),action)===false){
                                lose=false;
                            }
                        }
                }
    
                for(var i=hori+1 ; i<8;i++){
                        if(gamedata.square[indexOfSquare(vert,abc[i])].havePiece){
                            if(  danger(indexOfSquare(vert,abc[i]),action)===false && (gamedata.square[indexOfSquare(vert,abc[i])].typeOfPiece===nobel || gamedata.square[indexOfSquare(vert,abc[i])].typeOfPiece===soldier)){
                                lose=false;
                            }
                            break;
                        }else{
                            if(danger(indexOfSquare(vert,abc[i]),action)===false){
                                lose=false;
                            }
                        }
                }
    
                for(var i=hori-1 ; i>=0;i--){
                    if(gamedata.square[indexOfSquare(vert,abc[i])].havePiece){
                        if(  danger(indexOfSquare(vert,abc[i]),action)===false && (gamedata.square[indexOfSquare(vert,abc[i])].typeOfPiece===nobel || gamedata.square[indexOfSquare(vert,abc[i])].typeOfPiece===soldier)){
                            lose=false;
                        }
                        break;
                    }else{
                        if(danger(indexOfSquare(vert,abc[i]),action)===false){
                            lose=false;
                        }
                    }
                }
            }else if(nobelPieces[index]==='bishop'){
                let i=vert+1
                let j=hori+1
                while(i<9 && j<8){
                        if(gamedata.square[indexOfSquare(i,abc[j])].havePiece){
                            if( danger(indexOfSquare(i,abc[j]),action)===false && ( gamedata.square[indexOfSquare(i,abc[j])].typeOfPiece===nobel || gamedata.square[indexOfSquare(i,abc[j])].typeOfPiece===soldier)){
                                lose=false;
                            }
                            break;
                        }else{
                            if(danger(indexOfSquare(i,abc[j]),action)===false){
                                lose=false;
                            }
                        }
    
                    j++
                    i++
                }
    
                i=vert-1
                j=hori-1
                while(i>0 && j>=0){
    
                    // console.log(i,j)
    
                    if(gamedata.square[indexOfSquare(i,abc[j])].havePiece){
                        if( danger(indexOfSquare(i,abc[j]),action)===false && ( gamedata.square[indexOfSquare(i,abc[j])].typeOfPiece===nobel || gamedata.square[indexOfSquare(i,abc[j])].typeOfPiece===soldier)){
                            lose=false;
                        }
                        break;
                    }else{
                        if(danger(indexOfSquare(i,abc[j]),action)===false){
                            lose=false;
                        }
                    }
    
                    j--
                    i--
                }
    
                i=vert+1
                j=hori-1
                while(i<9 && j>=0){
    
                    if(gamedata.square[indexOfSquare(i,abc[j])].havePiece){
                        if( danger(indexOfSquare(i,abc[j]),action)===false && ( gamedata.square[indexOfSquare(i,abc[j])].typeOfPiece===nobel || gamedata.square[indexOfSquare(i,abc[j])].typeOfPiece===soldier)){
                            lose=false;
                        }
                        break;
                    }else{
                        if(danger(indexOfSquare(i,abc[j]),action)===false){
                            lose=false;
                        }
                    }
    
                    j--
                    i++
                }
    
                i=vert-1
                j=hori+1
                while(i>0 && j<8){
    
                    if(gamedata.square[indexOfSquare(i,abc[j])].havePiece){
                            if( danger(indexOfSquare(i,abc[j]),action)===false && ( gamedata.square[indexOfSquare(i,abc[j])].typeOfPiece===nobel || gamedata.square[indexOfSquare(i,abc[j])].typeOfPiece===soldier)){
                                lose=false;
                            }
                            break;
                        }else{
                            if(danger(indexOfSquare(i,abc[j]),action)===false){
                                lose=false;
                            }
                        }
    
                    j++
                    i--
                }
            }else if(nobelPieces[index]==='queen'){
                let i=vert+1
                let j=hori+1
                while(i<9 && j<8){
    
                    if(gamedata.square[indexOfSquare(i,abc[j])].havePiece){
                            if( danger(indexOfSquare(i,abc[j]),action)===false && ( gamedata.square[indexOfSquare(i,abc[j])].typeOfPiece===nobel || gamedata.square[indexOfSquare(i,abc[j])].typeOfPiece===soldier)){
                                lose=false;
                            }
                            break;
                        }else{
                            if(danger(indexOfSquare(i,abc[j]),action)===false){
                                lose=false;
                            }
                        }
    
                    j++
                    i++
                }
    
                i=vert-1
                j=hori-1
                while(i>0 && j>=0){
    
                    // console.log(i,j)
    
                    if(gamedata.square[indexOfSquare(i,abc[j])].havePiece){
                            if( danger(indexOfSquare(i,abc[j]),action)===false && ( gamedata.square[indexOfSquare(i,abc[j])].typeOfPiece===nobel || gamedata.square[indexOfSquare(i,abc[j])].typeOfPiece===soldier)){
                                lose=false;
                            }
                            break;
                        }else{
                            if(danger(indexOfSquare(i,abc[j]),action)===false){
                                lose=false;
                            }
                        }
    
                    j--
                    i--
                }
    
                i=vert+1
                j=hori-1
                while(i<9 && j>=0){
    
                    if(gamedata.square[indexOfSquare(i,abc[j])].havePiece){
                            if( danger(indexOfSquare(i,abc[j]),action)===false && ( gamedata.square[indexOfSquare(i,abc[j])].typeOfPiece===nobel || gamedata.square[indexOfSquare(i,abc[j])].typeOfPiece===soldier)){
                                lose=false;
                            }
                            break;
                        }else{
                            if(danger(indexOfSquare(i,abc[j]),action)===false){
                                lose=false;
                            }
                        }
    
                    j--
                    i++
                }
    
                i=vert-1
                j=hori+1
                while(i>0 && j<8){
    
                    if(gamedata.square[indexOfSquare(i,abc[j])].havePiece){
                            if( danger(indexOfSquare(i,abc[j]),action)===false && ( gamedata.square[indexOfSquare(i,abc[j])].typeOfPiece===nobel || gamedata.square[indexOfSquare(i,abc[j])].typeOfPiece===soldier)){
                                lose=false;
                            }
                            break;
                        }else{
                            if(danger(indexOfSquare(i,abc[j]),action)===false){
                                lose=false;
                            }
                        }
    
                    j++
                    i--
                }
    
    
    
                for( i=vert+1 ; i<=8;i++){
                    if(gamedata.square[indexOfSquare(i,XSdata.horizontal)].havePiece){
                        if(danger(indexOfSquare(i,XSdata.horizontal),action)===false && ( gamedata.square[indexOfSquare(i,XSdata.horizontal)].typeOfPiece===nobel || gamedata.square[indexOfSquare(i,XSdata.horizontal)].typeOfPiece===soldier)){
                            lose=false;
                        }
                        break;
                    }else{
                        if(danger(indexOfSquare(i,XSdata.horizontal),action)===false){
                            lose=false;
                        }
                    }
                }
    
                for( i=vert-1 ; i>0;i--){
                        if(gamedata.square[indexOfSquare(i,XSdata.horizontal)].havePiece){
                            if(danger(indexOfSquare(i,XSdata.horizontal),action)===false && ( gamedata.square[indexOfSquare(i,XSdata.horizontal)].typeOfPiece===nobel || gamedata.square[indexOfSquare(i,XSdata.horizontal)].typeOfPiece===soldier)){
                                lose=false;
                            }
                            break;
                        }else{
                            if(danger(indexOfSquare(i,XSdata.horizontal),action)===false){
                                lose=false;
                            }
                        }
                }
    
                for( i=hori+1 ; i<8;i++){
                        if(gamedata.square[indexOfSquare(vert,abc[i])].havePiece){
                            if( danger(indexOfSquare(vert,abc[i]),action)===false && (gamedata.square[indexOfSquare(vert,abc[i])].typeOfPiece===nobel || gamedata.square[indexOfSquare(vert,abc[i])].typeOfPiece===soldier)){
                                lose=false;
                            }
                            break;
                        }else{
                            if(danger(indexOfSquare(vert,abc[i]),action)===false){
                                lose=false;
                            }
                        }
                }
    
                for( i=hori-1 ; i>=0;i--){
                    if(gamedata.square[indexOfSquare(vert,abc[i])].havePiece){
                        if(  danger(indexOfSquare(vert,abc[i]),action)===false && (gamedata.square[indexOfSquare(vert,abc[i])].typeOfPiece===nobel || gamedata.square[indexOfSquare(vert,abc[i])].typeOfPiece===soldier)){
                            lose=false;
                        }
                        break;
                    }else{
                        if(danger(indexOfSquare(vert,abc[i]),action)===false){
                            lose=false;
                        }
                    }
                }
    
            }else if(nobelPieces[index]==='knight'){
                let possibleMove = [[vert+2,hori+1],[vert+2,hori-1],[vert+1,hori+2],[vert+1,hori-2],[vert-2,hori+1],[vert-2,hori-1],[vert-1,hori+2],[vert-1,hori-2]];
                for (var v=0;v<possibleMove.length;v++){
                    if( possibleMove[v][0]<9 && possibleMove[v][0]>0 && possibleMove[v][1]<8 && possibleMove[v][1]>=0){
                        if(danger(indexOfSquare(possibleMove[v][0],abc[possibleMove[v][1]]),action)===false){
                            let i=possibleMove[v][0];
                            let j=possibleMove[v][1];
                            if(gamedata.square[indexOfSquare(i,abc[j])].havePiece){
                                if(gamedata.square[indexOfSquare(i,abc[j])].typeOfPiece===nobel || gamedata.square[indexOfSquare(i,abc[j])].typeOfPiece===soldier){
                                    lose=false;
                                }
                            }else{
                                lose=false;
                            }
                        }
                    }
                }
            }else if(nobelPieces[index]==='king'){
                    let possibleMove = [[vert+1,hori+1],[vert+1,hori-1],[vert+1,hori],[vert,hori-1],[vert,hori+1],[vert-1,hori-1],[vert-1,hori+1],[vert-1,hori]];
                    for (var v=0;v<possibleMove.length;v++){
                        if(possibleMove[v][0]<9 && possibleMove[v][0]>0 && possibleMove[v][1]<8 && possibleMove[v][1]>=0){
                            // console.log("position:",possibleMove[v][0],abc[possibleMove[v][1]],'danger:',danger(indexOfSquare(possibleMove[v][0],abc[possibleMove[v][1]]),action));
                            // console.log('------------------------------------')
                            if(danger(indexOfSquare(possibleMove[v][0],abc[possibleMove[v][1]]),action)===false){
                                let i=possibleMove[v][0];
                                let j=possibleMove[v][1];
                                if(gamedata.square[indexOfSquare(i,abc[j])].havePiece){
                                    if(gamedata.square[indexOfSquare(i,abc[j])].typeOfPiece===nobel || gamedata.square[indexOfSquare(i,abc[j])].typeOfPiece===soldier){
                                        lose=false;
                                    }
                                }else{
                                    lose=false;
                                }
                            }
                        }
                    }
                    // console.log('------------------------------------')
    
                    // if(danger(indexOfSquare(vert,abc[hori]),action)===false  && XSdata.firstmove===false && gamedata['player'+typeOfPlayer]['nobel'+typeOfPlayer][7].firstmove===false && gamedata.square[indexOfSquare(vert,abc[hori+1])].havePiece===false  && gamedata.square[indexOfSquare(vert,abc[hori+2])].havePiece===false  && action ){
                    //     // console.log("yyyyy")
                    //     if(danger(indexOfSquare(vert,abc[hori+2]),action)===false  && danger(indexOfSquare(vert,abc[hori+1]),action)===false){

                    //         // console.log(indexOfSquare(vert,abc[hori+2]))
                    //         if(gamedata.square[indexOfSquare(vert,abc[hori+2])].havePiece===false  && action){
                    //             // console.log("yyyyy")
                    //             lose=false;
                    //         }
                    //     }
                    // }else if(danger(indexOfSquare(vert,abc[hori]),action)===false && XSdata.firstmove===false && gamedata['player'+typeOfPlayer]['nobel'+typeOfPlayer][0].firstmove===false && gamedata.square[indexOfSquare(vert,abc[hori-1])].havePiece===false && gamedata.square[indexOfSquare(vert,abc[hori-2])].havePiece===false && gamedata.square[indexOfSquare(vert,abc[hori-3])].havePiece===false && action ){
                    //     if(danger(indexOfSquare(vert,abc[hori-2]),action)===false  && danger(indexOfSquare(vert,abc[hori-1]),action)===false){
                    //         // console.log(indexOfSquare(vert,abc[hori+2]))
                    //         if(gamedata.square[indexOfSquare(vert,abc[hori-2])].havePiece===false){
                    //             // console.log("yyyyy")
                    //             lose=false;
                    //         }
                    //     }
                    // }
            }
        }


        return lose ;
    }




//var squareClick=(index,top,left,deadPiece,typeofdead,indexofpiece)
//var XNClick=(index,type,action)
//var XSClick=(index,type,action)
//var pawnPromotion=(nblpiece,typplyr)
//var shortCastling=(kingID,rookID,time)
//var longCastling=(kingID,rookID,time)


function pieceInThatSquare(gamedata,hori,vert){
    for(let j=0;j<nobelPieces.length;j++){
        if(gamedata["playerx"]['nobelx'][j]!=undefined){
            if(gamedata["playerx"]['nobelx'][j].life && gamedata["playerx"]['nobelx'][j].horizontal==hori && gamedata["playerx"]['nobelx'][j].vertical==vert ){
                return {
                    type:"nobel",
                    index:j,
                    typeOfplayer:"x"
                }
            }
        }
    }

        for(let j=0;j<8;j++ ){
            if(gamedata["playerx"]['soldierx'][j].life && gamedata["playerx"]['soldierx'][j].horizontal==hori && gamedata["playerx"]['soldierx'][j].vertical==vert ){
                return {
                    type:"soldier",
                    index:j,
                    typeOfplayer:"x"
                }
            }
        }

        for(let j=0;j<nobelPieces.length;j++){
            if(gamedata["playery"]['nobely'][j]!=undefined){
                if(gamedata["playery"]['nobely'][j].life && gamedata["playery"]['nobely'][j].horizontal==hori && gamedata["playery"]['nobely'][j].vertical==vert ){
                    return {
                        type:"nobel",
                        index:j,
                        typeOfplayer:"y"
                    }
                }
            }
        }
    
            for(let j=0;j<8;j++ ){
                if(gamedata["playery"]['soldiery'][j].life && gamedata["playery"]['soldiery'][j].horizontal==hori && gamedata["playery"]['soldiery'][j].vertical==vert ){
                    return {
                        type:"soldier",
                        index:j,
                        typeOfplayer:"y"
                    }
                }
            }
    return {
        type:"a",
    }
}

function connectToC() {
    //post
    if(data.coordinate!=UserData.coordinate){
        data.coordinate=UserData.coordinate;
        fetch('http://localhost:3000/api/platform', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
        })
        .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
        })
        .then(data => {
        console.log('Data sent successfully:', data);
        })
        .catch(error => {
        console.error('There was a problem with the fetch operation:', error);
        });
    }
        //get
        fetch('http://localhost:3000/api/platform')
        .then(response => {
            console.log(response);
            if (!response.ok) {
            throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(coordinate => {
            console.log(coordinate);
            if(coordinate!=data.coordinate && coordinate!="" && coordinate!="y0-y0-0-0-0" ){
                console.log(coordinate,"  ",data.coordinate);
                console.log(coordinate[0].toUpperCase(),"-",coordinate[1]);
                let selectedCurrentPiece=pieceInThatSquare(gamedata,coordinate[0].toUpperCase(),coordinate[1]);
                let index=selectedCurrentPiece.index;
                let type=selectedCurrentPiece.type;

                let selectedDiedPiece=pieceInThatSquare(gamedata,coordinate[3].toUpperCase(),coordinate[4]);
                let index2=selectedDiedPiece.index;
                let type2=selectedDiedPiece.type;

                console.log("index : ",index);
                if(type=="soldier"){
                    XSClick(index,'y',true);
                }else{
                    XNClick(index,'y',true);
                }

                if(type2=='a'){
                    squareClick( (8-coordinate[4])*8+(coordinate[3].charCodeAt(0)-'a'.charCodeAt(0)) ,coordinate[4],coordinate[3].charCodeAt(0)-'a'.charCodeAt(0) ,0,0,0)
                }else{
                    if(type2=="soldier"){
                        XSClick(index2,'x',true);
                    }else{
                        XNClick(index2,'x',true);
                    }
                }
                data.coordinate=coordinate ;
                UserData.coordinate=data.coordinate;
            }
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });
}

// Set the interval to execute the function every 100 milliseconds (1 second)
const intervalId = setInterval(connectToC, 100);