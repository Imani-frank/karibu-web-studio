import DashboardLayout from '@/components/layout/DashboardLayout';
import { useAuth } from '@/contexts/AuthContext';
import { mockProduce, mockSales, mockCreditSales, getDashboardStats } from '@/data/mockData';
import { BarChart3, TrendingUp, Package, DollarSign, Building2, Download, FileText, FileSpreadsheet } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu';
import {
  exportInventoryToPDF,
  exportInventoryToCSV,
  exportSalesToPDF,
  exportSalesToCSV,
  exportCreditSalesToPDF,
  exportCreditSalesToCSV,
  exportFullReportToPDF,
} from '@/utils/exportUtils';
import { toast } from 'sonner';

const Reports = () => {
  const { user } = useAuth();
  const stats = getDashboardStats();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-UG', {
      style: 'currency',
      currency: 'UGX',
      minimumFractionDigits: 0,
      notation: 'compact',
    }).format(amount);
  };

  const handleExport = (type: 'inventory' | 'sales' | 'credit' | 'full', format: 'pdf' | 'csv') => {
    try {
      if (type === 'inventory') {
        format === 'pdf' ? exportInventoryToPDF(mockProduce) : exportInventoryToCSV(mockProduce);
      } else if (type === 'sales') {
        format === 'pdf' ? exportSalesToPDF(mockSales) : exportSalesToCSV(mockSales);
      } else if (type === 'credit') {
        format === 'pdf' ? exportCreditSalesToPDF(mockCreditSales) : exportCreditSalesToCSV(mockCreditSales);
      } else if (type === 'full') {
        exportFullReportToPDF(mockProduce, mockSales, mockCreditSales);
      }
      toast.success(`${type.charAt(0).toUpperCase() + type.slice(1)} report exported successfully!`);
    } catch (error) {
      toast.error('Failed to export report. Please try again.');
    }
  };

  // Aggregate data by branch
  const branchData = [
    {
      name: 'Maganjo',
      stock: mockProduce.filter(p => p.branch === 'Maganjo').reduce((sum, p) => sum + p.tonnageKg, 0),
      sales: mockSales.filter(s => s.branch === 'Maganjo').reduce((sum, s) => sum + s.amountPaidUgx, 0),
    },
    {
      name: 'Matugga',
      stock: mockProduce.filter(p => p.branch === 'Matugga').reduce((sum, p) => sum + p.tonnageKg, 0),
      sales: mockSales.filter(s => s.branch === 'Matugga').reduce((sum, s) => sum + s.amountPaidUgx, 0),
    },
  ];

  // Produce type distribution
  const produceTypeData = [
    { name: 'Beans', value: mockProduce.filter(p => p.type === 'Beans').reduce((sum, p) => sum + p.tonnageKg, 0), color: 'hsl(25, 60%, 50%)' },
    { name: 'Grain Maize', value: mockProduce.filter(p => p.type === 'Grain Maize').reduce((sum, p) => sum + p.tonnageKg, 0), color: 'hsl(42, 75%, 55%)' },
    { name: 'Cow Peas', value: mockProduce.filter(p => p.type === 'Cow Peas').reduce((sum, p) => sum + p.tonnageKg, 0), color: 'hsl(142, 45%, 35%)' },
    { name: 'G-nuts', value: mockProduce.filter(p => p.type === 'G-nuts').reduce((sum, p) => sum + p.tonnageKg, 0), color: 'hsl(35, 70%, 50%)' },
    { name: 'Soybeans', value: mockProduce.filter(p => p.type === 'Soybeans').reduce((sum, p) => sum + p.tonnageKg, 0), color: 'hsl(80, 50%, 45%)' },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between animate-fade-in">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-hero text-primary-foreground">
              <BarChart3 className="h-7 w-7" />
            </div>
            <div>
              <h1 className="font-serif text-3xl font-bold">Reports & Analytics</h1>
              <p className="text-muted-foreground">
                {user?.role === 'director' 
                  ? 'Aggregated view across all branches'
                  : `Performance overview for ${user?.branch} branch`
                }
              </p>
            </div>
          </div>
          
          {/* Export Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="hero" size="lg" className="gap-2">
                <Download className="h-5 w-5" />
                Export Reports
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>Export Options</DropdownMenuLabel>
              <DropdownMenuSeparator />
              
              <DropdownMenuItem onClick={() => handleExport('full', 'pdf')} className="gap-2">
                <FileText className="h-4 w-4 text-karibu-green-600" />
                Complete Report (PDF)
              </DropdownMenuItem>
              
              <DropdownMenuSeparator />
              
              <DropdownMenuLabel className="text-xs text-muted-foreground">Inventory</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => handleExport('inventory', 'pdf')} className="gap-2">
                <FileText className="h-4 w-4" />
                Inventory Report (PDF)
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleExport('inventory', 'csv')} className="gap-2">
                <FileSpreadsheet className="h-4 w-4" />
                Inventory Report (CSV)
              </DropdownMenuItem>
              
              <DropdownMenuSeparator />
              
              <DropdownMenuLabel className="text-xs text-muted-foreground">Sales</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => handleExport('sales', 'pdf')} className="gap-2">
                <FileText className="h-4 w-4" />
                Sales Report (PDF)
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleExport('sales', 'csv')} className="gap-2">
                <FileSpreadsheet className="h-4 w-4" />
                Sales Report (CSV)
              </DropdownMenuItem>
              
              <DropdownMenuSeparator />
              
              <DropdownMenuLabel className="text-xs text-muted-foreground">Credit Sales</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => handleExport('credit', 'pdf')} className="gap-2">
                <FileText className="h-4 w-4" />
                Credit Sales Report (PDF)
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleExport('credit', 'csv')} className="gap-2">
                <FileSpreadsheet className="h-4 w-4" />
                Credit Sales Report (CSV)
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Summary Cards */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 animate-fade-in" style={{ animationDelay: '0.1s' }}>
          <div className="rounded-xl border bg-card p-6 karibu-shadow">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-karibu-green-100">
                <Package className="h-5 w-5 text-karibu-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Stock</p>
                <p className="text-xl font-bold">{(stats.totalStock / 1000).toFixed(1)} Tonnes</p>
              </div>
            </div>
          </div>
          <div className="rounded-xl border bg-card p-6 karibu-shadow">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-karibu-gold-100">
                <TrendingUp className="h-5 w-5 text-karibu-gold-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Sales</p>
                <p className="text-xl font-bold">{stats.totalSales} Transactions</p>
              </div>
            </div>
          </div>
          <div className="rounded-xl border bg-card p-6 karibu-shadow">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-karibu-green-100">
                <DollarSign className="h-5 w-5 text-karibu-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Revenue</p>
                <p className="text-xl font-bold">{formatCurrency(stats.totalRevenue)}</p>
              </div>
            </div>
          </div>
          <div className="rounded-xl border bg-card p-6 karibu-shadow">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-karibu-earth-100">
                <Building2 className="h-5 w-5 text-karibu-earth-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Pending Credits</p>
                <p className="text-xl font-bold">{formatCurrency(stats.pendingCredits)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Charts */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Branch Performance */}
          <div className="rounded-xl border bg-card p-6 karibu-shadow animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <h3 className="font-serif text-lg font-semibold mb-6">Branch Performance</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={branchData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                    }}
                  />
                  <Bar dataKey="stock" name="Stock (kg)" fill="hsl(142, 45%, 35%)" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="sales" name="Sales (UGX)" fill="hsl(42, 75%, 55%)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Produce Distribution */}
          <div className="rounded-xl border bg-card p-6 karibu-shadow animate-fade-in" style={{ animationDelay: '0.3s' }}>
            <h3 className="font-serif text-lg font-semibold mb-6">Produce Distribution</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={produceTypeData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {produceTypeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                    }}
                    formatter={(value: number) => [`${value.toLocaleString()} kg`, 'Stock']}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            {/* Legend */}
            <div className="mt-4 flex flex-wrap justify-center gap-4">
              {produceTypeData.map((item) => (
                <div key={item.name} className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-sm text-muted-foreground">{item.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Director-only: Credit Summary */}
        {user?.role === 'director' && (
          <div className="rounded-xl bg-gradient-hero p-8 text-primary-foreground karibu-shadow-lg animate-fade-in" style={{ animationDelay: '0.4s' }}>
            <h3 className="font-serif text-xl font-semibold mb-6">Credit Sales Summary</h3>
            <div className="grid gap-6 sm:grid-cols-3">
              <div>
                <p className="text-primary-foreground/70">Total Credits</p>
                <p className="mt-1 text-3xl font-bold">{mockCreditSales.length}</p>
              </div>
              <div>
                <p className="text-primary-foreground/70">Outstanding Amount</p>
                <p className="mt-1 text-3xl font-bold">
                  {formatCurrency(mockCreditSales.reduce((sum, c) => sum + c.amountDueUgx, 0))}
                </p>
              </div>
              <div>
                <p className="text-primary-foreground/70">Total Tonnage on Credit</p>
                <p className="mt-1 text-3xl font-bold">
                  {mockCreditSales.reduce((sum, c) => sum + c.tonnageKg, 0).toLocaleString()} kg
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Reports;
