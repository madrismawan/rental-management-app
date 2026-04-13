import {
  IconBuildingBank,
  IconCashBanknoteMinus,
  IconCashBanknotePlus,
  IconCreditCardPay,
  IconDatabase,
  IconUserCog,
  IconUsers,
} from "@tabler/icons-react";
import { ElementType } from "react";

interface SidebarConfig {
  administrator: SidebarItem[];
  project: SidebarItem[];
  hr: SidebarItem[];
  finance: SidebarItem[];
}
export interface SidebarItem {
  title: string;
  url: string;
  icon: ElementType;
  permission?: string;
  items?: { title: string; url: string }[];
}

const sidebarAdministrator: SidebarItem[] = [
  {
    title: "User Management",
    url: "/user",
    icon: IconUserCog,
    items: [
      { title: "Users", url: "/setting/user" },
      { title: "Roles", url: "/setting/role" },
    ],
  },
];

const sidebarProject: SidebarItem[] = [
  {
    title: "Project",
    url: "/project",
    icon: IconDatabase,
  },
];

const sidebarHR: SidebarItem[] = [
  {
    title: "Employee",
    url: "/hr/employee",
    icon: IconUsers,
  },
];

const sidebarFinance: SidebarItem[] = [
  {
    title: "Transactions",
    url: "/finance/transaction",
    icon: IconCreditCardPay,
  },
  {
    title: "Incomes",
    url: "/finance/income",
    icon: IconCashBanknotePlus,
  },
  {
    title: "Expenses",
    url: "/finance/expense",
    icon: IconCashBanknoteMinus,
  },
  {
    title: "Account",
    url: "/finance/account",
    icon: IconBuildingBank,
  },
];

export const SidebarData: SidebarConfig = {
  project: sidebarProject,
  finance: sidebarFinance,
  hr: sidebarHR,
  administrator: sidebarAdministrator,
};
