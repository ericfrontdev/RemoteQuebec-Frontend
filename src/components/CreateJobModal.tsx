import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Job } from '../types';

interface CreateJobModalProps {
  job?: Job | null;
  onClose: () => void;
  onSubmit: (job: Job | Omit<Job, 'id'>) => void;
}

export function CreateJobModal({ job, onClose, onSubmit }: CreateJobModalProps) {
  const [formData, setFormData] = useState({
    id: job?.id || '',
    title: job?.title || '',
    company: job?.company || '',
    location: job?.location || '',
    salary: job?.salary || '',
    type: job?.type || 'Full-time' as const,
    level: job?.level || 'Mid-Level' as const,
    description: job?.description || '',
    requirements: job?.requirements || [''],
    companyLogo: job?.companyLogo || '',
    contactEmail: job?.contactEmail || '',
    postedAt: job?.postedAt || new Date().toISOString().split('T')[0],
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.title.trim()) newErrors.title = 'Le titre est requis';
    if (!formData.company.trim()) newErrors.company = 'Le nom de l\'entreprise est requis';
    if (!formData.location.trim()) newErrors.location = 'La localisation est requise';
    if (!formData.salary.trim()) newErrors.salary = 'Le salaire est requis';
    if (!formData.description.trim()) newErrors.description = 'La description est requise';
    if (!formData.companyLogo.trim()) newErrors.companyLogo = 'Le logo est requis';
    if (!formData.contactEmail.trim()) newErrors.contactEmail = 'L\'email de contact est requis';
    if (!formData.contactEmail.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      newErrors.contactEmail = 'Email invalide';
    }
    if (formData.requirements.some(req => !req.trim())) {
      newErrors.requirements = 'Tous les prérequis doivent être remplis';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(formData);
    }
  };

  const addRequirement = () => {
    setFormData(prev => ({
      ...prev,
      requirements: [...prev.requirements, ''],
    }));
  };

  const updateRequirement = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      requirements: prev.requirements.map((req, i) => (i === index ? value : req)),
    }));
  };

  const removeRequirement = (index: number) => {
    setFormData(prev => ({
      ...prev,
      requirements: prev.requirements.filter((_, i) => i !== index),
    }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">
            {job ? 'Modifier l\'offre d\'emploi' : 'Créer une offre d\'emploi'}
          </h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Fermer"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Titre du poste
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={e => setFormData(prev => ({ ...prev, title: e.target.value }))}
                className={`w-full p-2 border rounded-lg ${
                  errors.title ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Entreprise
              </label>
              <input
                type="text"
                value={formData.company}
                onChange={e => setFormData(prev => ({ ...prev, company: e.target.value }))}
                className={`w-full p-2 border rounded-lg ${
                  errors.company ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.company && <p className="text-red-500 text-sm mt-1">{errors.company}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Localisation
              </label>
              <input
                type="text"
                value={formData.location}
                onChange={e => setFormData(prev => ({ ...prev, location: e.target.value }))}
                className={`w-full p-2 border rounded-lg ${
                  errors.location ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.location && <p className="text-red-500 text-sm mt-1">{errors.location}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Salaire
              </label>
              <input
                type="text"
                value={formData.salary}
                onChange={e => setFormData(prev => ({ ...prev, salary: e.target.value }))}
                className={`w-full p-2 border rounded-lg ${
                  errors.salary ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="ex: 45-65k €"
              />
              {errors.salary && <p className="text-red-500 text-sm mt-1">{errors.salary}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Type de contrat
              </label>
              <select
                value={formData.type}
                onChange={e => setFormData(prev => ({ ...prev, type: e.target.value as any }))}
                className="w-full p-2 border border-gray-300 rounded-lg"
              >
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Contract">Contract</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Niveau d'expérience
              </label>
              <select
                value={formData.level}
                onChange={e => setFormData(prev => ({ ...prev, level: e.target.value as any }))}
                className="w-full p-2 border border-gray-300 rounded-lg"
              >
                <option value="Junior">Junior</option>
                <option value="Mid-Level">Mid-Level</option>
                <option value="Senior">Senior</option>
              </select>
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email de contact pour les candidatures
              </label>
              <input
                type="email"
                value={formData.contactEmail}
                onChange={e => setFormData(prev => ({ ...prev, contactEmail: e.target.value }))}
                className={`w-full p-2 border rounded-lg ${
                  errors.contactEmail ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="recrutement@entreprise.com"
              />
              {errors.contactEmail && <p className="text-red-500 text-sm mt-1">{errors.contactEmail}</p>}
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                URL du logo
              </label>
              <input
                type="url"
                value={formData.companyLogo}
                onChange={e => setFormData(prev => ({ ...prev, companyLogo: e.target.value }))}
                className={`w-full p-2 border rounded-lg ${
                  errors.companyLogo ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="https://example.com/logo.png"
              />
              {errors.companyLogo && <p className="text-red-500 text-sm mt-1">{errors.companyLogo}</p>}
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
                className={`w-full p-2 border rounded-lg h-32 ${
                  errors.description ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
            </div>

            <div className="col-span-2">
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  Prérequis
                </label>
                <button
                  type="button"
                  onClick={addRequirement}
                  className="text-sm text-blue-600 hover:text-blue-700"
                >
                  + Ajouter un prérequis
                </button>
              </div>
              {formData.requirements.map((req, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={req}
                    onChange={e => updateRequirement(index, e.target.value)}
                    className={`flex-1 p-2 border rounded-lg ${
                      errors.requirements ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {formData.requirements.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeRequirement(index)}
                      className="p-2 text-red-600 hover:text-red-700"
                    >
                      <X size={20} />
                    </button>
                  )}
                </div>
              ))}
              {errors.requirements && (
                <p className="text-red-500 text-sm mt-1">{errors.requirements}</p>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              {job ? 'Mettre à jour' : 'Créer l\'offre'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}