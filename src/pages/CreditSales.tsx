import { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { mockCreditSales } from '@/data/mockData';
import { Button } from '@/components/ui/button';
import { CreditCard, Plus, Calendar, User, Phone, MapPin, AlertCircle, Download, FileText, FileSpreadsheet } from 'lucide-react';
import { format, differenceInDays } from 'date-fns';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { exportCreditSalesToPDF, exportCreditSalesToCSV } from '@/utils/exportUtils';
import { toast } from 'sonner';

const CreditSales = () => {
  const [showForm, setShowForm] = useState(false);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-UG', {
      style: 'currency',
      currency: 'UGX',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getDueStatus = (dueDate: Date) => {
    const daysUntilDue = differenceInDays(dueDate, new Date());
    if (daysUntilDue < 0) return { label: 'Overdue', color: 'bg-destructive text-destructive-foreground' };
    if (daysUntilDue <= 7) return { label: 'Due Soon', color: 'bg-karibu-earth-100 text-karibu-earth-600' };
    return { label: 'Active', color: 'bg-karibu-green-100 text-karibu-green-600' };
  };

  const handleExport = (format: 'pdf' | 'csv') => {
    try {
      format === 'pdf' ? exportCreditSalesToPDF(mockCreditSales) : exportCreditSalesToCSV(mockCreditSales);
      toast.success(`Credit sales report exported as ${format.toUpperCase()}!`);
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
            <h1 className="font-serif text-3xl font-bold">Credit Sales</h1>
            <p className="mt-1 text-muted-foreground">
              Manage deferred payments for trusted buyers
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
            
            <Button variant="hero" size="lg" onClick={() => setShowForm(true)}>
              <Plus className="h-5 w-5" />
              New Credit Sale
            </Button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid gap-4 sm:grid-cols-3 animate-fade-in" style={{ animationDelay: '0.1s' }}>
          <div className="rounded-xl border bg-card p-6">
            <p className="text-sm text-muted-foreground">Total Outstanding</p>
            <p className="mt-2 text-2xl font-bold text-karibu-earth-600">
              {formatCurrency(mockCreditSales.reduce((sum, c) => sum + c.amountDueUgx, 0))}
            </p>
          </div>
          <div className="rounded-xl border bg-card p-6">
            <p className="text-sm text-muted-foreground">Active Credits</p>
            <p className="mt-2 text-2xl font-bold">{mockCreditSales.length}</p>
          </div>
          <div className="rounded-xl border bg-card p-6">
            <p className="text-sm text-muted-foreground">Overdue</p>
            <p className="mt-2 text-2xl font-bold text-destructive">
              {mockCreditSales.filter(c => differenceInDays(c.dueDate, new Date()) < 0).length}
            </p>
          </div>
        </div>

        {/* Credit Sales List */}
        <div className="space-y-4 animate-fade-in" style={{ animationDelay: '0.2s' }}>
          {mockCreditSales.map((credit) => {
            const status = getDueStatus(credit.dueDate);
            return (
              <div key={credit.id} className="rounded-xl border bg-card p-6 karibu-shadow hover:karibu-shadow-lg transition-all duration-300">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  {/* Buyer Info */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-karibu-green-100">
                        <User className="h-6 w-6 text-karibu-green-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold">{credit.buyerName}</h3>
                        <p className="text-sm text-muted-foreground">{credit.nationalId}</p>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1.5">
                        <MapPin className="h-4 w-4" />
                        {credit.location}
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Phone className="h-4 w-4" />
                        {credit.contact}
                      </div>
                    </div>
                  </div>

                  {/* Order Info */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">Produce:</span>
                      <span className="font-medium">{credit.produceName}</span>
                      <span className="rounded-full bg-muted px-2 py-0.5 text-xs">{credit.produceType}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Quantity: <span className="font-medium text-foreground">{credit.tonnageKg.toLocaleString()} kg</span>
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Dispatched: {format(credit.dispatchDate, 'MMM dd, yyyy')}
                    </p>
                  </div>

                  {/* Amount & Due Date */}
                  <div className="text-right">
                    <p className="text-2xl font-bold text-karibu-green-600">
                      {formatCurrency(credit.amountDueUgx)}
                    </p>
                    <div className="mt-2 flex items-center justify-end gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">Due:</span>
                      <span className="font-medium">{format(credit.dueDate, 'MMM dd, yyyy')}</span>
                    </div>
                    <div className="mt-2">
                      <span className={cn(
                        'inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium',
                        status.color
                      )}>
                        {status.label}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="mt-4 flex items-center justify-between border-t pt-4">
                  <p className="text-sm text-muted-foreground">
                    Sales Agent: <span className="font-medium text-foreground">{credit.salesAgentName}</span> • {credit.branch}
                  </p>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">View Details</Button>
                    <Button variant="default" size="sm">Mark Paid</Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {mockCreditSales.length === 0 && (
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed bg-muted/30 py-16">
            <CreditCard className="h-12 w-12 text-muted-foreground" />
            <p className="mt-4 text-lg font-medium">No credit sales</p>
            <p className="text-muted-foreground">Start by adding a new credit sale</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default CreditSales;
