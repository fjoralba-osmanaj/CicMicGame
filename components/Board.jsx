import React from 'react';
import { View, TouchableOpacity, Dimensions, StyleSheet } from 'react-native';
import Svg, { Line,  } from 'react-native-svg';
import { Image } from 'react-native';

const Board = ({ onPointPress, boardState = Array(24).fill(null),validMoves = [],
  selectedPiece = null  }) => {
  const boardSize = 300;
 
  // Koordinatat e 24 pozitave
  const points = [
    // Katrori i jashtem
    { x: 30, y: 30 }, { x: 150, y: 30 }, { x: 270, y: 30 },
    { x: 270, y: 150 }, { x: 270, y: 270 }, 
    { x: 150, y: 270 }, { x: 30, y: 270 },
    { x: 30, y: 150 },
    // Katrori i mesit
    { x: 70, y: 70 }, { x: 150, y: 70 }, { x: 230, y: 70 },
    { x: 230, y: 150 }, { x: 230, y: 230 },
    { x: 150, y: 230 }, { x: 70, y: 230 },
    { x: 70, y: 150 },
    // Katrori i brendshem
    { x: 110, y: 110 }, { x: 150, y: 110 }, { x: 190, y: 110 },
    { x: 190, y: 150 }, { x: 190, y: 190 },
    { x: 150, y: 190 }, { x: 110, y: 190 },
    { x: 110, y: 150 }
  ];

  // Vijat horizontale dhe vertikale qe plotesojne tabelen e lojes
  const lines = [
    // Katrori i jashtem
    [0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [6, 7], [7, 0],
    
    // Katrori i mesit
    [8, 9], [9, 10], [10, 11], [11, 12], [12, 13], [13, 14], [14, 15], [15, 8],
    
    // Katrori i brendshem
    [16, 17], [17, 18], [18, 19], [19, 20], [20, 21], [21, 22], [22, 23], [23, 16],
    
    // Vijat vertikale
    [1, 9], [9, 17],   
    [5, 13], [13, 21], 
    
    // Vijat horizontale
    [3, 11], [11, 19], 
    [7, 15], [15, 23]  
  ];

  return (
    <View style={{ 
      
      alignItems: 'center', 
      justifyContent: 'center', 
      flex: 1,
      
    }}>
      {/* Madhesia e tabeles */}
      <View style={{ width: boardSize, height: boardSize }}>
      
        {/* Vijat e tabeles */}
        <Svg height={boardSize} width={boardSize} pointerEvents="none" style={{ zIndex: 1 }}>
          {lines.map(([start, end], index) => (
            <Line
              key={index}
              x1={points[start].x}
              y1={points[start].y}
              x2={points[end].x}
              y2={points[end].y}
              stroke='rgba(22, 16, 7, 0.8)'
              strokeWidth="3.5"
            />
          ))}
        </Svg>
        {/*Imazhi i tabeles */}
        <Image
               source={require('../assets/images/board7.png')}
               style={styles.piece}
             />
             
        {/* Pikat e tabeles ku vendosen figurat e lojes */}
        {points.map((point, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => onPointPress(index)}
            style={{
              position: 'absolute',
              left: point.x - 10,
              top: point.y - 10,
              width: 20,
              height: 20,
              borderRadius: 15,
              backgroundColor: 
              selectedPiece === index ? 'rgba(0,255,0,0.5)' : // Ngjyra e gjelbert, ne rastin kur selektojme nje figure
              validMoves.includes(index) ? 'rgba(0,0,255,0.5)' : // E kalter per levizjet e lejuara
              'rgba(22, 16, 7, 0.9)', // E kafte per pozite normale
              justifyContent: 'center',
              alignItems: 'center',
              zIndex: 2,
            }}
          >
            {/* Pamja e pozitave boshe */}
            {boardState[index] === null && (
              <View
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: 3,
                  backgroundColor:' rgba(22, 16, 7, 0.8)',
                }}
              />
            )}
              
             {/* Figurat e lojtareve, te modifikuara me imazhe fasules dhe misrit*/}
             {boardState[index] === 1 && (
            <Image
              source={require('../assets/images/bean.png')}
              style={styles.pieceImage}
            />
          )}
          {boardState[index] === 2 && (
            <Image
              source={require('../assets/images/corn (2).png')}
              style={styles.pieceImage}
            />
          )}
          
                  
          </TouchableOpacity>
        ))}
        
      </View>
      
          
    </View>
  );
};
// Stilet
const { width, height } = Dimensions.get('window');
const styles = StyleSheet.create({
  pieceImage: { //Stilizimi i imazheve te figurave
    width: 40,      
    height: 40,
    resizeMode: 'contain', 
    position: 'absolute',
    top: -10,         
    left: -10,        
  },
  piece: { //Stilizimi i imazhit te tabeles
    width: 400,
    height: 400,
    position: 'absolute',
    justifyContent: 'center',
    top: -49,
    left:-49,
    borderRadius: 8,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.9,
    shadowRadius: 8,
    
  },
  backgroundContainer: { //Stilizimi i imazhit ne sfond
    flex: 1,
    width: width,  
    height: height,
    
  }
});

export default Board;