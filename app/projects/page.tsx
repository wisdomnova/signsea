'use client'

import React, { useState, useEffect } from 'react'
import { IconPlus, IconSearch, IconFilter, IconBriefcaseOff, IconX, IconArrowRight, IconTrash } from '@tabler/icons-react'
import { Shell } from '@/components/dashboard-shell'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { apiClient } from '@/lib/api-client'
import { koboToNaira, formatCurrency } from '@/lib/currency-utils'
import { getDisplayStatus } from '@/lib/status-mapping'
import { useUI } from '@/components/ui/ui-provider'

interface Project {
  id: string
  title: string
  description: string
  type: string
  status: string
  total_amount: number
  currency: string
  created_at: string
  payment_received_at?: string
  freelancer_id?: string
  freelancer_name?: string
  client_name?: string
  client_email?: string
}

export default function ProjectsPage() {
  const { confirm, showToast } = useUI()
  const [loading, setLoading] = useState(true)
  const [projects, setProjects] = useState<Project[]>([])
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [showFilter, setShowFilter] = useState(false)
  const [statusFilter, setStatusFilter] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  useEffect(() => {
    fetchProjects()
  }, [statusFilter])

  const fetchProjects = async () => {
    try {
      setLoading(true)
      const query = statusFilter ? `?status=${statusFilter}` : ''
      const data: any = await apiClient.request(`/projects${query}`, 'GET')
      setProjects(data.projects || [])
    } catch (err) {
      console.error('Failed to fetch projects:', err)
      setProjects([])
    } finally {
      setLoading(false)
    }
  }

  const canDeleteProject = (project: Project): boolean => {
    // Can't delete if paid
    if (project.payment_received_at) return false
    // Can't delete if completed
    if (project.status === 'COMPLETED') return false
    return true
  }

  const handleDeleteProject = async (project: Project) => {
    if (!canDeleteProject(project)) {
      showToast?.('This project cannot be deleted', 'error')
      return
    }

    const confirmed = window.confirm(`Delete Project?\n\nAre you sure you want to delete "${project.title}"? This action cannot be undone.`)
    if (!confirmed) return

    try {
      setDeletingId(project.id)
      await apiClient.request(`/projects/${project.id}`, 'DELETE')
      showToast?.('Project deleted successfully', 'success')
      setProjects(projects.filter(p => p.id !== project.id))
    } catch (err) {
      console.error('Failed to delete project:', err)
      showToast?.('Failed to delete project', 'error')
    } finally {
      setDeletingId(null)
    }
  }

  useEffect(() => {
    let filtered = projects
    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      filtered = filtered.filter(p => 
        p.title.toLowerCase().includes(term) || 
        p.id.toLowerCase().includes(term)
      )
    }
    setFilteredProjects(filtered)
  }, [projects, searchTerm])

  const statuses = ['Active', 'Completed', 'On Hold', 'Cancelled']

  return (
    <Shell title="Projects">
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-1">
            <h2 className="text-[28px] font-bold tracking-tight text-black">Projects.</h2>
            <p className="text-[14px] text-gray-500 font-medium">Track your active and archived escrow milestones.</p>
          </div>
          <Link 
            href="/project/create" 
            className="px-5 h-10 bg-black text-white text-[13px] font-medium rounded-full flex items-center gap-2 hover:bg-[#333] transition-all"
          >
            <IconPlus size={14} />
            Start Project
          </Link>
        </div>

        <div className="flex items-center gap-4 relative">
          <div className="relative flex-1">
            <IconSearch className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input 
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search projects by name, ID or client..."
              className="w-full h-11 pl-11 pr-4 bg-gray-50 border border-gray-100 rounded-xl text-[13px] font-medium focus:outline-none focus:ring-1 focus:ring-black/5"
            />
          </div>
          <div className="relative">
            <button 
              onClick={() => setShowFilter(!showFilter)}
              className={`h-11 px-4 border rounded-xl flex items-center gap-2 text-[13px] font-bold transition-all ${
                showFilter ? 'bg-black text-white border-black' : 'border-gray-100 text-gray-400 hover:text-black hover:bg-gray-50'
              }`}
            >
              <IconFilter size={14} />
              Filter
            </button>
            
            <AnimatePresence>
              {showFilter && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute top-full right-0 mt-2 w-56 bg-white border border-gray-100 rounded-2xl shadow-lg z-10"
                >
                  <div className="p-4 space-y-4">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-[12px] font-bold text-black uppercase tracking-widest">Status</h3>
                      <button 
                        onClick={() => setShowFilter(false)}
                        className="text-gray-400 hover:text-black"
                      >
                        <IconX size={14} />
                      </button>
                    </div>
                    
                    <div className="space-y-2">
                      <button 
                        onClick={() => {
                          setStatusFilter(null)
                          setShowFilter(false)
                        }}
                        className={`w-full text-left px-3 py-2 rounded-lg text-[12px] font-medium transition-all ${
                          statusFilter === null ? 'bg-black text-white' : 'bg-gray-50 text-black hover:bg-gray-100'
                        }`}
                      >
                        All Projects
                      </button>
                      {statuses.map(status => (
                        <button 
                          key={status}
                          onClick={() => {
                            setStatusFilter(status)
                            setShowFilter(false)
                          }}
                          className={`w-full text-left px-3 py-2 rounded-lg text-[12px] font-medium transition-all ${
                            statusFilter === status ? 'bg-black text-white' : 'bg-gray-50 text-black hover:bg-gray-100'
                          }`}
                        >
                          {status}
                        </button>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {loading ? (
            <div className="border border-gray-100 rounded-3xl overflow-hidden bg-white animate-pulse">
              <div className="h-12 bg-gray-50/50 border-b border-gray-50" />
              <div className="divide-y divide-gray-50">
                {[1, 2, 3, 4, 5].map(i => (
                  <div key={i} className="h-20 bg-white" />
                ))}
              </div>
            </div>
          ) : (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="border border-gray-100 rounded-3xl overflow-hidden bg-white"
            >
              <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left">
                <thead>
                  <tr className="border-b border-gray-50 bg-gray-50/50">
                    <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest whitespace-nowrap">Project Name</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest whitespace-nowrap">Client</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest whitespace-nowrap">Amount</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest whitespace-nowrap">Status</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest whitespace-nowrap">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProjects.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-24 text-center">
                        <div className="flex flex-col items-center max-w-[280px] mx-auto text-center">
                          <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-200 mb-6 border border-gray-100">
                              <IconBriefcaseOff size={32} />
                          </div>
                          <p className="text-[14px] font-bold text-black mb-1">No projects found</p>
                          <p className="text-[13px] text-gray-400 font-medium mb-8 leading-relaxed">
                              We couldn't find any projects matching your search or filters.
                          </p>
                          <Link 
                            href="/project/create" 
                            className="px-6 h-10 bg-black text-white text-[12px] font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-[#333] transition-all"
                          >
                            <IconPlus size={14} />
                            Create one now
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filteredProjects.map((project) => (
                      <tr key={project.id} className="border-t border-gray-50 hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 text-[13px] font-bold text-black">{project.title}</td>
                        <td className="px-6 py-4 text-[13px] font-medium text-gray-500">{project.client_name || '—'}</td>
                        <td className="px-6 py-4 text-[13px] font-bold text-black">
                          {formatCurrency(koboToNaira(project.total_amount), project.currency, {})}
                        </td>
                        <td className="px-6 py-4 text-[13px] font-bold">
                          <span className={`px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-widest whitespace-nowrap inline-block ${
                            project.status === 'DRAFT' ? 'bg-yellow-100 text-yellow-700' :
                            project.status === 'PENDING' ? 'bg-gray-100 text-gray-700' :
                            project.status === 'ACTIVE' ? 'bg-green-100 text-green-700' :
                            project.status === 'FUNDED' ? 'bg-blue-100 text-blue-700' :
                            project.status === 'COMPLETED' ? 'bg-green-100 text-green-700' :
                            'bg-gray-100 text-gray-700'
                          }`}>
                            {getDisplayStatus(project.status)}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            {project.status !== 'COMPLETED' && (
                              <Link
                                href={`/project/create?edit=${project.id}`}
                                className="inline-flex items-center gap-1 px-3 py-2 bg-gray-100 text-black text-[11px] font-bold rounded-lg hover:bg-gray-200 transition-all"
                              >
                                Edit
                              </Link>
                            )}
                            <Link
                              href={`/p/${project.id}`}
                              className="inline-flex items-center gap-1 px-3 py-2 bg-black text-white text-[11px] font-bold rounded-lg hover:bg-[#333] transition-all"
                            >
                              View
                              <IconArrowRight size={12} />
                            </Link>
                            {canDeleteProject(project) && (
                              <button
                                onClick={() => handleDeleteProject(project)}
                                disabled={deletingId === project.id}
                                className="inline-flex items-center gap-1 px-3 py-2 bg-red-50 text-red-600 text-[11px] font-bold rounded-lg hover:bg-red-100 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                <IconTrash size={12} />
                                Delete
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Shell>
  )
}
