import React from 'react';
import { Image, StyleProp, ViewStyle, ImageStyle, ImageSourcePropType } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Fontisto from 'react-native-vector-icons/Fontisto';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Entypo from 'react-native-vector-icons/Entypo';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Feather from 'react-native-vector-icons/Feather';
import * as LucideIcons from 'lucide-react-native';
import { useAppTheme } from '@/theme/ThemeProvider';

export type IconFamily = 'Ionicons'
  | 'Fontisto'
  | 'Foundation'
  | 'MaterialIcons'
  | 'MaterialCommunityIcons'
  | 'Ionicons'
  | 'Feather'
  | 'FontAwesome'
  | 'FontAwesome5'
  | 'AntDesign'
  | 'Entypo'
  | 'EvilIcons'
  | 'Foundation'
  | 'Octicons'
  | 'SimpleLineIcons'
  | 'Zocial'
  | 'Lucide';

interface AppIconProps {
  type?: 'vector' | 'svg' | 'image';
  name?: string;
  svg?: React.FC<any>;
  source?: ImageSourcePropType;
  size?: number;
  color?: string;
  style?: StyleProp<ViewStyle>;
  family?: IconFamily;
}

const IconFamilies: Record<string, any> = {
  MaterialCommunityIcons,
  Ionicons,
  FontAwesome,
  Fontisto,
  AntDesign,
  Entypo,
  MaterialIcons,
  Feather
};

const AppIcon: React.FC<AppIconProps & { style?: StyleProp<ImageStyle> | StyleProp<ViewStyle> }> = ({
  type = 'vector',
  name,
  svg: Svg,
  source,
  size = 24,
  color,
  style,
  family = 'MaterialCommunityIcons', // default
}) => {
  const { colors } = useAppTheme();
  // Render SVG
  if (type === 'svg' && Svg) {
    return <Svg width={size} height={size} style={style} />;
  }

  // Render Image
  if (type === 'image' && source) {
    return (
      <Image
        source={source}
        resizeMode="contain"
        style={[{ width: size, height: size } as ImageStyle, style as ImageStyle]}
      />
    );
  }

  // Render Vector Icon
  if (family === 'Lucide') {
    // Handle Lucide icons
    const LucideIcon = (LucideIcons as any)[name || 'HelpCircle'];

    if (!LucideIcon) {
      console.log(`Invalid Lucide icon name: ${name}`);
      return null;
    }

    return <LucideIcon size={size} color={color ?? colors.text} style={style} />;
  }

  const IconSet = IconFamilies[family];

  if (!IconSet) {
    console.log(`Invalid icon family passed: ${family}`);
    return null;
  }

  return <IconSet name={name || 'help-circle'} size={size} color={color ?? colors.text} style={style} />;
};

export default AppIcon;
