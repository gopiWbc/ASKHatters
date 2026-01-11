import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { FlexStyle } from '@/theme'
import BackButton from '@/components/ui/atoms/BackButton'
import StepDots from '@/components/ui/atoms/StepsDot'
import { stepOrder } from '../utils'

type Props = {
  activeStepIndex: number;
  showBackButton?:boolean,
  onBackClick?:()=>void
};
const LandingTopSection:React.FC<Props> = ({activeStepIndex ,showBackButton=true , onBackClick}) => {
  return (
    <View style={styles.topSection}>
        {showBackButton?<BackButton  onClick={onBackClick} />:<View style={styles.placeHolderView} />}
        {/* <StepDots
          total={stepOrder.length}
          activeIndex={activeStepIndex}
        /> */}
        <View style={styles.placeHolderView} />
      </View>
  )
}

export default LandingTopSection

const styles = StyleSheet.create({
      topSection:{
        ...FlexStyle.rowBetween,
      },
      placeHolderView:{
        width:40
      }
})
