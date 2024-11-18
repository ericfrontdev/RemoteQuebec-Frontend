import React from 'react';
import { X, Calendar, MapPin, Building2, BriefcaseIcon, Pencil } from 'lucide-react';
import { Job } from '../types';

interface JobModalProps {
  job: Job;
  onClose: () => void;
  onEdit: (job: Job) => void;
  onApply: (job: Job) => void;
}

export function JobModal({ job, onClose, onEdit, onApply }: JobModalProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">{job.title}</h2>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onEdit(job)}
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
              aria-label="Modifier l'offre"
            >
              <Pencil size={18} />
            </button>
            <button
              onClick={onClose}
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
              aria-label="Fermer"
            >
              <X size={18} />
            </button>
          </div>
        </div>
        
        <div className="p-6">
          <div className="flex items-start gap-6 mb-6">
            <img
              src={job.companyLogo}
              alt={`${job.company} logo`}
              className="w-20 h-20 rounded-lg object-cover"
            />
            <div>
              <div className="flex items-center gap-4 text-gray-600 mb-2">
                <div className="flex items-center gap-1">
                  <Building2 size={16} />
                  <span>{job.company}</span>
                </div>
                <div className="flex items-center gap-1">
                  <MapPin size={16} />
                  <span>{job.location}</span>
                </div>
              </div>
              <div className="flex items-center gap-4 text-gray-600">
                <div className="flex items-center gap-1">
                  <BriefcaseIcon size={16} />
                  <span>{job.type}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar size={16} />
                  <span>{new Date(job.postedAt).toLocaleDateString('fr-FR')}</span>
                </div>
              </div>
              <div className="mt-2">
                <span className="text-xl font-semibold text-gray-900">{job.salary}</span>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Description du poste</h3>
              <p className="text-gray-600 whitespace-pre-line">{job.description}</p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Prérequis</h3>
              <ul className="list-disc list-inside space-y-2 text-gray-600">
                {job.requirements.map((requirement, index) => (
                  <li key={index}>{requirement}</li>
                ))}
              </ul>
            </div>

            <div className="pt-6 border-t border-gray-200">
              <button
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                onClick={() => onApply(job)}
              >
                Postuler à cette offre
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}