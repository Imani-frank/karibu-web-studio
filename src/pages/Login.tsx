import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { UserRole, Branch } from '@/types/karibu';
import { Wheat, Users, ShieldCheck, Building2, ArrowRight } from 'lucide-react';
import heroBg from '@/assets/hero-bg.jpg';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [name, setName] = useState('');
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null);
  const [step, setStep] = useState(1);

  const roles = [
    {
      id: 'manager' as UserRole,
      title: 'Manager',
      description: 'Full access to procurement, sales, and inventory management',
      icon: ShieldCheck,
    },
    {
      id: 'sales_agent' as UserRole,
      title: 'Sales Agent',
      description: 'Record sales and view inventory at your branch',
      icon: Users,
    },
    {
      id: 'director' as UserRole,
      title: 'Director',
      description: 'View aggregated reports and sales summaries',
      icon: Building2,
    },
  ];

  const branches: Branch[] = ['Maganjo', 'Matugga'];

  const handleContinue = () => {
    if (step === 1 && name.length >= 2) {
      setStep(2);
    } else if (step === 2 && selectedRole) {
      if (selectedRole === 'director') {
        login(name, selectedRole, 'Maganjo');
        navigate('/dashboard');
      } else {
        setStep(3);
      }
    } else if (step === 3 && selectedBranch) {
      login(name, selectedRole!, selectedBranch);
      navigate('/dashboard');
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Left Panel - Hero */}
      <div className="relative hidden w-1/2 lg:block">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${heroBg})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-karibu-green-700/90 via-karibu-green-600/80 to-karibu-gold-500/60" />
        <div className="relative z-10 flex h-full flex-col justify-between p-12">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-karibu-gold-500">
              <Wheat className="h-7 w-7 text-karibu-brown" />
            </div>
            <div>
              <h1 className="font-serif text-2xl font-bold text-primary-foreground">Karibu</h1>
              <p className="text-sm text-primary-foreground/80">Groceries LTD</p>
            </div>
          </div>
          
          <div className="space-y-6">
            <h2 className="font-serif text-4xl font-bold leading-tight text-primary-foreground">
              Welcome to Your<br />
              <span className="text-karibu-gold-200">Wholesale Management</span><br />
              System
            </h2>
            <p className="max-w-md text-lg text-primary-foreground/90">
              Streamline your cereal distribution business with our comprehensive 
              inventory, sales, and credit management solution.
            </p>
            <div className="flex gap-4 text-sm text-primary-foreground/80">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-karibu-gold-500" />
                2 Branches
              </div>
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-karibu-gold-500" />
                5 Produce Types
              </div>
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-karibu-gold-500" />
                Real-time Stock
              </div>
            </div>
          </div>

          <p className="text-sm text-primary-foreground/60">
            © 2024 Karibu Groceries LTD. All rights reserved.
          </p>
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="flex w-full flex-col justify-center bg-background px-8 lg:w-1/2 lg:px-16">
        <div className="mx-auto w-full max-w-md">
          {/* Mobile Logo */}
          <div className="mb-8 flex items-center gap-3 lg:hidden">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-karibu-gold-500">
              <Wheat className="h-6 w-6 text-karibu-brown" />
            </div>
            <div>
              <h1 className="font-serif text-xl font-bold">Karibu</h1>
              <p className="text-xs text-muted-foreground">Groceries LTD</p>
            </div>
          </div>

          {/* Step Indicator */}
          <div className="mb-8 flex items-center gap-2">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                  s <= step ? 'bg-primary' : 'bg-muted'
                }`}
              />
            ))}
          </div>

          {/* Step 1: Name */}
          {step === 1 && (
            <div className="animate-fade-in space-y-6">
              <div>
                <h2 className="font-serif text-2xl font-bold">What's your name?</h2>
                <p className="mt-2 text-muted-foreground">
                  Enter your name to get started
                </p>
              </div>
              <div>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your full name"
                  className="w-full rounded-xl border border-input bg-background px-4 py-3 text-lg focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
              <Button
                size="lg"
                variant="hero"
                className="w-full"
                onClick={handleContinue}
                disabled={name.length < 2}
              >
                Continue
                <ArrowRight className="h-5 w-5" />
              </Button>
            </div>
          )}

          {/* Step 2: Role Selection */}
          {step === 2 && (
            <div className="animate-fade-in space-y-6">
              <div>
                <h2 className="font-serif text-2xl font-bold">Select your role</h2>
                <p className="mt-2 text-muted-foreground">
                  Choose your role to access the system
                </p>
              </div>
              <div className="space-y-3">
                {roles.map((role) => {
                  const Icon = role.icon;
                  return (
                    <button
                      key={role.id}
                      onClick={() => setSelectedRole(role.id)}
                      className={`w-full rounded-xl border-2 p-4 text-left transition-all duration-200 ${
                        selectedRole === role.id
                          ? 'border-primary bg-karibu-green-50 shadow-md'
                          : 'border-border hover:border-karibu-green-200 hover:bg-muted/50'
                      }`}
                    >
                      <div className="flex items-start gap-4">
                        <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${
                          selectedRole === role.id
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted text-muted-foreground'
                        }`}>
                          <Icon className="h-6 w-6" />
                        </div>
                        <div>
                          <h3 className="font-semibold">{role.title}</h3>
                          <p className="mt-1 text-sm text-muted-foreground">
                            {role.description}
                          </p>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
              <Button
                size="lg"
                variant="hero"
                className="w-full"
                onClick={handleContinue}
                disabled={!selectedRole}
              >
                Continue
                <ArrowRight className="h-5 w-5" />
              </Button>
            </div>
          )}

          {/* Step 3: Branch Selection */}
          {step === 3 && (
            <div className="animate-fade-in space-y-6">
              <div>
                <h2 className="font-serif text-2xl font-bold">Select your branch</h2>
                <p className="mt-2 text-muted-foreground">
                  Choose the branch you're working at
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {branches.map((branch) => (
                  <button
                    key={branch}
                    onClick={() => setSelectedBranch(branch)}
                    className={`rounded-xl border-2 p-6 text-center transition-all duration-200 ${
                      selectedBranch === branch
                        ? 'border-primary bg-karibu-green-50 shadow-md'
                        : 'border-border hover:border-karibu-green-200 hover:bg-muted/50'
                    }`}
                  >
                    <Building2 className={`mx-auto h-8 w-8 ${
                      selectedBranch === branch ? 'text-primary' : 'text-muted-foreground'
                    }`} />
                    <h3 className="mt-3 font-semibold">{branch}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">Branch</p>
                  </button>
                ))}
              </div>
              <Button
                size="lg"
                variant="hero"
                className="w-full"
                onClick={handleContinue}
                disabled={!selectedBranch}
              >
                Enter System
                <ArrowRight className="h-5 w-5" />
              </Button>
            </div>
          )}

          {/* Back Button */}
          {step > 1 && (
            <button
              onClick={() => setStep(step - 1)}
              className="mt-4 text-sm text-muted-foreground hover:text-foreground"
            >
              ← Go back
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;
