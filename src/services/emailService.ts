import { Job, JobApplication } from '../types';
import { api } from './api';

export async function sendApplicationEmail(job: Job, application: JobApplication) {
  try {
    const formData = new FormData();
    formData.append('resume', application.resume);
    formData.append('jobId', job.id);
    formData.append('fullName', application.fullName);
    formData.append('email', application.email);
    formData.append('phone', application.phone);
    formData.append('coverLetter', application.coverLetter);

    const response = await api.post('/applications', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    if (!response.data.success) {
      throw new Error(response.data.message || 'Échec de l\'envoi de la candidature');
    }

    return response.data;
  } catch (error) {
    console.error('Erreur lors de l\'envoi de la candidature:', error);
    throw new Error('Échec de l\'envoi de la candidature');
  }
}