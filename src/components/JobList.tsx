// JobList.jsx
import { useEffect, useState } from 'react'
import { JobCard } from './JobCard'
import { Job } from '../types'

export function JobList() {
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string>('')

  useEffect(() => {
    // Replace '/api/jobs' with your actual API endpoint
    const jobAPI = 'http://localhost:4000'
    fetch(`${jobAPI}/api/jobs`)
      .then((response) => response.json())
      .then((data) => {
        setJobs(data)
        setLoading(false)
        console.log('GO')
      })
      .catch((error) => {
        console.error('Error fetching jobs:', error)
        setError('Failed to fetch jobs')
        setLoading(false)
      })
  }, [])

  if (loading) {
    return <div>Loading jobs...</div>
  }

  if (error) {
    return <div>{error}</div>
  }

  return (
    <div className="grid grid-cols-1 gap-6">
      {jobs.map((job) => (
        <JobCard
          key={job.id}
          job={job}
          onClick={(job) => console.log(job)}
        />
      ))}
    </div>
  )
}
