import { useNavigation } from '@react-navigation/native';
import type { NavigationProp } from '@react-navigation/native';
import { AppParamList } from './Screens';

export const useAppNavigation = () =>
  useNavigation<NavigationProp<AppParamList>>();