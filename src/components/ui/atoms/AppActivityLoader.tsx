import { View, Text, ActivityIndicator,ActivityIndicatorProps } from 'react-native'
import React from 'react'
import { useAppTheme } from '@/theme/ThemeProvider'

type Props = {
    color?:string,
    size?: number | "small" | "large" | undefined
}

const AppActivityLoader:React.FC<Props>=({size=24,color})=> {
    const {colors} = useAppTheme()
  return (
     <ActivityIndicator color={color??colors.primary} size={size} />
  )
}

export default AppActivityLoader