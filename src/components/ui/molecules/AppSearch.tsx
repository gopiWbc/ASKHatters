import React from 'react';
import { View, StyleSheet, ViewStyle, StyleProp } from 'react-native';
import AppInput from '@/components/ui/atoms/AppInput';
import AppIcon from '@/components/ui/atoms/AppIcon';
import { useAppTheme } from '@/theme/ThemeProvider';

interface AppSearchProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  style?: StyleProp<ViewStyle>;
}

const AppSearch: React.FC<AppSearchProps> = ({
  value,
  onChangeText,
  placeholder = "Search...",
  style,
}) => {
  const { colors } = useAppTheme();

  return (
    <View style={[styles.container, style]}>
      <AppInput
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        prefix={
          <AppIcon 
            name="Search" 
            size={20} 
            color={colors.textSecondary} 
            family='Lucide' 
          />
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default AppSearch;
