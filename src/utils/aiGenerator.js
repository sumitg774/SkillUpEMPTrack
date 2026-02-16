import { GoogleGenerativeAI } from "@google/generative-ai";

const getAPIKey = () => import.meta.env.VITE_GEMINI_API_KEY || localStorage.getItem('gemini_api_key');

// Helper for simulated delays
const delay = (ms) => new Promise(res => setTimeout(res, ms));

export const generateStudyGuideAI = async (topic) => {
  const apiKey = getAPIKey();
  if (!apiKey) {
    await delay(1000);
    return {
      guides: [
        { title: `Basics of ${topic}`, content: `This guide covers the fundamental principles of ${topic}. You should focus on syntax, core concepts, and common use cases.`, code: `// Example code for ${topic}\nconsole.log("Learning ${topic}");` },
        { title: `Intermediate ${topic}`, content: `Diving deeper into ${topic}, we look at architectural patterns, optimization, and advanced features.`, code: `/* Advanced pattern */` },
        { title: `Expert ${topic}`, content: `Mastering ${topic} involves understanding low-level implementations and complex integrations.` }
      ]
    };
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  // ... rest of AI logic
  const prompt = `You are an expert tutor... (similar to existing)`;
  // (I'll keep the full logic for when key IS present)
  try {
    const result = await model.generateContent(`Create a detailed study guide for: "${topic}". JSON format: {guides: [{title, content, code}]}. 3 concepts.`);
    const text = (await result.response).text();
    return JSON.parse(text.replace(/```json/g, '').replace(/```/g, ''));
  } catch (e) { throw e; }
};

export const generatePracticeQuestionsAI = async (topic) => {
  const apiKey = getAPIKey();
  if (!apiKey) {
    await delay(800);
    return [
      { q: `What is a primary feature of ${topic}?`, a: `The primary feature is its versatility in modern development environments.` },
      { q: `Which of these is best practice for ${topic}?`, a: `Following modular design patterns and ensuring code readability.` },
      { q: `How does ${topic} handle asynchronous operations?`, a: `It typically uses promises or equivalent patterns to manage non-blocking tasks.` }
    ];
  }
  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  try {
    const result = await model.generateContent(`Generate 3 MCQ practice questions for "${topic}". JSON array: [{q, a}].`);
    const text = (await result.response).text();
    return JSON.parse(text.replace(/```json/g, '').replace(/```/g, ''));
  } catch (e) { throw e; }
};

export const generateRoadmapAI = async (role) => {
  const apiKey = getAPIKey();
  if (!apiKey) {
    await delay(1200);
    return {
      role,
      steps: [
        { phase: "Fundamentals", topics: ["Core Theory", "Syntax basics", "Tooling"], estimatedTime: "1-2 weeks", importance: "High" },
        { phase: "Advanced Deep Dive", topics: ["Performance", "Security", "Testing"], estimatedTime: "3 weeks", importance: "High" },
        { phase: "Real-world Projects", topics: ["Portfolio pieces", "Open source", "Optimization"], estimatedTime: "Ongoing", importance: "Medium" },
        { phase: "Interview Readiness", topics: ["System Design", "Algorithms", "Soft Skills"], estimatedTime: "1 week", importance: "High" }
      ]
    };
  }
  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  try {
    const result = await model.generateContent(`Create interview roadmap for: "${role}". JSON format: {role, steps: [{phase, topics, estimatedTime, importance}]}.`);
    const text = (await result.response).text();
    return JSON.parse(text.replace(/```json/g, '').replace(/```/g, ''));
  } catch (e) { throw e; }
};

export const reviewResumeAI = async (resumeData) => {
  const apiKey = getAPIKey();
  if (!apiKey) {
    await delay(1500);
    return {
      score: 85,
      feedback: [
        "Strong presentation of technical expertise.",
        "Clear and concise professional summary.",
        "Achievements are well-defined but could use more metrics.",
        "Design is highly modern and recruiter-friendly."
      ],
      suggestions: "To reach 100%, try adding more quantitative results (e.g., 'Improved performance by 30%') in your experience section. Your 'Philosophy' adds a unique personality touch that 90% of resumes lack."
    };
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  const prompt = `Review resume: ${JSON.stringify(resumeData)}. JSON format: {score, feedback: [], suggestions}.`;
  try {
    const result = await model.generateContent(prompt);
    const text = (await result.response).text();
    return JSON.parse(text.replace(/```json/g, '').replace(/```/g, ''));
  } catch (e) { throw e; }
};

export const parseResumeAI = async (rawText) => {
  const apiKey = getAPIKey();
  if (!apiKey) {
    await delay(1500);
    // Simulate a basic extraction for demo if no API key
    return {
      personalInfo: { fullName: "Extracted Name", role: "Software Developer", summary: "Analysis complete from raw text..." },
      experience: [{ company: "Old Corp", role: "Developer", duration: "2020-2022", desc: "Built various features." }],
      education: [{ school: "University", degree: "B.S. CS", year: "2019" }],
      skills: [{ name: "JavaScript" }, { name: "React" }]
    };
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  const prompt = `Extract resume data from this text: "${rawText}". 
  Return JSON format ONLY: {
    personalInfo: {fullName, role, summary, email, phone, location},
    experience: [{company, role, duration, desc}],
    projects: [{title, duration, stack, desc}],
    education: [{school, degree, year}],
    skills: [{name, level}],
    achievements: [{title}],
    languages: [{name, label}]
  }. Fill as much as possible.`;

  try {
    const result = await model.generateContent(prompt);
    const text = (await result.response).text();
    const cleaned = text.replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(cleaned);
  } catch (e) { throw e; }
};
