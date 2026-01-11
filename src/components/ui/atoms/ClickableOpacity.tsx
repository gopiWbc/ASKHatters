import { StyleProp, StyleSheet, Text, TouchableOpacity, View, ViewStyle } from 'react-native'
import React from 'react'

type Props = {
    onClick:()=>void,
    children?:React.ReactNode,
    activeOpacity?:number,
    disabled?:boolean,
    style?:StyleProp<ViewStyle>
}

const ClickableView:React.FC<Props> = ({onClick,activeOpacity=0.4,children,disabled,style}) => {
  return (
    <TouchableOpacity activeOpacity={activeOpacity} onPress={onClick} disabled={disabled} style={[style]}>
        {!!children?children:null}
    </TouchableOpacity>
  )
}

export default ClickableView