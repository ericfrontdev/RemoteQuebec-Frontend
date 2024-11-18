import React from 'react'
import { Search } from 'lucide-react'
import { JobFilter } from '../types'

interface JobFiltersProps {
  filters: JobFilter
  setFilters: React.Dispatch<React.SetStateAction<JobFilter>>
}

export function JobFilters({ filters, setFilters }: JobFiltersProps) {
  const jobTypes = ['Full-time', 'Part-time', 'Contract']
  const experienceLevels = ['Junior', 'Mid-Level', 'Senior']

  const handleTypeChange = (type: string) => {
    setFilters((prev) => ({
      ...prev,
      type: prev.type.includes(type)
        ? prev.type.filter((t) => t !== type)
        : [...prev.type, type],
    }))
  }

  const handleLevelChange = (level: string) => {
    setFilters((prev) => ({
      ...prev,
      level: prev.level.includes(level)
        ? prev.level.filter((l) => l !== level)
        : [...prev.level, level],
    }))
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="relative mb-6">
        <Search
          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
          size={20}
        />
        <input
          type="text"
          placeholder="Rechercher un poste, une entreprise..."
          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          value={filters.search}
          onChange={(e) =>
            setFilters((prev) => ({ ...prev, search: e.target.value }))
          }
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="font-semibold mb-3 text-gray-700">Type de contrat</h3>
          <div className="space-y-2">
            {jobTypes.map((type) => (
              <label
                key={type}
                className="flex items-center space-x-2"
              >
                <input
                  type="checkbox"
                  checked={filters.type.includes(type)}
                  onChange={() => handleTypeChange(type)}
                  className="rounded text-blue-600 focus:ring-blue-500"
                />
                <span className="text-gray-600">{type}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <h3 className="font-semibold mb-3 text-gray-700">
            Niveau d'expérience
          </h3>
          <div className="space-y-2">
            {experienceLevels.map((level) => (
              <label
                key={level}
                className="flex items-center space-x-2"
              >
                <input
                  type="checkbox"
                  checked={filters.level.includes(level)}
                  onChange={() => handleLevelChange(level)}
                  className="rounded text-blue-600 focus:ring-blue-500"
                />
                <span className="text-gray-600">{level}</span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
