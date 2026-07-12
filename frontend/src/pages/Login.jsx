import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useApp } from '../context/AppContext';
import { ShieldCheck, Info, ArrowLeft, Key, UserCheck, ShieldAlert, Lock } from 'lucide-react';
import toast from 'react-hot-toast';

// Setup schema
const loginSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Must be a valid corporate email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  rememberMe: z.boolean().optional(),
});

export const Login = () => {
  const navigate = useNavigate();
  const { login } = useApp();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: async (data, context, options) => {
      // Manual resolver to avoid complex hookform resolver issues
      const result = loginSchema.safeParse(data);
      if (!result.success) {
        const fieldErrors = {};
        result.error.errors.forEach((err) => {
          fieldErrors[err.path[0]] = { message: err.message };
        });
        return { values: {}, errors: fieldErrors };
      }
      return { values: result.data, errors: {} };
    },
    defaultValues: {
      email: 'pandu@assetflow.com',
      password: 'password123',
      rememberMe: true,
    }
  });

  const onSubmit = async (data) => {
    setLoading(true);
    // Simulate API call delay
    setTimeout(() => {
      const res = login(data.email, data.password);
      setLoading(false);
      if (res.success) {
        toast.success(`Welcome back, ${res.user.name}!`);
        navigate('/dashboard');
      } else {
        toast.error(res.message);
      }
    }, 800);
  };

  const handleQuickLogin = (email) => {
    setValue('email', email);
    setValue('password', 'password123');
    toast.success(`Selected credentials for ${email}`);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 md:p-8">
      {/* Container Card */}
      <div className="w-full max-w-4xl bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden grid grid-cols-1 md:grid-cols-12">
        
        {/* LEFT COLUMN: Demo accounts panel (Col Span 5) */}
        <div className="md:col-span-5 bg-slate-900 p-8 text-white flex flex-col justify-between">
          <div className="space-y-6">
            <Link to="/" className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white transition-colors">
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Product Site
            </Link>

            <div>
              <h3 className="text-lg font-bold">Demo Custody Portal</h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">Select a profile card below to auto-populate credentials and test access levels.</p>
            </div>

            <div className="space-y-3">
              {[
                { name: 'Rahul (Admin)', email: 'rahul@assetflow.com', desc: 'Org setups, categories, roles' },
                { name: 'Pandu (Manager)', email: 'pandu@assetflow.com', desc: 'Registers & allocates equipment' },
                { name: 'Sarah Chen (Dept Head)', email: 'sarah.c@assetflow.com', desc: 'Approves local requests' },
                { name: 'Alice Watson (Staff)', email: 'alice.w@assetflow.com', desc: 'Books spaces, raises issues' }
              ].map((account) => (
                <button
                  key={account.email}
                  type="button"
                  onClick={() => handleQuickLogin(account.email)}
                  className="w-full text-left p-3.5 rounded-xl border border-slate-800 hover:border-slate-700 bg-slate-950/40 hover:bg-slate-950/80 transition-all flex items-start gap-3 cursor-pointer group"
                >
                  <UserCheck className="w-4.5 h-4.5 text-blue-400 mt-0.5 shrink-0 group-hover:scale-110 transition-transform" />
                  <div className="min-w-0 flex-1 text-xs">
                    <p className="font-bold text-slate-200">{account.name}</p>
                    <p className="text-[10px] text-slate-500 font-mono mt-0.5 truncate">{account.email}</p>
                    <p className="text-[10px] text-slate-450 mt-1 font-semibold leading-tight">{account.desc}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="text-[10px] text-slate-500 pt-6 border-t border-slate-800/60 mt-6 flex items-center gap-1.5 leading-tight font-medium">
            <Lock className="w-3.5 h-3.5 shrink-0" />
            <span>Encrypted Corporate Session. Passwords default: password123</span>
          </div>
        </div>

        {/* RIGHT COLUMN: Form fields (Col Span 7) */}
        <div className="md:col-span-7 p-8 md:p-10 flex flex-col justify-center">
          <div className="mb-6">
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-base">A</span>
              <span className="font-extrabold text-base tracking-tight text-slate-900">AssetFlow ERP</span>
            </div>
            <h2 className="text-xl font-bold text-slate-800 tracking-tight mt-4">Corporate Sign In</h2>
            <p className="text-slate-500 text-xs mt-1">Authenticate using your corporate email address to access modules.</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Email */}
            <div>
              <label className="block text-xs font-semibold text-slate-655 mb-1.5" htmlFor="email">
                Corporate Email Address
              </label>
              <input
                id="email"
                type="email"
                {...register('email')}
                placeholder="e.g. employee@company.com"
                className={`w-full px-3.5 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 transition-all font-semibold ${
                  errors.email
                    ? 'border-red-300 focus:ring-red-500/25 focus:border-red-500'
                    : 'border-slate-200 focus:ring-blue-500/25 focus:border-blue-500'
                }`}
              />
              {errors.email && (
                <p className="text-xs text-red-600 font-medium mt-1">{errors.email.message}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-slate-655" htmlFor="password">
                  Account Password
                </label>
                <button
                  type="button"
                  onClick={() => toast.success('Simulation: Verification codes dispatched.')}
                  className="text-xs font-semibold text-blue-600 hover:underline cursor-pointer"
                >
                  Forgot Password?
                </button>
              </div>
              <input
                id="password"
                type="password"
                {...register('password')}
                placeholder="••••••••"
                className={`w-full px-3.5 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 transition-all ${
                  errors.password
                    ? 'border-red-300 focus:ring-red-500/25 focus:border-red-500'
                    : 'border-slate-200 focus:ring-blue-500/25 focus:border-blue-500'
                }`}
              />
              {errors.password && (
                <p className="text-xs text-red-600 font-medium mt-1">{errors.password.message}</p>
              )}
            </div>

            {/* Remember me */}
            <div className="flex items-center">
              <input
                id="rememberMe"
                type="checkbox"
                {...register('rememberMe')}
                className="h-4.5 w-4.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500/20 cursor-pointer"
              />
              <label htmlFor="rememberMe" className="ml-2 text-xs font-semibold text-slate-600 select-none cursor-pointer">
                Keep my session active on this device
              </label>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-xl text-sm transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75 shadow-xs"
            >
              {loading ? 'Authenticating securely...' : 'Sign In to Portal'}
            </button>
          </form>
        </div>

      </div>
    </div>
  );
};
export default Login;
