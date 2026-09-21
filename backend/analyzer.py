import re
from typing import Dict, List, Any, Set, Tuple

# Comprehensive taxonomy of skills organized by category
SKILL_TAXONOMY: Dict[str, List[str]] = {
    "Programming": [
        "Python", "Java", "C", "C++", "C#", "JavaScript", "TypeScript",
        "Go", "Rust", "Ruby", "PHP", "Swift", "Kotlin", "Scala", "R", "Dart"
    ],
    "Web": [
        "HTML", "HTML5", "CSS", "CSS3", "React", "React.js", "Next.js", "Vue", "Vue.js",
        "Angular", "Node.js", "Node", "Express", "Express.js", "Django", "Flask", "FastAPI",
        "Spring Boot", "REST API", "RESTful", "GraphQL", "Tailwind CSS", "Bootstrap"
    ],
    "Database": [
        "SQL", "MySQL", "PostgreSQL", "MongoDB", "Redis", "SQLite",
        "Oracle", "Cassandra", "Elasticsearch", "DynamoDB", "Firebase", "Supabase"
    ],
    "Cloud": [
        "AWS", "Amazon Web Services", "Azure", "Microsoft Azure",
        "Google Cloud", "Google Cloud Platform", "GCP", "Cloudflare", "Heroku", "Serverless"
    ],
    "Tools": [
        "Git", "GitHub", "GitLab", "Docker", "Kubernetes", "CI/CD",
        "Jenkins", "Linux", "Terraform", "Nginx", "Jira", "Postman", "Bash", "Webpack", "Vite"
    ],
    "Data/AI": [
        "Machine Learning", "Artificial Intelligence", "AI", "NLP", "Natural Language Processing",
        "Deep Learning", "Pandas", "NumPy", "TensorFlow", "PyTorch", "Scikit-Learn",
        "Computer Vision", "Data Analysis", "Data Science", "Tableau", "Power BI", "Keras", "OpenCV"
    ],
    "Soft Skills": [
        "Communication", "Leadership", "Teamwork", "Problem Solving",
        "Time Management", "Critical Thinking", "Adaptability", "Collaboration",
        "Presentation", "Analytical Skills", "Mentoring", "Agile", "Scrum"
    ]
}

# Common English stopwords to ignore when extracting generic keywords
STOPWORDS: Set[str] = {
    "a", "about", "above", "after", "again", "against", "all", "am", "an", "and",
    "any", "are", "aren't", "as", "at", "be", "because", "been", "before", "being",
    "below", "between", "both", "but", "by", "can", "can't", "cannot", "could",
    "couldn't", "did", "didn't", "do", "does", "doesn't", "doing", "don't", "down",
    "during", "each", "few", "for", "from", "further", "had", "hadn't", "has",
    "hasn't", "have", "haven't", "having", "he", "he'd", "he'll", "he's", "her",
    "here", "here's", "hers", "herself", "him", "himself", "his", "how", "how's",
    "i", "i'd", "i'll", "i'm", "i've", "if", "in", "into", "is", "isn't", "it",
    "it's", "its", "itself", "let's", "me", "more", "most", "mustn't", "my",
    "myself", "no", "nor", "not", "of", "off", "on", "once", "only", "or",
    "other", "ought", "our", "ours", "ourselves", "out", "over", "own", "same",
    "shan't", "she", "she'd", "she'll", "she's", "should", "shouldn't", "so",
    "some", "such", "than", "that", "that's", "the", "their", "theirs", "them",
    "themselves", "then", "there", "there's", "these", "they", "they'd", "they'll",
    "they're", "they've", "this", "those", "through", "to", "too", "under", "until",
    "up", "very", "was", "wasn't", "we", "we'd", "we'll", "we're", "we've", "were",
    "weren't", "what", "what's", "when", "when's", "where", "where's", "which",
    "while", "who", "who's", "whom", "why", "why's", "with", "won't", "would",
    "wouldn't", "you", "you'd", "you'll", "you're", "you've", "your", "yours",
    "yourself", "yourselves", "role", "candidate", "responsibilities", "requirements",
    "experience", "work", "job", "position", "ability", "working", "looking", "must",
    "ideal", "opportunity", "team", "years", "plus", "including"
}

# Standard sections checked for resume structure health
SECTION_PATTERNS: Dict[str, str] = {
    "Contact Information": r"(\bemail\b|\bphone\b|\blinkedin\b|\bgithub\b|@|(\+?\d{1,3}[-.\s]?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}))",
    "Education": r"\b(education|university|college|bachelor|master|b\.?tech|m\.?tech|b\.?s|m\.?s|degree|diploma|gpa)\b",
    "Experience": r"\b(experience|employment|work history|work experience|internship|professional experience)\b",
    "Skills": r"\b(skills|technical skills|technologies|proficiencies|core competencies|tools)\b",
    "Projects": r"\b(projects|personal projects|academic projects|portfolio|key projects)\b"
}


