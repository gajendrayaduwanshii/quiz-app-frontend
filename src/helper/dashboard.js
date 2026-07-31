// helper/dashboard.js

export const getSkillSummary = (skills = []) => {
  if (!skills || skills.length === 0)
    return { strongest: ["-", 0], weakest: ["-", 0] };
  const sorted = [...skills].sort(
    (a, b) => b.yearsExperience - a.yearsExperience
  );
  return {
    strongest: [sorted[0].skillName, sorted[0].yearsExperience],
    weakest: [
      sorted[sorted.length - 1].skillName,
      sorted[sorted.length - 1].yearsExperience,
    ],
  };
};

export const getUpskillSuggestion = (years) => {
  if (years < 1)
    return "🚀 You're just getting started. Focus on mastering core web technologies like HTML, CSS, and JavaScript.";
  if (years < 3)
    return "👶 You're a junior developer. Focus on building real-world projects and learn version control (Git), basic backend, and testing.";
  if (years < 5)
    return "🧑‍💻 You're at mid-level. Deepen skills in frontend/backend frameworks and understand CI/CD, DevOps basics, and scalable architecture.";
  if (years < 10)
    return "👨‍🏫 You're a senior developer. Start mentoring, contribute to architecture, and get involved in code reviews and tech strategy.";
  if (years < 20)
    return "🧠 You're highly experienced. Focus on tech leadership, organizational impact, and possibly transitioning into roles like Engineering Manager or Architect.";
  if (years < 30)
    return "🧓 You're a veteran in tech. Consider sharing your knowledge via writing, speaking, and mentoring. Stay updated with trends while leveraging your deep experience.";
  return "🏆 With 30+ years in the industry, you're a rare tech leader. Guide teams, shape company strategy, and influence engineering culture at scale.";
};

export const parseCertifications = (certStr) => {
  if (!certStr) return [];
  return certStr
    .split(/[\n,]+/)
    .map((cert) => cert.trim())
    .filter((cert) => cert);
};
