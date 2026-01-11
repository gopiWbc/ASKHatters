import { FlexStyle, TextStyle, theme } from '../../theme';
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useToast } from 'react-native-toast-notifications';
import AppIcon from '../ui/atoms/AppIcon';
import AppText from '../ui/atoms/AppText';
import ClickableView from '../ui/atoms/ClickableOpacity';

const CustomToastRenderType = {
  success: (toast: any) => {
    const displayMessage =
      toast.data?.body?.length >= 33
        ? toast.data?.body?.substring(0, 30) + '...'
        : toast.data?.body
          ? toast.data?.body
          : '';
    const Toast = useToast();
    return (
      <ClickableView
        onClick={() => {
          toast.data?.onPress && toast.data.onPress();
          Toast.hideAll();
        }}
        style={[
          styles.ToastContainer,
          FlexStyle.rowStart,
          { gap: 10, marginVertical: 10 },
        ]}>
        <View
          style={[styles.LeftMargin, { backgroundColor: theme.colors.success }]}
        />
        <View style={[FlexStyle.rowBetween, { width: '90%' }]}>
          <View style={[styles.TextContainer, { gap: -5 }]}>
            <AppText
              text={toast.message}
              style={styles.titleLabel}
            />
            <AppText
              text={displayMessage}
              style={styles.bodyLabel}
            />
          </View>
          <AppIcon
            name={'bell-outline'}
            family="MaterialCommunityIcons"
            color={theme.colors.black}
            size={23}
          />
        </View>
      </ClickableView>
    );
  },
};

export default CustomToastRenderType;

const styles = StyleSheet.create({
  LeftMargin: {
    height: '100%',
    width: 7,
  },
  TextContainer: {
    height: '100%',
    padding: 15,
  },

  ToastContainer: {
    backgroundColor: theme.colors.white,
    borderRadius: 5,
    overflow: 'hidden',
    width: '90%',
  },
  bodyLabel: {
    ...TextStyle.medium,
    fontSize: 12,
  },
  titleLabel: {
    ...TextStyle.bold,
    fontSize: 16,
  },
});
