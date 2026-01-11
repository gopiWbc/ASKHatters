import { useRef } from 'react';
import {
  PanResponder,
  GestureResponderEvent,
  PanResponderGestureState,
} from 'react-native';

interface UseSwipeOptions {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
  swipeThreshold?: number;
}

export const useSwipe = ({
  onSwipeLeft,
  onSwipeRight,
  onSwipeUp,
  onSwipeDown,
  swipeThreshold = 50,
}: UseSwipeOptions) => {
  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gestureState) => {
        const { dx, dy } = gestureState;

        return (
          Math.max(Math.abs(dx), Math.abs(dy)) > 10 &&
          Math.abs(dx) !== Math.abs(dy)
        );
      },

      onPanResponderRelease: (
        _: GestureResponderEvent,
        gestureState: PanResponderGestureState
      ) => {
        const { dx, dy } = gestureState;

        if (Math.abs(dx) > Math.abs(dy)) {
          if (dx > swipeThreshold) {
            onSwipeRight?.();
          } else if (dx < -swipeThreshold) {
            onSwipeLeft?.();
          }
          return;
        }

        if (Math.abs(dy) > Math.abs(dx)) {
          if (dy < -swipeThreshold) {
            onSwipeUp?.();
          } else if (dy > swipeThreshold) {
            onSwipeDown?.();
          }
        }
      },
    })
  ).current;

  return panResponder;
};
