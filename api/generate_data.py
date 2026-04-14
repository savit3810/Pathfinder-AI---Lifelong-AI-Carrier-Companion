"""
generate_data.py
Generates realistic historical student datasets for PathFinder AI ML models.
Produces three CSVs and an alumni dataset in the backend/data/ directory.
"""
import os
import numpy as np
import pandas as pd

np.random.seed(42)
os.makedirs("data", exist_ok=True)

# ─────────────────────────────────────────────────────────────────────────────
# Helpers
# ─────────────────────────────────────────────────────────────────────────────
NAMES = [
    "Aarav", "Priya", "Rahul", "Sneha", "Arjun", "Meera", "Vikram", "Divya",
    "Riya", "Karan", "Ananya", "Rohan", "Pooja", "Sachin", "Kavya", "Nikhil",
    "Shreya", "Aditya", "Naina", "Suresh", "Tanvi", "Harsh", "Ishaan", "Simran",
    "Manav", "Preeti", "Yash", "Swati", "Dev", "Anjali"
]
COMPANIES = ["TCS", "Infosys", "Wipro", "Google", "Amazon", "Microsoft", "Accenture",
             "Deloitte", "HCL", "Tech Mahindra", "Flipkart", "Zomato", "Paytm",
             "CEAT", "Kotak Bank", "HDFC", "Cipla", "Sun Pharma", "KPMG", "EY"]
DOMAINS   = ["Software Engineering", "Data Science", "Full Stack Development",
             "Cybersecurity", "Product Management", "AI/ML Engineering",
             "Business Analytics", "Finance", "Healthcare IT", "Digital Marketing",
             "Cloud Architecture", "DevOps", "Embedded Systems", "UI/UX Design"]

def random_name():
    return np.random.choice(NAMES) + " " + np.random.choice(NAMES)

# ─────────────────────────────────────────────────────────────────────────────
# 1. CLASS 10 DATASET  →  stream prediction
# ─────────────────────────────────────────────────────────────────────────────
N10 = 3000
math10      = np.random.randint(40, 101, N10).astype(float)
science10   = np.random.randint(40, 101, N10).astype(float)
english10   = np.random.randint(40, 101, N10).astype(float)
social10    = np.random.randint(40, 101, N10).astype(float)
hindi10     = np.random.randint(40, 101, N10).astype(float)
art_interest   = np.random.randint(0, 11, N10)   # 0-10 scale
tech_interest  = np.random.randint(0, 11, N10)
commerce_int   = np.random.randint(0, 11, N10)
overall10   = (math10 + science10 + english10 + social10 + hindi10) / 5

# Stream logic: Science if strong in math+science; Commerce if commerce_int high; else Arts
stream_score = (
    (math10 * 0.3 + science10 * 0.3 + tech_interest * 3)    # science weight
    - (commerce_int * 2.5)                                    # commerce pull
    - (art_interest * 1.5)                                    # arts pull
    + np.random.normal(0, 8, N10)
)
streams = np.where(stream_score > 15, "Science",
          np.where((stream_score > -10) & (commerce_int > 5), "Commerce", "Arts"))

df10 = pd.DataFrame({
    "student_id": [f"S10-{i:04d}" for i in range(N10)],
    "name": [random_name() for _ in range(N10)],
    "math_marks": math10,
    "science_marks": science10,
    "english_marks": english10,
    "social_marks": social10,
    "hindi_marks": hindi10,
    "overall_percentage": np.round(overall10, 2),
    "tech_interest": tech_interest,
    "commerce_interest": commerce_int,
    "art_interest": art_interest,
    "recommended_stream": streams,
})
df10.to_csv("data/class10_students.csv", index=False)
print(f"[OK] class10_students.csv -- {N10} records | Distribution: {pd.Series(streams).value_counts().to_dict()}")

