import { lazy, type ComponentType } from 'react';

const DashboardPage = lazy(() =>
  import('../pages/DashboardPage/DashboardPage').then((m) => ({ default: m.DashboardPage })),
);
const TransactionsPage = lazy(() =>
  import('../pages/TransactionsPage/TransactionsPage').then((m) => ({
    default: m.TransactionsPage,
  })),
);
const CardPage = lazy(() =>
  import('../pages/CardPage/CardPage').then((m) => ({ default: m.CardPage })),
);
const AnalyticsPage = lazy(() =>
  import('../pages/AnalyticsPage/AnalyticsPage').then((m) => ({ default: m.AnalyticsPage })),
);
const HistoryPage = lazy(() =>
  import('../pages/HistoryPage/HistoryPage').then((m) => ({ default: m.HistoryPage })),
);
const SettingsPage = lazy(() =>
  import('../pages/SettingsPage/SettingsPage').then((m) => ({ default: m.SettingsPage })),
);
const HelpCenterPage = lazy(() =>
  import('../pages/HelpCenterPage/HelpCenterPage').then((m) => ({
    default: m.HelpCenterPage,
  })),
);

export interface RouteConfig {
  path: string;
  component: ComponentType;
  title: string;
}

export const routes: RouteConfig[] = [
  { path: '/dashboard', component: DashboardPage, title: 'Dashboard' },
  { path: '/transactions', component: TransactionsPage, title: 'Transactions' },
  { path: '/card', component: CardPage, title: 'Card' },
  { path: '/analytics', component: AnalyticsPage, title: 'Analytics' },
  { path: '/history', component: HistoryPage, title: 'History' },
  { path: '/settings', component: SettingsPage, title: 'Settings' },
  { path: '/help-center', component: HelpCenterPage, title: 'Help Center' },
];
