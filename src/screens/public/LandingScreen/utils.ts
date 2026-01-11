export const LandingSteps = {
  Landing: 'Landing',
  Login: 'Login',
  Success: 'Success',
} as const;

export type ContinueStep = (typeof LandingSteps)[keyof typeof LandingSteps];

export const stepOrder: ContinueStep[] = [
  LandingSteps.Landing,
  LandingSteps.Login,
  LandingSteps.Success,
];

export const AuthToggleOptions = [
  { label: 'Login', value: 'login' },
  { label: 'Register', value: 'register' },
];