# ─────────────────────────────────────────────────────────────────────────────
# 2. CLASS 12 DATASET  →  degree/course prediction
# ─────────────────────────────────────────────────────────────────────────────
N12 = 3000
stream12   = np.random.choice(["Science", "Commerce", "Arts"], N12, p=[0.5, 0.3, 0.2])
marks12_1  = np.random.randint(45, 100, N12).astype(float)
marks12_2  = np.random.randint(45, 100, N12).astype(float)
marks12_3  = np.random.randint(45, 100, N12).astype(float)
math12     = np.where(stream12 == "Arts",
                      np.random.randint(40, 75, N12),
                      np.random.randint(50, 100, N12)).astype(float)
physics12  = np.where(stream12 == "Science",
                      np.random.randint(50, 100, N12),
                      np.random.randint(30, 70, N12)).astype(float)
bio12      = np.random.randint(40, 100, N12).astype(float)
overall12  = (marks12_1 + marks12_2 + marks12_3 + math12) / 4

# Preferred subjects
pref_list  = ["Mathematics", "Biology", "Economics", "Computer Science", "History", "Business Studies"]
pref_subj  = [np.random.choice(pref_list) for _ in range(N12)]

# Skills at class12 level
skills12_count = np.random.randint(1, 8, N12)

# Course recommendation logic
def recommend_course(s, m, p, b, o, pref):
    if s == "Science":
        if m >= 75 and pref in ["Mathematics", "Computer Science"]:
            return "Engineering"
        if b >= 70 and p >= 65:
            return "Medical (MBBS)"
        if m >= 60:
            return "B.Sc Computer Science"
        return "B.Sc General Science"
    elif s == "Commerce":
        if m >= 70:
            return "CA / CMA"
        if o >= 65:
            return "BBA / MBA"
        return "B.Com"
    else:  # Arts
        if pref == "History":
            return "BA History / UPSC"
        return "BA / Mass Communication"

courses12 = [recommend_course(stream12[i], math12[i], physics12[i], bio12[i],
                               overall12[i], pref_subj[i]) for i in range(N12)]

df12 = pd.DataFrame({
    "student_id": [f"S12-{i:04d}" for i in range(N12)],
    "name": [random_name() for _ in range(N12)],
    "stream": stream12,
    "marks_subject1": np.round(marks12_1, 1),
    "marks_subject2": np.round(marks12_2, 1),
    "marks_subject3": np.round(marks12_3, 1),
    "math_marks": np.round(math12, 1),
    "physics_marks": np.round(physics12, 1),
    "bio_marks": np.round(bio12, 1),
    "overall_percentage": np.round(overall12, 2),
    "preferred_subject": pref_subj,
    "skills_count": skills12_count,
    "recommended_course": courses12,
})
df12.to_csv("data/class12_students.csv", index=False)
print(f"[OK] class12_students.csv -- {N12} records | Distribution: {pd.Series(courses12).value_counts().to_dict()}")

# ─────────────────────────────────────────────────────────────────────────────
# 3. COLLEGE STUDENT DATASET  →  job domain prediction
# ─────────────────────────────────────────────────────────────────────────────
NC = 3000
degree_col = np.random.choice(
    ["B.Tech / B.E.", "BCA", "B.Sc CS", "B.Com", "MBA", "B.Sc General", "BA"],
    NC, p=[0.35, 0.15, 0.15, 0.10, 0.10, 0.10, 0.05]
)
cgpa        = np.random.uniform(5.0, 10.0, NC).round(2)
skills_c    = np.random.randint(2, 12, NC)
projects    = np.random.randint(0, 6, NC)
internships = np.random.randint(0, 4, NC)
cert_count  = np.random.randint(0, 8, NC)
backlogs    = np.random.randint(0, 5, NC)

# Domain logic
def pick_domain(deg, cg, sk, pr, it, cert, bl):
    base = "Software Engineering"
    if deg in ["B.Tech / B.E.", "BCA", "B.Sc CS"]:
        if cg >= 8.5 and sk >= 8:
            return "Data Science" if np.random.rand() > 0.4 else "AI/ML Engineering"
        if cg >= 7.5 and sk >= 6:
            return "Full Stack Development"
        if cert >= 5:
            return "Cloud Architecture"
        if it >= 2:
            return "DevOps"
        return "Software Engineering"
    elif deg in ["B.Com", "MBA"]:
        if cg >= 8.0:
            return "Business Analytics"
        return "Finance"
    elif deg == "BA":
        return "Digital Marketing"
    elif deg == "B.Sc General":
        return "Healthcare IT"
    return base

