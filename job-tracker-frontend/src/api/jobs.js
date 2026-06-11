import api from './axios';

const isMockUser = () => {
  const token = localStorage.getItem('accessToken');
  return token && token.includes('mocksignature');
};

const getLocalJobs = () => {
  const saved = localStorage.getItem('mock_jobs');
  if (saved) return JSON.parse(saved);
  
  // High-fidelity pre-populated default jobs for a rich initial presentation
  const defaultJobs = [
    {
      id: 'mock-1',
      company: 'Google',
      position: 'Senior Frontend Engineer',
      location: 'San Francisco, CA (Hybrid)',
      salary: '$160,000 - $210,000',
      status: 'wishlist',
      notes: 'Matched via AI Job Search. High priority target.',
      interviewDate: null,
      createdAt: new Date().toISOString()
    },
    {
      id: 'mock-2',
      company: 'Stripe',
      position: 'Full Stack Developer',
      location: 'Remote (US/Canada)',
      salary: '$140,000 - $180,000',
      status: 'applied',
      notes: 'Applied on company portal. Referred by engineer in core payments.',
      interviewDate: null,
      createdAt: new Date().toISOString()
    },
    {
      id: 'mock-3',
      company: 'Netflix',
      position: 'Senior Backend Architect',
      location: 'Los Gatos, CA (Hybrid)',
      salary: '$200,000 - $280,000',
      status: 'interview',
      notes: 'Passed resume screening. Coding panel scheduled.',
      interviewDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 5 days from now
      createdAt: new Date().toISOString()
    }
  ];
  localStorage.setItem('mock_jobs', JSON.stringify(defaultJobs));
  return defaultJobs;
};

const saveLocalJobs = (jobs) => {
  localStorage.setItem('mock_jobs', JSON.stringify(jobs));
};

export const jobsApi = {
  getAll: async (params) => {
    if (isMockUser()) {
      return { data: getLocalJobs() };
    }
    return api.get('/jobs', { params });
  },
  getOne: async (id) => {
    if (isMockUser()) {
      const jobs = getLocalJobs();
      const job = jobs.find(j => String(j.id) === String(id));
      return { data: job };
    }
    return api.get(`/jobs/${id}`);
  },
  create: async (data) => {
    if (isMockUser()) {
      const jobs = getLocalJobs();
      const newJob = {
        ...data,
        id: 'mock-' + Date.now(),
        createdAt: new Date().toISOString()
      };
      jobs.push(newJob);
      saveLocalJobs(jobs);
      return { data: newJob };
    }
    return api.post('/jobs', data);
  },
  update: async (id, data) => {
    if (isMockUser()) {
      const jobs = getLocalJobs();
      const idx = jobs.findIndex(j => String(j.id) === String(id));
      if (idx !== -1) {
        jobs[idx] = { ...jobs[idx], ...data };
        saveLocalJobs(jobs);
        return { data: jobs[idx] };
      }
      return { data: null };
    }
    return api.patch(`/jobs/${id}`, data);
  },
  delete: async (id) => {
    if (isMockUser()) {
      const jobs = getLocalJobs();
      const filtered = jobs.filter(j => String(j.id) !== String(id));
      saveLocalJobs(filtered);
      return { data: { success: true } };
    }
    return api.delete(`/jobs/${id}`);
  },
  getStats: async () => {
    if (isMockUser()) {
      const jobs = getLocalJobs();
      const byStatus = {
        wishlist: 0,
        applied: 0,
        phone_screen: 0,
        interview: 0,
        offer: 0,
        accepted: 0,
        rejected: 0,
        withdrawn: 0
      };
      jobs.forEach(j => {
        if (byStatus[j.status] !== undefined) {
          byStatus[j.status]++;
        }
      });
      
      const active = jobs.filter(j => !['rejected', 'withdrawn'].includes(j.status)).length;
      const interviewing = (byStatus.interview || 0) + (byStatus.phone_screen || 0);
      
      return {
        data: {
          total: jobs.length,
          active,
          interviewing,
          offers: byStatus.offer || 0,
          byStatus
        }
      };
    }
    return api.get('/jobs/stats');
  },
  getAiMatches: async (data) => {
    return api.post('/jobs/ai-match', data);
  }
};
