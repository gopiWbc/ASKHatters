import { StyleSheet, Text, View } from 'react-native'
import React, { useMemo } from 'react'
import { ThemeColors } from '@/theme/colors'
import { useAppTheme } from '@/theme/ThemeProvider';
import AppIcon from './AppIcon';
import { spacing } from '@/theme';
import ClickableView from './ClickableOpacity';

type Props = {
    onClick?:()=>void,
    goBack?:boolean
}

const BackButton:React.FC<Props> = ({onClick,goBack}) => {
    const { colors } = useAppTheme();
    const styles = useMemo(() => createStyles(colors), [colors]);
    const handleBackClick = () =>{
        if(onClick) onClick();
        if(goBack) {
            
        }

    }
  return (
    <ClickableView onClick={handleBackClick} style={styles.iconContainer}>
        <AppIcon
          size={30}
          name={'chevron-small-left'}
          family="Entypo"
          color={colors.textSecondary}
        />
      </ClickableView>
  )
}

export default BackButton

const createStyles = (colors: ThemeColors) => StyleSheet.create({
     iconContainer: {
      borderRadius: 20,
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
      width: 34,
      marginLeft: spacing.xs,
    },
})