import React, {
  useCallback,
  useImperativeHandle,
  forwardRef,
  useState,
  useEffect,
  useMemo,
} from 'react';
import {
  View,
  StyleSheet,
  BackHandler,
  Modal,
  TouchableWithoutFeedback,
} from 'react-native';
import {
  Gesture,
  GestureDetector,
} from 'react-native-gesture-handler';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  interpolate,
  Extrapolation,
  withTiming,
} from 'react-native-reanimated';
import { runOnJS } from 'react-native-worklets';
import { theme } from '../../../theme';
import { useViewport } from '@/hooks/useViewPort';

export interface AppBottomSheetRef {
  open: () => void;
  close: () => void;
  expand: () => void;
}

interface AppBottomSheetProps {
  children?: React.ReactNode;
  initialHeight?: number; // percentage of screen height (e.g. 0.6)
}

const AppBottomSheet = forwardRef<AppBottomSheetRef, AppBottomSheetProps>(
  ({ children, initialHeight = 0.6 }, ref) => {
    const { rawHeight: SCREEN_HEIGHT } = useViewport();
    const MAX_TRANSLATE_Y = useMemo(() => -SCREEN_HEIGHT + 50, [SCREEN_HEIGHT]);

    const translateY = useSharedValue(0);
    const context = useSharedValue({ y: 0 });
    const active = useSharedValue(false);
    const [isVisible, setIsVisible] = useState(false);

    const scrollTo = useCallback((destination: number) => {
      'worklet';
      active.value = destination !== 0;
      translateY.value = withSpring(destination, { 
        damping: 20,
        stiffness: 90,
      });
    }, [active, translateY]);

    const close = useCallback(() => {
      translateY.value = withTiming(0, { duration: 250 }, (finished) => {
        if (finished) {
          runOnJS(setIsVisible)(false);
        }
      });
      active.value = false;
    }, [active, translateY]);

    useImperativeHandle(ref, () => ({
      open: () => {
        setIsVisible(true);
        setTimeout(() => {
          scrollTo(-SCREEN_HEIGHT * initialHeight);
        }, 10);
      },
      close: () => {
        close();
      },
      expand: () => {
        scrollTo(MAX_TRANSLATE_Y);
      },
    }), [scrollTo, close, initialHeight, SCREEN_HEIGHT, MAX_TRANSLATE_Y]);

    useEffect(() => {
        const backAction = () => {
            if (active.value) {
                close();
                return true;
            }
            return false;
        };

        const backHandler = BackHandler.addEventListener(
            'hardwareBackPress',
            backAction,
        );

        return () => backHandler.remove();
    }, [active, close]);

    const panGesture = Gesture.Pan()
      .onStart(() => {
        context.value = { y: translateY.value };
      })
      .onUpdate((event) => {
        translateY.value = context.value.y + event.translationY;
        translateY.value = Math.max(translateY.value, MAX_TRANSLATE_Y);
      })
      .onEnd((event) => {
        const velocity = event.velocityY;
        if (velocity > 500) {
            runOnJS(close)();
        } else if (velocity < -500) {
            scrollTo(MAX_TRANSLATE_Y);
        } else if (translateY.value > -SCREEN_HEIGHT * (initialHeight / 1.5)) {
            runOnJS(close)();
        } else if (translateY.value < -SCREEN_HEIGHT * (initialHeight + 0.1)) {
            scrollTo(MAX_TRANSLATE_Y);
        } else {
            scrollTo(-SCREEN_HEIGHT * initialHeight);
        }
      });

    const rBottomSheetStyle = useAnimatedStyle(() => {
      const borderRadius = interpolate(
        translateY.value,
        [MAX_TRANSLATE_Y + 50, MAX_TRANSLATE_Y],
        [25, 0],
        Extrapolation.CLAMP
      );

      return {
        borderRadius,
        transform: [{ translateY: translateY.value }],
      };
    });

    const rBackdropStyle = useAnimatedStyle(() => {
      return {
        opacity: interpolate(
          translateY.value,
          [0, -SCREEN_HEIGHT * initialHeight],
          [0, 1],
          Extrapolation.CLAMP
        ),
      };
    });

    const rBackdropProps = useAnimatedStyle(() => {
        return {
          display: translateY.value === 0 ? 'none' : 'flex',
        };
    });

    if (!isVisible) return null;

    return (
      <Modal
        transparent
        visible={isVisible}
        animationType="none"
        onRequestClose={close}
      >
        <View style={styles.container}>
          <TouchableWithoutFeedback onPress={close}>
            <Animated.View style={[styles.backdrop, rBackdropStyle, rBackdropProps]} />
          </TouchableWithoutFeedback>
          <GestureDetector gesture={panGesture}>
            <Animated.View style={[styles.bottomSheetContainer, { height: SCREEN_HEIGHT, top: SCREEN_HEIGHT }, rBottomSheetStyle]}>
              <View style={styles.line} />
              {children}
            </Animated.View>
          </GestureDetector>
        </View>
      </Modal>
    );
  }
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  bottomSheetContainer: {
    width: '100%',
    backgroundColor: theme.colors.white,
    position: 'absolute',
    paddingHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  line: {
    width: 40,
    height: 5,
    backgroundColor: '#E0E0E0',
    alignSelf: 'center',
    marginVertical: 12,
    borderRadius: 3,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
});

export default AppBottomSheet;
