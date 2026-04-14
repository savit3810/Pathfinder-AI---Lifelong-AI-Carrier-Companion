"""
train_models.py  (replaces train_model.py)
Trains 4 ML models for PathFinder AI:
  1. class10_stream_model   Random Forest Classifier  (Class 10  stream)
  2. class12_course_model   Random Forest Classifier  (Class 12  course)
  3. college_domain_model   Decision Tree Classifier  (college  domain)
  4. salary_model           Linear Regression          (features  LPA)

All models, encoders and metrics are saved to backend/models/
"""
import os, json, pickle
import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestClassifier, RandomForestRegressor
from sklearn.tree import DecisionTreeClassifier
from sklearn.linear_model import LogisticRegression, LinearRegression
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
from sklearn.metrics import (
    accuracy_score, classification_report,
    mean_absolute_error, r2_score
)

os.makedirs("models", exist_ok=True)
os.makedirs("data",   exist_ok=True)

metrics_all = {}

#  helpers 
def save_model(obj, name):
    path = f"models/{name}.pkl"
    with open(path, "wb") as f:
        pickle.dump(obj, f)
    print(f"   Saved {path}")

def load_csv(name):
    path = f"data/{name}.csv"
    if not os.path.exists(path):
        raise FileNotFoundError(f"Dataset not found: {path}. Run generate_data.py first.")
    return pd.read_csv(path)


# 
# MODEL 1: Class 10  Stream  (Random Forest Classifier)
# 
print("\n[1/4] Training Class-10 Stream Predictor (Random Forest)")
df10 = load_csv("class10_students")

le_stream = LabelEncoder()
y10 = le_stream.fit_transform(df10["recommended_stream"])
X10 = df10[["math_marks", "science_marks", "english_marks", "social_marks",
             "hindi_marks", "overall_percentage",
             "tech_interest", "commerce_interest", "art_interest"]]

X10_tr, X10_te, y10_tr, y10_te = train_test_split(X10, y10, test_size=0.2, random_state=42)
m_stream = RandomForestClassifier(n_estimators=200, max_depth=12, random_state=42)
m_stream.fit(X10_tr, y10_tr)
y10_pred = m_stream.predict(X10_te)
acc10 = round(accuracy_score(y10_te, y10_pred) * 100, 2)
print(f"  Accuracy: {acc10}%")
print(classification_report(y10_te, y10_pred, target_names=le_stream.classes_))

save_model(m_stream,  "class10_stream_model")
save_model(le_stream, "class10_stream_encoder")
metrics_all["class10_stream"] = {
    "model": "Random Forest Classifier",
    "accuracy_pct": acc10,
    "classes": le_stream.classes_.tolist(),
    "n_estimators": 200,
    "features": X10.columns.tolist(),
}

# 
# MODEL 2: Class 12  Degree/Course  (Random Forest Classifier)
# 
print("\n[2/4] Training Class-12 Course Predictor (Random Forest)")
df12 = load_csv("class12_students")

le_stream12  = LabelEncoder()
le_pref12    = LabelEncoder()
le_course12  = LabelEncoder()

df12["stream_enc"] = le_stream12.fit_transform(df12["stream"])
df12["pref_enc"]   = le_pref12.fit_transform(df12["preferred_subject"])
y12 = le_course12.fit_transform(df12["recommended_course"])
X12 = df12[["stream_enc", "marks_subject1", "marks_subject2", "marks_subject3",
             "math_marks", "physics_marks", "bio_marks",
             "overall_percentage", "pref_enc", "skills_count"]]

X12_tr, X12_te, y12_tr, y12_te = train_test_split(X12, y12, test_size=0.2, random_state=42)
m_course = RandomForestClassifier(n_estimators=200, max_depth=14, random_state=42)
m_course.fit(X12_tr, y12_tr)
y12_pred = m_course.predict(X12_te)
acc12 = round(accuracy_score(y12_te, y12_pred) * 100, 2)
print(f"  Accuracy: {acc12}%")

save_model(m_course,    "class12_course_model")
save_model(le_stream12, "class12_stream_encoder")
save_model(le_pref12,   "class12_pref_encoder")
save_model(le_course12, "class12_course_encoder")
metrics_all["class12_course"] = {
    "model": "Random Forest Classifier",
    "accuracy_pct": acc12,
    "classes": le_course12.classes_.tolist(),
    "n_estimators": 200,
    "features": X12.columns.tolist(),
}

