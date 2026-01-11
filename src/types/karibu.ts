// User roles for role-based access control
export type UserRole = 'manager' | 'sales_agent' | 'director';

export interface User {
  id: string;
  name: string;
  role: UserRole;
  branch: Branch;
  contact: string;
}

export type Branch = 'Maganjo' | 'Matugga';

export type ProduceType = 'Beans' | 'Grain Maize' | 'Cow Peas' | 'G-nuts' | 'Soybeans';

export interface Produce {
  id: string;
  name: string;
  type: ProduceType;
  dateAdded: Date;
  tonnageKg: number;
  costUgx: number;
  priceUgx: number;
  dealerName: string;
  dealerContact: string;
  branch: Branch;
}

export interface Sale {
  id: string;
  produceId: string;
  produceName: string;
  tonnageKg: number;
  amountPaidUgx: number;
  buyerName: string;
  salesAgentName: string;
  date: Date;
  branch: Branch;
}

export interface CreditSale {
  id: string;
  buyerName: string;
  nationalId: string;
  location: string;
  contact: string;
  amountDueUgx: number;
  salesAgentName: string;
  dueDate: Date;
  produceName: string;
  produceType: ProduceType;
  tonnageKg: number;
  dispatchDate: Date;
  branch: Branch;
}

export interface DashboardStats {
  totalStock: number;
  totalSales: number;
  totalRevenue: number;
  pendingCredits: number;
  lowStockItems: number;
}
