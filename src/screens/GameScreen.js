import React, { useState, useEffect } from "react";
import {
  View,
  Dimensions,
  StyleSheet,
  Alert,
  Text,
  Vibration,
} from "react-native";
import { PanGestureHandler } from "react-native-gesture-handler";

const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;

export default function GameScreen() {
  const [ballX, setBallX] = useState(screenWidth / 2 - 15);
  const [ballY, setBallY] = useState(screenHeight / 2 - 15);
  const [ballDirectionX, setBallDirectionX] = useState(13);
  const [ballDirectionY, setBallDirectionY] = useState(13);
  const [bricks, setBricks] = useState([
    { x: screenWidth / 3 - 50, y: 100 },
    { x: (screenWidth / 3) * 2 - 50, y: 150 },
    { x: screenWidth / 2 - 50, y: 200 },
  ]);
  const [paddleX, setPaddleX] = useState(screenWidth / 2 - 50);
  const [isPaused, setIsPaused] = useState(false);
  const [level, setLevel] = useState(1);

  const ballSize = 30;
  const paddleWidth = 100;
  const paddleHeight = 20;

  useEffect(() => {
    if (!isPaused) {
      const interval = setInterval(() => {
        moveBall();
      }, 10);
      return () => clearInterval(interval);
    }
  }, [ballX, ballY, ballDirectionX, ballDirectionY, paddleX, isPaused]);

  /**
   * Esta função move a bola pela tela, atualizando suas coordenadas e verificando colisões com as bordas, plataforma e tijolos.
   */
  const moveBall = () => {
    setBallX((prev) => prev + ballDirectionX);
    setBallY((prev) => prev + ballDirectionY);

    if (ballX <= 0) {
      setBallX(1);
      setBallDirectionX((prev) => -prev);
    } else if (ballX >= screenWidth - ballSize) {
      setBallX(screenWidth - ballSize - 1);
      setBallDirectionX((prev) => -prev);
    }

    if (ballY <= 0) {
      setBallY(1);
      setBallDirectionY((prev) => -prev);
    }

    if (
      ballY + ballSize >= screenHeight - paddleHeight - 80 &&
      ballX + ballSize >= paddleX &&
      ballX <= paddleX + paddleWidth
    ) {
      setBallY(screenHeight - paddleHeight - ballSize - 81);
      setBallDirectionY((prev) => -prev);
    }

    if (ballY > screenHeight) {
      handleGameOver();
    }

    checkBrickCollisions();
  };
  /**
   * Esta função exibe um alerta de "Game Over" quando a bola passa pela base e reinicia o jogo.
   */
  const handleGameOver = () => {
    Vibration.vibrate(500);
    setIsPaused(true);
    Alert.alert("Game Over", "A bola passou pela base!", [
      { text: "Reiniciar", onPress: resetGame },
    ]);
  };

  /**
   * Esta função gera os tijolos para o nível atual, organizados em linhas e colunas.
   * A quantidade de linhas aumenta conforme o nível.
   */
  const generateBricks = (level) => {
    const numberOfRows = level;
    const numberOfColumns = 4;
    const brickWidth = 100;
    const brickHeight = 30;
    const horizontalPadding =
      (screenWidth - numberOfColumns * brickWidth) / (numberOfColumns + 1);
    const verticalPadding = 20;

    const newBricks = [];

    for (let row = 0; row < numberOfRows; row++) {
      for (let col = 0; col < numberOfColumns; col++) {
        newBricks.push({
          x: horizontalPadding + col * (brickWidth + horizontalPadding),
          y: 100 + row * (brickHeight + verticalPadding),
        });
      }
    }

    setBricks(newBricks);
    Vibration.vibrate(500);
  };
  /**
   * funçao de mensagem de vitoria e proximo nivel
   *
   */
  const handleWin = () => {
    setIsPaused(true);
    Alert.alert("Vitória", "Você quebrou todos os tijolos!", [
      { text: "Próximo nível", onPress: nextLevel },
    ]);
  };

  /**
   * Esta funçao chama o próximo nivel
   *
   */

  const nextLevel = () => {
    setLevel((prevLevel) => prevLevel + 1); // Incrementa o nível
    setBallX(screenWidth / 2 - 15);
    setBallY(screenHeight / 2 - 15);
    setBallDirectionX(13);
    setBallDirectionY(13);
    generateBricks(level);
    setIsPaused(false);
    verificaNivel(level);
  };
  /**
   * Esta função verifica se o jogador venceu o último nível e exibe uma mensagem de "Vitória".
   */
  const verificaNivel = (level) => {
    if (level === 3) {
      setIsPaused(true);
      Alert.alert("Vitória", "Você venceu todos os niveis!");
    }
  };

  /**
   * Esta função reseta o estado do jogo para a condição inicial.
   */
  const resetGame = () => {
    setBallX(screenWidth / 2 - 15);
    setBallY(screenHeight / 2 - 15);
    setBallDirectionX(13);
    setBallDirectionY(13);
    setBricks([
      { x: screenWidth / 3 - 50, y: 100 },
      { x: (screenWidth / 3) * 2 - 50, y: 150 },
      { x: screenWidth / 2 - 50, y: 200 },
    ]);
    setLevel(1); // Reinicia o nível
    setIsPaused(false);
    Vibration.vibrate(500);
  };
  /**
   * Esta função verifica colisões entre a bola e os tijolos.
   * Remove os tijolos atingidos e inverte a direção da bola.
   */
  const checkBrickCollisions = () => {
    setBricks((prevBricks) => {
      const remainingBricks = prevBricks.filter((brick) => {
        if (
          ballX >= brick.x &&
          ballX <= brick.x + 100 &&
          ballY >= brick.y &&
          ballY <= brick.y + 30
        ) {
          setBallDirectionY((prev) => -prev);
          return false;
        }
        return true;
      });

      if (remainingBricks.length === 0) {
        handleWin();
      }

      return remainingBricks;
    });
  };

  return (
    <View style={styles.container}>
      {/* Contador de nível */}
      <Text style={styles.level}>Nível: {level}</Text>

      {/* Exibir tijolos */}
      {bricks.map((brick, index) => (
        <View
          key={index}
          style={[styles.brick, { left: brick.x, top: brick.y }]}
        />
      ))}

      {/* Exibir bola */}
      <View style={[styles.ball, { left: ballX, top: ballY }]} />

      {/* Paddle do jogador */}
      <PanGestureHandler
        onGestureEvent={(e) => {
          setPaddleX(
            Math.max(
              Math.min(e.nativeEvent.translationX, screenWidth - paddleWidth),
              0
            )
          );
        }}
      >
        <View style={[styles.paddle, { left: paddleX }]} />
      </PanGestureHandler>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f0f0",
    justifyContent: "flex-start", // Alinha o conteúdo no topo
  },
  level: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#000",
    position: "absolute",
    top: 20,
    left: 20,
  },
  brick: {
    position: "absolute",
    width: 100,
    height: 30,
    backgroundColor: "#6200ee",
  },
  ball: {
    position: "absolute",
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#ff4081",
  },
  paddle: {
    position: "absolute",
    bottom: 20,
    width: 100,
    height: 20,
    backgroundColor: "#6200ee",
  },
});
