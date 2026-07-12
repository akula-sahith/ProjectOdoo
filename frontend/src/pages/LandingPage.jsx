import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import {
  ArrowRight,
  Shield,
  Layers,
  Wrench,
  FileCheck,
  Building2,
  Calendar,
  Bell,
  BarChart3,
  ChevronDown,
  Mail,
  Zap,
  Lock,
  ArrowRightLeft,
  Users,
  AlertCircle,
  Network,
  Database,
  ShieldCheck,
  Activity
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import gsap from 'gsap';
import Lenis from 'lenis';
import toast from 'react-hot-toast';

export const LandingPage = () => {
  const navigate = useNavigate();
  const { assets, bookings, maintenanceTickets } = useApp();
  const [scrolled, setScrolled] = useState(false);

  // Smooth scroll using Lenis
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    function raf(time) {
      lenis.run = true;
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      lenis.destroy();
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Parallax Hero Mouse Movement
  const heroRef = useRef(null);
  const handleMouseMove = (e) => {
    if (!heroRef.current) return;
    const { clientX, clientY } = e;
    const { innerWidth, innerHeight } = window;
    const xOffset = (clientX - innerWidth / 2) / 45;
    const yOffset = (clientY - innerHeight / 2) / 45;

    gsap.to('.hero-parallax-card', {
      x: xOffset,
      y: yOffset,
      stagger: 0.03,
      ease: 'power2.out',
      duration: 0.8,
    });
  };

  // Section Ref for Counter trigger
  const statsRef = useRef(null);
  const [counters, setCounters] = useState({
    assets: 0,
    depts: 0,
    employees: 0,
    repairs: 0,
    bookings: 0,
    efficiency: 0,
  });

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          const duration = 1500;
          const steps = 40;
          const stepTime = duration / steps;
          let currentStep = 0;

          const interval = setInterval(() => {
            currentStep++;
            setCounters({
              assets: Math.round((assets.length * 15 + 1450) * (currentStep / steps)),
              depts: Math.round(5 * (currentStep / steps)),
              employees: Math.round(142 * (currentStep / steps)),
              repairs: Math.round((maintenanceTickets.length * 12 + 480) * (currentStep / steps)),
              bookings: Math.round((bookings.length * 20 + 820) * (currentStep / steps)),
              efficiency: Math.round(99.4 * (currentStep / steps)),
            });

            if (currentStep >= steps) {
              clearInterval(interval);
            }
          }, stepTime);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (statsRef.current) {
      observer.observe(statsRef.current);
    }
    return () => observer.disconnect();
  }, [assets, bookings, maintenanceTickets]);

  // Showcase device mockup screens cycler - DO NOT CHANGE SECTION NAME/FLOW
  const showcaseScreens = [
    { title: 'Executive KPI Dashboard', desc: 'Real-time corporate resource snapshots and performance trackers.', img: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=900' },
    { title: 'Structured Asset Directory', desc: 'Complete equipment passport lifecycle logs, serial logs, and QR tags.', img: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=900' },
    { title: 'Interactive Maintenance Kanban', desc: 'Approve repair tickets and route technicians instantly.', img: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80&w=900' },
    { title: 'Double-Booking Conflict Calendar', desc: 'Reserve vehicles or conference suites without overlaps.', img: 'https://images.unsplash.com/photo-1506784983877-45594efa4cbe?auto=format&fit=crop&q=80&w=900' },
    { title: 'Ledger Reporting Exports', desc: 'Extract automated valuations, depreciations, and logs.', img: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&q=80&w=900' },
  ];
  const [activeShowcaseIdx, setActiveShowcaseIdx] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveShowcaseIdx((prev) => (prev + 1) % showcaseScreens.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  // Core Modules - Creative interactive layout instead of a grid box!
  const coreModules = [
    { id: 'dashboard', title: 'Executive Dashboard', desc: 'Real-time charts, tracking ledger logs, and quick action panels.', icon: BarChart3, highlight: 'Recharts integration, active ticket logs, and resource booking statuses.', img: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=600' },
    { id: 'org', title: 'Organization Setup', desc: 'Departments structure, employee roles, and cost allocation models.', icon: Building2, highlight: 'Multi-department nesting, role access boundaries, and personnel passports.', img: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=600' },
    { id: 'assets', title: 'Asset Directory', desc: 'Detailed equipment ledger passport listings with serial parameters.', icon: Layers, highlight: 'Condition tracking, original values, serial codes, and barcode scans.', img: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=600' },
    { id: 'transfer', title: 'Allocation & Transfer', desc: 'Custody assignment workflows with dynamic transfer handlers.', icon: ArrowRightLeft, highlight: 'Overlap validation rules preventing multiple simultaneous users.', img: 'https://images.unsplash.com/photo-1573164713988-8665fc963095?auto=format&fit=crop&q=80&w=600' },
    { id: 'booking', title: 'Resource Booking', desc: 'Calendars preventing double bookings of cars or meetings.', icon: Calendar, highlight: 'Real-time validation blockades checking overlapping hour intervals.', img: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=600' },
    { id: 'repairs', title: 'Maintenance Kanban', desc: 'Fault tickets routing technicians across progress boards.', icon: Wrench, highlight: 'Staff issues creation, manager validation queues, and status tags.', img: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80&w=600' },
    { id: 'audit', title: 'Audit Cycles', desc: 'Verifying hardware physical state by departments.', icon: FileCheck, highlight: 'Missing inventory logging with automated state transitions.', img: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=600' },
    { id: 'reports', title: 'Reports Tab', desc: 'Linear depreciation valuations calculation curves.', icon: FileCheck, highlight: 'Automated valuation lists with PDF/XLSX export downloads.', img: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&q=80&w=600' },
    { id: 'alerts', title: 'Notifications Center', desc: 'Categorized priority logs alerting stakeholders.', icon: Bell, highlight: 'Real-time UI toasts, alerts lists, and system priority categories.', img: 'https://images.unsplash.com/photo-1557200134-90327ee9fafa?auto=format&fit=crop&q=80&w=600' },
  ];
  const [activeModuleIdx, setActiveModuleIdx] = useState(0);

  // Expandable User Roles - DO NOT CHANGE SECTION NAME/FLOW
  const userRolesData = [
    { role: 'Admin', desc: 'Manages organization directories, departments setup, asset categories, system security settings, and backups scheduling.', icon: Shield },
    { role: 'Asset Manager', desc: 'Registers inventory assets, allocates equipment to staff, and reviews repair and return approvals logs.', icon: Zap },
    { role: 'Department Head', desc: 'Approves local transfer and allocation workflows, schedules meeting rooms, and reviews cost center reports.', icon: Building2 },
    { role: 'Employee', desc: 'Views assigned corporate workstations, schedules shared spaces, and requests returns or repairs.', icon: Users },
  ];
  const [expandedRole, setExpandedRole] = useState(0);

  return (
    <div className="bg-white min-h-screen text-slate-900 font-sans selection:bg-blue-100 selection:text-blue-900 overflow-x-hidden">
      
      {/* 1. STICKY GLASS NAVBAR */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? 'bg-white/80 backdrop-blur-md border-b border-slate-200 py-3.5 shadow-xs' : 'bg-transparent py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-8 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-lg">A</span>
            <span className="font-extrabold text-xl tracking-tight text-slate-900">AssetFlow</span>
          </div>

          <nav className="hidden lg:flex items-center gap-8 text-sm font-bold text-slate-500">
            <a href="#hardening" className="hover:text-blue-600 transition-colors">Enterprise Hardening</a>
            <a href="#modules" className="hover:text-blue-600 transition-colors">Core Modules</a>
            <a href="#showcase" className="hover:text-blue-600 transition-colors">Interface Walkthrough</a>
            <a href="#roles" className="hover:text-blue-600 transition-colors">User Roles</a>
          </nav>

          <div className="flex items-center gap-3.5">
            <Link
              to="/login"
              className="px-4 py-2 text-sm font-bold text-slate-700 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-all"
            >
              Employee Login
            </Link>
            <button
              onClick={() => toast.success('Demo request registered. Our sales team will reach out shortly.')}
              className="hidden sm:inline-block px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-lg shadow-xs transition-colors cursor-pointer"
            >
              Request Demo
            </button>
          </div>
        </div>
      </header>

      {/* 2. HERO SECTION - Centered Layout with Bottom Mockup and Ambient Gradient */}
      <section
        ref={heroRef}
        onMouseMove={handleMouseMove}
        className="pt-32 pb-24 bg-radial from-slate-50/30 via-white to-white border-b border-slate-200 relative overflow-hidden flex flex-col items-center"
      >
        {/* Massive Ambient Radial Blur Background (Purple/Blue Aura) - Brighter & Heavier */}
        <div className="absolute top-[40%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[850px] h-[850px] bg-radial from-purple-500/40 via-blue-400/30 to-transparent blur-[110px] pointer-events-none z-0" />

        <div className="max-w-4xl mx-auto px-6 text-center space-y-6 relative z-10 flex flex-col items-center">
          {/* Centered Split Text Reveal Mask */}
          <h1 className="text-4xl sm:text-5xl md:text-6.5xl font-black text-slate-900 tracking-tight leading-tight select-none">
            <div className="overflow-hidden py-1">
              <motion.span
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                className="inline-block"
              >
                Manage Every Asset.
              </motion.span>
            </div>
            <div className="overflow-hidden py-1">
              <motion.span
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.08 }}
                className="inline-block text-blue-600"
              >
                Empower Every Team.
              </motion.span>
            </div>
          </h1>

          <motion.p
            initial={{ opacity: 0, filter: "blur(6px)", y: 15 }}
            animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
            transition={{ duration: 0.8, delay: 0.35, ease: "easeOut" }}
            className="text-slate-500 text-sm md:text-base max-w-2xl leading-relaxed font-semibold"
          >
            AssetFlow is a physical resource management platform built to simplify, track, allocate, maintain, and audit organization capital through a unified role-based ERP portal.
          </motion.p>

          {/* Action Buttons Centered */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5, ease: "easeOut" }}
            className="flex flex-wrap justify-center gap-4 pt-1"
          >
            <button
              onClick={() => navigate('/login')}
              className="px-7 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-sm rounded-xl shadow-md hover:shadow-blue-500/20 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              Employee Portal <ArrowRight className="w-4 h-4" />
            </button>
            <a
              href="#modules"
              className="px-7 py-3.5 border border-slate-200 hover:bg-slate-50 text-slate-700 font-extrabold text-sm rounded-xl transition-all shadow-sm bg-white"
            >
              Explore Modules
            </a>
          </motion.div>
        </div>

        {/* Large Mockup Centered at the Bottom (overlapping or emerging) */}
        <motion.div
          initial={{ opacity: 0, y: 60, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
          className="w-full max-w-5xl px-6 mt-16 relative z-10 flex justify-center"
        >
          {/* Sleek Browser Frame emerging from the bottom */}
          <div className="w-full bg-white border border-slate-200/80 rounded-3xl shadow-2xl p-2.5">
            <div className="h-6 w-full flex items-center justify-between px-3 border-b border-slate-100 pb-2 mb-2 bg-slate-50/50 rounded-t-2xl">
              <div className="flex gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-red-400/80" />
                <span className="w-2.5 h-2.5 rounded-full bg-yellow-400/80" />
                <span className="w-2.5 h-2.5 rounded-full bg-green-400/80" />
              </div>
              <div className="px-5 py-0.5 bg-white border border-slate-200/60 rounded-md text-[9px] font-bold text-slate-400 tracking-wide">
                assetflow.corp/portal
              </div>
              <span className="w-6" />
            </div>
            <div className="rounded-2xl overflow-hidden border border-slate-200/60 bg-slate-900 aspect-video shadow-inner">
              <img
                src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=1200"
                alt="AssetFlow Executive Dashboard"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </motion.div>
      </section>

      {/* 5. PROBLEMS WE SOLVE - Flat comparison timeline layout with NO box containers! */}
      <section id="hardening" className="py-20 bg-white border-b border-slate-100">
        <div className="max-w-6xl mx-auto px-6 md:px-8 space-y-16">
          <div className="max-w-xl text-left space-y-2">
            <span className="text-[10px] font-bold text-red-500 uppercase tracking-widest block">Critical Fixes</span>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Enterprise Hardening</h2>
            <p className="text-slate-500 text-xs leading-relaxed font-semibold">Transitioning workspace databases from manual Excel tables into active cloud-managed ledger keys.</p>
          </div>

          {/* Minimalist Split comparison grid layout with custom center separator */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 relative">
            <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-[1.5px] bg-slate-100 -translate-x-1/2" />
            
            {/* Left Column: Legacy Traps */}
            <div className="space-y-8">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">Legacy Operations Chaos</h3>
              </div>
              
              <ul className="space-y-6">
                <li className="flex items-start gap-4">
                  <span className="w-5 h-5 rounded-full bg-red-50 text-red-600 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">✕</span>
                  <div className="space-y-1">
                    <h4 className="font-bold text-slate-800 text-sm">Clunky Spreadsheets & Manual Logs</h4>
                    <p className="text-xs text-slate-500 leading-relaxed font-medium">Uncoordinated updates lead to ghost inventory tags, double records, and inaccurate asset passport files.</p>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <span className="w-5 h-5 rounded-full bg-red-50 text-red-650 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">✕</span>
                  <div className="space-y-1">
                    <h4 className="font-bold text-slate-800 text-sm">Overlapping Space Bookings</h4>
                    <p className="text-xs text-slate-500 leading-relaxed font-medium">Meeting rooms and shared fleet vehicles get double-booked, causing organization schedule conflicts.</p>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <span className="w-5 h-5 rounded-full bg-red-50 text-red-650 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">✕</span>
                  <div className="space-y-1">
                    <h4 className="font-bold text-slate-800 text-sm">Unscheduled Maintenance Deficits</h4>
                    <p className="text-xs text-slate-500 leading-relaxed font-medium">No alerts coordinate hardware defects, leaving printer and server breakdowns waiting weeks for attention.</p>
                  </div>
                </li>
              </ul>
            </div>

            {/* Right Column: AssetFlow Solutions */}
            <div className="space-y-8">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-pulse" />
                <h3 className="text-sm font-bold uppercase tracking-wider text-blue-600">AssetFlow Platform</h3>
              </div>

              <ul className="space-y-6">
                <li className="flex items-start gap-4">
                  <span className="w-5 h-5 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">✓</span>
                  <div className="space-y-1">
                    <h4 className="font-bold text-slate-800 text-sm">Centralized Database Ledgers</h4>
                    <p className="text-xs text-slate-500 leading-relaxed font-medium">Maintains single sources of truth with transaction histories, custodian parameters, and QR details.</p>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <span className="w-5 h-5 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">✓</span>
                  <div className="space-y-1">
                    <h4 className="font-bold text-slate-800 text-sm">Overlapping Interval Validators</h4>
                    <p className="text-xs text-slate-500 leading-relaxed font-medium">Actively scans database schedules and blocks conflicting double bookings at submission checkpoints.</p>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <span className="w-5 h-5 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">✓</span>
                  <div className="space-y-1">
                    <h4 className="font-bold text-slate-800 text-sm">Automated Kanban Fault Queues</h4>
                    <p className="text-xs text-slate-500 leading-relaxed font-medium">Speeds up equipment repairs by instantly routing user reports onto dedicated manager and technician pipelines.</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 6. CORE MODULES - High-Level Interactive Showcase Layout (No Grid Box!) */}
      <section id="modules" className="py-20 bg-slate-50 border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-6 md:px-8 space-y-12">
          <div className="max-w-xl text-left space-y-2">
            <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest block">System Capabilities</span>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Core Functional Modules</h2>
            <p className="text-slate-500 text-xs leading-relaxed font-semibold">Select a system module below to inspect its features and live database parameters.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            {/* Left Column: Modules Sidebar List (Col 5) */}
            <div className="lg:col-span-5 flex flex-col gap-2.5">
              {coreModules.map((m, idx) => {
                const Icon = m.icon;
                return (
                  <button
                    key={m.id}
                    onClick={() => setActiveModuleIdx(idx)}
                    className={`w-full text-left px-4 py-3.5 rounded-xl border transition-all duration-200 cursor-pointer flex items-center gap-3.5 ${
                      activeModuleIdx === idx
                        ? 'bg-white border-blue-300 text-blue-700 shadow-sm'
                        : 'bg-transparent border-transparent text-slate-500 hover:bg-slate-100 hover:text-slate-800'
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                      activeModuleIdx === idx ? 'bg-blue-50 text-blue-600' : 'bg-slate-200/60 text-slate-500'
                    }`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-bold">{m.title}</p>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Right Column: Premium Showcase Panel Viewport (Col 7) */}
            <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-250 shadow-md p-8 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-blue-750 rounded-lg text-xs font-bold">
                  <Zap className="w-3.5 h-3.5 text-blue-500" /> Active System Node
                </div>
                <h3 className="text-2xl md:text-3xl font-extrabold text-slate-900 leading-tight">{coreModules[activeModuleIdx].title}</h3>
                <p className="text-slate-500 text-sm md:text-base font-semibold leading-relaxed">{coreModules[activeModuleIdx].desc}</p>
              </div>

              {/* Dynamic Module Showcase Image */}
              <div className="relative w-full h-48 rounded-xl overflow-hidden border border-slate-200 shadow-xs my-3 bg-slate-50">
                <img
                  src={coreModules[activeModuleIdx].img}
                  alt={coreModules[activeModuleIdx].title}
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                  loading="lazy"
                />
              </div>

              {/* Data highlight details block */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-1.5">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block">Dashboard Integration</span>
                <p className="text-slate-800 text-sm md:text-base font-bold leading-relaxed">{coreModules[activeModuleIdx].highlight}</p>
              </div>

              {/* Device simulation screen link */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs text-slate-500 font-bold">🛡️ Protected ERP Subsystem</span>
                <Link
                  to="/login"
                  className="inline-flex items-center gap-1.5 text-sm text-blue-600 font-extrabold hover:underline"
                >
                  Verify Portal <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. DEVICE MOCKUP SHOWCASE CYCLER - DO NOT CHANGE SECTION NAME/FLOW */}
      <section id="showcase" className="py-20 bg-white border-b border-slate-100">
        <div className="max-w-6xl mx-auto px-6 md:px-8 space-y-12">
          <div className="max-w-xl text-left space-y-2 mx-auto text-center">
            <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest block">Product Walkthrough</span>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Explore the Portal Interfaces</h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center max-w-5xl mx-auto">
            {/* Show selector tabs (col 4) */}
            <div className="lg:col-span-4 space-y-2.5">
              {showcaseScreens.map((screen, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveShowcaseIdx(idx)}
                  className={`w-full text-left p-3.5 rounded-xl border transition-all cursor-pointer ${
                    activeShowcaseIdx === idx
                      ? 'bg-blue-50 border-blue-300 text-blue-700'
                      : 'bg-white border-slate-150 text-slate-500 hover:bg-slate-50'
                  }`}
                >
                  <p className="text-xs font-bold">{screen.title}</p>
                  <p className="text-[10px] mt-0.5 font-semibold text-slate-450 line-clamp-1">{screen.desc}</p>
                </button>
              ))}
            </div>

            {/* Screenshot mockup (col 8) */}
            <div className="lg:col-span-8 bg-slate-900 p-2 rounded-2xl shadow-xl border border-slate-800">
              <div className="h-3.5 w-full flex items-center gap-1.5 px-2 pb-2">
                <span className="w-2 h-2 rounded-full bg-red-500" />
                <span className="w-2 h-2 rounded-full bg-yellow-500" />
                <span className="w-2 h-2 rounded-full bg-green-500" />
              </div>
              <img
                src={showcaseScreens[activeShowcaseIdx].img}
                alt={showcaseScreens[activeShowcaseIdx].title}
                className="w-full h-72 object-cover rounded-xl border border-slate-800"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 9. USER ROLES ACCORDION - DO NOT CHANGE SECTION NAME/FLOW */}
      <section id="roles" className="py-20 bg-slate-50 border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-6 md:px-8 space-y-12">
          <div className="max-w-xl text-left space-y-2">
            <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest block">Authorization System</span>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Seeded Security Personas</h2>
            <p className="text-slate-500 text-xs leading-relaxed font-semibold">Select a user profile to review access scopes and dashboard privileges.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start max-w-5xl mx-auto">
            {/* Roles list (col 5) */}
            <div className="lg:col-span-5 space-y-2.5">
              {userRolesData.map((role, idx) => {
                const Icon = role.icon;
                return (
                  <button
                    key={idx}
                    onClick={() => setExpandedRole(idx)}
                    className={`w-full p-3.5 rounded-xl border transition-all text-left flex items-center gap-3.5 cursor-pointer ${
                      expandedRole === idx
                        ? 'bg-blue-600 border-blue-600 text-white shadow-md'
                        : 'bg-white border-slate-200 text-slate-655 hover:bg-slate-50'
                    }`}
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    <span className="text-xs font-bold">{role.role}</span>
                  </button>
                );
              })}
            </div>

            {/* Display details of active role (col 7) */}
            <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs h-48 flex flex-col justify-center">
              <h3 className="text-sm font-bold text-slate-800 mb-1">Scope of: {userRolesData[expandedRole].role}</h3>
              <p className="text-slate-550 text-xs leading-relaxed font-semibold">{userRolesData[expandedRole].desc}</p>
              
              <Link
                to="/login"
                className="mt-4 inline-flex items-center gap-1 text-[10px] text-blue-600 font-extrabold hover:underline"
              >
                Log In as {userRolesData[expandedRole].role} <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 10. TESTIMONIALS SLIDER - Compact Section */}
      <section className="py-20 bg-white border-b border-slate-100 font-medium">
        <div className="max-w-6xl mx-auto px-6 md:px-8 space-y-12">
          <div className="max-w-xl text-left space-y-2 mx-auto text-center">
            <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest block">Client Feedback</span>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Trusted by Corporate Managers</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {[
              { quote: 'AssetFlow streamlined our annual hardware inventory audit cycle from 3 weeks to just 2 days. The QR code passport scanner changed everything.', author: 'Dave Miller', title: 'VP of Operations, NetSecure', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=80' },
              { quote: 'We resolved duplicate booking overlaps of executive Teslas and project rooms instantly. The overlap conflict validator is flawless.', author: 'Sarah Jenkins', title: 'Admin Director, CoreFinance', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=80' },
              { quote: 'The linear depreciation curve reporting saves our finance team hours when calculating physical capital valuations every quarter.', author: 'Markus Vance', title: 'CFO, BuildCorp Ltd', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=80' }
            ].map((t, idx) => (
              <div key={idx} className="bg-slate-50/50 p-5 rounded-2xl border border-slate-200 flex flex-col justify-between h-56 shadow-xs">
                <p className="text-slate-550 text-xs italic font-semibold leading-relaxed">"{t.quote}"</p>
                <div className="flex items-center gap-2.5 pt-3.5 border-t border-slate-150/50 mt-4">
                  <img src={t.avatar} alt="" className="w-8 h-8 rounded-full object-cover border" />
                  <div className="min-w-0">
                    <p className="text-[10px] font-bold text-slate-800">{t.author}</p>
                    <p className="text-[9px] text-slate-450 font-bold">{t.title}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 12. FINAL CTA - Floating Grid Card with Spotlight Glow */}
      <section className="py-24 bg-white relative overflow-hidden flex justify-center">
        <div className="max-w-5xl w-full mx-6 md:mx-8 bg-white border border-slate-200 rounded-3xl p-10 md:p-16 relative overflow-hidden shadow-xl shadow-slate-100/50 bg-[radial-gradient(#f1f5f9_1.5px,transparent_1.5px)] [background-size:24px_24px]">
          {/* Radial glow background lights */}
          <div className="absolute -top-24 -left-24 w-80 h-80 rounded-full bg-blue-150/40 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -right-24 w-80 h-80 rounded-full bg-purple-150/40 blur-3xl pointer-events-none" />
          
          <div className="max-w-2xl mx-auto text-center space-y-6 relative z-10">
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-full text-xs font-bold">
              <Zap className="w-3.5 h-3.5 text-blue-500 animate-pulse" /> AssetFlow Enterprise
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900 leading-tight">
              Ready to Modernize Your <br />
              Organization's Asset Management?
            </h2>
            <p className="text-slate-500 text-sm md:text-base max-w-md mx-auto leading-relaxed font-semibold">
              Deploy role-based dashboards, enforce calendar reservation validations, and orchestrate maintenance Kanban boards from a secure ERP portal.
            </p>
            <div className="flex flex-wrap justify-center gap-3.5 pt-2">
              <button
                onClick={() => navigate('/login')}
                className="px-6 py-3.5 bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-sm rounded-xl shadow-sm transition-all cursor-pointer"
              >
                Sign In to Portal
              </button>
              <button
                onClick={() => toast.success('Demo request registered.')}
                className="px-6 py-3.5 border border-slate-200 hover:bg-slate-50 text-slate-700 font-extrabold text-sm rounded-xl transition-all cursor-pointer"
              >
                Explore Modules
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 13. FOOTER - Premium Signature Watermark Layout with Updates Signup */}
      <motion.footer
        initial={{ y: 60, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="bg-slate-950 border-t border-slate-900 text-xs pt-16 pb-8 font-medium text-slate-300 relative overflow-hidden"
      >
        <div className="max-w-7xl mx-auto px-6 md:px-8 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-12 border-b border-slate-900 pb-12 mb-12 relative z-10">
          
          {/* Logo & Operational Status */}
          <div className="space-y-4 col-span-1 md:col-span-3 lg:col-span-2">
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-lg">A</span>
              <span className="font-extrabold text-xl tracking-tight text-white">AssetFlow</span>
            </div>
            <p className="text-[12px] leading-relaxed text-slate-400 font-semibold max-w-sm">
              Enterprise-grade resource ledger ERP platform protecting physical and hardware organizational assets.
            </p>
            {/* Status indicator */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-green-500/10 border border-green-500/30 text-green-400 rounded-full font-black text-[10px]">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-green-500"></span>
              </span>
              <span>All Systems Operational</span>
            </div>
          </div>

          {/* Links Column 1: Scope */}
          <div className="space-y-4">
            <h4 className="font-black text-white uppercase text-xs tracking-wider">Product Scope</h4>
            <ul className="space-y-2.5 font-bold text-slate-400 text-sm">
              <li><a href="#hardening" className="hover:text-white transition-colors">Key Fixes</a></li>
              <li><a href="#modules" className="hover:text-white transition-colors">Core Modules</a></li>
              <li><a href="#showcase" className="hover:text-white transition-colors">Interface Showcase</a></li>
            </ul>
          </div>

          {/* Links Column 2: Trust */}
          <div className="space-y-4">
            <h4 className="font-black text-white uppercase text-xs tracking-wider">Security & Trust</h4>
            <ul className="space-y-2.5 font-bold text-slate-400 text-sm">
              <li><a href="#roles" className="hover:text-white transition-colors">Access Scopes</a></li>
              <li><a href="#" className="hover:text-white transition-colors">GDPR Readiness</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Contact Support</a></li>
            </ul>
          </div>

          {/* Col 5: Subscription Form */}
          <div className="space-y-4">
            <h4 className="font-black text-white uppercase text-xs tracking-wider">Get System Updates</h4>
            <p className="text-[12px] leading-relaxed text-slate-400 font-semibold">Subscribe to receive system release notes and deployment updates.</p>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                toast.success('Successfully subscribed to system updates.');
                e.target.reset();
              }}
              className="flex items-center gap-1.5"
            >
              <input
                type="email"
                required
                placeholder="Work email"
                className="w-full px-3 py-2 border border-slate-800 rounded-lg text-xs font-bold focus:outline-none focus:border-blue-500 text-white bg-slate-900"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-black text-xs cursor-pointer shrink-0 transition-colors"
              >
                Join
              </button>
            </form>
          </div>

        </div>

        {/* React Dynamic CSS Keyframes Style for Moving Shine particles inside letters */}
        <style dangerouslySetInnerHTML={{__html: `
          @keyframes textShine {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
          .watermark-shine {
            background: linear-gradient(
              to right,
              #1e293b 0%,
              #3b82f6 25%,
              #60a5fa 50%,
              #3b82f6 75%,
              #1e293b 100%
            );
            background-size: 200% auto;
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            animation: textShine 4s linear infinite;
            display: inline-block;
            width: 100%;
          }
        `}} />

        {/* Footer Brand Signature (Gigantic watermark typography with shine particle movement) */}
        <div className="max-w-7xl mx-auto px-6 md:px-8 relative z-0 select-none pointer-events-none mb-4 text-center">
          <p className="text-[5.5rem] sm:text-[7.5rem] md:text-[9.5rem] lg:text-[11.5rem] font-black uppercase tracking-tighter leading-none watermark-shine">
            ASSETFLOW
          </p>
        </div>

        {/* Footer bottom section */}
        <div className="max-w-7xl mx-auto px-6 md:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 relative z-10 border-t border-slate-900 pt-6">
          <p className="font-bold text-slate-500 text-[11px]">© 2026 AssetFlow Corp. All rights reserved.</p>
          <div className="flex gap-4 text-slate-400">
            <a href="#" className="hover:text-white" aria-label="GitHub">
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" /><path d="M9 18c-4.51 2-5-2-7-2" /></svg>
            </a>
            <a href="#" className="hover:text-white" aria-label="LinkedIn">
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" /><rect width="4" height="12" x="2" y="9" /><circle cx="4" cy="4" r="2" /></svg>
            </a>
          </div>
        </div>
      </motion.footer>
    </div>
  );
};
export default LandingPage;