# 
# MODEL 3: College  Job Domain  (Decision Tree + LR ensemble)
# 
print("\n[3/4] Training College Domain Predictor (Decision Tree + Logistic Regression)")
df_col = load_csv("college_students")

le_deg    = LabelEncoder()
le_dom    = LabelEncoder()
df_col["degree_enc"] = le_deg.fit_transform(df_col["degree"])
y_col = le_dom.fit_transform(df_col["recommended_domain"])
X_col = df_col[["degree_enc", "cgpa", "skills_count", "projects_count",
                 "internships_count", "certifications", "active_backlogs"]]

Xc_tr, Xc_te, yc_tr, yc_te = train_test_split(X_col, y_col, test_size=0.2, random_state=42)

# Decision Tree
m_dt = DecisionTreeClassifier(max_depth=16, random_state=42)
m_dt.fit(Xc_tr, yc_tr)
dt_acc = round(accuracy_score(yc_te, m_dt.predict(Xc_te)) * 100, 2)

# Logistic Regression (complementary)
m_lr_cls = LogisticRegression(max_iter=1000, random_state=42)
m_lr_cls.fit(Xc_tr, yc_tr)
lr_acc = round(accuracy_score(yc_te, m_lr_cls.predict(Xc_te)) * 100, 2)

print(f"  Decision Tree Accuracy: {dt_acc}%")
print(f"  Logistic Regression Accuracy: {lr_acc}%")

save_model(m_dt,      "college_domain_model_dt")
save_model(m_lr_cls,  "college_domain_model_lr")
save_model(le_deg,    "college_degree_encoder")
save_model(le_dom,    "college_domain_encoder")
metrics_all["college_domain"] = {
    "model_dt": "Decision Tree Classifier",
    "model_lr": "Logistic Regression",
    "dt_accuracy_pct": dt_acc,
    "lr_accuracy_pct": lr_acc,
    "classes": le_dom.classes_.tolist(),
    "features": X_col.columns.tolist(),
}

# 
# MODEL 4: Salary Prediction  (Linear Regression + Random Forest Regressor)
# 
print("\n[4/4] Training Salary Predictor (Linear + Random Forest Regressor)")
# Use college data (salary target)
y_sal = df_col["expected_salary_lpa"]

Xs_tr, Xs_te, ys_tr, ys_te = train_test_split(X_col, y_sal, test_size=0.2, random_state=42)

m_linreg = LinearRegression()
m_linreg.fit(Xs_tr, ys_tr)
ylin_pred = m_linreg.predict(Xs_te)
mae_lin = round(mean_absolute_error(ys_te, ylin_pred), 3)
r2_lin  = round(r2_score(ys_te, ylin_pred), 4)

m_rfreg = RandomForestRegressor(n_estimators=200, max_depth=12, random_state=42)
m_rfreg.fit(Xs_tr, ys_tr)
yrf_pred = m_rfreg.predict(Xs_te)
mae_rf = round(mean_absolute_error(ys_te, yrf_pred), 3)
r2_rf  = round(r2_score(ys_te, yrf_pred), 4)

print(f"  Linear Regression   MAE: {mae_lin} LPA | R: {r2_lin}")
print(f"  RF Regressor        MAE: {mae_rf} LPA | R: {r2_rf}")

save_model(m_linreg, "salary_linear_model")
save_model(m_rfreg,  "salary_rf_model")
# keep backward-compat name
save_model(m_rfreg,  "../salary_model")   # old path still working
metrics_all["salary"] = {
    "linear_regression": {"mae_lpa": mae_lin, "r2": r2_lin},
    "random_forest_regressor": {"mae_lpa": mae_rf, "r2": r2_rf},
    "features": X_col.columns.tolist(),
}

#  Save legacy success model  
# Create a simple success classifier on college data for backward-compat API
print("\n[+] Creating legacy success model (backward-compat)")
y_succ = (y_sal >= 6.0).astype(int)
m_succ = RandomForestClassifier(n_estimators=100, random_state=42)
m_succ.fit(Xs_tr, (ys_tr >= 6.0).astype(int))
save_model(m_succ, "../success_model")

#  Save all metrics 
with open("models/model_metrics.json", "w") as f:
    json.dump(metrics_all, f, indent=2)
print("\n  All 4 models trained & saved to backend/models/")
print("  Metrics saved to backend/models/model_metrics.json")
print(json.dumps(metrics_all, indent=2))