def _build_skill_regex(skill: str) -> re.Pattern:
    """Builds a boundary-safe regular expression for a given skill string."""
    escaped = re.escape(skill)
    # Handle C++, C#, .NET specially since \b doesn't wrap punctuation like +, #, .
    if skill in ["C++", "C#", ".NET"]:
        return re.compile(rf"(?<![a-zA-Z0-9]){escaped}(?![a-zA-Z0-9])", re.IGNORECASE)
    if skill.lower() == "c":
        # Match ' C ' or 'C,' or 'C/' but not words starting with c
        return re.compile(r"(?<![a-zA-Z0-9])C(?![a-zA-Z0-9+#])")
    if skill.lower() == "r":
        return re.compile(r"(?<![a-zA-Z0-9])R(?![a-zA-Z0-9])")
    return re.compile(rf"\b{escaped}\b", re.IGNORECASE)


# Precompile regexes for taxonomy lookup
SKILL_PATTERNS: Dict[str, Tuple[str, re.Pattern]] = {}
for category, skills in SKILL_TAXONOMY.items():
    for sk in skills:
        SKILL_PATTERNS[sk] = (category, _build_skill_regex(sk))


def extract_skills_from_text(text: str) -> Dict[str, Set[str]]:
    """
    Extract skills present in the given text categorized by taxonomy.
    Returns a dictionary mapping category names to sets of found skills.
    """
    found: Dict[str, Set[str]] = {cat: set() for cat in SKILL_TAXONOMY.keys()}
    for skill_name, (category, pattern) in SKILL_PATTERNS.items():
        if pattern.search(text):
            found[category].add(skill_name)
    return found


def extract_keywords_from_job(job_text: str, top_n: int = 25) -> List[str]:
    """
    Extract significant keywords from the job description, prioritizing
    technical terms, qualifications, and domain verbs/nouns.
    """
    # 1. First capture recognized skills from the taxonomy in the JD
    detected_skills_by_cat = extract_skills_from_text(job_text)
    jd_skills = set()
    for s_set in detected_skills_by_cat.values():
        jd_skills.update(s_set)

    # 2. Extract words of length >= 3
    words = re.findall(r"\b[a-zA-Z][a-zA-Z0-9_+#.-]{2,}\b", job_text.lower())
    freq: Dict[str, int] = {}

    for w in words:
        clean_w = w.strip(".-")
        if not clean_w or clean_w in STOPWORDS or clean_w.isdigit():
            continue
        freq[clean_w] = freq.get(clean_w, 0) + 1

    # Boost frequency for recognized technical terms
    for s in jd_skills:
        s_lower = s.lower()
        freq[s_lower] = freq.get(s_lower, 0) + 10

    # Sort keywords by frequency
    sorted_keywords = sorted(freq.items(), key=lambda x: x[1], reverse=True)
    keywords = [kw for kw, _ in sorted_keywords[:top_n]]
    return keywords


def analyze_resume_structure(resume_text: str) -> Tuple[int, List[str], List[str]]:
    """
    Evaluates presence of standard resume sections and contact information.
    Returns (score 0-100, present_sections, missing_sections).
    """
    present = []
    missing = []
    for section, pattern in SECTION_PATTERNS.items():
        if re.search(pattern, resume_text, re.IGNORECASE):
            present.append(section)
        else:
            missing.append(section)

    score = int((len(present) / len(SECTION_PATTERNS)) * 100)
    return score, present, missing


def analyze_experience_and_education(resume_text: str, job_text: str) -> int:
    """
    Estimates experience and education compatibility.
    Detects years of experience mentioned in both and degree requirements.
    """
    score = 70  # Baseline reasonable score

    # Experience years detection
    exp_pattern = re.compile(r"(\d{1,2})\+?\s*(?:years?|yrs?)(?:\s+of)?\s+experience", re.IGNORECASE)
    job_exp_matches = exp_pattern.findall(job_text)
    resume_exp_matches = exp_pattern.findall(resume_text)

    if job_exp_matches:
        try:
            req_years = max([int(x) for x in job_exp_matches])
            if resume_exp_matches:
                cand_years = max([int(x) for x in resume_exp_matches])
                if cand_years >= req_years:
                    score += 15
                elif cand_years >= req_years - 1:
                    score += 10
                else:
                    score -= 10
            else:
                # Resume has experience section but doesn't explicitly format as 'X years'
                if re.search(SECTION_PATTERNS["Experience"], resume_text, re.IGNORECASE):
                    score += 5
        except Exception:
            pass

    # Education match
    edu_terms = ["bachelor", "master", "phd", "b.tech", "m.tech", "b.s", "m.s", "computer science"]
    job_edu = [term for term in edu_terms if term in job_text.lower()]
    resume_edu = [term for term in edu_terms if term in resume_text.lower()]

    if job_edu:
        matched_edu = set(job_edu).intersection(set(resume_edu))
        if matched_edu:
            score += 15
        else:
            score -= 5

    return max(35, min(100, score))


