"use client";

import { motion } from "framer-motion";
import { Link as PhosphorLink, CheckCircle, ShieldCheck, CurrencyNgn, ChartLineUp } from "@phosphor-icons/react";

export function MockDashboard() {
  const milestones = [
    { title: "UI/UX Design", status: "COMPLETED", amount: "₦250,000", date: "Feb 12" },
    { title: "Frontend Implementation", status: "PENDING", amount: "₦400,000", date: "Feb 28" },
    { title: "API Integration", status: "LOCKED", amount: "₦350,000", date: "Mar 15" },
  ];

  return (
    <div className="relative group w-full overflow-hidden">
      <motion.div 
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        className="w-full bg-mist rounded-2xl border border-slate-200 shadow-2xl overflow-hidden pointer-events-none select-none max-w-4xl mx-auto"
      >
        {/* Top Header Mockup */}
        <div className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-seafoam/10 flex items-center justify-center text-seafoam">
              <ShieldCheck size={24} weight="duotone" />
            </div>
            <div>
              <div className="text-xs text-marine/50 font-medium">Tracking Project</div>
              <div className="text-sm font-bold text-abyss font-serif tracking-tight">E-Commerce App Redesign</div>
            </div>
          </div>
          <div className="flex gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-slate-200"></div>
            <div className="w-2.5 h-2.5 rounded-full bg-slate-200"></div>
            <div className="w-2.5 h-2.5 rounded-full bg-slate-200"></div>
          </div>
        </div>

        {/* Layout Mockup */}
        <div className="p-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            <div className="bg-white rounded-xl p-6 border border-slate-100 shadow-sm transition-all duration-300 transform group-hover:-translate-y-1">
              <h4 className="text-xs font-bold text-marine/50 uppercase tracking-widest mb-4 flex items-center gap-2">
                <PhosphorLink size={14} weight="bold" />
                Active Milestones
              </h4>
              <div className="space-y-4">
                {milestones.map((m, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 rounded-lg bg-mist border border-slate-50 transition-colors">
                    <div className="flex items-center gap-3">
                      {m.status === "COMPLETED" ? (
                        <CheckCircle size={20} weight="duotone" className="text-seafoam" />
                      ) : (
                        <div className={`w-5 h-5 rounded-full border-2 ${m.status === "PENDING" ? "border-seafoam/50 border-t-seafoam animate-spin" : "border-slate-200"}`}></div>
                      )}
                      <div>
                        <div className="text-sm font-semibold text-abyss">{m.title}</div>
                        <div className="text-[10px] text-marine/50">Expected {m.date}</div>
                      </div>
                    </div>
                    <div className="text-sm font-mono font-bold text-abyss">{m.amount}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm transition-all duration-300 transform group-hover:-translate-y-1 group-hover:delay-75">
                <CurrencyNgn size={20} weight="duotone" className="text-seafoam mb-2" />
                <div className="text-xs text-marine/50">Escrow Locked</div>
                <div className="text-xl font-bold font-serif text-abyss tracking-tight">₦750,000</div>
              </div>
              <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm transition-all duration-300 transform group-hover:-translate-y-1 group-hover:delay-100">
                <ChartLineUp size={20} weight="duotone" className="text-seafoam mb-2" />
                <div className="text-xs text-marine/50">Reputation Gain</div>
                <div className="text-xl font-bold font-serif text-abyss tracking-tight">+15 pts</div>
              </div>
            </div>
          </div>
          
          <div className="space-y-6">
            <div className="bg-abyss text-white p-6 rounded-2xl shadow-xl space-y-4 relative overflow-hidden transition-all duration-500 group-hover:scale-[1.02]">
              <div className="w-16 h-16 rounded-full bg-seafoam/20 blur-2xl absolute -top-4 -right-4 animate-pulse"></div>
              <div className="relative">
                <div className="text-[10px] font-bold text-seafoam/80 uppercase tracking-widest mb-1">Status</div>
                <h3 className="text-lg font-serif font-bold text-white mb-4 leading-tight truncate">Anchor Secured</h3>
                <div className="h-1 bg-white/10 rounded-full overflow-hidden mb-6">
                  <div className="h-full bg-seafoam w-[60%]"></div>
                </div>
                <div className="flex flex-col gap-2">
                  <div className="bg-white/10 text-[10px] px-3 py-2 rounded-lg backdrop-blur-sm border border-white/5 font-medium">Agreement Witnessed</div>
                  <div className="bg-seafoam text-abyss text-[10px] px-3 py-2 rounded-lg font-bold">Funds Safe at Anchor</div>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4 transition-all duration-300 transform group-hover:translate-x-2">
              <div className="flex -space-x-3">
                <div className="w-8 h-8 rounded-full bg-slate-200 border-2 border-white ring-2 ring-seafoam/20"></div>
                <div className="w-8 h-8 rounded-full bg-slate-300 border-2 border-white"></div>
                <div className="w-8 h-8 rounded-full bg-slate-400 border-2 border-white"></div>
              </div>
              <div className="text-[10px] text-marine/50 leading-tight">
                Securely manage project milestones and fund releases from one dashboard.
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
