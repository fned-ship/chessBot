#include <stdio.h>
#include <limits.h>
#include <float.h>
#include "chess.h"
// 1 : PAWN , 4 : ROOK , 3 : isKnight , 3 : BISHOP , 5 : QUEEN , 6 :  KING , 3 : BISHOP , 3 : isKnight , 4 : ROOK .
#define pawn 1 
#define knight 3
#define bishop 3
#define rook 4
#define queen 5
#define king 6
struct Piece{
    int x;
    int y;
    int piece ;
    int alive;
    int moveCount;
    int isKnight; // 1  if it is a isKnight, else 0 // i used that to distinguish which the isKnight or the bishop bcs they have same value
};
struct Pos{
    int x0;
    int y0;
    int x;
    int y;
    int promotion; //-1 means no promotion, otherwise the type of promoted piece 
    int isKnightPromotion;
};
typedef struct {
    int fromRow;
    int fromCol;
    int toRow;
    int toCol;
    int promotion;
    int isKnightPromotion;
} Move;
Move bestMove; // Global variable to store the best move
int getIndexOfPawn(int x , int blackWhite ){
    if(blackWhite){
        return x ;
    }else{
        return 8 + x ;
    }
}
int findIndexOfPiece(int x , int y , int whiteBlack , struct Piece white[16] , struct Piece  black[16]){
    if(whiteBlack){ //white
        for (int i = 0; i < 16; ++i) {
            if( white[i].alive && white[i].x==x && white[i].y == y){
                return i ;
            }
        }
    }else { //black
        for (int i = 0; i < 16; ++i) {
            if( black[i].alive && black[i].x==x && black[i].y == y){
                return i ;
            }
        }
    }
    return -1 ;
}
int makeMove(int x0 , int y0 , int x , int y , int promotion , int isKnightPromotion , int * board , int blackWhite,struct Piece * white , struct Piece * black){
    int returnVal=-1 ;
    *(board+y0*8+x0)=0;  // Remove the pawn from its original position
    if(blackWhite){//white
        for(int  i=0;i<16;i++){
            if((white+i)->x==x0 && (white+i)->y == y0 && (white+i)->alive ){
                (white+i)->x=x;
                (white+i)->y=y;
                (white+i)->moveCount+=1;
                //check for promotion
                if(y==0 && (white+i)->piece==-pawn ){
                    (white+i)->piece=promotion ;
                    (white+i)->isKnight=isKnightPromotion ;
                }
                if(y0==0 && i<8){
                    (white+i)->piece=-pawn ;
                    (white+i)->isKnight=0 ;
                }
                //check for en passant
                if(*(board+y*8+x)==0 && (white+i)->piece ==-pawn && x-x0!=0 ){
                    returnVal=getIndexOfPawn(x,0);
                    (black+returnVal)->alive=0;
                    *(board+y0*8+x) = 0 ;
                }
                //
                *(board+y*8+x) = (white+i)->piece ;
                //check for castling
                if(x-x0==2 && (white+i)->piece ==-king ){
                    //move the rook
                    (white+15)->x=x-1;
                    (white+15)->y=y;
                    (white+15)->moveCount+=1;
                    *(board+y*8+x-1) = (white+15)->piece ;
                    *(board+y*8+7) = 0 ;
                }else if(x0-x==2 && (white+i)->piece ==-king ){
                    //move the rook
                    (white+8)->x=x+1;
                    (white+8)->y=y;
                    (white+8)->moveCount+=1;
                    *(board+y*8+x+1) = (white+8)->piece ;
                    *(board+y*8) = 0 ;
                }

                break;
            }
        }
    }else{//black
        for(int  i=0;i<16;i++){
            if((black+i)->x==x0 && (black+i)->y == y0 && (black+i)->alive){
                (black+i)->x=x;
                (black+i)->y=y;
                (black+i)->moveCount+=1;
                //check for promotion
                if(y==7 && (black+i)->piece==pawn ){
                    (black+i)->piece=promotion ;
                    (black+i)->isKnight=isKnightPromotion ;
                }
                if(y0==7 && i>7){
                    (black+i)->piece=pawn ;
                    (black+i)->isKnight=0 ;
                }
                //check for en passant
                if(*(board+y*8+x)==0 && (black+i)->piece ==pawn && x-x0!=0 ){
                    returnVal=getIndexOfPawn(x,1);
                    (white+returnVal)->alive=0;
                    *(board+y0*8+x) = 0 ;
                }
                //
                *(board+y*8+x) = (black+i)->piece ;
                //check for castling
                if(x-x0==2 && (black+i)->piece ==king ){
                    //move the rook
                    (black+7)->x=x-1;
                    (black+7)->y=y;
                    (black+7)->moveCount+=1;
                    *(board+y*8+x-1) = (black+7)->piece ;
                    *(board+y*8+7) = 0 ;
                }else if(x0-x==2 && (black+i)->piece ==king ){
                    //move the rook
                    (black)->x=x+1;
                    (black)->y=y;
                    (black)->moveCount+=1;
                    *(board+y*8+x+1) = (black)->piece ;
                    *(board+y*8) = 0 ;
                }
                break;
            }
        }
    }
    return returnVal ;
}
int killPiece(int x , int y ,int whiteBlack , struct Piece * white , struct Piece * black){
    if(whiteBlack){ //white
        for (int i = 0; i < 16; ++i) {
            if((white+i)->x==x && (white+i)->y == y && (white+i)->alive ){
                (white+i)->alive=0;
                return i ;
            }
        }
    }else { //black
        for (int i = 0; i < 16; ++i) {
            if((black+i)->x==x && (black+i)->y == y && (black+i)->alive ){
                (black+i)->alive=0;
                return i ;
            }
        }
    }
}
void AlivePiece(int x , int y,int index ,int * board  ,int whiteBlack , struct Piece * white , struct Piece * black){
    if(whiteBlack){ //white
        for (int i = 0; i < 16; ++i) {
            if( i==index){
                (white+i)->alive=1;
                *(board+y*8+x)=(white+i)->piece;
                break; ;
            }
        }
    }else { //black
        for (int i = 0; i < 16; ++i) {
            if(i==index ){
                (black+i)->alive=1;
                *(board+y*8+x)=(black+i)->piece;
                break ;
            }
        }
    }
}
int shortCastling(int board[8][8],int whiteBlack,struct Piece white[16],struct Piece black[16],int indexOfLastPiecePlayed){
    struct Pos opponentPossibleMoves[256]; // Max possible moves
    int n = 0;

    if(whiteBlack){
        if(white[15].moveCount!=0 || white[12].moveCount!=0 || board[7][5]!=0 || board[7][6]!=0 ){
            return 0 ;
        }
        for (int i = 0; i < 16; i++) {
            if (black[i].alive) {
                legalMove(black[i],board, opponentPossibleMoves, &n,white,black,0,indexOfLastPiecePlayed,1);
            }
        }
        for(int i=0; i<n;i++){
            if(opponentPossibleMoves[i].x>3 && opponentPossibleMoves[i].x<7  && opponentPossibleMoves[i].y==7){
                return 0 ;
            }
        }
    }else{
        if(black[7].moveCount!=0 || black[4].moveCount!=0 || board[0][5]!=0 || board[0][6]!=0  ){
            return 0 ;
        }
        for (int i = 0; i < 16; i++) {
            if (white[i].alive) {
                legalMove(white[i],board, opponentPossibleMoves, &n,white,black,0,indexOfLastPiecePlayed,1);
            }
        }
        for(int i=0; i<n;i++){
            if(opponentPossibleMoves[i].x>3 && opponentPossibleMoves[i].x<7 && opponentPossibleMoves[i].y==0){
                return 0 ;
            }
        }
    }
    return 1 ;

}
int longCastling(int board[8][8],int whiteBlack,struct Piece white[16],struct Piece black[16],int indexOfLastPiecePlayed){
    struct Pos opponentPossibleMoves[256]; // Max possible moves
    int n = 0;

    if(whiteBlack){
        if(white[8].moveCount!=0 || white[12].moveCount!=0 || board[7][1]!=0 || board[7][2]!=0  || board[7][3]!=0  ){
            return 0 ;
        }
        for (int i = 0; i < 16; i++) {
            if (black[i].alive) {
                legalMove(black[i],board, opponentPossibleMoves, &n,white,black,0,indexOfLastPiecePlayed,1);
            }
        }
        for(int i=0; i<n;i++){
            if(opponentPossibleMoves[i].x>0 && opponentPossibleMoves[i].x<5 && opponentPossibleMoves[i].y==7){
                return 0 ;
            }
        }
    }else{
        if(black[0].moveCount!=0 || black[4].moveCount!=0 || board[0][1]!=0 || board[0][2]!=0  || board[0][3]!=0 ){
            return 0 ;
        }
        for (int i = 0; i < 16; i++) {
            if (white[i].alive) {
                legalMove(white[i],board, opponentPossibleMoves, &n,white,black,0,indexOfLastPiecePlayed,1);
            }
        }
        for(int i=0; i<n;i++){
            if(opponentPossibleMoves[i].x>0 && opponentPossibleMoves[i].x<5 && opponentPossibleMoves[i].y==0){
                return 0 ;
            }
        }
    }
    return 1 ;

}
int danger(struct Piece currentPos ,int x , int y , int board[8][8],int blackWhite,struct Piece white[16],struct Piece black[16],int indexOfLastPiecePlayed,int recursive){ // whiteblack , who plays 
    // return 0 ;
    if(!recursive){
        return 0 ;
    }
    struct Pos opponentPossibleMoves[256]; // Max possible moves
    int n = 0;

    int tempBoard[8][8];
    copyBoard(board, tempBoard); // Create a copy of the board
    struct Piece tempWhite[16];
    copyPieces(white,tempWhite);  // Create a copy of the white pieces
    struct Piece tempBlack[16];
    copyPieces(black,tempBlack);  // Create a copy of the black pieces

    if(blackWhite){//white
        //make the move of white
        if(tempBoard[y][x]!=0){
            killPiece(x,y,0,tempWhite,tempBlack);
        }
        makeMove(currentPos.x,currentPos.y,x,y,-queen,0,tempBoard,1,tempWhite,tempBlack);
        //
        for (int i = 0; i < 16; i++) {
            if (tempBlack[i].alive) {
                legalMove(tempBlack[i],tempBoard, opponentPossibleMoves, &n,tempWhite,tempBlack,0,indexOfLastPiecePlayed,0);
            }
        }
        //
        for(int i=0; i<n;i++){
            if(opponentPossibleMoves[i].x==tempWhite[12].x && opponentPossibleMoves[i].y==tempWhite[12].y){
                return 1 ;
            }
        }
    }else{
        //make the move of black
        if(tempBoard[y][x]!=0){
            killPiece(x,y,1,tempWhite,tempBlack);
        }
        makeMove(currentPos.x,currentPos.y,x,y,queen,0,tempBoard,0,tempWhite,tempBlack);
        //
        for (int i = 0; i < 16; i++) {
            if (tempWhite[i].alive) {
                legalMove(tempWhite[i],tempBoard, opponentPossibleMoves, &n,tempWhite,tempBlack,0,indexOfLastPiecePlayed,0);
            }
        }
        //
        for(int i=0; i<n;i++){
            if(opponentPossibleMoves[i].x==tempBlack[4].x && opponentPossibleMoves[i].y==tempBlack[4].y){
                return 1 ;
            }
        }
    }
    return 0 ;
}
void legalMove(struct Piece currentPos,int board[8][8],struct Pos * possibleMoves,int * n ,struct Piece white[16],struct Piece black[16] , int recursive , int indexOfLastPiecePlayed , int recursive2 ){
    int x0=currentPos.x ;
    int y0=currentPos.y ;
        if(currentPos.piece==-pawn || currentPos.piece==pawn ){ // pawn
            if(currentPos.piece==-pawn){ // white pawn
                if( y0-2>=0 && !danger(currentPos,x0,y0-2,board,1,white,black,indexOfLastPiecePlayed,recursive2) && board[y0-1][x0]==0 && board[y0-2][x0]==0 && !currentPos.moveCount){
                    possibleMoves[*n].x=x0;possibleMoves[*n].y=y0-2;
                    possibleMoves[*n].x0=x0;possibleMoves[*n].y0=y0;possibleMoves[*n].promotion=0;
                    (*n)++ ;
                }
                if( y0-1>=0 && !danger(currentPos,x0,y0-1,board,1,white,black,indexOfLastPiecePlayed,recursive2) && board[y0-1][x0]==0 ){
                    //check if there is promotion
                    if(y0==1){
                        //queen
                        possibleMoves[*n].x=x0;possibleMoves[*n].y=y0-1;
                        possibleMoves[*n].x0=x0;possibleMoves[*n].y0=y0;possibleMoves[*n].promotion=-queen;
                        (*n)++ ;
                        //rook
                        possibleMoves[*n].x=x0;possibleMoves[*n].y=y0-1;
                        possibleMoves[*n].x0=x0;possibleMoves[*n].y0=y0;possibleMoves[*n].promotion=-rook;
                        (*n)++ ;
                        //knight
                        possibleMoves[*n].x=x0;possibleMoves[*n].y=y0-1;
                        possibleMoves[*n].x0=x0;possibleMoves[*n].y0=y0;possibleMoves[*n].promotion=-knight;possibleMoves[*n].isKnightPromotion=1;
                        (*n)++ ;
                        //bishop
                        possibleMoves[*n].x=x0;possibleMoves[*n].y=y0-1;
                        possibleMoves[*n].x0=x0;possibleMoves[*n].y0=y0;possibleMoves[*n].promotion=-bishop;possibleMoves[*n].isKnightPromotion=0;
                        (*n)++ ;
                    }else{
                        possibleMoves[*n].x=x0;possibleMoves[*n].y=y0-1;
                        possibleMoves[*n].x0=x0;possibleMoves[*n].y0=y0;possibleMoves[*n].promotion=0;
                        (*n)++ ;
                    }
                }
                if(x0-1>=0 && y0-1>=0 && !danger(currentPos,x0-1,y0-1,board,1,white,black,indexOfLastPiecePlayed,recursive2) && board[y0-1][x0-1]>0){
                    if(y0==1){
                        //queen
                        possibleMoves[*n].x=x0-1;possibleMoves[*n].y=y0-1;
                        possibleMoves[*n].x0=x0;possibleMoves[*n].y0=y0;possibleMoves[*n].promotion=-queen;
                        (*n)++ ;
                        //rook
                        possibleMoves[*n].x=x0-1;possibleMoves[*n].y=y0-1;
                        possibleMoves[*n].x0=x0;possibleMoves[*n].y0=y0;possibleMoves[*n].promotion=-rook;
                        (*n)++ ;
                        //knight
                        possibleMoves[*n].x=x0-1;possibleMoves[*n].y=y0-1;
                        possibleMoves[*n].x0=x0;possibleMoves[*n].y0=y0;possibleMoves[*n].promotion=-knight;possibleMoves[*n].isKnightPromotion=1;
                        (*n)++ ;
                        //bishop
                        possibleMoves[*n].x=x0-1;possibleMoves[*n].y=y0-1;
                        possibleMoves[*n].x0=x0;possibleMoves[*n].y0=y0;possibleMoves[*n].promotion=-bishop;possibleMoves[*n].isKnightPromotion=0;
                        (*n)++ ;
                    }else{
                        possibleMoves[*n].x=x0-1;possibleMoves[*n].y=y0-1;
                        possibleMoves[*n].x0=x0;possibleMoves[*n].y0=y0;possibleMoves[*n].promotion=0;
                        (*n)++ ;
                    }
                }
                if(x0+1<8 && y0-1>=0 && !danger(currentPos,x0+1,y0-1,board,1,white,black,indexOfLastPiecePlayed,recursive2) && board[y0-1][x0+1]>0){
                    if(y0==1){
                        //queen
                        possibleMoves[*n].x=x0+1;possibleMoves[*n].y=y0-1;
                        possibleMoves[*n].x0=x0;possibleMoves[*n].y0=y0;possibleMoves[*n].promotion=-queen;
                        (*n)++ ;
                        //rook
                        possibleMoves[*n].x=x0+1;possibleMoves[*n].y=y0-1;
                        possibleMoves[*n].x0=x0;possibleMoves[*n].y0=y0;possibleMoves[*n].promotion=-rook;
                        (*n)++ ;
                        //knight
                        possibleMoves[*n].x=x0+1;possibleMoves[*n].y=y0-1;
                        possibleMoves[*n].x0=x0;possibleMoves[*n].y0=y0;possibleMoves[*n].promotion=-knight;possibleMoves[*n].isKnightPromotion=1;
                        (*n)++ ;
                        //bishop
                        possibleMoves[*n].x=x0+1;possibleMoves[*n].y=y0-1;
                        possibleMoves[*n].x0=x0;possibleMoves[*n].y0=y0;possibleMoves[*n].promotion=-bishop;possibleMoves[*n].isKnightPromotion=0;
                        (*n)++ ;
                    }else{
                        possibleMoves[*n].x=x0+1;possibleMoves[*n].y=y0-1;
                        possibleMoves[*n].x0=x0;possibleMoves[*n].y0=y0;possibleMoves[*n].promotion=0;
                        (*n)++ ;
                    }
                }
                //en passent
                if(x0-1>=0 && y0-1>=0 && !danger(currentPos,x0-1,y0-1,board,1,white,black,indexOfLastPiecePlayed,recursive2) && board[y0-1][x0-1]==0 && board[y0][x0-1]==pawn && getIndexOfPawn(x0-1,0)==indexOfLastPiecePlayed && black[getIndexOfPawn(x0-1,0)].moveCount==1 ){
                    possibleMoves[*n].x=x0-1;possibleMoves[*n].y=y0-1;
                    possibleMoves[*n].x0=x0;possibleMoves[*n].y0=y0;possibleMoves[*n].promotion=0;
                    (*n)++ ;
                }
                if(x0+1<8 && y0-1>=0 && !danger(currentPos,x0+1,y0-1,board,1,white,black,indexOfLastPiecePlayed,recursive2) && board[y0-1][x0+1]==0 && board[y0][x0+1]==pawn && getIndexOfPawn(x0+1,0)==indexOfLastPiecePlayed && black[getIndexOfPawn(x0+1,0)].moveCount==1 ){
                    possibleMoves[*n].x=x0+1;possibleMoves[*n].y=y0-1;
                    possibleMoves[*n].x0=x0;possibleMoves[*n].y0=y0;possibleMoves[*n].promotion=0;
                    (*n)++ ;
                }
            }else{
                if( y0+2<8 && !danger(currentPos,x0,y0+2,board,0,white,black,indexOfLastPiecePlayed,recursive2) && board[y0+1][x0]==0 && board[y0+2][x0]==0 && !currentPos.moveCount){
                    possibleMoves[*n].x=x0;possibleMoves[*n].y=y0+2;
                    possibleMoves[*n].x0=x0;possibleMoves[*n].y0=y0;possibleMoves[*n].promotion=0;
                    (*n)++ ;
                }
                if( y0+1<8 && !danger(currentPos,x0,y0+1,board,0,white,black,indexOfLastPiecePlayed,recursive2) && board[y0+1][x0]==0 ){
                    if(y0==6){
                        //queen
                        possibleMoves[*n].x=x0;possibleMoves[*n].y=y0+1;
                        possibleMoves[*n].x0=x0;possibleMoves[*n].y0=y0;possibleMoves[*n].promotion=queen;
                        (*n)++ ;
                        //rook
                        possibleMoves[*n].x=x0;possibleMoves[*n].y=y0+1;
                        possibleMoves[*n].x0=x0;possibleMoves[*n].y0=y0;possibleMoves[*n].promotion=rook;
                        (*n)++ ;
                        //knight
                        possibleMoves[*n].x=x0;possibleMoves[*n].y=y0+1;
                        possibleMoves[*n].x0=x0;possibleMoves[*n].y0=y0;possibleMoves[*n].promotion=knight;possibleMoves[*n].isKnightPromotion=1;
                        (*n)++ ;
                        //bishop
                        possibleMoves[*n].x=x0;possibleMoves[*n].y=y0+1;
                        possibleMoves[*n].x0=x0;possibleMoves[*n].y0=y0;possibleMoves[*n].promotion=bishop;possibleMoves[*n].isKnightPromotion=0;
                        (*n)++ ;
                    }else{
                        possibleMoves[*n].x=x0;possibleMoves[*n].y=y0+1;
                        possibleMoves[*n].x0=x0;possibleMoves[*n].y0=y0;possibleMoves[*n].promotion=0;
                        (*n)++ ;
                    }
                }
                if(x0-1>=0 && y0+1<8 && !danger(currentPos,x0-1,y0+1,board,0,white,black,indexOfLastPiecePlayed,recursive2) && board[y0+1][x0-1]<0){
                    if(y0==6){
                        //queen
                        possibleMoves[*n].x=x0-1;possibleMoves[*n].y=y0+1;
                        possibleMoves[*n].x0=x0;possibleMoves[*n].y0=y0;possibleMoves[*n].promotion=queen;
                        (*n)++ ;
                        //rook
                        possibleMoves[*n].x=x0-1;possibleMoves[*n].y=y0+1;
                        possibleMoves[*n].x0=x0;possibleMoves[*n].y0=y0;possibleMoves[*n].promotion=rook;
                        (*n)++ ;
                        //knight
                        possibleMoves[*n].x=x0-1;possibleMoves[*n].y=y0+1;
                        possibleMoves[*n].x0=x0;possibleMoves[*n].y0=y0;possibleMoves[*n].promotion=knight;possibleMoves[*n].isKnightPromotion=1;
                        (*n)++ ;
                        //bishop
                        possibleMoves[*n].x=x0-1;possibleMoves[*n].y=y0+1;
                        possibleMoves[*n].x0=x0;possibleMoves[*n].y0=y0;possibleMoves[*n].promotion=bishop;possibleMoves[*n].isKnightPromotion=0;
                        (*n)++ ;
                    }else{
                        possibleMoves[*n].x=x0-1;possibleMoves[*n].y=y0+1;
                        possibleMoves[*n].x0=x0;possibleMoves[*n].y0=y0;possibleMoves[*n].promotion=0;
                        (*n)++ ;
                    }
                }
                if(x0+1<8 && y0+1<8 && !danger(currentPos,x0+1,y0+1,board,0,white,black,indexOfLastPiecePlayed,recursive2) && board[y0+1][x0+1]<0){
                    if(y0==6){
                        //queen
                        possibleMoves[*n].x=x0+1;possibleMoves[*n].y=y0+1;
                        possibleMoves[*n].x0=x0;possibleMoves[*n].y0=y0;possibleMoves[*n].promotion=queen;
                        (*n)++ ;
                        //rook
                        possibleMoves[*n].x=x0+1;possibleMoves[*n].y=y0+1;
                        possibleMoves[*n].x0=x0;possibleMoves[*n].y0=y0;possibleMoves[*n].promotion=rook;
                        (*n)++ ;
                        //knight
                        possibleMoves[*n].x=x0+1;possibleMoves[*n].y=y0+1;
                        possibleMoves[*n].x0=x0;possibleMoves[*n].y0=y0;possibleMoves[*n].promotion=knight;possibleMoves[*n].isKnightPromotion=1;
                        (*n)++ ;
                        //bishop
                        possibleMoves[*n].x=x0+1;possibleMoves[*n].y=y0+1;
                        possibleMoves[*n].x0=x0;possibleMoves[*n].y0=y0;possibleMoves[*n].promotion=bishop;possibleMoves[*n].isKnightPromotion=0;
                        (*n)++ ;
                    }else{
                        possibleMoves[*n].x=x0+1;possibleMoves[*n].y=y0+1;
                        possibleMoves[*n].x0=x0;possibleMoves[*n].y0=y0;possibleMoves[*n].promotion=0;
                        (*n)++ ;
                    }
                }
                //en passent
                if(x0-1>=0 && y0+1<8 && !danger(currentPos,x0-1,y0+1,board,0,white,black,indexOfLastPiecePlayed,recursive2) && board[y0+1][x0-1]==0 && board[y0][x0-1]==-pawn && getIndexOfPawn(x0-1,1)==indexOfLastPiecePlayed && white[getIndexOfPawn(x0-1,1)].moveCount==1  ){
                    possibleMoves[*n].x=x0-1;possibleMoves[*n].y=y0+1;
                    possibleMoves[*n].x0=x0;possibleMoves[*n].y0=y0;possibleMoves[*n].promotion=0;
                    (*n)++ ;
                }
                if(x0+1<8 && y0+1<8 && !danger(currentPos,x0+1,y0+1,board,0,white,black,indexOfLastPiecePlayed,recursive2) && board[y0+1][x0+1]==0 && board[y0][x0+1]==-pawn && getIndexOfPawn(x0+1,1)==indexOfLastPiecePlayed && white[getIndexOfPawn(x0+1,1)].moveCount==1 ){
                    possibleMoves[*n].x=x0+1;possibleMoves[*n].y=y0+1;
                    possibleMoves[*n].x0=x0;possibleMoves[*n].y0=y0;possibleMoves[*n].promotion=0;
                    (*n)++ ;
                }
            }

        }else if (currentPos.piece==-rook  || currentPos.piece==rook  ){ // rook
            int i=x0-1;
            while(i>=0){
                if(!danger(currentPos,i,y0,board,currentPos.piece<0,white,black,indexOfLastPiecePlayed,recursive2) && board[y0][i]==0){
                    possibleMoves[*n].x=i;possibleMoves[*n].y=y0;
                    possibleMoves[*n].x0=x0;possibleMoves[*n].y0=y0;possibleMoves[*n].promotion=0;
                    (*n)++ ;
                }else{
                    if(!danger(currentPos,i,y0,board,currentPos.piece<0,white,black,indexOfLastPiecePlayed,recursive2) && currentPos.piece*board[y0][i]<0){
                        possibleMoves[*n].x=i;possibleMoves[*n].y=y0;
                        possibleMoves[*n].x0=x0;possibleMoves[*n].y0=y0;possibleMoves[*n].promotion=0;
                        (*n)++ ;
                        break;
                    }else if(currentPos.piece*board[y0][i]>0){
                        break;
                    }
                }
                i-=1;
            }
            i=x0+1;
            while(i<8){
                if(!danger(currentPos,i,y0,board,currentPos.piece<0,white,black,indexOfLastPiecePlayed,recursive2) && board[y0][i]==0){
                    possibleMoves[*n].x=i;possibleMoves[*n].y=y0;
                    possibleMoves[*n].x0=x0;possibleMoves[*n].y0=y0;possibleMoves[*n].promotion=0;
                    (*n)++ ;
                }else{
                    if(!danger(currentPos,i,y0,board,currentPos.piece<0,white,black,indexOfLastPiecePlayed,recursive2) && currentPos.piece*board[y0][i]<0){
                        possibleMoves[*n].x=i;possibleMoves[*n].y=y0;
                        possibleMoves[*n].x0=x0;possibleMoves[*n].y0=y0;possibleMoves[*n].promotion=0;
                        (*n)++ ;
                        break;
                    }else if(currentPos.piece*board[y0][i]>0){
                        break;
                    }
                }
                i+=1;
            }
            i=y0+1;
            while(i<8){
                if(!danger(currentPos,x0,i,board,currentPos.piece<0,white,black,indexOfLastPiecePlayed,recursive2) && board[i][x0]==0){
                    possibleMoves[*n].x=x0;possibleMoves[*n].y=i;
                    possibleMoves[*n].x0=x0;possibleMoves[*n].y0=y0;possibleMoves[*n].promotion=0;
                    (*n)++ ;
                }else{
                    if(!danger(currentPos,x0,i,board,currentPos.piece<0,white,black,indexOfLastPiecePlayed,recursive2) && currentPos.piece*board[i][x0]<0){
                        possibleMoves[*n].x=x0;possibleMoves[*n].y=i;
                        possibleMoves[*n].x0=x0;possibleMoves[*n].y0=y0;possibleMoves[*n].promotion=0;
                        (*n)++ ;
                        break;
                    }else if(currentPos.piece*board[i][x0]>0){
                        break;
                    }
                }
                i+=1;
            }
            i=y0-1;
            while(i>=0){
                if(!danger(currentPos,x0,i,board,currentPos.piece<0,white,black,indexOfLastPiecePlayed,recursive2) && board[i][x0]==0){
                    possibleMoves[*n].x=x0;possibleMoves[*n].y=i;
                    possibleMoves[*n].x0=x0;possibleMoves[*n].y0=y0;possibleMoves[*n].promotion=0;
                    (*n)++ ;
                }else{
                    if(!danger(currentPos,x0,i,board,currentPos.piece<0,white,black,indexOfLastPiecePlayed,recursive2) && currentPos.piece*board[i][x0]<0){
                        possibleMoves[*n].x=x0;possibleMoves[*n].y=i;
                        possibleMoves[*n].x0=x0;possibleMoves[*n].y0=y0;possibleMoves[*n].promotion=0;
                        (*n)++ ;
                        break;
                    }else if(currentPos.piece*board[i][x0]>0){
                        break;
                    }
                }
                i-=1;
            }
        }else if(( currentPos.piece==-bishop  || currentPos.piece==bishop )&& !currentPos.isKnight){//bishop
            int i=1;
            while(x0+i<8 && y0+i<8){
                if(!danger(currentPos,x0+i,y0+i,board,currentPos.piece<0,white,black,indexOfLastPiecePlayed,recursive2) && board[y0+i][x0+i]==0){
                    possibleMoves[*n].x=x0+i;possibleMoves[*n].y=y0+i;
                    possibleMoves[*n].x0=x0;possibleMoves[*n].y0=y0;possibleMoves[*n].promotion=0;
                    (*n)++ ;
                }else{
                    if(!danger(currentPos,x0+i,y0+i,board,currentPos.piece<0,white,black,indexOfLastPiecePlayed,recursive2) && currentPos.piece*board[y0+i][x0+i]<0){
                        possibleMoves[*n].x=x0+i;possibleMoves[*n].y=y0+i;
                        possibleMoves[*n].x0=x0;possibleMoves[*n].y0=y0;possibleMoves[*n].promotion=0;
                        (*n)++ ;
                        break;
                    }else if(currentPos.piece*board[y0+i][x0+i]>0){
                        break;
                    }
                }
                i+=1;
            }
            i=1;
            while(x0-i>=0 && y0-i>=0){
                if(!danger(currentPos,x0-i,y0-i,board,currentPos.piece<0,white,black,indexOfLastPiecePlayed,recursive2) && board[y0-i][x0-i]==0){
                    possibleMoves[*n].x=x0-i;possibleMoves[*n].y=y0-i;
                    possibleMoves[*n].x0=x0;possibleMoves[*n].y0=y0;possibleMoves[*n].promotion=0;
                    (*n)++ ;
                }else{
                    if(!danger(currentPos,x0-i,y0-i,board,currentPos.piece<0,white,black,indexOfLastPiecePlayed,recursive2) && currentPos.piece*board[y0-i][x0-i]<0){
                        possibleMoves[*n].x=x0-i;possibleMoves[*n].y=y0-i;
                        possibleMoves[*n].x0=x0;possibleMoves[*n].y0=y0;possibleMoves[*n].promotion=0;
                        (*n)++ ;
                        break;
                    }else if(currentPos.piece*board[y0-i][x0-i]>0){
                        break;
                    }
                }
                i+=1;
            }
            i=1;
            while(x0+i<8 && y0-i>=0){
                if(!danger(currentPos,x0+i,y0-i,board,currentPos.piece<0,white,black,indexOfLastPiecePlayed,recursive2) && board[y0-i][x0+i]==0){
                    possibleMoves[*n].x=x0+i;possibleMoves[*n].y=y0-i;
                    possibleMoves[*n].x0=x0;possibleMoves[*n].y0=y0;possibleMoves[*n].promotion=0;
                    (*n)++ ;
                }else{
                    if(!danger(currentPos,x0+i,y0-i,board,currentPos.piece<0,white,black,indexOfLastPiecePlayed,recursive2) && currentPos.piece*board[y0-i][x0+i]<0){
                        possibleMoves[*n].x=x0+i;possibleMoves[*n].y=y0-i;
                        possibleMoves[*n].x0=x0;possibleMoves[*n].y0=y0;possibleMoves[*n].promotion=0;
                        (*n)++ ;
                        break;
                    }else if(currentPos.piece*board[y0-i][x0+i]>0){
                        break;
                    }
                }
                i+=1;
            }
            i=1;
            while(x0-i>=0 && y0+i<8){
                if(!danger(currentPos,x0-i,y0+i,board,currentPos.piece<0,white,black,indexOfLastPiecePlayed,recursive2) && board[y0+i][x0-i]==0){
                    possibleMoves[*n].x=x0-i;possibleMoves[*n].y=y0+i;
                    possibleMoves[*n].x0=x0;possibleMoves[*n].y0=y0;possibleMoves[*n].promotion=0;
                    (*n)++ ;
                }else{
                    if(!danger(currentPos,x0-i,y0+i,board,currentPos.piece<0,white,black,indexOfLastPiecePlayed,recursive2) && currentPos.piece*board[y0+i][x0-i]<0){
                        possibleMoves[*n].x=x0-i;possibleMoves[*n].y=y0+i;
                        possibleMoves[*n].x0=x0;possibleMoves[*n].y0=y0;possibleMoves[*n].promotion=0;
                        (*n)++ ;
                        break;
                    }else if(currentPos.piece*board[y0+i][x0-i]>0){
                        break;
                    }
                }
                i+=1;
            }

        }else if( currentPos.piece==-queen  || currentPos.piece==queen ){//queen
            int i=x0-1;
            while(i>=0){
                if(!danger(currentPos,i,y0,board,currentPos.piece<0,white,black,indexOfLastPiecePlayed,recursive2) && board[y0][i]==0){
                    possibleMoves[*n].x=i;possibleMoves[*n].y=y0;
                    possibleMoves[*n].x0=x0;possibleMoves[*n].y0=y0;possibleMoves[*n].promotion=0;
                    (*n)++ ;
                }else{
                    if(!danger(currentPos,i,y0,board,currentPos.piece<0,white,black,indexOfLastPiecePlayed,recursive2) && currentPos.piece*board[y0][i]<0){
                        possibleMoves[*n].x=i;possibleMoves[*n].y=y0;
                        possibleMoves[*n].x0=x0;possibleMoves[*n].y0=y0;possibleMoves[*n].promotion=0;
                        (*n)++ ;
                        break;
                    }else if(currentPos.piece*board[y0][i]>0){
                        break;
                    }
                }
                i-=1;
            }
            i=x0+1;
            while(i<8){
                if(!danger(currentPos,i,y0,board,currentPos.piece<0,white,black,indexOfLastPiecePlayed,recursive2) && board[y0][i]==0){
                    possibleMoves[*n].x=i;possibleMoves[*n].y=y0;
                    possibleMoves[*n].x0=x0;possibleMoves[*n].y0=y0;possibleMoves[*n].promotion=0;
                    (*n)++ ;
                }else{
                    if(!danger(currentPos,i,y0,board,currentPos.piece<0,white,black,indexOfLastPiecePlayed,recursive2) && currentPos.piece*board[y0][i]<0){
                        possibleMoves[*n].x=i;possibleMoves[*n].y=y0;
                        possibleMoves[*n].x0=x0;possibleMoves[*n].y0=y0;possibleMoves[*n].promotion=0;
                        (*n)++ ;
                        break;
                    }else if(currentPos.piece*board[y0][i]>0){
                        break;
                    }
                }
                i+=1;
            }
            i=y0+1;
            while(i<8){
                if(!danger(currentPos,x0,i,board,currentPos.piece<0,white,black,indexOfLastPiecePlayed,recursive2) && board[i][x0]==0){
                    possibleMoves[*n].x=x0;possibleMoves[*n].y=i;
                    possibleMoves[*n].x0=x0;possibleMoves[*n].y0=y0;possibleMoves[*n].promotion=0;
                    (*n)++ ;
                }else{
                    if(!danger(currentPos,x0,i,board,currentPos.piece<0,white,black,indexOfLastPiecePlayed,recursive2) && currentPos.piece*board[i][x0]<0){
                        possibleMoves[*n].x=x0;possibleMoves[*n].y=i;
                        possibleMoves[*n].x0=x0;possibleMoves[*n].y0=y0;possibleMoves[*n].promotion=0;
                        (*n)++ ;
                        break;
                    }else if(currentPos.piece*board[i][x0]>0){
                        break;
                    }
                }
                i+=1;
            }
            i=y0-1;
            while(i>=0){
                if(!danger(currentPos,x0,i,board,currentPos.piece<0,white,black,indexOfLastPiecePlayed,recursive2) && board[i][x0]==0){
                    possibleMoves[*n].x=x0;possibleMoves[*n].y=i;
                    possibleMoves[*n].x0=x0;possibleMoves[*n].y0=y0;possibleMoves[*n].promotion=0;
                    (*n)++ ;
                }else{
                    if(!danger(currentPos,x0,i,board,currentPos.piece<0,white,black,indexOfLastPiecePlayed,recursive2) && currentPos.piece*board[i][x0]<0){
                        possibleMoves[*n].x=x0;possibleMoves[*n].y=i;
                        possibleMoves[*n].x0=x0;possibleMoves[*n].y0=y0;possibleMoves[*n].promotion=0;
                        (*n)++ ;
                        break;
                    }else if(currentPos.piece*board[i][x0]>0){
                        break;
                    }
                }
                i-=1;
            }
            i=1;
            while(x0+i<8 && y0+i<8){
                if(!danger(currentPos,x0+i,y0+i,board,currentPos.piece<0,white,black,indexOfLastPiecePlayed,recursive2) && board[y0+i][x0+i]==0){
                    possibleMoves[*n].x=x0+i;possibleMoves[*n].y=y0+i;
                    possibleMoves[*n].x0=x0;possibleMoves[*n].y0=y0;possibleMoves[*n].promotion=0;
                    (*n)++ ;
                }else{
                    if(!danger(currentPos,x0+i,y0+i,board,currentPos.piece<0,white,black,indexOfLastPiecePlayed,recursive2) && currentPos.piece*board[y0+i][x0+i]<0){
                        possibleMoves[*n].x=x0+i;possibleMoves[*n].y=y0+i;
                        possibleMoves[*n].x0=x0;possibleMoves[*n].y0=y0;possibleMoves[*n].promotion=0;
                        (*n)++ ;
                        break;
                    }else if(currentPos.piece*board[y0+i][x0+i]>0){
                        break;
                    }
                }
                i+=1;
            }
            i=1;
            while(x0-i>=0 && y0-i>=0){
                if(!danger(currentPos,x0-i,y0-i,board,currentPos.piece<0,white,black,indexOfLastPiecePlayed,recursive2) && board[y0-i][x0-i]==0){
                    possibleMoves[*n].x=x0-i;possibleMoves[*n].y=y0-i;
                    possibleMoves[*n].x0=x0;possibleMoves[*n].y0=y0;possibleMoves[*n].promotion=0;
                    (*n)++ ;
                }else{
                    if(!danger(currentPos,x0-i,y0-i,board,currentPos.piece<0,white,black,indexOfLastPiecePlayed,recursive2) && currentPos.piece*board[y0-i][x0-i]<0){
                        possibleMoves[*n].x=x0-i;possibleMoves[*n].y=y0-i;
                        possibleMoves[*n].x0=x0;possibleMoves[*n].y0=y0;possibleMoves[*n].promotion=0;
                        (*n)++ ;
                        break;
                    }else if(currentPos.piece*board[y0-i][x0-i]>0){
                        break;
                    }
                }
                i+=1;
            }
            i=1;
            while(x0+i<8 && y0-i>=0){
                if(!danger(currentPos,x0+i,y0-i,board,currentPos.piece<0,white,black,indexOfLastPiecePlayed,recursive2) && board[y0-i][x0+i]==0){
                    possibleMoves[*n].x=x0+i;possibleMoves[*n].y=y0-i;
                    possibleMoves[*n].x0=x0;possibleMoves[*n].y0=y0;possibleMoves[*n].promotion=0;
                    (*n)++ ;
                }else{
                    if(!danger(currentPos,x0+i,y0-i,board,currentPos.piece<0,white,black,indexOfLastPiecePlayed,recursive2) && currentPos.piece*board[y0-i][x0+i]<0){
                        possibleMoves[*n].x=x0+i;possibleMoves[*n].y=y0-i;
                        possibleMoves[*n].x0=x0;possibleMoves[*n].y0=y0;possibleMoves[*n].promotion=0;
                        (*n)++ ;
                        break;
                    }else if(currentPos.piece*board[y0-i][x0+i]>0){
                        break;
                    }
                }
                i+=1;
            }
            i=1;
            while(x0-i>=0 && y0+i<8){
                if(!danger(currentPos,x0-i,y0+i,board,currentPos.piece<0,white,black,indexOfLastPiecePlayed,recursive2) && board[y0+i][x0-i]==0){
                    possibleMoves[*n].x=x0-i;possibleMoves[*n].y=y0+i;
                    possibleMoves[*n].x0=x0;possibleMoves[*n].y0=y0;possibleMoves[*n].promotion=0;
                    (*n)++ ;
                }else{
                    if(!danger(currentPos,x0-i,y0+i,board,currentPos.piece<0,white,black,indexOfLastPiecePlayed,recursive2) && currentPos.piece*board[y0+i][x0-i]<0){
                        possibleMoves[*n].x=x0-i;possibleMoves[*n].y=y0+i;
                        possibleMoves[*n].x0=x0;possibleMoves[*n].y0=y0;possibleMoves[*n].promotion=0;
                        (*n)++ ;
                        break;
                    }else if(currentPos.piece*board[y0+i][x0-i]>0){
                        break;
                    }
                }
                i+=1;
            }


        }else if(( currentPos.piece==-knight  || currentPos.piece==knight )&& currentPos.isKnight){//isKnight
            int posMvs[8][2]={{x0+1,y0+2},{x0-1,y0+2},{x0+1,y0-2},{x0-1,y0-2},{x0+2,y0+1},{x0+2,y0-1},{x0-2,y0-1},{x0-2,y0+1}};
            for(int i=0;i<8;i++){
                if(!danger(currentPos,posMvs[i][0],posMvs[i][1],board,currentPos.piece<0,white,black,indexOfLastPiecePlayed,recursive2) && posMvs[i][1]<8 && posMvs[i][1]>=0 && posMvs[i][0]<8 && posMvs[i][0]>=0  && currentPos.piece*board[posMvs[i][1]][posMvs[i][0]]<=0 ){
                    possibleMoves[*n].x=posMvs[i][0];possibleMoves[*n].y=posMvs[i][1];
                    possibleMoves[*n].x0=x0;possibleMoves[*n].y0=y0;possibleMoves[*n].promotion=0;
                    (*n)++ ;
                }
            }
        }else if(currentPos.piece==-king  || currentPos.piece==king ){//king
            int posMvs[8][2]={{x0+1,y0},{x0-1,y0},{x0,y0-1},{x0,y0+1},{x0+1,y0+1},{x0-1,y0-1},{x0-1,y0+1},{x0+1,y0-1}};
            for(int i=0;i<8;i++){
                if(!danger(currentPos,posMvs[i][0],posMvs[i][1],board,currentPos.piece<0,white,black,indexOfLastPiecePlayed,recursive2) && posMvs[i][1]<8 && posMvs[i][1]>=0 && posMvs[i][0]<8 && posMvs[i][0]>=0 && currentPos.piece*board[posMvs[i][1]][posMvs[i][0]]<=0 ){
                    possibleMoves[*n].x=posMvs[i][0];possibleMoves[*n].y=posMvs[i][1];
                    possibleMoves[*n].x0=x0;possibleMoves[*n].y0=y0;possibleMoves[*n].promotion=0;
                    (*n)++ ;
                }
            }
            if(recursive){
                if(shortCastling(board,currentPos.piece==-king,white,black,indexOfLastPiecePlayed)){
                    possibleMoves[*n].x=x0+2;possibleMoves[*n].y=y0;
                    possibleMoves[*n].x0=x0;possibleMoves[*n].y0=y0;possibleMoves[*n].promotion=0;
                    (*n)++ ;
                }
                if(longCastling(board,currentPos.piece==-king,white,black,indexOfLastPiecePlayed)){
                    possibleMoves[*n].x=x0-2;possibleMoves[*n].y=y0;
                    possibleMoves[*n].x0=x0;possibleMoves[*n].y0=y0;possibleMoves[*n].promotion=0;
                    (*n)++ ;
                }
            }

        }
    
}
int getx0(char coordinate[10]){
    return  coordinate[0] - 'a' ;
}
int gety0(char coordinate[10]){
    return  8 - ( coordinate[1] - '0' ) ;
}
int getx1(char coordinate[10]){
    return  coordinate[3] - 'a' ;
}
int gety1(char coordinate[10]){
    return  8 - ( coordinate[4] - '0' ) ;
}
int getPromo(char coordinate[10]){
    return  coordinate[6] - '0' ;
}
int getIsKnightPromo(char coordinate[10]){
    return  coordinate[8] - '0' ;
}
void printMove(int x0 , int y0 ,int x ,int y ){
    printf("%c%d to %c%d\n" ,'a'+x0 ,8-y0,'a'+x ,8-y);
}
void printGame(int board[8][8]){
    for(int i=0;i<8;i++){
        printf("%d    ",8-i);
        for(int j=0;j<8;j++){
            if(board[i][j]>=0){
                printf("  %d ",board[i][j]);
            }else{
                printf(" %d ",board[i][j]);
            }
        }
        printf("\n");
    }
    printf("       a   b   c   d   e   f   g   h\n");
}

