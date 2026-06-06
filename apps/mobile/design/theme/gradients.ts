import { colors } from './colors';

export const screenGradients = {
  teal:   [colors.tealDark, colors.tealMid, colors.tealLight] as const,
  gold:   [colors.goldDark, colors.goldMid, colors.goldLight] as const,
  red:    [colors.redDark, colors.redMid, colors.redLight] as const,
  orange: [colors.orangeDark, colors.orangeMid, colors.orangeLight] as const,
};

export const buttonGradients = {
  teal:   [colors.tealDark, colors.tealMid] as const,
  gold:   [colors.goldDark, colors.goldMid] as const,
  red:    [colors.redDark, colors.redMid] as const,
  orange: [colors.orangeDark, colors.orangeMid] as const,
};

export const statusGradients = {
  green:  [colors.tealDark, colors.tealMid] as const,
  yellow: [colors.goldDark, colors.goldLight] as const,
  red:    [colors.redDark, colors.redLight] as const,
  grey:   ['#888888', '#aaaaaa'] as const,
};
