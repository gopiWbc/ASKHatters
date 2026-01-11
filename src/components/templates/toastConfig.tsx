import React, { useEffect, useMemo } from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  Easing,
  interpolateColor
} from 'react-native-reanimated';
import LinearGradient from 'react-native-linear-gradient';
import { FlexStyle, theme } from '@/theme';
import AppIcon from '@/components/ui/atoms/AppIcon';
import AppText from '@/components/ui/atoms/AppText';
import { lightColors } from '@/theme/colors';
import { useViewport, Viewport } from '@/hooks/useViewPort';
import ClickableView from '@/components/ui/atoms/ClickableOpacity';

interface TomatoToastProps {
  props: {
    status: string;
    message: string;
  };
}

const toastConfig = {
  tomatoToast: ({ props }: TomatoToastProps) => {
    const progressBarWidth = useSharedValue(100);
    const displayMessage =
      props.message.length >= 36 ? props.message.substring(0, 33) + '...' : props.message;

    let color:string = theme.colors.success;
    let gradientColors = ['#E8FFF2', '#73BF94', '#4D9F70'];

    if (props.status === 'error') {
      color = theme.colors.error;
      gradientColors = ['#ffe8e8', '#ff9797', '#FF4500'];
    } else if (props.status === 'warning') {
      color = theme.colors.warning;
      gradientColors = ['#e9e8ff', '#9799ff', '#5156BE'];
    }

    const viewport = useViewport()
    const styles = useMemo(()=>createStyles(viewport),[viewport])

    useEffect(() => {
      progressBarWidth.value = 100;
      progressBarWidth.value = withTiming(0, {
        duration: 3000,
        easing: Easing.linear,
      });
    }, [props]);

    // Simulate gradient using interpolateColor
    const animatedStyle = useAnimatedStyle(() => {
      const backgroundColor = interpolateColor(
        progressBarWidth.value,
        [0, 50, 100], // matched to gradientColors length
        gradientColors
      );

      return {
        width: `${progressBarWidth.value}%`,
        backgroundColor,
      };
    });

    return (
      <ClickableView onClick={() => {}} style={[styles.ToastContainer, { marginVertical: 10 }]}>
        <View style={[FlexStyle.rowBetween, { padding: 20, gap: 15 }]}>
          <View style={[FlexStyle.rowStart, styles.TextContainer, { backgroundColor: color }]}>
            <AppIcon
              name={
                props.status === 'success'
                  ? 'checkmark-circle-outline'
                  : props.status === 'error'
                    ? 'close-circle-outline'
                    : 'warning-outline'
              }
              family="Ionicons"
              color={theme.colors.white}
              size={23}
            />
            <AppText
              text={displayMessage}
              style={{ fontSize: 12, width: viewport.screenWidth * 0.5 ,color:lightColors.white }}
              numberOfLines={1}
            />
          </View>

          <View style={[FlexStyle.rowStart, { gap: 5, marginTop: 5 }]}>
            <View style={[styles.colorSquare, { backgroundColor: theme.colors.success }]} />
            <View style={[styles.colorSquare, { backgroundColor: theme.colors.error }]} />
            <View style={[styles.colorSquare, { backgroundColor: theme.colors.primary }]} />
          </View>
        </View>


        <View style={styles.emptyProgressBar}>
          <Animated.View style={[styles.progressBar, animatedStyle]}>
            <LinearGradient
              colors={gradientColors}
              start={{x: 0, y: 0}}
              end={{x: 1, y: 0}}
              locations={[0, 0.4667, 0.9567]}
              style={styles.gradient}
            />
          </Animated.View>
        </View>
      </ClickableView>
    );
  }
};

const createStyles =(viewport:Viewport)=> StyleSheet.create({
  TextContainer: {
    borderRadius: 10,
    gap: 5,
    height: 40,
    overflow: 'hidden',
    paddingHorizontal: 10,
    paddingVertical: 8,
    width: viewport.screenWidth * 0.65,
  },
  ToastContainer: {
    backgroundColor: theme.colors.white,
    borderRadius: 10,
    width: '90%',
  },
  colorSquare: {
    borderRadius: 3,
    height: 8,
    width: 8,
  },
  emptyProgressBar: {
    backgroundColor: '#D9D9D9',
    borderBottomLeftRadius: 3,
    borderBottomRightRadius: 3,
    height: 8,
    width: '100%',
  },
  progressBar: {
    borderBottomLeftRadius: 3,
    borderBottomRightRadius: 3,
    height: 8,
    overflow: 'hidden',
  },
    fakeGradientContainer: {
    ...StyleSheet.absoluteFillObject,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
    gradient: {
    borderBottomLeftRadius: 3,
    borderBottomRightRadius: 10,
    borderTopRightRadius: 10,
    height: '100%',
  },
});

export default toastConfig;
