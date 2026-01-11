import { useWindowDimensions } from 'react-native';
import { EdgeInsets, useSafeAreaInsets } from 'react-native-safe-area-context';

export type Viewport =  {
    screenWidth: number;
    screenHeight: number;
    rawHeight: number;
    insets: EdgeInsets;
}

export const useViewport = () : Viewport => {
  const { height, width } = useWindowDimensions();
  const insets = useSafeAreaInsets();

  const safeHeight =
    height - insets.top - insets.bottom;

  return {
    screenWidth:width,
    screenHeight: safeHeight,
    rawHeight: height,
    insets,
  };
};
