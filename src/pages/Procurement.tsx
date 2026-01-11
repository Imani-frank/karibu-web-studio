import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { ProduceType, Branch } from '@/types/karibu';
import { useAuth } from '@/contexts/AuthContext';
import { TrendingUp, Save, ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Procurement = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    produceName: '',
    produceType: '' as ProduceType | '',
    tonnageKg: '',
    costUgx: '',
    priceUgx: '',
    dealerName: '',
    dealerContact: '',
    branch: user?.branch || 'Maganjo' as Branch,
  });

  const produceTypes: ProduceType[] = ['Beans', 'Grain Maize', 'Cow Peas', 'G-nuts', 'Soybeans'];
  const branches: Branch[] = ['Maganjo', 'Matugga'];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validatePhone = (phone: string) => {
    const ugandaPhoneRegex = /^(\+256|0)[0-9]{9}$/;
    return ugandaPhoneRegex.test(phone.replace(/\s/g, ''));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (formData.produceName.length < 2) {
      toast({ title: 'Error', description: 'Produce name must be at least 2 characters', variant: 'destructive' });
      return;
    }
    if (!formData.produceType) {
      toast({ title: 'Error', description: 'Please select a produce type', variant: 'destructive' });
      return;
    }
    if (formData.tonnageKg.length < 3 || isNaN(Number(formData.tonnageKg))) {
      toast({ title: 'Error', description: 'Tonnage must be at least 1000kg (3+ digits)', variant: 'destructive' });
      return;
    }
    if (formData.costUgx.length < 5 || isNaN(Number(formData.costUgx))) {
      toast({ title: 'Error', description: 'Cost must be at least 10,000 UGX (5+ digits)', variant: 'destructive' });
      return;
    }
    if (formData.dealerName.length < 2) {
      toast({ title: 'Error', description: 'Dealer name must be at least 2 characters', variant: 'destructive' });
      return;
    }
    if (!validatePhone(formData.dealerContact)) {
      toast({ title: 'Error', description: 'Please enter a valid Ugandan phone number', variant: 'destructive' });
      return;
    }

    toast({
      title: 'Produce Added Successfully!',
      description: `${formData.tonnageKg}kg of ${formData.produceName} has been added to ${formData.branch} inventory.`,
    });

    navigate('/inventory');
  };

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-3xl space-y-6">
        {/* Header */}
        <div className="animate-fade-in">
          <Button variant="ghost" onClick={() => navigate(-1)} className="mb-4">
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-hero text-primary-foreground">
              <TrendingUp className="h-7 w-7" />
            </div>
            <div>
              <h1 className="font-serif text-3xl font-bold">Record Procurement</h1>
              <p className="text-muted-foreground">Add new produce to your inventory</p>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6 rounded-xl border bg-card p-8 karibu-shadow animate-fade-in" style={{ animationDelay: '0.1s' }}>
          <div className="grid gap-6 sm:grid-cols-2">
            {/* Produce Name */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Produce Name *</label>
              <input
                type="text"
                name="produceName"
                value={formData.produceName}
                onChange={handleChange}
                placeholder="e.g., Premium Red Beans"
                className="w-full rounded-lg border border-input bg-background px-4 py-2.5 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                required
              />
            </div>

            {/* Produce Type */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Produce Type *</label>
              <select
                name="produceType"
                value={formData.produceType}
                onChange={handleChange}
                className="w-full rounded-lg border border-input bg-background px-4 py-2.5 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                required
              >
                <option value="">Select type</option>
                {produceTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            {/* Tonnage */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Tonnage (kg) *</label>
              <input
                type="number"
                name="tonnageKg"
                value={formData.tonnageKg}
                onChange={handleChange}
                placeholder="Minimum 1000kg"
                min="100"
                className="w-full rounded-lg border border-input bg-background px-4 py-2.5 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                required
              />
            </div>

            {/* Cost */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Cost (UGX) *</label>
              <input
                type="number"
                name="costUgx"
                value={formData.costUgx}
                onChange={handleChange}
                placeholder="Total cost in UGX"
                min="10000"
                className="w-full rounded-lg border border-input bg-background px-4 py-2.5 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                required
              />
            </div>

            {/* Selling Price */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Selling Price (UGX) *</label>
              <input
                type="number"
                name="priceUgx"
                value={formData.priceUgx}
                onChange={handleChange}
                placeholder="Price to sell at"
                min="10000"
                className="w-full rounded-lg border border-input bg-background px-4 py-2.5 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                required
              />
            </div>

            {/* Branch */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Branch *</label>
              <select
                name="branch"
                value={formData.branch}
                onChange={handleChange}
                className="w-full rounded-lg border border-input bg-background px-4 py-2.5 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                required
              >
                {branches.map(branch => (
                  <option key={branch} value={branch}>{branch}</option>
                ))}
              </select>
            </div>

            {/* Dealer Name */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Dealer Name *</label>
              <input
                type="text"
                name="dealerName"
                value={formData.dealerName}
                onChange={handleChange}
                placeholder="Name of supplier"
                className="w-full rounded-lg border border-input bg-background px-4 py-2.5 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                required
              />
            </div>

            {/* Dealer Contact */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Dealer Contact *</label>
              <input
                type="tel"
                name="dealerContact"
                value={formData.dealerContact}
                onChange={handleChange}
                placeholder="+256 7XX XXX XXX"
                className="w-full rounded-lg border border-input bg-background px-4 py-2.5 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                required
              />
            </div>
          </div>

          {/* Submit */}
          <div className="flex justify-end gap-4 pt-4">
            <Button type="button" variant="outline" onClick={() => navigate(-1)}>
              Cancel
            </Button>
            <Button type="submit" variant="hero" size="lg">
              <Save className="h-5 w-5" />
              Save Procurement
            </Button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
};

export default Procurement;
