import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { mockProduce } from '@/data/mockData';
import { useAuth } from '@/contexts/AuthContext';
import { ShoppingCart, Save, ArrowLeft, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Sales = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    produceId: '',
    tonnageKg: '',
    amountPaidUgx: '',
    buyerName: '',
  });

  const availableProduce = mockProduce.filter(p => 
    p.tonnageKg > 0 && (user?.role === 'manager' || p.branch === user?.branch)
  );

  const selectedProduce = availableProduce.find(p => p.id === formData.produceId);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.produceId) {
      toast({ title: 'Error', description: 'Please select a produce', variant: 'destructive' });
      return;
    }

    if (!selectedProduce) {
      toast({ title: 'Error', description: 'Selected produce not found', variant: 'destructive' });
      return;
    }

    const requestedTonnage = Number(formData.tonnageKg);
    if (requestedTonnage > selectedProduce.tonnageKg) {
      toast({ 
        title: 'Insufficient Stock', 
        description: `Only ${selectedProduce.tonnageKg}kg available in stock.`, 
        variant: 'destructive' 
      });
      return;
    }

    if (formData.amountPaidUgx.length < 5 || isNaN(Number(formData.amountPaidUgx))) {
      toast({ title: 'Error', description: 'Amount must be at least 10,000 UGX', variant: 'destructive' });
      return;
    }

    if (formData.buyerName.length < 2) {
      toast({ title: 'Error', description: 'Buyer name must be at least 2 characters', variant: 'destructive' });
      return;
    }

    toast({
      title: 'Sale Recorded Successfully!',
      description: `${formData.tonnageKg}kg of ${selectedProduce.name} sold to ${formData.buyerName}.`,
    });

    navigate('/dashboard');
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-UG', {
      style: 'currency',
      currency: 'UGX',
      minimumFractionDigits: 0,
    }).format(amount);
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
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-karibu-gold-500 text-karibu-brown">
              <ShoppingCart className="h-7 w-7" />
            </div>
            <div>
              <h1 className="font-serif text-3xl font-bold">Record Sale</h1>
              <p className="text-muted-foreground">Process a new sale transaction</p>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6 rounded-xl border bg-card p-8 karibu-shadow animate-fade-in" style={{ animationDelay: '0.1s' }}>
          {/* Select Produce */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Select Produce *</label>
            <select
              name="produceId"
              value={formData.produceId}
              onChange={handleChange}
              className="w-full rounded-lg border border-input bg-background px-4 py-2.5 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              required
            >
              <option value="">Choose produce to sell</option>
              {availableProduce.map(produce => (
                <option key={produce.id} value={produce.id}>
                  {produce.name} - {produce.tonnageKg.toLocaleString()}kg available ({produce.branch})
                </option>
              ))}
            </select>
          </div>

          {/* Selected Produce Info */}
          {selectedProduce && (
            <div className="rounded-lg bg-karibu-green-50 p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="mt-0.5 h-5 w-5 text-karibu-green-600" />
                <div>
                  <p className="font-medium text-karibu-green-700">Product Details</p>
                  <div className="mt-2 grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Available Stock:</span>
                      <span className="ml-2 font-medium">{selectedProduce.tonnageKg.toLocaleString()} kg</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Price:</span>
                      <span className="ml-2 font-medium">
                        {formatCurrency(selectedProduce.priceUgx / selectedProduce.tonnageKg)}/kg
                      </span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Type:</span>
                      <span className="ml-2 font-medium">{selectedProduce.type}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Branch:</span>
                      <span className="ml-2 font-medium">{selectedProduce.branch}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="grid gap-6 sm:grid-cols-2">
            {/* Tonnage */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Quantity (kg) *</label>
              <input
                type="number"
                name="tonnageKg"
                value={formData.tonnageKg}
                onChange={handleChange}
                placeholder="Quantity to sell"
                max={selectedProduce?.tonnageKg}
                min="1"
                className="w-full rounded-lg border border-input bg-background px-4 py-2.5 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                required
              />
            </div>

            {/* Amount Paid */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Amount Paid (UGX) *</label>
              <input
                type="number"
                name="amountPaidUgx"
                value={formData.amountPaidUgx}
                onChange={handleChange}
                placeholder="Amount received"
                min="10000"
                className="w-full rounded-lg border border-input bg-background px-4 py-2.5 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                required
              />
            </div>

            {/* Buyer Name */}
            <div className="space-y-2 sm:col-span-2">
              <label className="text-sm font-medium">Buyer Name *</label>
              <input
                type="text"
                name="buyerName"
                value={formData.buyerName}
                onChange={handleChange}
                placeholder="Name of the buyer"
                className="w-full rounded-lg border border-input bg-background px-4 py-2.5 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                required
              />
            </div>

            {/* Sales Agent (auto-filled) */}
            <div className="space-y-2 sm:col-span-2">
              <label className="text-sm font-medium">Sales Agent</label>
              <input
                type="text"
                value={user?.name || ''}
                disabled
                className="w-full rounded-lg border border-input bg-muted px-4 py-2.5 text-muted-foreground"
              />
            </div>
          </div>

          {/* Submit */}
          <div className="flex justify-end gap-4 pt-4">
            <Button type="button" variant="outline" onClick={() => navigate(-1)}>
              Cancel
            </Button>
            <Button type="submit" variant="gold" size="lg">
              <Save className="h-5 w-5" />
              Record Sale
            </Button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
};

export default Sales;
