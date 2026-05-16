"use client";

import Link from "next/link";
import { SealCheck, ArrowRight, GithubLogo, TwitterLogo, LinkedinLogo } from "@phosphor-icons/react";

export function Footer() {
  return (
    <footer className="bg-white border-t border-slate-200 pt-12 sm:pt-16 pb-8 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 sm:gap-12 mb-12 sm:mb-16">
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-6 group transition-transform hover:translate-x-1">
              <div className="w-10 h-10 bg-seafoam rounded-xl flex items-center justify-center shadow-lg shadow-seafoam/10 transition-transform group-hover:rotate-12">
                <SealCheck size={24} weight="bold" className="text-abyss" />
              </div>
              <span className="text-2xl font-bold tracking-tight text-abyss font-serif">SignSea</span>
            </Link>
            <p className="text-marine/70 text-sm leading-relaxed mb-6">
              Trust at Anchor. Secure payment infrastructure for the African digital economy.
            </p>
            <div className="flex gap-4">
              <Link href="#" className="text-marine/60 hover:text-seafoam transition-colors">
                <TwitterLogo size={20} weight="duotone" />
              </Link>
              <Link href="#" className="text-marine/60 hover:text-seafoam transition-colors">
                <LinkedinLogo size={20} weight="duotone" />
              </Link>
              <Link href="#" className="text-marine/60 hover:text-seafoam transition-colors">
                <GithubLogo size={20} weight="duotone" />
              </Link>
            </div>
          </div>

          <div>
            <h4 className="font-serif font-bold text-abyss mb-6">Product</h4>
            <ul className="space-y-4">
              <li><Link href="/planner" className="text-sm text-marine/70 hover:text-seafoam transition-colors">Project Planner</Link></li>
              <li><Link href="/projects" className="text-sm text-marine/70 hover:text-seafoam transition-colors">Browse Projects</Link></li>
              <li><Link href="/wallet" className="text-sm text-marine/70 hover:text-seafoam transition-colors">Wallet & Payouts</Link></li>
              <li><Link href="/settings/reputation" className="text-sm text-marine/70 hover:text-seafoam transition-colors">Trust Score</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-serif font-bold text-abyss mb-6">Legal</h4>
            <ul className="space-y-4">
              <li><Link href="/legal/terms" className="text-sm text-marine/70 hover:text-seafoam transition-colors">Terms of Service</Link></li>
              <li><Link href="/legal/privacy" className="text-sm text-marine/70 hover:text-seafoam transition-colors">Privacy Policy</Link></li>
              <li><Link href="/legal/escrow-agreement" className="text-sm text-marine/70 hover:text-seafoam transition-colors">Escrow Agreement</Link></li>
              <li><Link href="/legal/refund-policy" className="text-sm text-marine/70 hover:text-seafoam transition-colors">Refund Policy</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-serif font-bold text-abyss mb-6">Resources</h4>
            <ul className="space-y-4">
              <li><Link href="#" className="text-sm text-marine/70 hover:text-seafoam transition-colors">Documentation</Link></li>
              <li><Link href="#" className="text-sm text-marine/70 hover:text-seafoam transition-colors">Help Center</Link></li>
              <li><Link href="#" className="text-sm text-marine/70 hover:text-seafoam transition-colors">Contact Support</Link></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-marine/50 bolder uppercase tracking-widest">
            Product of Loin Tech
          </p>
          <p className="text-xs text-marine/50">
            &copy; {new Date().getFullYear()} SignSea Technology. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
