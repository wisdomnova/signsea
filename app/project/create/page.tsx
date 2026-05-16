'use client'

import { Suspense } from 'react'
import CreateProjectContent from './create-project-content'

export default function CreateProjectPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-2 border-gray-200 border-t-black rounded-full animate-spin" />
          <p className="text-gray-400 font-medium">Loading...</p>
        </div>
      </div>
    }>
      <CreateProjectContent />
    </Suspense>
  )
}
