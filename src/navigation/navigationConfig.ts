import {
  CustomerTripScreen,
  EnquiryScreen,
  PackagesScreen,
  ProfileScreen,
  AboutScreen,
  SupportScreen,
  TransactionHistoryScreen,
  TripHistoryScreen,
  LandingScreen,
  LogoutScreen,
  UserChatScreen,
  SupporterDashboardScreen,
  SupporterChatScreen
} from '../screens';

import { ScreenNames, ScreenNamesType } from './Screens';
import { IconFamily } from '@/components/ui/atoms/AppIcon';

export type StackScreenType = {
  name: string;
  component: React.ComponentType<any>;
  isAuth?: boolean
}

export const StackScreens: StackScreenType[] = [
  { name: ScreenNames.Landing, component: LandingScreen, isAuth: true },
  { name: ScreenNames.Logout, component: LogoutScreen },
  { name: ScreenNames.Packages, component: PackagesScreen },
  { name: ScreenNames.CustomerTrip, component: CustomerTripScreen },
  { name: ScreenNames.Enquiry, component: EnquiryScreen },
  { name: ScreenNames.Profile, component: ProfileScreen },
  { name: ScreenNames.About, component: AboutScreen },
  { name: ScreenNames.Support, component: SupportScreen },
  { name: ScreenNames.TransactionHistory, component: TransactionHistoryScreen },
  { name: ScreenNames.TripHistory, component: TripHistoryScreen },
  { name: ScreenNames.UserChat, component: UserChatScreen },
  { name: ScreenNames.SupporterDashboard, component: SupporterDashboardScreen },
  { name: ScreenNames.SupporterChat, component: SupporterChatScreen },
];

export type NavigationItem = {
  name: ScreenNamesType;
  title: string;
  icon: {
    name: string;
    family: IconFamily,
    size?: number
  },
  isCentralized?: boolean
};


export const getBottomNavItems = (): NavigationItem[] => [
  {
    name: ScreenNames.Enquiry,
    title: 'Enquiries',
    icon: { name: 'ClipboardList', family: 'Lucide', size: 26 },
  },
  {
    name: ScreenNames.UserChat,
    title: 'Chats ',
    icon: { name: 'Package', family: 'Lucide' },
    isCentralized: true
  },
  {
    name: ScreenNames.Profile,
    title: 'Profile',
    icon: { name: 'CircleUserRound', family: 'Lucide', size: 26 },
  },
];

export const getSideNavItems = (): NavigationItem[] => [
  {
    name: ScreenNames.Profile,
    title: 'Profile',
    icon: { name: 'CircleUserRound', family: 'Lucide', size: 26 },
  },
  {
    name: ScreenNames.Enquiry,
    title: 'Enquiries',
    icon: { name: 'ClipboardList', family: 'Lucide' },
  },
  {
    name: ScreenNames.About,
    title: 'About Us',
    icon: { name: 'Info', family: 'Lucide' },
  },
  {
    name: ScreenNames.UserChat,
    title: 'AskHatters AI',
    icon: { name: 'MessageCircle', family: 'Lucide' },
  },

];