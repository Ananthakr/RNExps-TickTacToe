import React, {useEffect, useState} from 'react';
import {
  Dimensions,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from 'react-native';
import {Colors} from 'react-native/Libraries/NewAppScreen';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const appStates = {
  not_started: 'not_started',
  player_one_turn: 'player_one_turn',
  player_two_turn: 'player_two_turn',
  result_player_one_won: 'result_player_one_won',
  result_player_two_won: 'result_player_two_won',
  result_game_tied: 'result_game_tied',
};

type GameState = Array<Array<String>>;

const App = () => {
  const isDarkMode = useColorScheme() === 'dark';

  const [gameState, setGameState] = useState<GameState>([
    ['', '', ''],
    ['', '', ''],
    ['', '', ''],
  ]);
  const [appState, setAppState] = useState<String>(appStates.not_started);

  const resetGameState = () => {
    setGameState([
      ['', '', ''],
      ['', '', ''],
      ['', '', ''],
    ]);
  };

  const hasGameWon: (state: GameState, symbol: String) => Boolean = (
    state,
    symbol,
  ) => {
    if (
      // row X
      (state[0][0] === symbol &&
        state[0][1] === symbol &&
        state[0][2] === symbol) ||
      (state[1][0] === symbol &&
        state[1][1] === symbol &&
        state[1][2] === symbol) ||
      (state[2][0] === symbol &&
        state[2][1] === symbol &&
        state[2][2] === symbol) ||
      // column X
      (state[0][0] === symbol &&
        state[1][0] === symbol &&
        state[2][0] === symbol) ||
      (state[0][1] === symbol &&
        state[1][1] === symbol &&
        state[2][1] === symbol) ||
      (state[0][2] === symbol &&
        state[1][2] === symbol &&
        state[2][2] === symbol) ||
      // cross X
      (state[0][0] === symbol &&
        state[1][1] === symbol &&
        state[2][2] === symbol) ||
      (state[2][0] === symbol &&
        state[1][1] === symbol &&
        state[0][2] === symbol)
    ) {
      return true;
    }
    return false;
  };

  const hasGameTied: (state: GameState) => Boolean = state => {
    if (
      state[0].join('').length === 3 &&
      state[1].join('').length === 3 &&
      state[2].join('').length === 3
    ) {
      return true;
    }
    return false;
  };

  useEffect(() => {
    if (
      appState === appStates.player_one_turn ||
      appState === appStates.player_two_turn
    ) {
      if (hasGameWon(gameState, 'X'))
        setAppState(appStates.result_player_one_won);
      else if (hasGameWon(gameState, 'O'))
        setAppState(appStates.result_player_two_won);
      else if (hasGameTied(gameState)) setAppState(appStates.result_game_tied);
      else
        setAppState(
          appState === appStates.player_one_turn
            ? appStates.player_two_turn
            : appStates.player_one_turn,
        );
    }
  }, [gameState]);

  return (
    <SafeAreaView style={styles.backgroundStyle}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <View style={styles.gameWrapper}>
        <View
          style={{
            ...styles.gridContainer,
            opacity:
              appState === appStates.player_one_turn ||
              appState === appStates.player_two_turn
                ? 1
                : 0.2,
          }}>
          {gameState.map((row, i) => (
            <View style={styles.gridRow} key={i}>
              {row.map((item, j) => (
                <TouchableOpacity
                  activeOpacity={0.6}
                  disabled={
                    (appState !== appStates.player_one_turn &&
                      appState !== appStates.player_two_turn) ||
                    item !== ''
                  }
                  onPress={() => {
                    const newState = gameState;

                    if (appState === appStates.player_one_turn) {
                      newState[i][j] = 'X';
                    } else if (appState === appStates.player_two_turn) {
                      newState[i][j] = 'O';
                    }
                    setGameState([...newState]);
                  }}
                  key={j}>
                  <View style={styles.gridItem}>
                    <Text style={styles.gridItemContent}>{item}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          ))}
        </View>
        <View style={styles.statusContainer}>
          <View style={styles.statusWrapper}>
            <Text style={styles.statusText}>{appState}</Text>
          </View>
          {appState !== appStates.player_one_turn &&
          appState !== appStates.player_two_turn ? (
            <TouchableOpacity
              activeOpacity={0.6}
              onPress={() => {
                if (appState === appStates.not_started) {
                  setAppState(appStates.player_one_turn);
                } else if (
                  appState === appStates.result_player_one_won ||
                  appState === appStates.result_player_two_won ||
                  appState === appStates.result_game_tied
                ) {
                  resetGameState();
                  setAppState(appStates.not_started);
                }
              }}>
              <View style={styles.statusButton}>
                <Text style={styles.statusButtonText}>
                  {appState === appStates.not_started
                    ? 'Start'
                    : appState === appStates.result_player_one_won ||
                      appState === appStates.result_player_two_won ||
                      appState === appStates.result_game_tied
                    ? 'Restart'
                    : ''}
                </Text>
              </View>
            </TouchableOpacity>
          ) : null}
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  backgroundStyle: {
    backgroundColor: Colors.lighter,
    height: windowHeight,
  },
  gameWrapper: {
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  gridContainer: {
    marginVertical: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  gridRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  gridItem: {
    width: windowWidth / 6,
    height: windowWidth / 6,
    borderColor: '#000',
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  gridItemContent: {
    fontSize: 28,
    textAlign: 'center',
  },

  statusContainer: {
    padding: 10,
  },
  statusWrapper: {
    marginVertical: 10,
  },
  statusText: {
    fontSize: 18,
    textAlign: 'center',
    color: '#222',
  },
  statusButton: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 2,
    borderWidth: 2,
    borderColor: '#222',
  },
  statusButtonText: {
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
    color: '#222',
    textTransform: 'uppercase',
  },
});

export default App;