def calculate_keyword_match(keywords: List[str], resume_text: str) -> Tuple[int, List[Dict[str, Any]]]:
    """
    Compares required keywords against resume text.
    Returns (keyword_score 0-100, keyword_status_table).
    """
    if not keywords:
        return 100, []

    keyword_table = []
    matched_count = 0
    resume_lower = resume_text.lower()

    for kw in keywords:
        pattern = re.compile(rf"(?<![a-zA-Z0-9]){re.escape(kw)}(?![a-zA-Z0-9])", re.IGNORECASE)
        found = bool(pattern.search(resume_lower))
        if found:
            matched_count += 1
            status = "Matched"
        else:
            status = "Missing"

        keyword_table.append({
            "keyword": kw,
            "required": True,
            "found": found,
            "status": status
        })

    score = int((matched_count / len(keywords)) * 100)
    return score, keyword_table


def generate_strengths(
    matched_skills: List[str],
    present_sections: List[str],
    keyword_score: int,
    structure_score: int,
    resume_text: str
) -> List[str]:
    """Dynamically generates highlights and strengths based on the candidate's resume."""
    strengths = []

    if len(matched_skills) >= 6:
        top_skills = ", ".join(matched_skills[:4])
        strengths.append(f"Strong alignment in key technical competencies including {top_skills}.")
    elif len(matched_skills) > 0:
        strengths.append(f"Possesses core required skills such as {', '.join(matched_skills[:3])}.")

    if structure_score >= 80:
        strengths.append("Excellent resume structure featuring standard ATS-friendly sections.")

    if keyword_score >= 70:
        strengths.append(f"High keyword density ({keyword_score}%) aligning closely with the target position description.")

    # Action verbs and quantifiable metrics check
    metrics_matches = re.findall(r"\b(\d+%\s*(?:increase|decrease|growth|reduction|improvement)|increased|decreased|reduced|led|architected|developed|spearheaded)\b", resume_text, re.IGNORECASE)
    if len(metrics_matches) >= 3:
        strengths.append("Demonstrates results-driven experience with impactful action verbs and quantifiable achievements.")

    if "Contact Information" in present_sections:
        strengths.append("Complete contact profile with clear identification channels.")

    if not strengths:
        strengths.append("Resume provides foundational context suitable for tailoring to this position.")

    return strengths


def generate_weaknesses(
    missing_skills: List[str],
    missing_sections: List[str],
    keyword_score: int,
    structure_score: int,
    resume_text: str
) -> List[str]:
    """Identifies concrete gaps and potential red flags for ATS parsers."""
    weaknesses = []

    if len(missing_skills) >= 4:
        key_missing = ", ".join(missing_skills[:3])
        weaknesses.append(f"Missing high-priority skills requested in the job description: {key_missing}.")
    elif len(missing_skills) > 0:
        weaknesses.append(f"Could benefit from including {', '.join(missing_skills[:2])} to maximize candidate ranking.")

    if keyword_score < 60:
        weaknesses.append(f"Keyword match rate is currently {keyword_score}%, which may lower automated filtering rank.")

    if missing_sections:
        weaknesses.append(f"Missing recommended standard resume sections: {', '.join(missing_sections)}.")

    # Check for quantifiable numbers
    numbers = re.findall(r"\b\d+%\b|\b\$\d+\b|\b\d+\+\s*(?:users|clients|projects|features)\b", resume_text)
    if len(numbers) < 2:
        weaknesses.append("Limited quantifiable metrics or business impact metrics (e.g., percentages, scale, performance improvements).")

    if not weaknesses:
        weaknesses.append("Minor formatting variances; overall strong baseline alignment with the role requirements.")

    return weaknesses


