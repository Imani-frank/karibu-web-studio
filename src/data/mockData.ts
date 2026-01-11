import { Produce, Sale, CreditSale, DashboardStats } from '@/types/karibu';

export const mockProduce: Produce[] = [
  {
    id: '1',
    name: 'Premium Beans',
    type: 'Beans',
    dateAdded: new Date('2024-01-15'),
    tonnageKg: 5000,
    costUgx: 2500000,
    priceUgx: 3500000,
    dealerName: 'John Mukasa',
    dealerContact: '+256 701 234 567',
    branch: 'Maganjo',
  },
  {
    id: '2',
    name: 'White Maize',
    type: 'Grain Maize',
    dateAdded: new Date('2024-01-18'),
    tonnageKg: 8500,
    costUgx: 4000000,
    priceUgx: 5200000,
    dealerName: 'Sarah Nakato',
    dealerContact: '+256 702 345 678',
    branch: 'Maganjo',
  },
  {
    id: '3',
    name: 'Red Cow Peas',
    type: 'Cow Peas',
    dateAdded: new Date('2024-01-20'),
    tonnageKg: 3200,
    costUgx: 1800000,
    priceUgx: 2600000,
    dealerName: 'KGL Farm - Maganjo',
    dealerContact: '+256 703 456 789',
    branch: 'Maganjo',
  },
  {
    id: '4',
    name: 'Groundnuts',
    type: 'G-nuts',
    dateAdded: new Date('2024-01-22'),
    tonnageKg: 2800,
    costUgx: 3200000,
    priceUgx: 4500000,
    dealerName: 'Peter Ochieng',
    dealerContact: '+256 704 567 890',
    branch: 'Matugga',
  },
  {
    id: '5',
    name: 'Organic Soybeans',
    type: 'Soybeans',
    dateAdded: new Date('2024-01-25'),
    tonnageKg: 4100,
    costUgx: 2800000,
    priceUgx: 3900000,
    dealerName: 'KGL Farm - Matugga',
    dealerContact: '+256 705 678 901',
    branch: 'Matugga',
  },
  {
    id: '6',
    name: 'Yellow Maize',
    type: 'Grain Maize',
    dateAdded: new Date('2024-01-28'),
    tonnageKg: 950,
    costUgx: 3800000,
    priceUgx: 4800000,
    dealerName: 'Grace Auma',
    dealerContact: '+256 706 789 012',
    branch: 'Matugga',
  },
];

export const mockSales: Sale[] = [
  {
    id: 's1',
    produceId: '1',
    produceName: 'Premium Beans',
    tonnageKg: 500,
    amountPaidUgx: 175000,
    buyerName: 'Kampala Traders Ltd',
    salesAgentName: 'David Kato',
    date: new Date('2024-01-20'),
    branch: 'Maganjo',
  },
  {
    id: 's2',
    produceId: '2',
    produceName: 'White Maize',
    tonnageKg: 1200,
    amountPaidUgx: 624000,
    buyerName: 'Jinja Flour Mills',
    salesAgentName: 'Mary Nalubega',
    date: new Date('2024-01-22'),
    branch: 'Maganjo',
  },
  {
    id: 's3',
    produceId: '4',
    produceName: 'Groundnuts',
    tonnageKg: 350,
    amountPaidUgx: 157500,
    buyerName: 'Entebbe Foods',
    salesAgentName: 'James Okello',
    date: new Date('2024-01-25'),
    branch: 'Matugga',
  },
];

export const mockCreditSales: CreditSale[] = [
  {
    id: 'c1',
    buyerName: 'Mbarara Wholesale Co.',
    nationalId: 'CM84567890ABCDE',
    location: 'Mbarara Town',
    contact: '+256 770 123 456',
    amountDueUgx: 2500000,
    salesAgentName: 'David Kato',
    dueDate: new Date('2024-02-15'),
    produceName: 'Premium Beans',
    produceType: 'Beans',
    tonnageKg: 800,
    dispatchDate: new Date('2024-01-28'),
    branch: 'Maganjo',
  },
  {
    id: 'c2',
    buyerName: 'Fort Portal Agri Ltd',
    nationalId: 'CF12345678XYZAB',
    location: 'Fort Portal',
    contact: '+256 780 234 567',
    amountDueUgx: 1800000,
    salesAgentName: 'James Okello',
    dueDate: new Date('2024-02-28'),
    produceName: 'Organic Soybeans',
    produceType: 'Soybeans',
    tonnageKg: 500,
    dispatchDate: new Date('2024-01-30'),
    branch: 'Matugga',
  },
];

export const getDashboardStats = (): DashboardStats => {
  const totalStock = mockProduce.reduce((sum, p) => sum + p.tonnageKg, 0);
  const totalSales = mockSales.length + mockCreditSales.length;
  const totalRevenue = mockSales.reduce((sum, s) => sum + s.amountPaidUgx, 0);
  const pendingCredits = mockCreditSales.reduce((sum, c) => sum + c.amountDueUgx, 0);
  const lowStockItems = mockProduce.filter(p => p.tonnageKg < 1000).length;

  return {
    totalStock,
    totalSales,
    totalRevenue,
    pendingCredits,
    lowStockItems,
  };
};
