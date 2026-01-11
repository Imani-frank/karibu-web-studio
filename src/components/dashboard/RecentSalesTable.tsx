import { Sale } from '@/types/karibu';
import { format } from 'date-fns';

interface RecentSalesTableProps {
  sales: Sale[];
}

const RecentSalesTable = ({ sales }: RecentSalesTableProps) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-UG', {
      style: 'currency',
      currency: 'UGX',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="rounded-xl border bg-card karibu-shadow">
      <div className="border-b p-6">
        <h3 className="font-serif text-lg font-semibold">Recent Sales</h3>
        <p className="text-sm text-muted-foreground">Latest transactions across all branches</p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b bg-muted/50">
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Produce
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Buyer
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Quantity (kg)
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Amount
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Branch
              </th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {sales.map((sale) => (
              <tr key={sale.id} className="transition-colors hover:bg-muted/30">
                <td className="whitespace-nowrap px-6 py-4 text-sm font-medium">
                  {sale.produceName}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-muted-foreground">
                  {sale.buyerName}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm">
                  {sale.tonnageKg.toLocaleString()}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-karibu-green-600">
                  {formatCurrency(sale.amountPaidUgx)}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-muted-foreground">
                  {format(sale.date, 'MMM dd, yyyy')}
                </td>
                <td className="whitespace-nowrap px-6 py-4">
                  <span className="inline-flex rounded-full bg-karibu-green-100 px-2.5 py-0.5 text-xs font-medium text-karibu-green-700">
                    {sale.branch}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecentSalesTable;
