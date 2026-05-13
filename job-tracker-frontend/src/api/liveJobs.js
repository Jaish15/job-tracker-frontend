/**
 * Live Jobs API — fetches real job listings from free, no-key-required APIs.
 *
 * Sources:
 *  1. The Muse  — https://www.themuse.com/api/public/jobs  (all categories, no key)
 *  2. Remotive  — https://remotive.com/api/remote-jobs      (remote-only, no key)
 */

const MUSE_BASE     = 'https://www.themuse.com/api/public/jobs';
const REMOTIVE_BASE = 'https://remotive.com/api/remote-jobs';

/* ── Helpers ─────────────────────────────────────────────────── */

function stripHtml(html = '') {
  return html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
}

/* ── The Muse ─────────────────────────────────────────────────
   Returns { results, total, page_count }
   Docs: https://www.themuse.com/developers/api/v2
────────────────────────────────────────────────────────────── */
export async function fetchMuseJobs({ page = 1, category = '', level = '' } = {}) {
  const params = new URLSearchParams({ page: String(page - 1), descending: 'true' });
  if (category) params.set('category', category);
  if (level)    params.set('level', level);

  const res  = await fetch(`${MUSE_BASE}?${params}`);
  if (!res.ok) throw new Error(`The Muse API error: ${res.status}`);
  const data = await res.json();

  return {
    jobs: (data.results || []).map((j) => ({
      id:          `muse-${j.id}`,
      source:      'The Muse',
      title:       j.name,
      company:     j.company?.name || 'Unknown',
      location:    (j.locations || []).map((l) => l.name).join(', ') || 'Various',
      type:        (j.levels || []).map((l) => l.name).join(', ') || '',
      category:    (j.categories || []).map((c) => c.name).join(', ') || '',
      description: stripHtml(j.contents || ''),
      url:         j.refs?.landing_page || '',
      postedAt:    j.publication_date || '',
      salary:      '',
      tags:        [],
      remote:      false,
    })),
    total:      data.total,
    pageCount:  data.page_count,
  };
}

/* ── Remotive ─────────────────────────────────────────────────
   Returns { jobs }
   Docs: https://remotive.com/api
────────────────────────────────────────────────────────────── */
export async function fetchRemotiveJobs({ category = '', search = '' } = {}) {
  const params = new URLSearchParams();
  if (category) params.set('category', category);
  if (search)   params.set('search', search);

  const res  = await fetch(`${REMOTIVE_BASE}?${params}`);
  if (!res.ok) throw new Error(`Remotive API error: ${res.status}`);
  const data = await res.json();

  return {
    jobs: (data.jobs || []).map((j) => ({
      id:          `remotive-${j.id}`,
      source:      'Remotive',
      title:       j.title,
      company:     j.company_name || 'Unknown',
      location:    j.candidate_required_location || 'Remote',
      type:        j.job_type || '',
      category:    j.category || '',
      description: stripHtml(j.description || ''),
      url:         j.url || '',
      postedAt:    j.publication_date || '',
      salary:      j.salary || '',
      tags:        j.tags || [],
      remote:      true,
    })),
    total:     data['job-count'] || 0,
    pageCount: 1,
  };
}

/* ── Combined fetch — merges both sources ───────────────────── */
export async function fetchAllLiveJobs({ search = '', category = '', page = 1 } = {}) {
  const [museResult, remotiveResult] = await Promise.allSettled([
    fetchMuseJobs({ page, category }),
    fetchRemotiveJobs({ search, category }),
  ]);

  const museJobs      = museResult.status      === 'fulfilled' ? museResult.value.jobs      : [];
  const remotiveJobs  = remotiveResult.status  === 'fulfilled' ? remotiveResult.value.jobs  : [];
  const musePageCount = museResult.status       === 'fulfilled' ? museResult.value.pageCount : 1;

  // Merge & client-side keyword filter for Muse (no server-side search)
  let merged = [...museJobs, ...remotiveJobs];
  if (search) {
    const q = search.toLowerCase();
    merged = merged.filter(
      (j) =>
        j.title.toLowerCase().includes(q) ||
        j.company.toLowerCase().includes(q) ||
        j.category.toLowerCase().includes(q) ||
        j.description.toLowerCase().includes(q),
    );
  }

  return { jobs: merged, musePageCount };
}

/* ── Muse categories (for filter dropdown) ─────────────────── */
export const MUSE_CATEGORIES = [
  'Account Management',
  'Business & Strategy',
  'Creative & Design',
  'Customer Service',
  'Data Science',
  'Editorial',
  'Education',
  'Engineering',
  'Finance',
  'Healthcare & Medicine',
  'HR & Recruiting',
  'Legal',
  'Marketing & PR',
  'Operations',
  'Project & Product Management',
  'Retail',
  'Sales',
  'Social Media & Community',
  'Software Engineering',
  'UX & Interaction Design',
];

export const REMOTIVE_CATEGORIES = [
  'software-dev',
  'customer-support',
  'design',
  'devops-sysadmin',
  'finance-legal',
  'human-resources',
  'marketing',
  'product',
  'project-mgmt',
  'qa',
  'sales-business',
  'writing',
];
