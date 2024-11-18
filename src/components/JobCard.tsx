import { Calendar, MapPin, Building2, BriefcaseIcon } from 'lucide-react'
import { Job } from '../types'

interface JobCardProps {
  job: Job
  onClick: (job: Job) => void
}

export function JobCard({ job, onClick }: JobCardProps) {
  return (
    <div
      className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer"
      onClick={() => onClick(job)}
    >
      <div className="flex items-start gap-4">
        <img
          src={job.companyLogo}
          alt={`${job.company} logo`}
          className="w-16 h-16 rounded-lg object-cover"
        />
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">{job.title}</h2>
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium
              ${
                job.level === 'Junior'
                  ? 'bg-green-100 text-green-800'
                  : job.level === 'Mid-Level'
                  ? 'bg-blue-100 text-blue-800'
                  : 'bg-purple-100 text-purple-800'
              }`}
            >
              {job.level}
            </span>
          </div>

          <div className="mt-2 flex flex-wrap gap-4 text-gray-600">
            <div className="flex items-center gap-1">
              <Building2 size={16} />
              <span>{job.company}</span>
            </div>
            <div className="flex items-center gap-1">
              <MapPin size={16} />
              <span>{job.location}</span>
            </div>
            <div className="flex items-center gap-1">
              <BriefcaseIcon size={16} />
              <span>{job.type}</span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar size={16} />
              <span>{new Date(job.postedAt).toLocaleDateString('fr-FR')}</span>
            </div>
          </div>

          <div className="mt-4">
            <span className="text-lg font-semibold text-gray-900">
              {job.salary}
            </span>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {job.requirements.slice(0, 3).map((req, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
              >
                {req}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
