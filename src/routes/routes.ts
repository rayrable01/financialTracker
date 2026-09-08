import type { ComponentType } from "react";
import { DashboardPage } from "../pages/DashboardPage/DashboardPage";
import { TransactionsPage } from "../pages/TransactionsPage/TransactionsPage";
import { CardPage } from "../pages/CardPage/CardPage";
import { AnalyticsPage } from "../pages/AnalyticsPage/AnalyticsPage";
import { HistoryPage } from "../pages/HistoryPage/HistoryPage";
import { SettingsPage } from "../pages/SettingsPage/SettingsPage";
import { HelpCenterPage } from "../pages/HelpCenterPage/HelpCenterPage";

export interface RouteConfig {
  path: string;
  component: ComponentType;
  title: string;
}

export const routes: RouteConfig[] = [
  { path: "/dashboard", component: DashboardPage, title: "Dashboard" },
  { path: "/transactions", component: TransactionsPage, title: "Transactions" },
  { path: "/card", component: CardPage, title: "Card" },
  { path: "/analytics", component: AnalyticsPage, title: "Analytics" },
  { path: "/history", component: HistoryPage, title: "History" },
  { path: "/settings", component: SettingsPage, title: "Settings" },
  { path: "/help-center", component: HelpCenterPage, title: "Help Center" },
];
