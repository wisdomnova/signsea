'use client'

import { Shell } from '@/components/dashboard-shell'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  IconCalendar, 
  IconClock, 
  IconCircleCheck, 
  IconArrowRight, 
  IconChevronLeft,
  IconChevronRight,
  IconShieldCheck,
  IconPlus,
  IconFilter,
  IconBriefcase,
  IconBolt,
  IconAlertCircle
} from '@tabler/icons-react'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { apiClient } from '@/lib/api-client'

export default function PlannerPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [filterType, setFilterType] = useState('ALL')
  const [milestones, setMilestones] = useState<any[]>([])

  useEffect(() => {
    loadProjectsAndMilestones()
  }, [])

  async function loadProjectsAndMilestones() {
    try {
      const response: any = await apiClient.listProjects()
      const projects = Array.isArray(response) ? response : response?.data || []
      const allMilestones: any[] = []

      // Add project start and end dates as events
      projects.forEach((project: any) => {
        if (project.start_date) {
          allMilestones.push({
            id: `project-start-${project.id}`,
            type: 'DELIVERY',
            date: new Date(project.start_date),
            title: `${project.name} - Start`,
            description: `Project starts`,
            icon: 'briefcase',
            projectId: project.id
          })
        }

        if (project.end_date) {
          allMilestones.push({
            id: `project-end-${project.id}`,
            type: 'PAYMENT',
            date: new Date(project.end_date),
            title: `${project.name} - Due`,
            description: `Project deadline`,
            icon: 'clock',
            projectId: project.id
          })
        }
      })

      // Fetch milestones for each project
      for (const project of projects) {
        try {
          const projectMilestones = await apiClient.getMilestones(project.id)
          projectMilestones.forEach((milestone: any) => {
            if (milestone.date) {
              allMilestones.push({
                id: milestone.id,
                type: milestone.type || 'DELIVERY',
                date: new Date(milestone.date),
                title: milestone.name,
                description: milestone.description,
                icon: 'check',
                projectId: project.id
              })
            }
          })
        } catch (err) {
          // Silently skip if milestones fail for this project
        }
      }

      setMilestones(allMilestones)
    } catch (err) {
      console.error('Error loading projects:', err)
    } finally {
      setLoading(false)
    }
  }

  const monthStart = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1)
  const monthEnd = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0)
  const days = Array.from({ length: monthEnd.getDate() }, (_, i) => new Date(currentMonth.getFullYear(), currentMonth.getMonth(), i + 1))

  const nextMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))
  const prevMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))

  const isSameDay = (d1: Date, d2: Date) => d1.toDateString() === d2.toDateString()
  
  const filteredMilestones = milestones.filter(m => filterType === 'ALL' || m.type === filterType)
  const selectedDateMilestones = filteredMilestones.filter(m => isSameDay(m.date, selectedDate))

  return (
    <Shell title="Planner">
      <AnimatePresence mode="wait">
        {loading ? (
          <motion.div 
            key="skeleton" 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            className="grid lg:grid-cols-12 gap-10 animate-pulse"
          >
             <div className="lg:col-span-8 h-[500px] bg-gray-50 rounded-3xl" />
             <div className="lg:col-span-4 h-[500px] bg-gray-50 rounded-3xl" />
          </motion.div>
        ) : (
          <motion.div 
            key="content"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-10 pb-12"
          >
            {/* Header / Actions */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 sm:gap-6">
              <div className="space-y-1">
                <h2 className="text-[22px] sm:text-[28px] font-bold tracking-tight text-black">Your Schedule.</h2>
                <p className="text-[12px] sm:text-[14px] text-gray-500 font-medium">Manage your industrial deadlines and payouts.</p>
              </div>
              <div className="flex gap-2 sm:gap-3 flex-shrink-0">
                <div className="relative">
                  <select 
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                    className="appearance-none flex items-center gap-2 px-4 sm:px-6 h-10 sm:h-11 bg-white border border-gray-100 rounded-full text-[12px] sm:text-[13px] font-medium text-black hover:border-gray-200 transition-all cursor-pointer outline-none pr-9 sm:pr-10"
                  >
                    <option value="ALL">All Types</option>
                    <option value="DELIVERY">Deliveries</option>
                    <option value="PAYMENT">Payments</option>
                    <option value="SECURITY">Security</option>
                  </select>
                  <div className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                    <IconFilter size={14} />
                  </div>
                </div>
              </div>
            </div>

            <div className="grid lg:grid-cols-12 gap-6 sm:gap-10">
              {/* Intelligent Calendar */}
              <div className="lg:col-span-8 space-y-6 sm:space-y-8">
                <div className="p-5 sm:p-8 bg-white rounded-2xl sm:rounded-3xl border border-gray-100 relative group overflow-hidden">
                  <div className="flex items-center justify-between mb-6 sm:mb-10">
                    <h3 className="text-[16px] sm:text-[18px] font-bold text-black tracking-tight">
                      {currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}
                    </h3>
                    <div className="flex items-center gap-1 p-1 bg-gray-50 rounded-lg sm:rounded-xl border border-gray-100">
                      <button onClick={prevMonth} className="p-1.5 sm:p-2 hover:bg-white rounded-lg text-black transition-all hover:shadow-sm">
                        <IconChevronLeft size={14} />
                      </button>
                      <button onClick={nextMonth} className="p-1.5 sm:p-2 hover:bg-white rounded-lg text-black transition-all hover:shadow-sm">
                        <IconChevronRight size={14} />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-7 mb-6 sm:mb-8 px-1 sm:px-2">
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, i) => (
                      <div key={i} className="text-[9px] sm:text-[11px] font-bold text-gray-400 uppercase tracking-widest text-center">
                        {day}
                      </div>
                    ))}
                  </div>

                  <div className="grid grid-cols-7 gap-1 sm:gap-2">
                    {days.map((day, idx) => {
                      const dayMilestones = filteredMilestones.filter(m => isSameDay(m.date, day))
                      const isSelected = isSameDay(day, selectedDate)
                      const isToday = isSameDay(day, new Date())
                      
                      return (
                        <button
                          key={idx}
                          onClick={() => setSelectedDate(day)}
                          className={`aspect-square rounded-lg sm:rounded-2xl flex flex-col items-center justify-center relative transition-all border text-[11px] sm:text-[14px] font-bold ${
                            isSelected 
                              ? 'bg-black border-black text-white shadow-xl shadow-black/5' 
                              : isToday
                                ? 'bg-gray-50 border-gray-200 text-black'
                                : 'bg-white border-gray-50 text-black hover:border-gray-200 hover:bg-gray-50/50'
                          }`}
                        >
                          <span>
                            {day.getDate()}
                          </span>
                          {dayMilestones.length > 0 && (
                            <div className="flex gap-0.5 mt-1">
                              {dayMilestones.map((m, i) => (
                                <div 
                                  key={i} 
                                  className={`w-1 sm:w-1.5 h-1 sm:h-1.5 rounded-full ${
                                    m.type === 'PAYMENT' ? 'bg-black' : 
                                    m.type === 'SECURITY' ? 'bg-gray-400' : 'bg-gray-200'
                                  }`} 
                                />
                              ))}
                            </div>
                          )}
                        </button>
                      )
                    })}
                  </div>
                </div>

                {/* Legend / Status */}
                <div className="flex flex-wrap items-center gap-4 sm:gap-8 px-5 sm:px-8 py-4 sm:py-6 bg-gray-50 rounded-lg sm:rounded-2xl border border-gray-100">
                   <div className="flex items-center gap-2">
                      <div className="w-1.5 sm:w-2 h-1.5 sm:h-2 rounded-full bg-gray-200" />
                      <span className="text-[10px] sm:text-[11px] font-bold text-gray-500 uppercase tracking-widest">Delivery</span>
                   </div>
                   <div className="flex items-center gap-2">
                      <div className="w-1.5 sm:w-2 h-1.5 sm:h-2 rounded-full bg-black" />
                      <span className="text-[10px] sm:text-[11px] font-bold text-gray-500 uppercase tracking-widest">Payment</span>
                   </div>
                   <div className="flex items-center gap-2 ml-auto">
                      <IconShieldCheck size={14} className="text-black flex-shrink-0" />
                      <span className="text-[10px] sm:text-[11px] font-bold text-black uppercase tracking-widest">Auto-Synced</span>
                   </div>
                </div>
              </div>

              {/* Agenda Sidebar */}
              <div className="lg:col-span-4 space-y-6 sm:space-y-8">
                <div className="flex items-center justify-between px-2">
                  <h3 className="text-[14px] sm:text-[18px] font-bold text-black tracking-tight">Today's Tasks</h3>
                  <span className="text-[11px] sm:text-[12px] font-bold text-gray-400 uppercase tracking-widest">
                    {selectedDate.toLocaleDateString(undefined, { day: 'numeric', month: 'short' })}
                  </span>
                </div>

                <div className="space-y-3 sm:space-y-4">
                  <AnimatePresence mode="popLayout">
                    {selectedDateMilestones.length > 0 ? (
                      selectedDateMilestones.map(m => (
                        <motion.div
                          key={m.id}
                          initial={{ opacity: 0, x: 10 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, scale: 0.9 }}
                          className="p-4 sm:p-6 bg-white rounded-2xl sm:rounded-3xl border border-gray-100 space-y-3 sm:space-y-4 group transition-all"
                        >
                          <div className="flex items-center justify-between">
                            <div className="px-2 sm:px-2.5 py-1 rounded-md bg-gray-50 text-[9px] sm:text-[10px] font-bold uppercase tracking-widest flex items-center gap-1.5 text-black">
                              {m.type === 'PAYMENT' ? <IconBolt size={11} /> : 
                               m.type === 'SECURITY' ? <IconShieldCheck size={11} /> : <IconBriefcase size={11} />}
                              {m.type}
                            </div>
                          </div>
                          <div>
                            <h4 className="font-bold text-black text-[13px] sm:text-[16px] mb-1">{m.title}</h4>
                            {m.description && (
                              <p className="text-[10px] sm:text-[11px] text-gray-500 font-medium leading-relaxed">
                                {m.description}
                              </p>
                            )}
                            <div className="flex items-center gap-2 text-[10px] sm:text-[11px] font-medium text-gray-400 uppercase tracking-widest mt-2">
                               <span>{m.title}</span>
                               <span className="w-1 h-1 rounded-full bg-gray-200"></span>
                               <span className="text-black">On Schedule</span>
                            </div>
                          </div>
                          <div className="pt-3 sm:pt-4 border-t border-gray-50 flex items-center justify-between">
                             <div className="flex items-center gap-1 text-[10px] sm:text-[11px] text-gray-400 font-bold uppercase tracking-widest">
                               <IconCalendar size={12} />
                               {m.date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                             </div>
                             <button className="w-9 sm:w-10 h-9 sm:h-10 bg-black text-white rounded-full flex items-center justify-center hover:bg-gray-800 transition-all">
                                <IconArrowRight size={14} />
                             </button>
                          </div>
                        </motion.div>
                      ))
                    ) : (
                      <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="py-10 sm:py-16 text-center bg-gray-50 border border-gray-100 rounded-2xl sm:rounded-3xl px-4 sm:px-8"
                      >
                        <IconCalendar size={40} className="mx-auto text-gray-200 mb-4 sm:mb-6" />
                        <h4 className="text-[13px] sm:text-[16px] font-bold text-black mb-2">Nothing Scheduled</h4>
                        <p className="text-[12px] sm:text-[13px] text-gray-400 font-medium leading-relaxed">
                          No milestones scheduled for this date.
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Shell>
  )
}
