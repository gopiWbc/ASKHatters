import React from 'react';
import { StyleSheet, ViewStyle, StyleProp } from 'react-native';
import AppIcon from '@/components/ui/atoms/AppIcon';
import { useAppTheme } from '@/theme/ThemeProvider';
import ClickableView from '@/components/ui/atoms/ClickableOpacity';

interface AppFilterIconProps {
  onClick: () => void;
  style?: StyleProp<ViewStyle>;
  size?: number;
}

const AppFilterIcon: React.FC<AppFilterIconProps> = ({
  onClick,
  style,
  size = 20,
}) => {
  const { colors } = useAppTheme();

  return (
    <ClickableView 
      style={[
        styles.button, 
        { backgroundColor: colors.backgroundSecondary },
        style
      ]}
      onClick={onClick}
    >
      <AppIcon 
        name="SlidersHorizontal" 
        size={size} 
        color={colors.text} 
        family='Lucide' 
      />
    </ClickableView>
  );
};

const styles = StyleSheet.create({
  button: {
    height: 44,
    width: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default AppFilterIcon;
