/**
 * ATS scoring engine — runs entirely client-side.
 * Scores a candidate's application against a job posting.
 */

const EXPERIENCE_MAP = { entry: 1, mid: 3, senior: 6, lead: 10 };

/** Normalise a string for comparison */
const norm = (s = '') => s.toLowerCase().replace(/[^a-z0-9\s]/g, ' ').trim();

/** Extract all words from a block of text */
const words = (s = '') => norm(s).split(/\s+/).filter(Boolean);

/** Check if a keyword appears in a body of text */
const contains = (text = '', kw = '') => norm(text).includes(norm(kw));

/**
 * Score a single application against a job.
 * Returns { total, breakdown } where total is 0-100.
 */
export function scoreApplication(application, job) {
  const candidate = application.candidate || {};
  const candidateSkills = (candidate.skills || []).map(norm);
  const jobSkills = (job.skillsRequired || []).map(norm);
  const coverLetter = application.coverLetter || '';
  const bio = candidate.bio || '';
  const jobDesc = job.description || '';
  const jobTitle = job.title || '';

  // ── 1. Skills match (40 pts) ──────────────────────────────────────────────
  let skillsScore = 0;
  const matchedSkills = [];
  const missingSkills = [];

  if (jobSkills.length > 0) {
    jobSkills.forEach((jsk) => {
      const hit =
        candidateSkills.some((csk) => csk.includes(jsk) || jsk.includes(csk)) ||
        contains(coverLetter, jsk) ||
        contains(bio, jsk);
      if (hit) matchedSkills.push(jsk);
      else missingSkills.push(jsk);
    });
    skillsScore = Math.round((matchedSkills.length / jobSkills.length) * 40);
  } else {
    skillsScore = 20; // no required skills listed — neutral
  }

  // ── 2. Experience level (20 pts) ─────────────────────────────────────────
  const requiredYrs = EXPERIENCE_MAP[job.experienceLevel] || 0;
  const candidateYrs = candidate.experience || 0;
  let expScore = 0;
  if (requiredYrs === 0) {
    expScore = 20;
  } else if (candidateYrs >= requiredYrs) {
    expScore = 20;
  } else {
    expScore = Math.round((candidateYrs / requiredYrs) * 20);
  }

  // ── 3. Keyword density in cover letter (25 pts) ──────────────────────────
  const jobKeywords = [
    ...words(jobTitle),
    ...words(jobDesc).filter((w) => w.length > 4),
  ].slice(0, 30);

  let kwHits = 0;
  const clWords = words(coverLetter + ' ' + bio);
  jobKeywords.forEach((kw) => {
    if (clWords.includes(kw)) kwHits++;
  });
  const kwScore = jobKeywords.length > 0
    ? Math.min(25, Math.round((kwHits / jobKeywords.length) * 50))
    : 12;

  // ── 4. Profile completeness (15 pts) ─────────────────────────────────────
  let profileScore = 0;
  if (candidate.name) profileScore += 3;
  if (candidate.email) profileScore += 2;
  if (candidate.location) profileScore += 2;
  if (bio && bio.length > 30) profileScore += 3;
  if (application.resumeUrl || candidate.resumeUrl) profileScore += 3;
  if (candidateSkills.length >= 3) profileScore += 2;

  // ── Total ─────────────────────────────────────────────────────────────────
  const total = Math.min(100, skillsScore + expScore + kwScore + profileScore);

  // ── Grade ─────────────────────────────────────────────────────────────────
  let grade, color, label;
  if (total >= 80) { grade = 'A'; color = 'emerald'; label = 'Excellent Match'; }
  else if (total >= 65) { grade = 'B'; color = 'sky'; label = 'Good Match'; }
  else if (total >= 50) { grade = 'C'; color = 'amber'; label = 'Partial Match'; }
  else if (total >= 35) { grade = 'D'; color = 'orange'; label = 'Weak Match'; }
  else { grade = 'F'; color = 'rose'; label = 'Poor Match'; }

  return {
    total,
    grade,
    color,
    label,
    breakdown: {
      skills: { score: skillsScore, max: 40, matched: matchedSkills, missing: missingSkills },
      experience: { score: expScore, max: 20, required: requiredYrs, candidate: candidateYrs },
      keywords: { score: kwScore, max: 25, hits: kwHits, total: jobKeywords.length },
      profile: { score: profileScore, max: 15 },
    },
  };
}

/** Score all applications and return sorted list */
export function scoreAll(applications, job) {
  return applications
    .map((app) => ({ ...app, ats: scoreApplication(app, job) }))
    .sort((a, b) => b.ats.total - a.ats.total);
}
