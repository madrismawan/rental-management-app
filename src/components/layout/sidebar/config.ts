import {
  IconUsers,
  IconMotorbike,
  IconCashRegister,
  IconContract,
} from "@tabler/icons-react";
import { ElementType } from "react";

interface SidebarConfig {
  transaction: SidebarItem[];
  masterData: SidebarItem[];
}
export interface SidebarItem {
  title: string;
  url: string;
  icon: ElementType;
  role?: string;
  items?: { title: string; url: string }[];
}

const sidebarTransaction: SidebarItem[] = [
  {
    title: "Rental",
    url: "/rental",
    icon: IconCashRegister,
  },
  {
    title: "Maintenance",
    url: "/maintenance",
    icon: IconContract,
  },
];

const sidebarMasterData: SidebarItem[] = [
  {
    title: "Vehicle",
    url: "/vehicle",
    icon: IconMotorbike,
  },
  {
    title: "Customer",
    url: "/customer",
    icon: IconUsers,
  },
];

export const SidebarData: SidebarConfig = {
  transaction: sidebarTransaction,
  masterData: sidebarMasterData,
};