float evaluatePosition(int board[8][8] ,struct Piece white[16],struct Piece black[16],int indexOfLastPiecePlayed){
    struct Pos whitePossibleMoves[256]; // Max possible moves
    int n1 = 0;
    struct Pos blackPossibleMoves[256]; // Max possible moves
    int n2 = 0;
    float s=0;

    for (int i = 0; i < 16; i++) {
        if (white[i].alive) {
            legalMove(white[i], board, whitePossibleMoves, &n1,white,black,1,indexOfLastPiecePlayed,1);
        }
    }
    for (int i = 0; i < 16; i++) {
        if (black[i].alive) {
            legalMove(black[i], board, blackPossibleMoves, &n2,white,black,1,indexOfLastPiecePlayed,1);
        }
    }
    s+=n2/25600 ;
    s-=n1/25600 ;
    
    for(int i=0;i<8;i++){
        for(int j=0;j<8;j++){
            s+=board[i][j];
            //pawn structure
            // -- white --
            if(board[i][j]==-pawn){
                if (i > 0 && board[i - 1][j] == -pawn) {
                    s += 0.004;
                }
                // Check for passed pawns
                if ((j > 0 && i <7 &&  ( board[i + 1][j - 1] == pawn || board[i + 1][j - 1] == -pawn ) ) || (j < 7 && i <7 &&  ( board[i + 1][j + 1] == -pawn || board[i + 1][j + 1] == pawn )  )) {
                    s -= 0.005;
                }
            }
            // -- black --
            else if(board[i][j]==pawn){
                // Check for doubled pawns
                if (i > 0 && board[i - 1][j] == pawn) {
                    s -= 0.004;
                }
                // Check for passed pawns
                if ((j > 0 && i > 0 && ( board[i - 1][j - 1] == pawn || board[i - 1][j - 1] == -pawn ) ) || (j < 7 && i > 0 &&  ( board[i - 1][j + 1] == -pawn || board[i - 1][j + 1] == pawn )  )) {
                    s += 0.005;
                }
            }
            //king's safety
            // -- white --
            else if(board[i][j]==-king){
                if ( i >0  && j > 0 && board[i - 1][j - 1] == -pawn) {
                    s -= 0.08;
                }
                if (i >0 && j < 7 && board[i - 1][j + 1] == -pawn) {
                    s -= 0.08;
                }
                if(j==0 || j==7){
                    s+=0.01 ;
                }
                //castling
                if( ( i==2 || i==6) && white[12].moveCount==1 ){
                    s-=0.1;
                }
            }
            //-- black --
            else if(board[i][j]==king){
                if ( i <7  && j > 0 && board[i + 1][j - 1] == pawn) {
                    s += 0.08;
                }
                if (i <7 && j < 7 && board[i + 1][j + 1] == pawn) {
                    s += 0.08;
                }
                if(j==0 || j==7){
                    s-=0.01 ;
                }
                //castling
                if( ( i==2 || i==6) && black[4].moveCount==1 ){
                    s+=0.1;
                }
            }
            //rook movement
            else if(board[i][j]==-rook){//white
                if( i!=7 && ( j!=0 || j!=7 ) ){
                    s+=0.009 ;
                }
            }
            else if(board[i][j]==rook){
                if( i!=0 && ( j!=0 || j!=7 ) ){
                    s-=0.009 ;
                }
            }
            //
        }
    }
    return s ;
}
int gameOver(int board[8][8]){
    int numOfKings=0;
    for (int i = 0; i < 8; i++) {
        for (int j = 0; j < 8; j++) {
            if(board[i][j]==king || board[i][j]==-king) numOfKings++;
        }
    }
    return numOfKings <2  ;
}
void copyBoard(int (*source)[8], int (*destination)[8]) {
    for (int i = 0; i < 8; i++) {
        for (int j = 0; j < 8; j++) {
            destination[i][j] = source[i][j];
        }
    }
}
void copyPieces( struct Piece * source ,  struct Piece * destination ) {
    for (int i = 0; i < 16; i++) {
        (destination+i)->x= (source+i)->x;
        (destination+i)->y= (source+i)->y;
        (destination+i)->piece= (source+i)->piece;
        (destination+i)->alive= (source+i)->alive;
        (destination+i)->moveCount= (source+i)->moveCount;
        (destination+i)->isKnight= (source+i)->isKnight;
    }
}
// Function to perform minimax search
float minimax(int board[8][8], struct Piece white[16], struct Piece black[16], int depth, float alpha, float beta, int maximizingPlayer, int state , int indexOfLastPiecePlayed) {

    struct Pos possibleMoves[256]; // Max possible moves
    int n = 0;

    int tempBoard[8][8];
    copyBoard(board, tempBoard); // Create a copy of the board
    struct Piece tempWhite[16];
    copyPieces(white,tempWhite);  // Create a copy of the white pieces
    struct Piece tempBlack[16];
    copyPieces(black,tempBlack);  // Create a copy of the black pieces


    if (depth == 0 || gameOver(tempBoard)) {
        // If it's a terminal node, return the evaluation of the position
        return evaluatePosition(tempBoard,white,black,indexOfLastPiecePlayed);
    }

    if (maximizingPlayer) {
        // black to play
        //  Generate all possible moves from this state
        for (int i = 0; i < 16; i++) {
            if (tempBlack[i].alive) {
                legalMove(tempBlack[i], tempBoard, possibleMoves, &n,tempWhite,tempBlack,1,indexOfLastPiecePlayed,1);
            }
        }

        float maxEval = - FLT_MAX;
        float eval;
        int indexOfKilledPiece=-1;
        int indexOfKilledPawn=-1;
        // Iterate through each possible move and recursively call minimax
        for (int i = 0; i < n; i++) {
            //update indexOfLastPiecePlayed
            indexOfLastPiecePlayed=findIndexOfPiece(possibleMoves[i].x0,possibleMoves[i].y0,0,tempWhite,tempBlack);
            // Make move
            if (tempBoard[possibleMoves[i].y][possibleMoves[i].x] != 0) {
                indexOfKilledPiece=killPiece(possibleMoves[i].x, possibleMoves[i].y , 1, tempWhite, tempBlack);
            }
            indexOfKilledPawn=makeMove(possibleMoves[i].x0, possibleMoves[i].y0, possibleMoves[i].x, possibleMoves[i].y,possibleMoves[i].promotion,possibleMoves[i].isKnightPromotion, tempBoard, 0, tempWhite, tempBlack);
            //
            eval = minimax(tempBoard, tempWhite, tempBlack, depth - 1, alpha, beta, 0, 0,indexOfLastPiecePlayed);
            // Undo move
            makeMove(possibleMoves[i].x, possibleMoves[i].y, possibleMoves[i].x0, possibleMoves[i].y0,possibleMoves[i].promotion,possibleMoves[i].isKnightPromotion,  tempBoard, 0, tempWhite, tempBlack);
            if (indexOfKilledPiece!=-1) {
                AlivePiece(possibleMoves[i].x, possibleMoves[i].y,indexOfKilledPiece,tempBoard,1, tempWhite, tempBlack);
                indexOfKilledPiece=-1;
            }else if(indexOfKilledPawn!=-1){
                AlivePiece(possibleMoves[i].x, possibleMoves[i].y0,indexOfKilledPawn,tempBoard,1, tempWhite, tempBlack);
                indexOfKilledPawn=-1;
            }
            if (eval > maxEval) {
                maxEval = eval;
                if (state) {
                    bestMove.fromRow = possibleMoves[i].y0;
                    bestMove.fromCol = possibleMoves[i].x0;
                    bestMove.toRow = possibleMoves[i].y;
                    bestMove.toCol = possibleMoves[i].x;
                    bestMove.promotion = possibleMoves[i].promotion;
                    bestMove.isKnightPromotion = possibleMoves[i].isKnightPromotion;
                }
            }
            alpha = (alpha > eval) ? alpha : eval;
            if (beta <= alpha)
                break; // Beta cut-off
        }
        return maxEval;
    } else {
        // white to play
        //  Generate all possible moves from this state
        for (int i = 0; i < 16; i++) {
            if (tempWhite[i].alive) {
                legalMove(tempWhite[i], tempBoard, possibleMoves, &n,tempWhite,tempBlack,1,indexOfLastPiecePlayed,1);
            }
        }
        float minEval = FLT_MAX;
        float eval;
        int indexOfKilledPiece=-1;
        int indexOfKilledPawn=-1;
        // Iterate through each possible move and recursively call minimax
        for (int i = 0; i < n; i++) {
            //update indexOfLastPiecePlayed
            indexOfLastPiecePlayed=findIndexOfPiece(possibleMoves[i].x0,possibleMoves[i].y0,1,tempWhite,tempBlack);
            // Make move
            if (tempBoard[possibleMoves[i].y][possibleMoves[i].x] != 0) {
                indexOfKilledPiece=killPiece(possibleMoves[i].x, possibleMoves[i].y, 0, tempWhite, tempBlack);
            }
            indexOfKilledPawn=makeMove(possibleMoves[i].x0, possibleMoves[i].y0, possibleMoves[i].x, possibleMoves[i].y,possibleMoves[i].promotion,possibleMoves[i].isKnightPromotion,  tempBoard, 1, tempWhite, tempBlack);
            //
            eval = minimax(tempBoard, tempWhite, tempBlack, depth - 1, alpha, beta, 1, 0,indexOfLastPiecePlayed);
            // Undo move
            makeMove(possibleMoves[i].x, possibleMoves[i].y, possibleMoves[i].x0, possibleMoves[i].y0,possibleMoves[i].promotion,possibleMoves[i].isKnightPromotion,  tempBoard, 1, tempWhite, tempBlack);
            if (indexOfKilledPiece!=-1) {
                AlivePiece(possibleMoves[i].x, possibleMoves[i].y,indexOfKilledPiece,tempBoard,0, tempWhite, tempBlack);
                indexOfKilledPiece=-1;
            }else if(indexOfKilledPawn!=-1){
                AlivePiece(possibleMoves[i].x, possibleMoves[i].y0,indexOfKilledPawn,tempBoard,0, tempWhite, tempBlack);
                indexOfKilledPawn=-1;
            }
            if (eval < minEval) {
                minEval = eval;
            }
            beta = (beta < eval) ? beta : eval;
            if (beta <= alpha)
                break; // Alpha cut-off
        }
        return minEval;
    }
}
int main(){
    int depth = 5;
    int x0,y0,x,y,promotion,isKnightPromotion;
    int indexOfLastPiecePlayed=-1;
    struct Piece black[16] ;
    struct  Piece white[16] ;
    int c;
    int board[8][8] = {
    { rook, knight, bishop, queen, king, bishop, knight, rook},   // black Rook, isKnight, Bishop, Queen, King, Bishop, isKnight, Rook

    { pawn, pawn  , pawn  , pawn , pawn,  pawn ,  pawn , pawn},   // black Pawns

    {   0 ,   0   ,   0   ,   0  ,  0  ,    0  ,   0   ,   0 },   // Empty squares

    {   0 ,   0   ,   0   ,   0  ,  0  ,    0  ,   0   ,   0 },

    {   0 ,   0   ,   0   ,   0  ,  0  ,    0  ,   0   ,   0 },

    {   0 ,   0   ,   0   ,   0  ,  0  ,    0  ,   0   ,   0 },

    {-pawn, -pawn , -pawn , -pawn,-pawn, -pawn , -pawn ,-pawn},   // white Pawns

    {-rook,-knight,-bishop,-queen,-king,-bishop,-knight,-rook}    // white Rook, isKnight, Bishop, Queen, King, Bishop, isKnight, Rook
    };
    char move[10];
    int m=0,n=0;

    int maximizingPlayer = 1; 
    float bestMoveValue ;
    int indexOfKilledPiece=-1;

    for(int i=0;i<8;i++){
        for(int j=0;j<8;j++){
            if(board[i][j]<0){
                white[m].piece=board[i][j];
                white[m].x=j;
                white[m].y=i;
                white[m].alive=1;
                white[m].moveCount=0;
                white[m].isKnight = (j == 1 || j == 6) ? 1 : 0;
                m++;
            }else if(board[i][j]>0){
                black[n].piece=board[i][j];
                black[n].x=j;
                black[n].y=i;
                black[n].alive=1;
                black[n].moveCount=0;
                black[n].isKnight = (j == 1 || j == 6) ? 1 : 0;
                n++;
            }
        }
    }
    printGame(board);
    // game
    while(1){
        //get the coordinate from user

        printf("give  the coordinates of your next move:\n");
        fgets(move, sizeof(move), stdin); // Read input line by line
        move[strcspn(move, "\n")] = '\0'; // Remove trailing newline character
        while ((c = getchar()) != '\n' && c != EOF);// Clear input buffer

        // get the coordinate of move
        x0=getx0(move);
        y0=gety0(move);
        x=getx1(move);
        y=gety1(move);
        promotion=-getPromo(move);
        isKnightPromotion=getIsKnightPromo(move);        
        //
        if(y0==9){
            break;
        }
        //update indexOfLastPiecePlayed
        indexOfLastPiecePlayed=findIndexOfPiece(x0,y0,1,white,black);
        //make the move of white
        if(board[y][x]!=0){
            killPiece(x,y,0,white,black);
        }
        makeMove(x0,y0,x,y,promotion,isKnightPromotion,board,1,white,black);
        //print game
        printGame(board);
        //get the best move for black
        bestMoveValue = minimax(board,white,black ,depth, -FLT_MAX, FLT_MAX, maximizingPlayer,1,indexOfLastPiecePlayed);
        printf("-------------------------\n");
        printf("evaluate position value : %f\n",evaluatePosition(board,white,black,indexOfLastPiecePlayed));
        printf("best move value : %f\n",bestMoveValue);
        printf("-------------------------\n");
        //get the coordinate of best move
        x0=bestMove.fromCol;
        y0=bestMove.fromRow;
        x=bestMove.toCol;
        y=bestMove.toRow;
        promotion=bestMove.promotion;
        isKnightPromotion=bestMove.isKnightPromotion;
        //make the move of black
        if(board[y][x]!=0){
            killPiece(x,y,1,white,black);
        }
        makeMove(x0,y0,x,y,promotion,isKnightPromotion,board,0,white,black);
        // print the move
        printf("%c%d - %c%d - %d - %d \n", 'a'+x0, 8-y0, 'a'+x, 8-y,promotion,isKnightPromotion);
        //print game
        printGame(board);

    }

    return 0;
}