def generate_recommendations(
    missing_skills: List[str],
    missing_sections: List[str],
    keyword_table: List[Dict[str, Any]],
    ats_score: int,
    job_title: str
) -> List[str]:
    """Generates prioritized, high-impact suggestions to elevate the resume's ATS score."""
    recommendations = []

    if missing_skills:
        top_missing = ", ".join(missing_skills[:4])
        recommendations.append(f"Incorporate missing core skills ({top_missing}) naturally into your Projects or Work Experience bullet points.")

    missing_keywords = [item["keyword"] for item in keyword_table if not item["found"]][:5]
    if missing_keywords:
        recommendations.append(f"Sprinkle targeted job keywords such as '{', '.join(missing_keywords)}' into your summary and project achievements.")

    if missing_sections:
        for sec in missing_sections:
            recommendations.append(f"Add a dedicated '{sec}' section to prevent ATS parsers from misclassifying your credentials.")

    recommendations.append(f"Tailor your top professional summary or objective to explicitly mention target role keywords like '{job_title or 'the target role'}'.")
    recommendations.append("Begin bullet points with strong action verbs (e.g., 'Architected', 'Spearheaded', 'Optimized') followed by quantifiable impact.")

    return recommendations


def generate_candidate_summary(resume_text: str, matched_skills: List[str], job_title: str, ats_score: int) -> str:
    """Generates an executive snapshot summarizing the candidate's alignment."""
    word_count = len(resume_text.split())
    skills_preview = ", ".join(matched_skills[:5]) if matched_skills else "General technical skills"

    status_label = "Strong Match" if ats_score >= 80 else "Moderate Match" if ats_score >= 60 else "Developing Match"

    summary = (
        f"Resume parsed successfully ({word_count} words analyzed). "
        f"The candidate profile reflects a {status_label} ({ats_score}/100) for {job_title or 'the requested position'}. "
        f"Demonstrated core competencies include: {skills_preview}. "
        f"Targeted enhancements to skill keyword density and quantifiable achievements will maximize interview callback probabilities."
    )
    return summary


def analyze_resume(resume_text: str, job_description: str, job_title: str = "Software Professional") -> Dict[str, Any]:
    """
    Main analysis orchestrator that evaluates resume against job description.
    Produces comprehensive, real calculated ATS score, skills matching,
    keyword table, strengths, weaknesses, recommendations, and candidate summary.
    """
    if not resume_text or not job_description:
        raise ValueError("Both resume text and job description must be provided for analysis.")

    # 1. Extract skills from both documents
    resume_skills_by_cat = extract_skills_from_text(resume_text)
    job_skills_by_cat = extract_skills_from_text(job_description)

    # Flatten all detected skills
    resume_all_skills: Set[str] = set()
    for s_set in resume_skills_by_cat.values():
        resume_all_skills.update(s_set)

    job_all_skills: Set[str] = set()
    for s_set in job_skills_by_cat.values():
        job_all_skills.update(s_set)

    # Match and missing skills
    if job_all_skills:
        matched_skills_set = job_all_skills.intersection(resume_all_skills)
        missing_skills_set = job_all_skills.difference(resume_all_skills)
        skills_match_score = int((len(matched_skills_set) / len(job_all_skills)) * 100)
    else:
        # If job description mentions no dictionary skills, score based on candidate's raw skills
        matched_skills_set = resume_all_skills
        missing_skills_set = set()
        skills_match_score = min(90, max(50, len(resume_all_skills) * 8))

    matched_skills = sorted(list(matched_skills_set))
    missing_skills = sorted(list(missing_skills_set))

    # 2. Extract job keywords and match
    job_keywords = extract_keywords_from_job(job_description, top_n=20)
    keyword_score, keyword_table = calculate_keyword_match(job_keywords, resume_text)

    # 3. Analyze resume structure
    structure_score, present_sections, missing_sections = analyze_resume_structure(resume_text)

    # 4. Analyze experience & education relevance
    relevance_score = analyze_experience_and_education(resume_text, job_description)

    # 5. Composite Weighted ATS Score
    # Weighting: Skills (40%), Keywords (30%), Structure (15%), Relevance (15%)
    ats_score = int(
        (skills_match_score * 0.40) +
        (keyword_score * 0.30) +
        (structure_score * 0.15) +
        (relevance_score * 0.15)
    )
    ats_score = max(10, min(99, ats_score))

    score_breakdown = {
        "skills": skills_match_score,
        "keywords": keyword_score,
        "structure": structure_score,
        "relevance": relevance_score
    }

    # 6. Generate qualitative insights
    strengths = generate_strengths(matched_skills, present_sections, keyword_score, structure_score, resume_text)
    weaknesses = generate_weaknesses(missing_skills, missing_sections, keyword_score, structure_score, resume_text)
    recommendations = generate_recommendations(missing_skills, missing_sections, keyword_table, ats_score, job_title)
    summary = generate_candidate_summary(resume_text, matched_skills, job_title, ats_score)

    return {
        "ats_score": ats_score,
        "score_breakdown": score_breakdown,
        "matched_skills": matched_skills,
        "missing_skills": missing_skills,
        "keywords": keyword_table,
        "strengths": strengths,
        "weaknesses": weaknesses,
        "recommendations": recommendations,
        "summary": summary
    }
