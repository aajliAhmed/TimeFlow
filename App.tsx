import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Platform,
  StatusBar as RNStatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import ModernGauge from './ModernGauge';

// Configuration des périodes
const MORNING_START = 9 * 60 * 60; // 9h00 en secondes
const MORNING_END = 13 * 60 * 60; // 13h00 en secondes
const AFTERNOON_START = 14 * 60 * 60; // 14h00 en secondes
const AFTERNOON_END = 18 * 60 * 60; // 18h00 en secondes

const App: React.FC = () => {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      
      <View style={styles.header}>
        <Text style={styles.title}>TimeFlow</Text>
        <Text style={styles.subtitle}>Tableau de Bord</Text>
      </View>

      <View style={styles.gaugesContainer}>
        <ModernGauge
          startTime={MORNING_START}
          endTime={MORNING_END}
          label="Matin (09:00 - 13:00)"
          primaryColor="#00FFFF" // Cyan clair
          secondaryColor="#0066FF" // Bleu électrique
        />
        
        <ModernGauge
          startTime={AFTERNOON_START}
          endTime={AFTERNOON_END}
          label="Après-midi (14:00 - 18:00)"
          primaryColor="#FF6B35" // Orange vif
          secondaryColor="#FF1493" // Rose/Rouge (Deep Pink)
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000', // Noir profond
  },
  header: {
    alignItems: 'center',
    paddingTop: 10,
    paddingBottom: 8,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
    letterSpacing: 1.5,
    textShadowColor: 'rgba(255, 255, 255, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
  },
  subtitle: {
    fontSize: 12,
    color: '#888888',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  gaugesContainer: {
    flex: 1,
    justifyContent: 'space-evenly',
    alignItems: 'center',
    paddingVertical: 8,
    paddingBottom: 16,
  },
});

export default App;