domains_c = [pick_domain(degree_col[i], cgpa[i], skills_c[i], projects[i],
                          internships[i], cert_count[i], backlogs[i]) for i in range(NC)]

# Salary logic (LPA)
base_sal = np.where(np.isin(degree_col, ["B.Tech / B.E.", "BCA"]), 5.0, 3.5)
salary_c = (base_sal + cgpa * 0.8 + skills_c * 0.3 + projects * 0.2
            + internships * 0.5 - backlogs * 0.3
            + np.random.normal(0, 0.8, NC)).clip(2.5, 30.0).round(2)

df_col = pd.DataFrame({
    "student_id": [f"UC-{i:04d}" for i in range(NC)],
    "name": [random_name() for _ in range(NC)],
    "degree": degree_col,
    "cgpa": cgpa,
    "skills_count": skills_c,
    "projects_count": projects,
    "internships_count": internships,
    "certifications": cert_count,
    "active_backlogs": backlogs,
    "recommended_domain": domains_c,
    "expected_salary_lpa": salary_c,
})
df_col.to_csv("data/college_students.csv", index=False)
print(f"[OK] college_students.csv -- {NC} records | Domains: {pd.Series(domains_c).value_counts().to_dict()}")

# ─────────────────────────────────────────────────────────────────────────────
# 4. ALUMNI / SENIOR SUCCESS DATASET  →  motivation engine
# ─────────────────────────────────────────────────────────────────────────────
NA = 500
alumni_names      = [random_name() for _ in range(NA)]
alumni_class10pct = np.random.randint(50, 96, NA).astype(float)
alumni_stream12   = np.random.choice(["Science", "Commerce", "Arts"], NA)
alumni_degree     = np.random.choice(["B.Tech", "MBBS", "BBA", "CA", "B.Sc CS", "BA", "MBA"], NA)
alumni_cgpa       = np.random.uniform(5.5, 9.8, NA).round(2)
alumni_skills     = np.random.randint(3, 13, NA)
alumni_company    = [np.random.choice(COMPANIES) for _ in range(NA)]
alumni_domain     = [np.random.choice(DOMAINS) for _ in range(NA)]
alumni_yoe        = np.random.randint(1, 12, NA)
# Salary: base on domain prestige + yoe
domain_sal = {d: round(6 + i * 0.5, 1) for i, d in enumerate(DOMAINS)}
alumni_salary = np.array([
    max(4, round(domain_sal[alumni_domain[i]] + alumni_yoe[i] * 0.8
                 + (alumni_cgpa[i] - 7) * 0.5, 2))
    for i in range(NA)
])
alumni_story = [
    f"{alumni_names[i].split()[0]} started with {alumni_class10pct[i]}% in Class 10, "
    f"chose {alumni_stream12[i]}, completed {alumni_degree[i]} with {alumni_cgpa[i]} CGPA, "
    f"and now works as {alumni_domain[i]} at {alumni_company[i]} earning ₹{alumni_salary[i]} LPA."
    for i in range(NA)
]

df_alumni = pd.DataFrame({
    "alumni_id": [f"AL-{i:04d}" for i in range(NA)],
    "name": alumni_names,
    "class10_percentage": alumni_class10pct,
    "stream_class12": alumni_stream12,
    "degree": alumni_degree,
    "cgpa": alumni_cgpa,
    "skills_count": alumni_skills,
    "current_company": alumni_company,
    "current_domain": alumni_domain,
    "years_of_experience": alumni_yoe,
    "current_salary_lpa": alumni_salary,
    "success_story": alumni_story,
})
df_alumni.to_csv("data/alumni_seniors.csv", index=False)
print(f"[OK] alumni_seniors.csv -- {NA} records")

print("\n[DONE] All datasets generated in backend/data/")
