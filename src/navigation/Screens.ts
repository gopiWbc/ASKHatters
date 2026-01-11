export const ScreenNames = {
  // Stack
  Landing: 'Landing',
  Logout: 'Logout',

  Packages: 'Packages',
  CustomerTrip: 'CustomerTrip',
  Enquiry: 'Enquiry',
  Profile: 'Profile',
  About: 'About',
  Support: 'Support',
  TransactionHistory: 'TransactionHistory',
  TripHistory: 'TripHistory',
  UserChat: 'UserChat',
  SupporterDashboard: 'SupporterDashboard',
  SupporterChat: 'SupporterChat',
} as const;

export type ScreenNamesType = typeof ScreenNames[keyof typeof ScreenNames];

export type AppParamList = {
  [ScreenNames.Landing]: undefined;
  [ScreenNames.Logout]: undefined;
  [ScreenNames.Packages]: undefined;
  [ScreenNames.CustomerTrip]: undefined;
  [ScreenNames.Enquiry]: undefined;
  [ScreenNames.Profile]: { userId: string } | undefined;
  [ScreenNames.TripHistory]: { from: string } | undefined;
  [ScreenNames.TransactionHistory]: { filter?: 'ALL' | 'SUCCESS' };
  [ScreenNames.About]: undefined;
  [ScreenNames.Support]: undefined;
  [ScreenNames.UserChat]: { chatId?: string; readOnly?: boolean } | undefined;
  [ScreenNames.SupporterDashboard]: undefined;
  [ScreenNames.SupporterChat]: { chatId: string };
};

export const routeDisplayNameMap: Record<string, string> = {
  [ScreenNames.Packages]: 'Packages',
  [ScreenNames.CustomerTrip]: 'My Trips',
  [ScreenNames.Enquiry]: 'Enquiries',
  [ScreenNames.Profile]: 'Profile',
  [ScreenNames.TripHistory]: 'Trip History',
  [ScreenNames.TransactionHistory]: 'Transactions History',
  [ScreenNames.About]: 'About Us',
  [ScreenNames.Support]: 'Support',
  [ScreenNames.UserChat]: 'AskHatters AI',
  [ScreenNames.SupporterDashboard]: 'Supporter Dashboard',
  [ScreenNames.SupporterChat]: 'User Support',
};