import { useState, useEffect } from 'react'
import { Briefcase, Plus } from 'lucide-react'
import { JobCard } from './components/JobCard'
import { JobFilters } from './components/JobFilters'
import { JobModal } from './components/JobModal'
import { CreateJobModal } from './components/CreateJobModal'
import { ApplicationModal } from './components/ApplicationModal'
//import { jobs as initialJobs } from './data/jobs'
import { jobsApi } from './services/api'
import { Job, JobFilter } from './types'

function App() {
  const [jobs, setJobs] = useState<Job[]>([])
  const [filters, setFilters] = useState<JobFilter>({
    type: [],
    level: [],
    search: '',
  })
  const [selectedJob, setSelectedJob] = useState<Job | null>(null)
  const [editingJob, setEditingJob] = useState<Job | null>(null)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showApplicationModal, setShowApplicationModal] = useState(false)
  const [jobToApply, setJobToApply] = useState<Job | null>(null)

  const filteredJobs = jobs.filter((job) => {
    const matchesType =
      filters.type.length === 0 || filters.type.includes(job.type)
    const matchesLevel =
      filters.level.length === 0 || filters.level.includes(job.level)
    const matchesSearch =
      job.title.toLowerCase().includes(filters.search.toLowerCase()) ||
      job.company.toLowerCase().includes(filters.search.toLowerCase()) ||
      job.description.toLowerCase().includes(filters.search.toLowerCase())

    return matchesType && matchesLevel && matchesSearch
  })

  const handleCreateJob = (newJob: Omit<Job, 'id'>) => {
    const jobWithId: Job = {
      ...newJob,
      id: (jobs.length + 1).toString(),
    }
    setJobs((prev) => [...prev, jobWithId])
    setShowCreateModal(false)
  }

  const handleUpdateJob = (updatedJob: Job) => {
    setJobs((prev) =>
      prev.map((job) => (job.id === updatedJob.id ? updatedJob : job))
    )
    setEditingJob(null)
    setSelectedJob(updatedJob)
  }

  const handleApplyToJob = (job: Job) => {
    setSelectedJob(null)
    setJobToApply(job)
    setShowApplicationModal(true)
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Briefcase className="h-8 w-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">
                Remote Québec
              </h1>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-500">
                {filteredJobs.length} offre{filteredJobs.length > 1 ? 's' : ''}{' '}
                disponible{filteredJobs.length > 1 ? 's' : ''}
              </span>
              <button
                onClick={() => setShowCreateModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus size={20} />
                Créer une offre d'emploi
              </button>
            </div>
          </div>
        </div>
      </header>

      <section className="relative bg-gradient-to-r from-blue-600 to-blue-800">
        <div className="absolute inset-0 bg-black/50">
          <img
            src="https://images.unsplash.com/photo-1593642532744-d377ab507dc8?auto=format&fit=crop&w=2000"
            alt="Person working remotely"
            className="w-full h-full object-cover mix-blend-overlay"
          />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center mb-10">
            <h2 className="text-4xl font-bold text-white mb-4">
              Trouvez votre prochain emploi en télétravail
            </h2>
            <p className="text-xl text-gray-200">
              Les meilleures opportunités de travail à distance au Québec
            </p>
          </div>
          <JobFilters
            filters={filters}
            setFilters={setFilters}
          />
        </div>
      </section>

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {filteredJobs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredJobs.map((job) => (
              <JobCard
                key={job.id}
                job={job}
                onClick={(job) => setSelectedJob(job)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              Aucune offre ne correspond à vos critères de recherche.
            </p>
          </div>
        )}
      </main>

      <footer className="bg-white border-t border-gray-200 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-gray-500">
            © 2024 Remote Québec. Tous droits réservés.
          </p>
        </div>
      </footer>

      {selectedJob && (
        <JobModal
          job={selectedJob}
          onClose={() => setSelectedJob(null)}
          onEdit={(job) => {
            setEditingJob(job)
            setSelectedJob(null)
          }}
          onApply={handleApplyToJob}
        />
      )}

      {(showCreateModal || editingJob) && (
        <CreateJobModal
          job={editingJob}
          onClose={() => {
            setShowCreateModal(false)
            setEditingJob(null)
          }}
          onSubmit={editingJob ? handleUpdateJob : handleCreateJob}
        />
      )}

      {showApplicationModal && jobToApply && (
        <ApplicationModal
          job={jobToApply}
          onClose={() => {
            setShowApplicationModal(false)
            setJobToApply(null)
          }}
          onSubmit={() => {
            setShowApplicationModal(false)
            setJobToApply(null)
          }}
        />
      )}
    </div>
  )
}

export default App
