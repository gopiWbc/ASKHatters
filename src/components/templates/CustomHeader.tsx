import React from "react";
import { StyleSheet, View, TouchableOpacity } from "react-native";
import { FlexStyle } from "../../theme";
import AppIcon from "../ui/atoms/AppIcon";
import AppText from "../ui/atoms/AppText";
import ClickableView from "../ui/atoms/ClickableOpacity";
import { routeDisplayNameMap, ScreenNames } from "@/navigation/Screens";
import { useAppTheme } from "@/theme/ThemeProvider";
import { getCurrentRouteName } from "@/utils/navigator";
import { DeviceEventEmitter } from "react-native";

interface CustomHeaderProps {
  navigation: {
    toggleDrawer: () => void;
  };
  screenTitle?: string;
};

const CustomHeader: React.FC<CustomHeaderProps> = ({ 
  navigation, 
  screenTitle, 
}) => {
  
  const currentRouteName = getCurrentRouteName();
  const displayTitle = screenTitle || routeDisplayNameMap[currentRouteName || ''] || currentRouteName || '';
  const {colors} = useAppTheme()
  const isUserChat = currentRouteName === ScreenNames.UserChat;

  return (
    <View
      style={[
        styles.headerContainer,
        {
          backgroundColor: colors.background,
          borderColor: colors.border,
        },
      ]}>
      {/* Left Section - Menu Button */}
      <View style={styles.leftSection}>
        <ClickableView onClick={() => navigation.toggleDrawer()}>
          <AppIcon
            name="menu-fold"
            family="AntDesign"
            size={22}
            color={colors.text}
          />
        </ClickableView>
      </View>

      {/* Center Section - Title */}
      <View style={styles.centerSection}>
        <AppText
          text={displayTitle}
          weight="medium"
          variant="lg"
          tone="default"
        />
      </View>

      {/* Right Section - Placeholder for balance */}
      <View style={styles.rightSection}>
        {isUserChat && (
          <TouchableOpacity onPress={() => DeviceEventEmitter.emit('close-user-chat-request')}>
            <AppIcon
              name="close-circle-outline"
              family="MaterialCommunityIcons"
              size={22}
              color={colors.error}
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default CustomHeader;

const styles = StyleSheet.create({
  headerContainer: {
    ...FlexStyle.rowBetween,
    paddingHorizontal: 20,
    paddingTop: 15,
    paddingBottom: 10,
    borderBottomWidth:1
  },
  leftSection: {
    width: 35,
    alignItems: 'flex-start',
  },
  centerSection: {
    flex: 1,
    // alignItems: 'center',
    justifyContent: 'center',
  },
  rightSection: {
    width: 40,
    alignItems: 'flex-end',
  },
});