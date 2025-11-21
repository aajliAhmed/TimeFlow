import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Dimensions, Animated, Easing } from 'react-native';
import Svg, {
  Path,
  Defs,
  LinearGradient,
  Stop,
  Filter,
  FeGaussianBlur,
  FeMerge,
  FeMergeNode,
} from 'react-native-svg';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const GAUGE_SIZE = SCREEN_WIDTH * 0.75;
const GAUGE_RADIUS = GAUGE_SIZE / 2;
const STROKE_WIDTH = 16; // Augmenté de 12 à 16 pour plus de présence visuelle
const TRACK_STROKE_WIDTH = 10;
const INNER_RADIUS = GAUGE_RADIUS - STROKE_WIDTH / 2;

interface ModernGaugeProps {
  startTime: number; // en secondes depuis minuit
  endTime: number; // en secondes depuis minuit
  label: string;
  primaryColor: string;
  secondaryColor: string;
  darkTrackColor?: string;
}

const ModernGauge: React.FC<ModernGaugeProps> = ({
  startTime,
  endTime,
  label,
  primaryColor,
  secondaryColor,
  darkTrackColor = 'rgba(100, 100, 100, 0.2)',
}) => {
  const [secondsRemaining, setSecondsRemaining] = useState(0);
  const [progressPath, setProgressPath] = useState('');

  // Créer un ID unique et valide pour les filtres SVG (sans espaces ni caractères spéciaux)
  const filterId = `glow-${startTime}-${endTime}`.replace(/[^a-zA-Z0-9-]/g, '-');
  const gradientId = `gradient-${startTime}-${endTime}`.replace(/[^a-zA-Z0-9-]/g, '-');

  // Valeurs animées avec Animated API native
  const progressArc = useRef(new Animated.Value(0)).current;
  const initialAnimation = useRef(new Animated.Value(0)).current;

  // Référence pour l'animation fluide
  const animationFrameRef = useRef<number | null>(null);

  // Calcul de l'arc SVG (demi-cercle de -90° à +90°)
  const createArcPath = (startAngle: number, endAngle: number): string => {
    const startRad = ((startAngle - 90) * Math.PI) / 180;
    const endRad = ((endAngle - 90) * Math.PI) / 180;
    const startX = GAUGE_RADIUS + INNER_RADIUS * Math.cos(startRad);
    const startY = GAUGE_RADIUS + INNER_RADIUS * Math.sin(startRad);
    const endX = GAUGE_RADIUS + INNER_RADIUS * Math.cos(endRad);
    const endY = GAUGE_RADIUS + INNER_RADIUS * Math.sin(endRad);
    const largeArcFlag = endAngle - startAngle > 180 ? 1 : 0;

    return `M ${startX} ${startY} A ${INNER_RADIUS} ${INNER_RADIUS} 0 ${largeArcFlag} 1 ${endX} ${endY}`;
  };

  // Fonction pour mettre à jour la jauge avec animation fluide
  const updateGauge = () => {
    const now = Date.now();
    const currentDate = new Date(now);
    const currentSeconds =
      currentDate.getHours() * 3600 +
      currentDate.getMinutes() * 60 +
      currentDate.getSeconds() +
      currentDate.getMilliseconds() / 1000;

    let remaining = 0;
    let progress = 0;

    if (currentSeconds < startTime) {
      // Avant la période
      remaining = endTime - startTime;
      progress = 0;
    } else if (currentSeconds >= endTime) {
      // Après la période
      remaining = 0;
      progress = 1;
    } else {
      // Pendant la période : calcul précis avec millisecondes
      const elapsed = currentSeconds - startTime;
      remaining = endTime - currentSeconds;
      const periodDuration = endTime - startTime;
      progress = elapsed / periodDuration;
    }

    // Animation fluide de l'arc de progression
    Animated.timing(progressArc, {
      toValue: progress,
      duration: 1000,
      easing: Easing.out(Easing.quad),
      useNativeDriver: false, // Path ne peut pas utiliser native driver
    }).start();

    // Mise à jour du chemin de l'arc
    const endAngle = -90 + progress * 180;
    setProgressPath(createArcPath(-90, endAngle));

    // Calcul du temps restant en secondes totales (arrondi à l'entier)
    const totalSecondsRemaining = Math.ceil(remaining);
    setSecondsRemaining(totalSecondsRemaining);

    // Programmer la prochaine mise à jour pour animation ultra-fluide (50ms)
    animationFrameRef.current = setTimeout(() => {
      updateGauge();
    }, 50) as unknown as number;
  };

  useEffect(() => {
    // Animation d'apparition au montage
    Animated.timing(initialAnimation, {
      toValue: 1,
      duration: 800,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start();

    // Calcul de la position initiale
    const now = Date.now();
    const currentDate = new Date(now);
    const currentSeconds =
      currentDate.getHours() * 3600 +
      currentDate.getMinutes() * 60 +
      currentDate.getSeconds() +
      currentDate.getMilliseconds() / 1000;

    let initialProgress = 0;
    let initialRemaining = 0;

    if (currentSeconds >= startTime && currentSeconds < endTime) {
      const elapsed = currentSeconds - startTime;
      const periodDuration = endTime - startTime;
      initialProgress = elapsed / periodDuration;
      initialRemaining = endTime - currentSeconds;
    } else if (currentSeconds >= endTime) {
      initialProgress = 1;
      initialRemaining = 0;
    } else {
      initialRemaining = endTime - startTime;
    }

    // Positionner initialement l'arc
    progressArc.setValue(initialProgress);

    // Mise à jour initiale du chemin et des secondes
    const initialEndAngle = -90 + initialProgress * 180;
    setProgressPath(createArcPath(-90, initialEndAngle));
    setSecondsRemaining(Math.ceil(initialRemaining));

    // Animation d'apparition : remplissage progressif de 0 à la position actuelle
    progressArc.addListener(({ value }) => {
      const endAngle = -90 + value * 180;
      setProgressPath(createArcPath(-90, endAngle));
    });

    // Démarrer l'animation fluide après un court délai
    setTimeout(() => {
      updateGauge();
    }, 100);

    return () => {
      if (animationFrameRef.current) {
        clearTimeout(animationFrameRef.current);
      }
      progressArc.removeAllListeners();
    };
  }, [startTime, endTime]);

  // Création du chemin de la jauge complète (track de fond)
  const fullArcPath = createArcPath(-90, 90);

  return (
    <View style={styles.container}>
      <Text style={[styles.label, { color: primaryColor }]}>{label}</Text>

      <View style={styles.gaugeWrapper}>
        <Svg width={GAUGE_SIZE} height={GAUGE_SIZE} viewBox={`0 0 ${GAUGE_SIZE} ${GAUGE_SIZE}`}>
          <Defs>
            {/* Dégradé pour l'arc de progression */}
            <LinearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
              <Stop offset="0%" stopColor={primaryColor} stopOpacity="1" />
              <Stop offset="100%" stopColor={secondaryColor} stopOpacity="1" />
            </LinearGradient>

            {/* Filtre pour l'effet glow/ombre */}
            <Filter id={filterId}>
              <FeGaussianBlur stdDeviation="4" result="coloredBlur" />
              <FeMerge>
                <FeMergeNode in="coloredBlur" />
                <FeMergeNode in="SourceGraphic" />
              </FeMerge>
            </Filter>
          </Defs>

          {/* Track de fond (chemin complet) */}
          <Path
            d={fullArcPath}
            stroke={darkTrackColor}
            strokeWidth={TRACK_STROKE_WIDTH}
            fill="none"
            strokeLinecap="round"
          />

          {/* Arc de progression avec dégradé - Terminaison arrondie */}
          <Path
            d={progressPath}
            stroke={`url(#${gradientId})`}
            strokeWidth={STROKE_WIDTH}
            fill="none"
            strokeLinecap="round"
            filter={`url(#${filterId})`}
          />

          {/* Graduations */}
          {Array.from({ length: 9 }, (_, i) => {
            const angle = -90 + (i * 22.5);
            const radian = ((angle - 90) * Math.PI) / 180;
            const x1 = GAUGE_RADIUS + (INNER_RADIUS - 15) * Math.cos(radian);
            const y1 = GAUGE_RADIUS + (INNER_RADIUS - 15) * Math.sin(radian);
            const x2 = GAUGE_RADIUS + (INNER_RADIUS - 25) * Math.cos(radian);
            const y2 = GAUGE_RADIUS + (INNER_RADIUS - 25) * Math.sin(radian);
            const isMajor = i === 0 || i === 8;

            return (
              <Path
                key={i}
                d={`M ${x1} ${y1} L ${x2} ${y2}`}
                stroke={isMajor ? primaryColor : darkTrackColor}
                strokeWidth={isMajor ? 3 : 2}
                strokeLinecap="round"
                opacity={0.6}
              />
            );
          })}
        </Svg>

        {/* Affichage du temps restant en secondes */}
        <View style={styles.timeContainer}>
          <Text style={[styles.secondsText, { color: primaryColor }]}>
            {secondsRemaining.toLocaleString()}
          </Text>
          <Text style={styles.secondsLabel}>secondes rest.</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginVertical: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 12,
    textAlign: 'center',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  gaugeWrapper: {
    width: GAUGE_SIZE,
    height: GAUGE_SIZE,
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  timeContainer: {
    position: 'absolute',
    top: GAUGE_RADIUS - 35,
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondsText: {
    fontSize: 42, // Très grand nombre
    fontWeight: 'bold',
    fontFamily: 'monospace',
    letterSpacing: 1,
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
  },
  secondsLabel: {
    fontSize: 12,
    color: '#AAAAAA', // Gris clair
    fontWeight: '400',
    marginTop: 4,
    letterSpacing: 0.5,
  },
});

export default ModernGauge;
