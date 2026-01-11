import { Produce } from '@/types/karibu';
import { cn } from '@/lib/utils';

interface StockOverviewProps {
  produce: Produce[];
}

const StockOverview = ({ produce }: StockOverviewProps) => {
  const maxStock = Math.max(...produce.map(p => p.tonnageKg));

  return (
    <div className="rounded-xl border bg-card karibu-shadow">
      <div className="border-b p-6">
        <h3 className="font-serif text-lg font-semibold">Stock Overview</h3>
        <p className="text-sm text-muted-foreground">Current inventory levels by produce</p>
      </div>
      <div className="p-6 space-y-4">
        {produce.map((item) => {
          const percentage = (item.tonnageKg / maxStock) * 100;
          const isLowStock = item.tonnageKg < 1000;
          
          return (
            <div key={item.id} className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <span className="font-medium">{item.name}</span>
                  {isLowStock && (
                    <span className="inline-flex rounded-full bg-karibu-earth-100 px-2 py-0.5 text-xs font-medium text-karibu-earth-600">
                      Low Stock
                    </span>
                  )}
                </div>
                <span className="text-muted-foreground">
                  {item.tonnageKg.toLocaleString()} kg
                </span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                <div
                  className={cn(
                    'h-full rounded-full transition-all duration-500',
                    isLowStock ? 'bg-karibu-earth-500' : 'bg-karibu-green-500'
                  )}
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default StockOverview;
