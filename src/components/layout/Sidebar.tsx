import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  TrendingUp,
  CreditCard,
  BarChart3,
  LogOut,
  Wheat,
  Users,
  Building2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const Sidebar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard', roles: ['manager', 'sales_agent', 'director'] },
    { icon: Package, label: 'Inventory', path: '/inventory', roles: ['manager', 'sales_agent'] },
    { icon: TrendingUp, label: 'Procurement', path: '/procurement', roles: ['manager'] },
    { icon: ShoppingCart, label: 'Record Sale', path: '/sales', roles: ['manager', 'sales_agent'] },
    { icon: CreditCard, label: 'Credit Sales', path: '/credit-sales', roles: ['manager', 'sales_agent'] },
    { icon: BarChart3, label: 'Reports', path: '/reports', roles: ['manager', 'director'] },
  ];

  const filteredMenuItems = menuItems.filter(item => 
    user && item.roles.includes(user.role)
  );

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 bg-sidebar text-sidebar-foreground">
      <div className="flex h-full flex-col">
        {/* Logo Section */}
        <div className="flex items-center gap-3 border-b border-sidebar-border p-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-karibu-gold-500">
            <Wheat className="h-6 w-6 text-karibu-brown" />
          </div>
          <div>
            <h1 className="font-serif text-xl font-bold text-sidebar-foreground">Karibu</h1>
            <p className="text-xs text-sidebar-foreground/70">Groceries LTD</p>
          </div>
        </div>

        {/* User Info */}
        <div className="border-b border-sidebar-border p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-sidebar-accent">
              <Users className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-medium">{user?.name}</p>
              <p className="text-xs capitalize text-sidebar-foreground/70">
                {user?.role.replace('_', ' ')}
              </p>
            </div>
          </div>
          <div className="mt-3 flex items-center gap-2 text-xs text-sidebar-foreground/70">
            <Building2 className="h-3.5 w-3.5" />
            <span>{user?.branch} Branch</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 p-4">
          {filteredMenuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-all duration-200',
                  isActive
                    ? 'bg-sidebar-primary text-sidebar-primary-foreground shadow-md'
                    : 'hover:bg-sidebar-accent text-sidebar-foreground/80 hover:text-sidebar-foreground'
                )}
              >
                <Icon className="h-5 w-5" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="border-t border-sidebar-border p-4">
          <Button
            variant="sidebar"
            className="w-full justify-start gap-3"
            onClick={logout}
          >
            <LogOut className="h-5 w-5" />
            Logout
          </Button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
