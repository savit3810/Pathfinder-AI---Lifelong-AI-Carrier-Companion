import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestRegressor, RandomForestClassifier
from sklearn.model_selection import train_test_split
import pickle
import os

print("Generating dataset...")
np.random.seed(42)
n_samples = 5000

# Features
# stage: 0=10th, 1=12th, 2=college/grad
stage = np.random.randint(0, 3, n_samples)
# stream: 0=arts, 1=commerce, 2=science, 3=computer_science
stream = np.random.randint(0, 4, n_samples)
# marks: 40 to 100
marks = np.random.randint(40, 101, n_samples)
# skills count: 0 to 10
skills_count = np.random.randint(0, 11, n_samples)

# Targets
# Salary growth logic based on features
base_salary = 300000 # 3 LPA base in INR maybe
salary = base_salary + (stage * 100000) + (stream * 50000) + (marks * 2000) + (skills_count * 30000)
# Add some noise
salary = salary + np.random.normal(0, 50000, n_samples)

# Success probability: higher marks and skills mean higher success 
success_score = (marks * 0.4) + (skills_count * 6) + (stream * 5)
# threshold for success = 70
success = (success_score + np.random.normal(0, 10, n_samples) > 65).astype(int)

df = pd.DataFrame({
    'stage': stage,
    'stream': stream,
    'marks': marks,
    'skills_count': skills_count,
    'salary': salary,
    'success': success
})

X = df[['stage', 'stream', 'marks', 'skills_count']]
y_salary = df['salary']
y_success = df['success']

print("Training Models...")
# Salary Model
X_train, X_test, y_train, y_test = train_test_split(X, y_salary, test_size=0.2, random_state=42)
salary_model = RandomForestRegressor(n_estimators=100, random_state=42)
salary_model.fit(X_train, y_train)

# Success Model
X_train_c, X_test_c, y_train_c, y_test_c = train_test_split(X, y_success, test_size=0.2, random_state=42)
success_model = RandomForestClassifier(n_estimators=100, random_state=42)
success_model.fit(X_train_c, y_train_c)

print("Saving models...")
with open('salary_model.pkl', 'wb') as f:
    pickle.dump(salary_model, f)

with open('success_model.pkl', 'wb') as f:
    pickle.dump(success_model, f)

print("Models saved successfully to backend/salary_model.pkl and backend/success_model.pkl!")
