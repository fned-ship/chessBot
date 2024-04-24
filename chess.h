#ifndef chess
#define chess
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

int getIndexOfPawn(int x , int blackWhite );
int findIndexOfPiece(int x , int y , int whiteBlack , struct Piece white[16] , struct Piece  black[16]);
int makeMove(int x0 , int y0 , int x , int y , int promotion , int isKnightPromotion , int * board , int blackWhite,struct Piece * white , struct Piece * black);
int killPiece(int x , int y ,int whiteBlack , struct Piece * white , struct Piece * black);
void AlivePiece(int x , int y,int index ,int * board  ,int whiteBlack , struct Piece * white , struct Piece * black);
int shortCastling(int board[8][8],int whiteBlack,struct Piece white[16],struct Piece black[16],int indexOfLastPiecePlayed);
int longCastling(int board[8][8],int whiteBlack,struct Piece white[16],struct Piece black[16],int indexOfLastPiecePlayed);
int danger(struct Piece currentPos ,int x , int y , int board[8][8],int blackWhite);
void legalMove(struct Piece currentPos,int board[8][8],struct Pos * possibleMoves,int * n ,struct Piece white[16],struct Piece black[16] , int recursive , int indexOfLastPiecePlayed );
int getx0(char coordinate[12]);
int gety0(char coordinate[12]);
int getx1(char coordinate[12]);
int gety1(char coordinate[12]);
int getPromo(char coordinate[12]);
int getGameOver(char coordinate[12]);
int getIsKnightPromo(char coordinate[12]);
void printMove(int x0 , int y0 ,int x ,int y );
void printGame(int board[8][8]);
float evaluatePosition(int board[8][8] ,struct Piece white[16],struct Piece black[16],int indexOfLastPiecePlayed);
int gameOver(int board[8][8]);
void copyBoard(int (*source)[8], int (*destination)[8]);
void copyPieces( struct Piece * source ,  struct Piece * destination ) ;
float minimax(int board[8][8], struct Piece white[16], struct Piece black[16], int depth, float alpha, float beta, int maximizingPlayer, int state , int indexOfLastPiecePlayed) ;
#endif