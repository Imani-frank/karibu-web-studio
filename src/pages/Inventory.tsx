import { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { mockProduce } from '@/data/mockData';
import { Produce, Branch } from '@/types/karibu';
import { useAuth } from '@/contexts/AuthContext';
import { Package, Search, Filter, AlertTriangle, Download, FileText, FileSpreadsheet } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { exportInventoryToPDF, exportInventoryToCSV } from '@/utils/exportUtils';
import { toast } from 'sonner';

const Inventory = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [branchFilter, setBranchFilter] = useState<Branch | 'all'>('all');

  const filteredProduce = mockProduce.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.type.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesBranch = branchFilter === 'all' || item.branch === branchFilter;
    return matchesSearch && matchesBranch;
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-UG', {
      style: 'currency',
      currency: 'UGX',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const handleExport = (format: 'pdf' | 'csv') => {
    try {
      // Export filtered produce based on current filters
      format === 'pdf' ? exportInventoryToPDF(filteredProduce) : exportInventoryToCSV(filteredProduce);
      toast.success(`Inventory report exported as ${format.toUpperCase()}!`);
    } catch (error) {
      toast.error('Failed to export. Please try again.');
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between animate-fade-in">
          <div>
            <h1 className="font-serif text-3xl font-bold">Inventory</h1>
            <p className="mt-1 text-muted-foreground">
              Manage your produce stock across branches
            </p>
          </div>
          <div className="flex gap-3">
            {/* Export Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="lg" className="gap-2">
                  <Download className="h-5 w-5" />
                  Export
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => handleExport('pdf')} className="gap-2">
                  <FileText className="h-4 w-4" />
                  Export as PDF
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => handleExport('csv')} className="gap-2">
                  <FileSpreadsheet className="h-4 w-4" />
                  Export as CSV
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            {user?.role === 'manager' && (
              <Button variant="hero" size="lg">
                <Package className="h-5 w-5" />
                Add Produce
              </Button>
            )}
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col gap-4 sm:flex-row animate-fade-in" style={{ animationDelay: '0.1s' }}>
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search produce by name or type..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-xl border border-input bg-background py-3 pl-12 pr-4 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
          <div className="flex gap-2">
            <Button
              variant={branchFilter === 'all' ? 'default' : 'outline'}
              onClick={() => setBranchFilter('all')}
            >
              <Filter className="h-4 w-4" />
              All Branches
            </Button>
            <Button
              variant={branchFilter === 'Maganjo' ? 'default' : 'outline'}
              onClick={() => setBranchFilter('Maganjo')}
            >
              Maganjo
            </Button>
            <Button
              variant={branchFilter === 'Matugga' ? 'default' : 'outline'}
              onClick={() => setBranchFilter('Matugga')}
            >
              Matugga
            </Button>
          </div>
        </div>

        {/* Inventory Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 animate-fade-in" style={{ animationDelay: '0.2s' }}>
          {filteredProduce.map((item) => (
            <InventoryCard key={item.id} produce={item} formatCurrency={formatCurrency} />
          ))}
        </div>

        {filteredProduce.length === 0 && (
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed bg-muted/30 py-16">
            <Package className="h-12 w-12 text-muted-foreground" />
            <p className="mt-4 text-lg font-medium">No produce found</p>
            <p className="text-muted-foreground">Try adjusting your search or filters</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

interface InventoryCardProps {
  produce: Produce;
  formatCurrency: (amount: number) => string;
}

const InventoryCard = ({ produce, formatCurrency }: InventoryCardProps) => {
  const isLowStock = produce.tonnageKg < 1000;

  const typeColors: Record<string, string> = {
    'Beans': 'bg-karibu-earth-100 text-karibu-earth-600',
    'Grain Maize': 'bg-karibu-gold-100 text-karibu-gold-600',
    'Cow Peas': 'bg-karibu-green-100 text-karibu-green-600',
    'G-nuts': 'bg-amber-100 text-amber-700',
    'Soybeans': 'bg-lime-100 text-lime-700',
  };

  return (
    <div className={cn(
      'rounded-xl border bg-card p-6 transition-all duration-300 hover:karibu-shadow-lg',
      isLowStock && 'border-karibu-earth-200 bg-karibu-earth-50/50'
    )}>
      <div className="flex items-start justify-between">
        <div>
          <span className={cn(
            'inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium',
            typeColors[produce.type] || 'bg-muted text-muted-foreground'
          )}>
            {produce.type}
          </span>
          <h3 className="mt-2 font-serif text-lg font-semibold">{produce.name}</h3>
        </div>
        {isLowStock && (
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-karibu-earth-100">
            <AlertTriangle className="h-4 w-4 text-karibu-earth-600" />
          </div>
        )}
      </div>

      <div className="mt-4 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Stock</span>
          <span className={cn(
            'font-semibold',
            isLowStock && 'text-karibu-earth-600'
          )}>
            {produce.tonnageKg.toLocaleString()} kg
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Price/kg</span>
          <span className="font-medium text-karibu-green-600">
            {formatCurrency(produce.priceUgx / produce.tonnageKg).split('.')[0]}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Branch</span>
          <span className="inline-flex rounded-full bg-karibu-green-100 px-2.5 py-0.5 text-xs font-medium text-karibu-green-700">
            {produce.branch}
          </span>
        </div>
      </div>

      <div className="mt-4 border-t pt-4">
        <p className="text-xs text-muted-foreground">
          Dealer: {produce.dealerName}
        </p>
      </div>
    </div>
  );
};

export default Inventory;
