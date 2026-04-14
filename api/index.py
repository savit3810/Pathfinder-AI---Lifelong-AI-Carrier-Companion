"""
main.py  –  PathFinder AI  •  ML Backend (FastAPI)
Endpoints:
  GET  /                        health check
  GET  /model-metrics           all model accuracy info
  POST /predict/stream          Class-10 stream predictor
  POST /predict/course          Class-12 course predictor
  POST /predict/domain          College domain predictor
  POST /predict/salary          Salary projection
  POST /analyze/position        Percentile / position analysis
  POST /seniors/match           Alumni motivation matches
  GET  /lifecycle/{role}        Lifecycle roadmap data
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import List, Optional
import pickle, json, os, math
import numpy as np
import pandas as pd
from db import save_prediction, get_user_history
from uuid import uuid4

# ─── App ──────────────────────────────────────────────────────────────────────
app = FastAPI(title="PathFinder AI — ML Backend", version="2.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ─── Model loading ────────────────────────────────────────────────────────────
BASE = os.path.dirname(__file__)

def load(path):
    full = os.path.join(BASE, path)
    if not os.path.exists(full):
        return None
    with open(full, "rb") as f:
        return pickle.load(f)

def load_json(path):
    full = os.path.join(BASE, path)
    if not os.path.exists(full):
        return {}
    with open(full) as f:
        return json.load(f)

# Class-10 stream
m_stream       = load("models/class10_stream_model.pkl")
enc_stream     = load("models/class10_stream_encoder.pkl")

# Class-12 course
m_course       = load("models/class12_course_model.pkl")
enc_stream12   = load("models/class12_stream_encoder.pkl")
enc_pref12     = load("models/class12_pref_encoder.pkl")
enc_course12   = load("models/class12_course_encoder.pkl")

# College domain
m_domain_dt    = load("models/college_domain_model_dt.pkl")
m_domain_lr    = load("models/college_domain_model_lr.pkl")
enc_degree     = load("models/college_degree_encoder.pkl")
enc_domain     = load("models/college_domain_encoder.pkl")

# Salary
m_salary_rf    = load("models/salary_rf_model.pkl")
m_salary_lin   = load("models/salary_linear_model.pkl")

# Legacy backward-compat
m_salary_old   = load("salary_model.pkl")
m_success_old  = load("success_model.pkl")

# Metrics & Alumni data
model_metrics  = load_json("models/model_metrics.json")

def load_alumni():
    path = os.path.join(BASE, "data/alumni_seniors.csv")
    if not os.path.exists(path):
        return pd.DataFrame()
    return pd.read_csv(path)

alumni_df = load_alumni()

# ─── Schemas ──────────────────────────────────────────────────────────────────
class Class10Input(BaseModel):
    user_id: Optional[str] = None
    math_marks: float = Field(..., ge=0, le=100)
    science_marks: float = Field(..., ge=0, le=100)
    english_marks: float = Field(..., ge=0, le=100)
    social_marks: float = Field(60.0, ge=0, le=100)
    hindi_marks: float = Field(60.0, ge=0, le=100)
    tech_interest: int = Field(5, ge=0, le=10)
    commerce_interest: int = Field(5, ge=0, le=10)
    art_interest: int = Field(5, ge=0, le=10)

class Class12Input(BaseModel):
    user_id: Optional[str] = None
    stream: str = "Science"          # Science / Commerce / Arts
    marks_subject1: float = Field(..., ge=0, le=100)
    marks_subject2: float = Field(..., ge=0, le=100)
    marks_subject3: float = Field(..., ge=0, le=100)
    math_marks: float = Field(60.0, ge=0, le=100)
    physics_marks: float = Field(60.0, ge=0, le=100)
    bio_marks: float = Field(60.0, ge=0, le=100)
    preferred_subject: str = "Mathematics"
    skills_count: int = Field(3, ge=0, le=20)

class CollegeInput(BaseModel):
    user_id: Optional[str] = None
    degree: str = "B.Tech / B.E."
    cgpa: float = Field(..., ge=0.0, le=10.0)
    skills_count: int = Field(5, ge=0, le=20)
    projects_count: int = Field(2, ge=0, le=20)
    internships_count: int = Field(1, ge=0, le=10)
    certifications: int = Field(2, ge=0, le=20)
    active_backlogs: int = Field(0, ge=0, le=20)

class PositionInput(BaseModel):
    role: str          # class10 / class12 / college / graduate
    overall_score: float = Field(..., ge=0, le=100)
    skills_count: int = Field(3, ge=0, le=20)
    extra_score: float = Field(0.0)   # CGPA*10 for college, else 0

class SeniorMatchInput(BaseModel):
    class10_percentage: float = Field(60.0, ge=0, le=100)
    stream: str = "Science"
    cgpa: float = Field(7.0, ge=0.0, le=10.0)
    skills_count: int = Field(4, ge=0, le=20)
    top_n: int = Field(3, ge=1, le=10)

# Legacy input (backward-compat)
class OldProfile(BaseModel):
    stage: int
    stream: int
    marks: float
    skills_count: int

class OldComparison(BaseModel):
    profile1: OldProfile
    profile2: OldProfile

# ─── Helpers ──────────────────────────────────────────────────────────────────
STREAM_SKILLS = {
    "Science": ["Physics", "Chemistry", "Mathematics", "Biology", "Computer Science"],
    "Commerce": ["Accountancy", "Business Studies", "Economics", "Statistics"],
    "Arts": ["History", "Geography", "Political Science", "Sociology", "Psychology"],
}

COURSE_NEXT = {
    "Engineering":         ["JEE Mains / Advanced", "BITSAT", "State CETs"],
    "Medical (MBBS)":      ["NEET-UG", "AIIMS entrance"],
    "B.Sc Computer Science": ["CUET", "College direct admission"],
    "CA / CMA":            ["CA Foundation", "CMA Foundation exam"],
    "BBA / MBA":           ["IPMAT", "SET", "BBA entrance exams"],
    "B.Com":               ["CUET Commerce", "State university admission"],
    "BA History / UPSC":   ["CUET", "Start NCERT reading for UPSC"],
    "BA / Mass Communication": ["IIMC", "Symbiosis entrance"],
}

DOMAIN_SKILLS = {
    "Software Engineering":   ["DSA", "Java/C++", "System Design", "Git"],
    "Data Science":           ["Python", "Pandas", "ML", "SQL", "Statistics"],
    "Full Stack Development": ["React", "Node.js", "MongoDB", "REST APIs"],
    "AI/ML Engineering":      ["Deep Learning", "PyTorch", "MLOps", "NLP"],
    "Cloud Architecture":     ["AWS/Azure", "Docker", "Kubernetes", "Terraform"],
    "DevOps":                 ["CI/CD", "Jenkins", "Linux", "Monitoring"],
    "Business Analytics":     ["Excel", "Power BI", "SQL", "Tableau"],
    "Finance":                ["Financial Modelling", "Excel VBA", "Valuations"],
    "Healthcare IT":          ["HL7", "EHR Systems", "Python", "Data Privacy"],
    "Digital Marketing":      ["SEO/SEM", "Google Ads", "Content Strategy", "Analytics"],
    "Cybersecurity":          ["Ethical Hacking", "SIEM", "Networking", "CompTIA Sec+"],
    "Product Management":     ["Agile", "User Research", "Roadmapping", "SQL"],
    "Embedded Systems":       ["C", "RTOS", "Microcontrollers", "PCB Design"],
    "UI/UX Design":           ["Figma", "User Research", "Prototyping", "CSS"],
}

def safe_encode(encoder, value, default=0):
    """Handle unseen labels gracefully."""
    if encoder is None:
        return default
    try:
        return int(encoder.transform([value])[0])
    except (ValueError, AttributeError):
        return default

def confidence_desc(prob: float) -> str:
    if prob >= 0.85: return "Very High"
    if prob >= 0.70: return "High"
    if prob >= 0.55: return "Moderate"
    return "Low"

# ─── Routes ───────────────────────────────────────────────────────────────────

@app.get("/")
def health():
    return {
        "status": "ok",
        "message": "PathFinder AI ML Backend v2.0",
        "models_loaded": {
            "class10_stream":  m_stream is not None,
            "class12_course":  m_course is not None,
            "college_domain_dt": m_domain_dt is not None,
            "college_domain_lr": m_domain_lr is not None,
            "salary_rf":       m_salary_rf is not None,
            "salary_linear":   m_salary_lin is not None,
        }
    }

@app.get("/model-metrics")
def get_metrics():
    return {"metrics": model_metrics}

# ──────────────────────────────────────────────────────────────────────────────
# PREDICT: Class-10 → Stream
# ──────────────────────────────────────────────────────────────────────────────
@app.post("/predict/stream")
async def predict_stream(data: Class10Input):
    if not m_stream or not enc_stream:
        raise HTTPException(503, "Class-10 model not loaded. Run train_models.py first.")

    overall = (data.math_marks + data.science_marks + data.english_marks +
               data.social_marks + data.hindi_marks) / 5
    X = np.array([[data.math_marks, data.science_marks, data.english_marks,
                   data.social_marks, data.hindi_marks, overall,
                   data.tech_interest, data.commerce_interest, data.art_interest]])

    pred_idx  = m_stream.predict(X)[0]
    proba     = m_stream.predict_proba(X)[0]
    stream    = enc_stream.inverse_transform([pred_idx])[0]
    confidence= round(float(proba[pred_idx]) * 100, 1)

    # All class probabilities
    class_probs = {
        enc_stream.inverse_transform([i])[0]: round(float(p) * 100, 1)
        for i, p in enumerate(proba)
    }

    # Reasoning
    reasons = []
    if stream == "Science":
        if data.tech_interest >= 7:
            reasons.append("Strong technology interest detected")
        if data.math_marks >= 75 and data.science_marks >= 75:
            reasons.append(f"High Math ({data.math_marks}%) & Science ({data.science_marks}%) scores")
        reasons.append("Recommended entrance: JEE / NEET based on further interest")
    elif stream == "Commerce":
        reasons.append(f"Commerce interest: {data.commerce_interest}/10")
        reasons.append("Strong aptitude for business and economics")
        reasons.append("Recommended: CA Foundation or BBA entrance preparation")
    else:
        reasons.append(f"Arts/Humanities interest: {data.art_interest}/10")
        reasons.append("Recommended for UPSC, Journalism, or Creative fields")

    result = {
        "predicted_stream": stream,
        "confidence_pct": confidence,
        "confidence_level": confidence_desc(confidence / 100),
        "all_stream_probabilities": class_probs,
        "overall_percentage": round(overall, 2),
        "recommended_subjects": STREAM_SKILLS.get(stream, []),
        "reasoning": reasons,
        "model_used": "Random Forest Classifier",
        "model_accuracy": model_metrics.get("class10_stream", {}).get("accuracy_pct", "N/A"),
    }
    
    uid = data.user_id or str(uuid4())
    await save_prediction(uid, "class10", data.dict(), result)
    result["user_id"] = uid
    return result

# ──────────────────────────────────────────────────────────────────────────────
# PREDICT: Class-12 → Course/Degree
# ──────────────────────────────────────────────────────────────────────────────
@app.post("/predict/course")
async def predict_course(data: Class12Input):
    if not m_course:
        raise HTTPException(503, "Class-12 model not loaded. Run train_models.py first.")

    stream_enc = safe_encode(enc_stream12, data.stream)
    pref_enc   = safe_encode(enc_pref12,   data.preferred_subject)
    overall12  = (data.marks_subject1 + data.marks_subject2 +
                  data.marks_subject3 + data.math_marks) / 4

    X = np.array([[stream_enc, data.marks_subject1, data.marks_subject2,
                   data.marks_subject3, data.math_marks, data.physics_marks,
                   data.bio_marks, overall12, pref_enc, data.skills_count]])

    pred_idx  = m_course.predict(X)[0]
    proba     = m_course.predict_proba(X)[0]
    course    = enc_course12.inverse_transform([pred_idx])[0]
    confidence= round(float(proba[pred_idx]) * 100, 1)

    class_probs = {
        enc_course12.inverse_transform([i])[0]: round(float(p) * 100, 1)
        for i, p in enumerate(proba)
    }

    next_steps = COURSE_NEXT.get(course, ["Research admission requirements"])

    result = {
        "predicted_course": course,
        "confidence_pct": confidence,
        "confidence_level": confidence_desc(confidence / 100),
        "all_course_probabilities": class_probs,
        "overall_percentage": round(overall12, 2),
        "next_steps": next_steps,
        "model_used": "Random Forest Classifier",
        "model_accuracy": model_metrics.get("class12_course", {}).get("accuracy_pct", "N/A"),
    }
    uid = data.user_id or str(uuid4())
    await save_prediction(uid, "class12", data.dict(), result)
    result["user_id"] = uid
    return result

# ──────────────────────────────────────────────────────────────────────────────
# PREDICT: College → Job Domain
# ──────────────────────────────────────────────────────────────────────────────
@app.post("/predict/domain")
async def predict_domain(data: CollegeInput):
    if not m_domain_dt:
        raise HTTPException(503, "College model not loaded. Run train_models.py first.")

    degree_enc = safe_encode(enc_degree, data.degree)
    X = np.array([[degree_enc, data.cgpa, data.skills_count, data.projects_count,
                   data.internships_count, data.certifications, data.active_backlogs]])

    # Decision Tree prediction
    pred_dt   = m_domain_dt.predict(X)[0]
    proba_dt  = m_domain_dt.predict_proba(X)[0]
    domain_dt = enc_domain.inverse_transform([pred_dt])[0]
    conf_dt   = round(float(proba_dt[pred_dt]) * 100, 1)

    # Logistic Regression prediction
    pred_lr   = m_domain_lr.predict(X)[0] if m_domain_lr else pred_dt
    domain_lr = enc_domain.inverse_transform([pred_lr])[0] if m_domain_lr else domain_dt
    proba_lr  = m_domain_lr.predict_proba(X)[0] if m_domain_lr else proba_dt
    conf_lr   = round(float(proba_lr[pred_lr]) * 100, 1) if m_domain_lr else conf_dt

    # Ensemble: pick higher confidence
    if conf_dt >= conf_lr:
        domain, confidence, model_name = domain_dt, conf_dt, "Decision Tree"
        proba_used = proba_dt
    else:
        domain, confidence, model_name = domain_lr, conf_lr, "Logistic Regression"
        proba_used = proba_lr

    class_probs = {
        enc_domain.inverse_transform([i])[0]: round(float(p) * 100, 1)
        for i, p in enumerate(proba_used)
    }

    recommended_skills = DOMAIN_SKILLS.get(domain, ["Communication", "Problem Solving"])

    backlog_warning = []
    if data.active_backlogs >= 3:
        backlog_warning = ["⚠️ Clear active backlogs to improve placement chances significantly."]

    result = {
        "predicted_domain": domain,
        "confidence_pct": confidence,
        "confidence_level": confidence_desc(confidence / 100),
        "model_used": f"{model_name} (ensemble)",
        "dt_prediction": {"domain": domain_dt, "confidence": conf_dt},
        "lr_prediction": {"domain": domain_lr, "confidence": conf_lr},
        "top_domains": class_probs,
        "recommended_skills": recommended_skills,
        "warnings": backlog_warning,
        "dt_accuracy":  model_metrics.get("college_domain", {}).get("dt_accuracy_pct", "N/A"),
        "lr_accuracy":  model_metrics.get("college_domain", {}).get("lr_accuracy_pct", "N/A"),
    }
    uid = data.user_id or str(uuid4())
    await save_prediction(uid, "college", data.dict(), result)
    result["user_id"] = uid
    return result

# ──────────────────────────────────────────────────────────────────────────────
# PREDICT: Salary projection
# ──────────────────────────────────────────────────────────────────────────────
@app.post("/predict/salary")
async def predict_salary_v2(data: CollegeInput):
    if not m_salary_rf:
        raise HTTPException(503, "Salary model not loaded. Run train_models.py first.")

    degree_enc = safe_encode(enc_degree, data.degree)
    X = np.array([[degree_enc, data.cgpa, data.skills_count, data.projects_count,
                   data.internships_count, data.certifications, data.active_backlogs]])

    sal_rf  = float(m_salary_rf.predict(X)[0])
    sal_lin = float(m_salary_lin.predict(X)[0]) if m_salary_lin else sal_rf
    base    = round((sal_rf + sal_lin) / 2, 2)

    growth_rates = [0, 0.18, 0.35, 0.55, 0.82, 1.15]
    projection   = [{"year": f"Year {i}", "salary_lpa": round(base * (1 + r), 2)}
                    for i, r in enumerate(growth_rates)]

    result = {
        "base_salary_lpa": base,
        "rf_prediction": round(sal_rf, 2),
        "linear_prediction": round(sal_lin, 2),
        "5_year_projection": projection,
        "rf_model_metrics": model_metrics.get("salary", {}).get("random_forest_regressor", {}),
        "linear_model_metrics": model_metrics.get("salary", {}).get("linear_regression", {}),
    }
    uid = data.user_id or str(uuid4())
    await save_prediction(uid, "salary", data.dict(), result)
    result["user_id"] = uid
    return result

# ──────────────────────────────────────────────────────────────────────────────
# POSITION ANALYSIS  →  percentile & readiness
# ──────────────────────────────────────────────────────────────────────────────
@app.post("/analyze/position")
def analyze_position(data: PositionInput):
    """
    Computes academic percentile, skill percentile, readiness score,
    and a comparative ranking message using historical dataset stats.
    """
    role = data.role.lower()

    # Load right dataset for comparison
    dataset_map = {
        "class10": "data/class10_students.csv",
        "class12": "data/class12_students.csv",
        "college": "data/college_students.csv",
        "graduate": "data/college_students.csv",
    }
    csv_path = os.path.join(BASE, dataset_map.get(role, "data/college_students.csv"))

    # Score column per dataset
    score_col_map = {
        "class10": "overall_percentage",
        "class12": "overall_percentage",
        "college": "cgpa",
        "graduate": "cgpa",
    }

    acad_pctile = 50.0
    skill_pctile = 50.0

    if os.path.exists(csv_path):
        df = pd.read_csv(csv_path)
        sc = score_col_map.get(role, "overall_percentage")
        if sc in df.columns:
            normalized = data.overall_score / 10 if role in ["college", "graduate"] else data.overall_score
            col_vals  = df[sc].dropna().values
            acad_pctile = round(float(np.mean(col_vals < normalized)) * 100, 1)

        sk_col = "skills_count"
        if sk_col in df.columns:
            sk_vals  = df[sk_col].dropna().values
            skill_pctile = round(float(np.mean(sk_vals < data.skills_count)) * 100, 1)

    # Readiness score (composite)
    readiness = round(
        acad_pctile * 0.5 + skill_pctile * 0.3 + min(data.extra_score, 100) * 0.2,
        1
    )

    # Ranking category
    if acad_pctile >= 80:
        rank_label = "Top 20%"
        rank_msg   = "🏆 You are in the top 20% of students at your level!"
    elif acad_pctile >= 60:
        rank_label = "Top 40%"
        rank_msg   = "⭐ You are performing above average — keep it up!"
    elif acad_pctile >= 40:
        rank_label = "Middle 40%"
        rank_msg   = "📈 You are in the middle range. Focus on key weak areas."
    else:
        rank_label = "Needs Improvement"
        rank_msg   = "💪 You have room to grow. Consistent effort will move you up!"

    strengths = []
    areas_to_improve = []
    if acad_pctile >= 70:
        strengths.append("Strong academic performance")
    else:
        areas_to_improve.append("Improve subject-wise scores through practice tests")
    if skill_pctile >= 70:
        strengths.append("Above-average skill set")
    else:
        areas_to_improve.append("Add more certifications and practical skills")
    if data.extra_score >= 70:
        strengths.append("Excellent project/internship record")
    elif data.extra_score > 0:
        areas_to_improve.append("Take up more hands-on projects or internships")

    return {
        "academic_percentile": acad_pctile,
        "skill_percentile": skill_pctile,
        "readiness_score": readiness,
        "ranking_label": rank_label,
        "ranking_message": rank_msg,
        "strengths": strengths,
        "areas_to_improve": areas_to_improve,
        "compared_to": f"Historical dataset of {role} students",
    }

# ──────────────────────────────────────────────────────────────────────────────
# SENIORS MATCH  →  motivation engine
# ──────────────────────────────────────────────────────────────────────────────
@app.post("/seniors/match")
def match_seniors(data: SeniorMatchInput):
    if alumni_df.empty:
        raise HTTPException(503, "Alumni dataset not loaded. Run generate_data.py first.")

    df = alumni_df.copy()

    # Weight-based similarity score
    df["sim_score"] = (
        (1 - abs(df["class10_percentage"] - data.class10_percentage) / 100) * 0.35
        + (df["stream_class12"] == data.stream).astype(float) * 0.25
        + (1 - abs(df["cgpa"] - data.cgpa) / 10) * 0.20
        + (1 - abs(df["skills_count"] - data.skills_count) / 12) * 0.20
    )

    top = df.nlargest(data.top_n, "sim_score").reset_index(drop=True)

    seniors = []
    for _, row in top.iterrows():
        seniors.append({
            "name": row["name"],
            "class10_percentage": row["class10_percentage"],
            "stream": row["stream_class12"],
            "degree": row["degree"],
            "cgpa": row["cgpa"],
            "current_company": row["current_company"],
            "current_domain": row["current_domain"],
            "current_salary_lpa": row["current_salary_lpa"],
            "years_of_experience": int(row["years_of_experience"]),
            "success_story": row["success_story"],
            "similarity_pct": round(float(row["sim_score"]) * 100, 1),
        })

    return {
        "matched_seniors": seniors,
        "motivation_note": (
            f"These {len(seniors)} alumni had similar profiles to you when they were students. "
            "Their journey can be your roadmap!"
        ),
    }

# ──────────────────────────────────────────────────────────────────────────────
# LIFECYCLE  →  roadmap data
# ──────────────────────────────────────────────────────────────────────────────
LIFECYCLE_DATA = {
    "class10": {
        "stages": [
            {"step": 1, "title": "Class 10 Board Exams",        "status": "current", "icon": "📚"},
            {"step": 2, "title": "Stream Selection",             "status": "upcoming", "icon": "🔀"},
            {"step": 3, "title": "Class 11 – 12 Studies",        "status": "upcoming", "icon": "📖"},
            {"step": 4, "title": "Entrance Exam Preparation",    "status": "upcoming", "icon": "✏️"},
            {"step": 5, "title": "Degree Admission",              "status": "upcoming", "icon": "🎓"},
            {"step": 6, "title": "Skill Development & Internship","status": "upcoming", "icon": "💡"},
            {"step": 7, "title": "Placement / Job",               "status": "upcoming", "icon": "💼"},
            {"step": 8, "title": "Career Growth",                 "status": "upcoming", "icon": "🚀"},
        ],
        "current_tip": "Focus on boards. Your stream choice now shapes your entire career.",
    },
    "class12": {
        "stages": [
            {"step": 1, "title": "Class 10 ✓",                    "status": "done",    "icon": "✅"},
            {"step": 2, "title": "Stream Selected ✓",             "status": "done",    "icon": "✅"},
            {"step": 3, "title": "Class 12 Board Exams",           "status": "current", "icon": "📚"},
            {"step": 4, "title": "Entrance Exam (JEE/NEET/CUET)",  "status": "upcoming", "icon": "✏️"},
            {"step": 5, "title": "Degree Admission",               "status": "upcoming", "icon": "🎓"},
            {"step": 6, "title": "Skill Development & Internship", "status": "upcoming", "icon": "💡"},
            {"step": 7, "title": "Placement / Job",                "status": "upcoming", "icon": "💼"},
            {"step": 8, "title": "Career Growth",                  "status": "upcoming", "icon": "🚀"},
        ],
        "current_tip": "Board + entrance prep simultaneously. Target 85%+ for top colleges.",
    },
    "college": {
        "stages": [
            {"step": 1, "title": "School Completed ✓",            "status": "done",    "icon": "✅"},
            {"step": 2, "title": "Degree in Progress",            "status": "current", "icon": "🎓"},
            {"step": 3, "title": "Internship / Projects",          "status": "upcoming", "icon": "💡"},
            {"step": 4, "title": "Placement Drive",                "status": "upcoming", "icon": "💼"},
            {"step": 5, "title": "First Job",                      "status": "upcoming", "icon": "🏢"},
            {"step": 6, "title": "Career Growth (2-5 years)",      "status": "upcoming", "icon": "📈"},
            {"step": 7, "title": "Senior / Lead Role",             "status": "upcoming", "icon": "🚀"},
        ],
        "current_tip": "Maintain 7.5+ CGPA, do 2+ internships, and build a strong GitHub profile.",
    },
    "graduate": {
        "stages": [
            {"step": 1, "title": "Degree Completed ✓",            "status": "done",    "icon": "✅"},
            {"step": 2, "title": "Job Hunting",                    "status": "current", "icon": "🔍"},
            {"step": 3, "title": "First Job",                      "status": "upcoming", "icon": "🏢"},
            {"step": 4, "title": "Skill Upskilling (Year 1-2)",    "status": "upcoming", "icon": "📚"},
            {"step": 5, "title": "Promotion / Role Switch",        "status": "upcoming", "icon": "📈"},
            {"step": 6, "title": "Senior / Lead Role",             "status": "upcoming", "icon": "🚀"},
            {"step": 7, "title": "Management / Expert Track",      "status": "upcoming", "icon": "🏆"},
        ],
        "current_tip": "Apply to 30+ jobs/week. Tailor your resume. Practice DSA daily.",
    },
}

@app.get("/lifecycle/{role}")
def get_lifecycle(role: str):
    role = role.lower()
    data = LIFECYCLE_DATA.get(role)
    if not data:
        raise HTTPException(404, f"No lifecycle data for role: {role}")
    return data

# ──────────────────────────────────────────────────────────────────────────────
# LEGACY  backward-compatible endpoints
# ──────────────────────────────────────────────────────────────────────────────
@app.post("/predict-salary")
def predict_salary_legacy(profile: OldProfile):
    if not m_salary_old:
        raise HTTPException(503, "Legacy salary model not loaded.")
    features = np.array([[profile.stage, profile.stream, profile.marks, profile.skills_count]])
    base_pred = float(m_salary_old.predict(features)[0])
    return {
        "year_1_salary": round(base_pred, 2),
        "year_3_salary": round(base_pred * 1.35, 2),
        "year_5_salary": round(base_pred * 1.85, 2),
    }

@app.post("/predict-career")
def predict_career_legacy(profile: OldProfile):
    if not m_success_old or not m_salary_old:
        raise HTTPException(503, "Legacy models not loaded.")
    features = np.array([[profile.stage, profile.stream, profile.marks, profile.skills_count]])
    success_prob = float(m_success_old.predict_proba(features)[0][1]) * 100
    return {
        "success_probability": round(success_prob, 2),
        "recommended_skills": ["Python", "Data Analysis", "Cloud Computing"] if profile.stream in [2, 3] else ["Communication", "Management"],
        "missing_skills": ["Machine Learning", "System Design"] if profile.skills_count < 5 else ["Leadership"],
        "time_to_achieve": f"{5 - profile.stage} years",
        "risk_score": max(10, 100 - (profile.marks + profile.skills_count * 5)),
    }

@app.post("/get-simulation-data")
def get_simulation_data_legacy(profile: OldProfile):
    sal = predict_salary_legacy(profile)
    car = predict_career_legacy(profile)
    return {
        "salary_growth": [
            {"year": "Year 1", "salary": sal["year_1_salary"]},
            {"year": "Year 3", "salary": sal["year_3_salary"]},
            {"year": "Year 5", "salary": sal["year_5_salary"]},
        ],
        "career_insights": car,
        "input_profile": profile.dict(),
    }

@app.post("/compare-careers")
def compare_careers_legacy(data: OldComparison):
    return {
        "path_1": get_simulation_data_legacy(data.profile1),
        "path_2": get_simulation_data_legacy(data.profile2),
    }
