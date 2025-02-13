import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Alert,Dimensions } from 'react-native';
import OpeningScreen from './app/OpeningScreen';
import Board from './components/Board';

/**
 * Krijon nje harte te pozitave qe jane afer njera tjetres.
 */
const createAdjacencyMap = (lines) => {
  const adjacency = {};
  lines.forEach(([a, b]) => {
    adjacency[a] = [...(adjacency[a] || []), b];
    adjacency[b] = [...(adjacency[b] || []), a];
  });
  return adjacency;
};
const { width, height } = Dimensions.get('window'); //Merr dimensionet e sakta te pajisjes ne perdorim

const Game = () => {
  // Variablat e gjendjes se lojes
  const [boardState, setBoardState] = useState(Array(24).fill(null)); // Pozitat e tabeles
  const [currentPlayer, setCurrentPlayer] = useState(1); // Gjen lojtarin aktual
  const [phase, setPhase] = useState('placing'); // Fazat e lojes
  const [piecesPlaced, setPiecesPlaced] = useState({ 1: 0, 2: 0 }); // Gjurmon figurat e vendosura
  const [selectedPiece, setSelectedPiece] = useState(null); // Gjurmon figurat e zgjedhura per levizje
  const [validMoves, setValidMoves] = useState([]); // Levizjet e vlefshme
  const [gameStarted, setGameStarted] = useState(false); 
  const handleStartGame = () => {
    setGameStarted(true);
  };

  
  // Harta per levizje ne pozitat e ngjitura, e modifikuar njejte sikur tek Board.jsx
  const adjacencyMap = createAdjacencyMap([
    
    [0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [6, 7], [7, 0],
    
    [8, 9], [9, 10], [10, 11], [11, 12], [12, 13], [13, 14], [14, 15], [15, 8],
    
    [16, 17], [17, 18], [18, 19], [19, 20], [20, 21], [21, 22], [22, 23], [23, 16],
    
    [1, 9], [9, 17],   
    [5, 13], [13, 21], 
   
    [3, 11], [11, 19], 
    [7, 15], [15, 23]  
  ]);

  // Detektimi i pozites dan(tre figura te vendosura ne tre pozita te ngjitura)
  const isMill = (position, board, player) => {
    const mills = [
      [0, 1, 2], [4, 5, 6], [8, 9, 10], [12, 13, 14], [16, 17, 18], [20, 21, 22],
      [2, 3, 4], [6, 7, 0], [10, 11, 12], [14, 15, 8], [18, 19, 20], [22, 23, 16],
      [1, 9, 17], [5, 13, 21], [3, 11, 19], [7, 15, 23]
    ];
    return mills.some(mill =>
      mill.includes(position) && mill.every(pos => board[pos] === player)
    );
  };

  /**
   * Mundeson vendosjen e figurave ne tabele
   */
  useEffect(() => {
    if (piecesPlaced[1] === 9 && piecesPlaced[2] === 9) {
      setPhase('moving');
      Alert.alert('Movement Phase', 'All pieces placed! Now move your pieces.');
    }
  }, [piecesPlaced]);

  /**
   * Mundeson eventet e shtypjes se pozitave te tabeles
   */
  const handlePointPress = (index) => {
    if (phase === 'placing') {
      handlePlacingPhase(index);
    } else if (phase === 'moving') {
      handleMovingPhase(index);
    } else if (phase === 'removing') {
      handleRemovingPhase(index);
    }
  };

  /**
   * Kontrollon vendosjen e figurave ne tabele
   */
  const handlePlacingPhase = (index) => {
    if (boardState[index] !== null || piecesPlaced[currentPlayer] >= 9) return;

    const newBoard = [...boardState];
    newBoard[index] = currentPlayer;
    setBoardState(newBoard);

    setPiecesPlaced(prev => ({
      ...prev,
      [currentPlayer]: prev[currentPlayer] + 1,
    }));

    if (isMill(index, newBoard, currentPlayer)) {
      setPhase('removing');
    } else {
      setCurrentPlayer(currentPlayer === 1 ? 2 : 1);
    }
  };

  /**
   * Kontrollon fazen e levizjeve kur figurat jane vendosur ne tabele
   */
  const handleMovingPhase = (index) => {
    // Nese lojtari selekton figuren e tij
    if (boardState[index] === currentPlayer) {
      // Selekton figuren per levizje
      setSelectedPiece(index);

    // Numeron figurat e lojtarit qe ka radhen
       const currentPieces = boardState.filter(p => p === currentPlayer).length;

      if (currentPieces === 3) {
        // Lejon levizjen ne cdo pozite te lire(rregull e lojes)
        setValidMoves(
          boardState
            .map((_, i) => (boardState[i] === null ? i : -1)) // Kontrollon pozitat e lira
            .filter(i => i !== -1) // Filtron pozitat qe nuk jane te lira
        );
      } else {
        // Lejon vetem levizje normale(ne pozitat e ngjitura)
        setValidMoves(
          adjacencyMap[index].filter(pos => boardState[pos] === null) // Filtron pozitat e ngjitura qe jane te lira
        );
      }
    }
    // Nese lojtari ben nje levizje te vlefshme
     if (selectedPiece !== null && validMoves.includes(index)) {
      // Levize figuren tek pozita e re
      const newBoard = [...boardState];
      newBoard[selectedPiece] = null; // Liron poziten e vjeter
      newBoard[index] = currentPlayer; // Vendos figuren ne poziten e re
      setBoardState(newBoard);

      // Kontrollon nese levizja krijon nje dan
      if (isMill(index, newBoard, currentPlayer)) {
        setPhase('removing');
      } else {
        setCurrentPlayer(currentPlayer === 1 ? 2 : 1);
      }

      // Restarton 
      setSelectedPiece(null);
      setValidMoves([]);

      // Kontrollon nese lojtari ne radhe ka me pak se 3 figura
      const currentPiecesAfterMove = newBoard.filter(p => p === currentPlayer).length;
      if (currentPiecesAfterMove < 3) {//Nese lojtari ka me pak se 3 figura atehere loja perfundon
        handleRestartingPhase();
      }

      // Kontrollon nese kundershtari ka levizje te vlefshme
      const opponent = currentPlayer === 1 ? 2 : 1;
      const opponentHasValidMoves = checkPlayerHasValidMoves(opponent, newBoard);

      if (!opponentHasValidMoves) {//Nese kundershtari nuk ka levizje, atehere loja perfundon
        Alert.alert('Game Over', `Player ${opponent} has no moves. Restarting the game.`, [
          {
            text: 'OK',
            onPress: () => {
              // Restarton gjendjen e lojes
              setBoardState(Array(24).fill(null));
              setPhase('placing');
              setPiecesPlaced({ 1: 0, 2: 0 });
              setCurrentPlayer(1);
              setSelectedPiece(null);
              setValidMoves([]);
            },
          },
        ]);
      }
    }
  };

  /**
   * Faza e largimit te figurave te kundershtarit
   */
  const handleRemovingPhase = (index) => {
    const opponent = currentPlayer === 1 ? 2 : 1;

    if (boardState[index] !== opponent) return;

    const opponentPieces = boardState.map((p, idx) => (p === opponent ? idx : -1)).filter(i => i !== -1);
    const allInMills = opponentPieces.every(pos => isMill(pos, boardState, opponent));//Kontrollon nese kundershtari ka figura ne poziten dan

    if (!isMill(index, boardState, opponent) || allInMills) {
      const newBoard = [...boardState];
      newBoard[index] = null;
      setBoardState(newBoard);

      // Kontrollon nese te gjitha figurat jane vendosur para se te vazhdoje tek faza e levizjes
      if (piecesPlaced[1] === 9 && piecesPlaced[2] === 9) {
        setPhase('moving');
      } else {
        setPhase('placing');
      }
      setCurrentPlayer(currentPlayer === 1 ? 2 : 1);
    } else {
      Alert.alert('Invalid Removal', 'Cannot remove a piece in a mill unless all opponent pieces are in mills.');
    }
  };

  /**
   * Kontrollon nese lojtari ka levizje te vlefshme
   */
  const checkPlayerHasValidMoves = (player, board) => {
    const playerPieces = board
      .map((val, idx) => (val === player ? idx : -1))
      .filter(i => i !== -1);

    return playerPieces.some(pieceIndex => {
      const destinations = getValidMovesForPiece(pieceIndex, board);
      return destinations.length > 0;
    });
  };

  /**
   * Kthen levizjet e vlefshme per figuren e selektuar
   */
  const getValidMovesForPiece = (pieceIndex, board) => {
    const currentPieces = board.filter(p => p === currentPlayer).length;

    if (currentPieces === 3) {
      
      return board.map((_, i) => (board[i] === null ? i : -1)).filter(i => i !== -1);
    } else {
      
      return adjacencyMap[pieceIndex].filter(pos => board[pos] === null);
    }
  };

  /**
   * Faza e restartimit
   */
  const handleRestartingPhase = () => {
    Alert.alert('Game Over', `Player ${currentPlayer} has fewer than 3 pieces. Restarting the game.`, [
      {
        text: 'OK',
        onPress: () => {
          // Reset the game state
          setBoardState(Array(24).fill(null));
          setPhase('placing');
          setPiecesPlaced({ 1: 0, 2: 0 });
          setCurrentPlayer(1);
          setSelectedPiece(null);
          setValidMoves([]);
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      {/* Teksti i statusit te lojes */}
      {gameStarted && (
        <Text style={styles.statusText}>
          {phase === 'placing' && `Player ${currentPlayer} Place Piece (${9 - piecesPlaced[currentPlayer]} left)`}
          {phase === 'moving' && `Player ${currentPlayer} Move Piece`}
          {phase === 'removing' && `Player ${currentPlayer}: Remove Opponent's Piece`}
        </Text>
        
      )}
  
      {/* Shikon nese loja ka filluar */}
      {!gameStarted ? (
        
        <OpeningScreen onStartGame={handleStartGame} />
      
      ) : (
        <Board
          boardState={boardState}
          onPointPress={handlePointPress}
          validMoves={validMoves}
          selectedPiece={selectedPiece}
        />
      )}
    </View>
  );
  
  
  
};

const styles = StyleSheet.create({
  
  
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    
  },
  statusText: {//Stilizon tekstin
    
    fontSize: width *0.05, // Responsive font size
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: -200,
    marginTop: 200 ,
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 10,
    
    
    
  },
});

export default Game;