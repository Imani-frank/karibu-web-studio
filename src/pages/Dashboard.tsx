import { useAuth } from '@/contexts/AuthContext';
import DashboardLayout from '@/components/layout/DashboardLayout';
import StatCard from '@/components/dashboard/StatCard';
import RecentSalesTable from '@/components/dashboard/RecentSalesTable';
import StockOverview from '@/components/dashboard/StockOverview';
import { mockProduce, mockSales, getDashboardStats } from '@/data/mockData';
import { Package, ShoppingCart, TrendingUp, AlertTriangle, DollarSign } from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();
  const stats = getDashboardStats();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-UG', {
      style: 'currency',
      currency: 'UGX',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="animate-fade-in">
          <h1 className="font-serif text-3xl font-bold">
            Welcome back, {user?.name}
          </h1>
          <p className="mt-2 text-muted-foreground">
            Here's what's happening with your business today.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4" style={{ animationDelay: '0.1s' }}>
          <StatCard
            title="Total Stock"
            value={`${(stats.totalStock / 1000).toFixed(1)}T`}
            subtitle="Across all branches"
            icon={<Package className="h-6 w-6" />}
            variant="primary"
          />
          <StatCard
            title="Total Sales"
            value={stats.totalSales}
            subtitle="This month"
            icon={<ShoppingCart className="h-6 w-6" />}
            trend={{ value: 12, isPositive: true }}
            variant="gold"
          />
          <StatCard
            title="Revenue"
            value={formatCurrency(stats.totalRevenue)}
            subtitle="Total earnings"
            icon={<TrendingUp className="h-6 w-6" />}
            trend={{ value: 8, isPositive: true }}
          />
          <StatCard
            title="Low Stock Items"
            value={stats.lowStockItems}
            subtitle="Need restocking"
            icon={<AlertTriangle className="h-6 w-6" />}
            variant={stats.lowStockItems > 0 ? 'warning' : 'default'}
          />
        </div>

        {/* Director View - Aggregated Summary */}
        {user?.role === 'director' && (
          <div className="rounded-xl bg-gradient-hero p-8 text-primary-foreground karibu-shadow-lg animate-fade-in">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-foreground/20">
                <DollarSign className="h-8 w-8" />
              </div>
              <div>
                <p className="text-lg font-medium text-primary-foreground/80">Total Pending Credits</p>
                <p className="text-4xl font-bold">{formatCurrency(stats.pendingCredits)}</p>
              </div>
            </div>
            <p className="mt-4 text-primary-foreground/70">
              Aggregated credit sales data from all branches. View detailed reports for more information.
            </p>
          </div>
        )}

        {/* Main Content Grid */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Recent Sales - Takes 2 columns */}
          <div className="lg:col-span-2 animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <RecentSalesTable sales={mockSales} />
          </div>

          {/* Stock Overview */}
          <div className="animate-fade-in" style={{ animationDelay: '0.3s' }}>
            <StockOverview produce={mockProduce} />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
