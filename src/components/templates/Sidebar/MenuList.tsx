import { View, StyleSheet } from 'react-native';
import React, { useMemo, useState } from 'react';
import { FlexStyle, spacing, TextStyle } from '../../../theme';
import AppIcon from '@/components/ui/atoms/AppIcon';
import AppText from '@/components/ui/atoms/AppText';
import ClickableView from '@/components/ui/atoms/ClickableOpacity';
import { getCurrentRouteName } from '@/utils/navigator';
import { useAppTheme } from '@/theme/ThemeProvider';
import { ThemeColors } from '@/theme/colors';

import { NavigationItem } from '@/navigation/navigationConfig';
import { IconFamily } from '@/components/ui/atoms/AppIcon';

interface MenuListProps {
  text: string;
  iconName: string;
  iconFamily: IconFamily;
  iconSize?: number;
  onMenuPress: (e: any) => void;
  onSubMenuPress: (e: any) => void;
  menu: NavigationItem;
  routeName: string;
  subMenu?: any;
  userRole: string;
}


const MenuList: React.FC<MenuListProps> = ({
    iconName,
    iconFamily,
    onMenuPress,
    iconSize,
    text,
    menu,
    routeName,
    subMenu,
    onSubMenuPress,
    userRole,
}) => {
    const [showSubMenus, setShowSubMenus] = useState(false);

    const {colors} = useAppTheme();
    const styles = useMemo(() => createStyles(colors), [colors]);

    const currentTab = getCurrentRouteName()

    const isActive = currentTab === routeName 
    
    const handleMenuPress = (link?: string, isSubMenu = false) => {
        if (isSubMenu && link) {
            onSubMenuPress(link);
            setShowSubMenus(false);
        } else {
            onMenuPress(menu);
            setShowSubMenus(false);
        }
    };

    const renderMenuItem = (label: string, link?: string, isSubMenu = false) => (
        <ClickableView onClick={() => handleMenuPress(link, isSubMenu)}>
            <View
                style={[
                    styles.menuContainer,
                    isSubMenu ? styles.subMenuContainer : styles.mainMenuContainer,
                    isActive && !isSubMenu ? styles.activeMenuContainer : {},
                ]}
            >
                {!isSubMenu && (
                <View style={styles.iconContainer}>
                    <AppIcon
                        size={iconSize||22}
                        name={iconName}
                        family={iconFamily}
                        color={isActive ? colors.primary :colors.textSecondary}
                    />
                </View>
                )}
                <AppText
                    allowFontScaling={false}
                    text={label}
                    variant='sm'
                    weight={'medium'}
                    tone={isActive ? 'primary' : 'secondary'}
                />
            </View>
        </ClickableView>
    );

    return (
        <View>
            {renderMenuItem(text)}
            {subMenu && (showSubMenus || isActive) && (
                <View style={styles.subMenuWrapper}>
                    {subMenu.map((item: any, index: number) => {
                        const allowedRoles = item.access.filter((role: any) => role === userRole);
                        if (!allowedRoles.length) return null;
                        return renderMenuItem(item.text, item.link, true);
                    })}
                </View>
            )}
        </View>
    );
};

const createStyles = (colors: ThemeColors) => StyleSheet.create({
    menuContainer: {
        ...FlexStyle.rowStart,
        gap:spacing.sm,
        paddingVertical: 5,
    },
    mainMenuContainer: {
        paddingLeft: 10,
    },
    subMenuContainer: {
        paddingLeft: 50,
        backgroundColor: 'transparent',
    },
    activeMenuContainer: {
        backgroundColor: colors.primaryLight,
        borderRadius:20,
    },
    menuText: {
        paddingLeft: 15,
    },
    activeText: {
        fontSize: 16,
        color: colors.white,
    },
    inactiveText: {
        fontSize: 15,
        color: colors.primary,
    },
    subMenuText: {
        fontSize: 14,
        color: colors.darkGray,
    },
    subMenuWrapper: {
        marginTop: 4,
    },
    iconContainer:{
        backgroundColor:colors.backgroundSecondary,
        borderRadius:20,
        padding:6
    }
});

export default MenuList;
