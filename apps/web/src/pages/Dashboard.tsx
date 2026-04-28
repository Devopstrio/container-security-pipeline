import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { ShieldCheck, ShieldAlert, Lock, Search, ExternalLink, RefreshCcw, Activity, AlertTriangle } from 'lucide-react';

const vulnData = [
  { name: 'Mon', count: 12 },
  { name: 'Tue', count: 18 },
  { name: 'Wed', count: 8 },
  { name: 'Thu', count: 5 },
  { name: 'Fri', count: 2 },
];

const trustData = [
  { name: 'Signed', value: 85 },
  { name: 'Unsigned', value: 15 },
];

const COLORS = ['#10b981', '#f43f5e'];

const Dashboard: React.FC = () => {
  return (
    <div className="space-y-12 animate-fade-in">
      {/* Header */}
      <div className="flex justify-between items-end border-b border-slate-800 pb-8">
        <div>
          <h1 className="text-5xl font-black text-white tracking-tighter italic uppercase">Security Operations</h1>
          <p className="text-slate-400 mt-3 text-xl max-w-2xl font-medium">Global control plane for supply chain trust and multi-cluster threat detection.</p>
        </div>
        <div className="flex gap-4">
          <button className="bg-slate-900 border border-slate-800 text-slate-300 px-6 py-3 rounded-2xl font-bold hover:bg-slate-800 transition flex items-center gap-2">
             <RefreshCcw size={18} /> Re-Scan All
          </button>
          <button className="bg-red-600 hover:bg-red-500 text-white px-8 py-3 rounded-2xl font-bold transition shadow-xl shadow-red-900/40 flex items-center gap-2">
             <ShieldAlert size={18} /> Quarantine Cluster
          </button>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard title="Trust Score" value="94.2" change="+1.2" icon={<ShieldCheck className="text-emerald-400" />} />
        <StatCard title="Signed Images" value="1,420" change="Verified" icon={<Lock className="text-sky-400" />} />
        <StatCard title="Open Findings" value="45" change="-12%" icon={<Search className="text-amber-400" />} />
        <StatCard title="Runtime Alerts" value="0" change="Safe" icon={<Activity className="text-red-400" />} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Vulnerability Trend */}
        <div className="bg-slate-900/40 border border-slate-800 p-10 rounded-[3rem] backdrop-blur-3xl shadow-2xl relative overflow-hidden">
          <div className="flex items-center justify-between mb-10">
            <h2 className="text-2xl font-bold text-white flex items-center gap-3">
              <span className="w-2 h-8 bg-red-600 rounded-full"></span>
              Critical Finding Velocity
            </h2>
            <div className="text-[10px] font-black uppercase text-red-400 tracking-[0.2em] bg-red-900/20 px-4 py-2 rounded-full border border-red-800/50">Supply Chain Risk</div>
          </div>
          <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={vulnData}>
                <defs>
                  <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} dy={10} />
                <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                   contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '16px' }}
                />
                <Area type="monotone" dataKey="count" stroke="#ef4444" strokeWidth={4} fillOpacity={1} fill="url(#colorCount)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Trust Pie Chart */}
        <div className="bg-slate-900/40 border border-slate-800 p-10 rounded-[3rem] backdrop-blur-3xl shadow-2xl relative overflow-hidden">
          <div className="flex items-center justify-between mb-10">
            <h2 className="text-2xl font-bold text-white flex items-center gap-3">
              <span className="w-2 h-8 bg-emerald-500 rounded-full"></span>
              Image Signing Compliance
            </h2>
            <div className="flex items-center gap-2 text-emerald-400 text-sm font-bold italic">
               <Lock size={20} />
               85% Verified
            </div>
          </div>
          <div className="h-[400px] w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={trustData}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={120}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {trustData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                   contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '16px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Policy Center */}
      <div className="bg-slate-900/40 border border-slate-800 p-10 rounded-[3rem] backdrop-blur-3xl shadow-2xl">
        <h2 className="text-2xl font-bold mb-10 text-white flex items-center gap-3 text-red-400">
           <ShieldAlert size={28} />
           Admission Policy Enforcement
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
           <PolicyCard name="No Critical Vulns" enforcement="Reject" status="Enforced" />
           <PolicyCard name="Require Cosign" enforcement="Reject" status="Enforced" />
           <PolicyCard name="No Root User" enforcement="Audit" status="Monitoring" />
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, change, icon }: any) => (
  <div className="bg-slate-900/40 border border-slate-800 p-8 rounded-[2.5rem] hover:border-red-500/30 transition-all group overflow-hidden relative shadow-2xl">
    <div className="absolute -right-6 -bottom-6 opacity-[0.03] group-hover:opacity-10 transition-opacity transform group-hover:scale-150 duration-1000 rotate-12">
       {React.cloneElement(icon, { size: 160 })}
    </div>
    <div className="relative z-10">
      <div className="p-4 bg-slate-950 rounded-2xl w-fit mb-6 border border-slate-800/50 shadow-inner group-hover:scale-110 transition duration-500">{icon}</div>
      <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] mb-1">{title}</p>
      <div className="flex items-end gap-3">
        <p className="text-4xl font-black text-white tracking-tighter">{value}</p>
        <span className={`text-[11px] font-black pb-1.5 ${change.startsWith('+') || change === 'Verified' ? 'text-emerald-400' : 'text-red-400'}`}>{change}</span>
      </div>
    </div>
  </div>
);

const PolicyCard = ({ name, enforcement, status }: any) => (
  <div className="p-6 bg-slate-950/50 border border-slate-800 rounded-3xl hover:bg-slate-800/50 transition cursor-pointer group">
    <div className="flex justify-between items-start mb-4">
      <h3 className="text-xl font-bold text-slate-100">{name}</h3>
      <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full border ${enforcement === 'Reject' ? 'border-red-500 text-red-500 bg-red-950/20' : 'border-amber-500 text-amber-500 bg-amber-950/20'}`}>{enforcement}</span>
    </div>
    <div className="flex justify-between items-center mt-8">
       <span className="text-[10px] font-black uppercase text-slate-500 tracking-widest">{status}</span>
       <ExternalLink size={14} className="text-slate-700 group-hover:text-white transition" />
    </div>
  </div>
);

export default Dashboard;
