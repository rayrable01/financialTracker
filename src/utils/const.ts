import {
  LayoutDashboard,
  ArrowLeftRight,
  CreditCard,
  ChartNoAxesCombined,
  History,
  Settings,
  CircleHelp,
} from 'lucide-react';

export const menuItems = {
  Dashboard: {
    url: '/dashboard',
    icon: LayoutDashboard,
  },
  Transactions: {
    url: '/transactions',
    icon: ArrowLeftRight,
  },
  Card: {
    url: '/card',
    icon: CreditCard,
  },
  Analytics: {
    url: '/analytics',
    icon: ChartNoAxesCombined,
  },
  History: {
    url: '/history',
    icon: History,
  },
} as const;

export const generalItems = {
  Settings: {
    url: '/settings',
    icon: Settings,
  },
  'Help Center': {
    url: '/help-center',
    icon: CircleHelp,
  },
} as const;

export type MenuItemsType = typeof menuItems;
export type MenuItem = keyof typeof menuItems;

export type GeneralItemsType = typeof generalItems;
export type GeneralItem = keyof typeof generalItems;