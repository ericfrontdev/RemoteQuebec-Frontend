import React, { useState, useRef, DragEvent } from 'react';
import { X, Upload, FileText } from 'lucide-react';
import { Job, JobApplication } from '../types';
import { sendApplicationEmail } from '../services/emailService';

interface ApplicationModalProps {
  job: Job;
  onClose: () => void;
  onSubmit: (application: JobApplication) => void;
}

export function ApplicationModal({ job, onClose, onSubmit }: ApplicationModalProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState<Omit<JobApplication, 'resume'>>({
    fullName: '',
    email: '',
    phone: '',
    coverLetter: '',
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isDragging, setIsDragging] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.fullName.trim()) newErrors.fullName = 'Le nom est requis';
    if (!formData.email.trim()) newErrors.email = 'L\'email est requis';
    if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      newErrors.email = 'Email invalide';
    }
    if (!formData.phone.trim()) newErrors.phone = 'Le téléphone est requis';
    if (!formData.coverLetter.trim()) newErrors.coverLetter = 'La lettre de motivation est requise';
    if (!selectedFile) newErrors.resume = 'Le CV est requis';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validate() && selectedFile && !isSubmitting) {
      setIsSubmitting(true);
      
      try {
        const application: JobApplication = {
          ...formData,
          resume: selectedFile
        };

        // Envoyer l'email à l'employeur
        await sendApplicationEmail(job, application);
        
        // Appeler onSubmit pour mettre à jour l'UI
        onSubmit(application);
        
        // Fermer le modal
        onClose();
        
        // Afficher un message de succès
        alert('Votre candidature a été envoyée avec succès !');
      } catch (error) {
        alert('Une erreur est survenue lors de l\'envoi de votre candidature. Veuillez réessayer.');
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const validateFile = (file: File): string | null => {
    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!allowedTypes.includes(file.type)) {
      return 'Format de fichier non supporté. Utilisez PDF ou DOC/DOCX.';
    }
    if (file.size > 5 * 1024 * 1024) {
      return 'Le fichier est trop volumineux. Taille maximum : 5MB';
    }
    return null;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const error = validateFile(file);
      if (error) {
        setErrors(prev => ({ ...prev, resume: error }));
        return;
      }
      setSelectedFile(file);
      setErrors(prev => ({ ...prev, resume: '' }));
    }
  };

  const handleDragEnter = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file) {
      const error = validateFile(file);
      if (error) {
        setErrors(prev => ({ ...prev, resume: error }));
        return;
      }
      setSelectedFile(file);
      setErrors(prev => ({ ...prev, resume: '' }));
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">
            Postuler - {job.title}
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
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nom complet
              </label>
              <input
                type="text"
                value={formData.fullName}
                onChange={e => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
                className={`w-full p-2 border rounded-lg ${
                  errors.fullName ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.fullName && <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={e => setFormData(prev => ({ ...prev, email: e.target.value }))}
                className={`w-full p-2 border rounded-lg ${
                  errors.email ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Téléphone
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={e => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                className={`w-full p-2 border rounded-lg ${
                  errors.phone ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                CV (PDF, DOC, DOCX - Max 5MB)
              </label>
              <div
                className={`mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-lg transition-colors ${
                  isDragging ? 'border-blue-500 bg-blue-50' : errors.resume ? 'border-red-500' : 'border-gray-300'
                }`}
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
              >
                <div className="space-y-2 text-center">
                  <div className="flex text-sm text-gray-600">
                    <label
                      htmlFor="resume"
                      className="relative cursor-pointer rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
                    >
                      <div className="flex flex-col items-center">
                        <FileText className={`mx-auto h-12 w-12 ${isDragging ? 'text-blue-500' : 'text-gray-400'}`} />
                        {selectedFile ? (
                          <span className="text-gray-600">{selectedFile.name}</span>
                        ) : (
                          <>
                            <span>Téléverser un fichier</span>
                            <p className="text-xs text-gray-500">
                              ou glisser-déposer
                            </p>
                          </>
                        )}
                      </div>
                      <input
                        id="resume"
                        ref={fileInputRef}
                        name="resume"
                        type="file"
                        className="sr-only"
                        accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                        onChange={handleFileChange}
                      />
                    </label>
                  </div>
                </div>
              </div>
              {errors.resume && <p className="text-red-500 text-sm mt-1">{errors.resume}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Lettre de motivation
              </label>
              <textarea
                value={formData.coverLetter}
                onChange={e => setFormData(prev => ({ ...prev, coverLetter: e.target.value }))}
                className={`w-full p-2 border rounded-lg h-32 ${
                  errors.coverLetter ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Présentez-vous et expliquez pourquoi vous êtes intéressé par ce poste..."
              />
              {errors.coverLetter && <p className="text-red-500 text-sm mt-1">{errors.coverLetter}</p>}
            </div>
          </div>

          <div className="flex justify-end gap-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              disabled={isSubmitting}
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isSubmitting}
            >
              <Upload size={20} />
              {isSubmitting ? 'Envoi en cours...' : 'Envoyer ma candidature'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}