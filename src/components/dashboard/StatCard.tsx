import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  variant?: 'default' | 'primary' | 'gold' | 'warning';
}

const StatCard = ({ title, value, subtitle, icon, trend, variant = 'default' }: StatCardProps) => {
  const variants = {
    default: 'bg-card',
    primary: 'bg-karibu-green-50 border-karibu-green-200',
    gold: 'bg-karibu-gold-50 border-karibu-gold-200',
    warning: 'bg-karibu-earth-50 border-karibu-earth-100',
  };

  const iconVariants = {
    default: 'bg-muted text-foreground',
    primary: 'bg-karibu-green-100 text-karibu-green-700',
    gold: 'bg-karibu-gold-100 text-karibu-gold-600',
    warning: 'bg-karibu-earth-100 text-karibu-earth-600',
  };

  return (
    <div className={cn(
      'rounded-xl border p-6 karibu-shadow transition-all duration-300 hover:karibu-shadow-lg',
      variants[variant]
    )}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="mt-2 text-3xl font-bold tracking-tight">{value}</p>
          {subtitle && (
            <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
          )}
          {trend && (
            <div className={cn(
              'mt-2 inline-flex items-center text-sm font-medium',
              trend.isPositive ? 'text-karibu-green-600' : 'text-destructive'
            )}>
              {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}%
              <span className="ml-1 text-muted-foreground">vs last week</span>
            </div>
          )}
        </div>
        <div className={cn(
          'flex h-12 w-12 items-center justify-center rounded-xl',
          iconVariants[variant]
        )}>
          {icon}
        </div>
      </div>
    </div>
  );
};

export default StatCard;
