const API_BASE = "http://localhost:8000";

let currentStage = null;
let currentChart = null;

// DOM Elements
const stageBtns = document.querySelectorAll('.btn-stage');
const inputForms = document.getElementById('input-forms');
const formTitle = document.getElementById('form-title');
const loader = document.getElementById('loader');
const dashboard = document.getElementById('results-dashboard');

const forms = {
    class10: document.getElementById('form-class10'),
    class12: document.getElementById('form-class12'),
    college: document.getElementById('form-college')
};

// Toggle forms
stageBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        // Active class toggle
        stageBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        currentStage = btn.dataset.stage;
        
        // Show container
        inputForms.classList.remove('hidden');
        dashboard.classList.add('hidden');
        
        // Hide all forms
        Object.values(forms).forEach(f => f.classList.add('hidden'));
        
        // Show clicked form
        forms[currentStage].classList.remove('hidden');
        formTitle.textContent = `Enter ${btn.textContent} Details`;
    });
});

// Form Submissions
forms.class10.addEventListener('submit', async (e) => {
    e.preventDefault();
    const data = {
        math_marks: parseFloat(e.target.math_marks.value),
        science_marks: parseFloat(e.target.science_marks.value),
        english_marks: parseFloat(e.target.english_marks.value),
        social_marks: 60,
        hindi_marks: 60,
        tech_interest: parseInt(e.target.tech_interest.value),
        commerce_interest: parseInt(e.target.commerce_interest.value),
        art_interest: parseInt(e.target.art_interest.value),
    };
    await processPipeline('/predict/stream', data, "class10", {
        role: "class10",
        overall_score: (data.math_marks + data.science_marks + data.english_marks)/3,
        skills_count: 0
    });
});

forms.class12.addEventListener('submit', async (e) => {
    e.preventDefault();
    const data = {
        stream: e.target.stream.value,
        marks_subject1: parseFloat(e.target.marks_subject1.value),
        marks_subject2: parseFloat(e.target.marks_subject2.value),
        marks_subject3: parseFloat(e.target.marks_subject3.value),
        math_marks: 60,
        physics_marks: 60,
        bio_marks: 60,
        preferred_subject: e.target.preferred_subject.value,
        skills_count: parseInt(e.target.skills_count.value),
    };
    await processPipeline('/predict/course', data, "class12", {
        role: "class12",
        overall_score: (data.marks_subject1 + data.marks_subject2 + data.marks_subject3)/3,
        skills_count: data.skills_count
    });
});

forms.college.addEventListener('submit', async (e) => {
    e.preventDefault();
    const data = {
        degree: e.target.degree.value,
        cgpa: parseFloat(e.target.cgpa.value),
        skills_count: parseInt(e.target.skills_count.value),
        projects_count: parseInt(e.target.projects_count.value),
        internships_count: parseInt(e.target.internships_count.value),
        active_backlogs: parseInt(e.target.active_backlogs.value)
    };
    await processPipeline('/predict/domain', data, "college", {
        role: "college",
        overall_score: data.cgpa,
        skills_count: data.skills_count,
        extra_score: data.cgpa * 10
    });
});

async function processPipeline(endpoint, inputData, stageRole, positionData) {
    // Show Loading
    inputForms.classList.add('hidden');
    dashboard.classList.add('hidden');
    loader.classList.remove('hidden');

    try {
        // 1. Prediction API
        const predRes = await fetch(`${API_BASE}${endpoint}`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(inputData)
        });
        const prediction = await predRes.json();

        // 2. Position API
        const posRes = await fetch(`${API_BASE}/analyze/position`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(positionData)
        });
        const position = await posRes.json();

        // 3. Seniors API
        const senRes = await fetch(`${API_BASE}/seniors/match`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                class10_percentage: positionData.overall_score > 10 ? positionData.overall_score : positionData.overall_score*10,
                stream: inputData.stream || "Science",
                cgpa: inputData.cgpa || 7.0,
                skills_count: positionData.skills_count,
                top_n: 2
            })
        });
        const seniors = await senRes.json();

        // 4. Lifecycle API
        const lifeRes = await fetch(`${API_BASE}/lifecycle/${stageRole}`);
        const lifecycle = await lifeRes.json();

        // If college, get Salary projection
        let salary = null;
        if (stageRole === 'college') {
            const salRes = await fetch(`${API_BASE}/predict/salary`, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(inputData)
            });
            salary = await salRes.json();
        }

        renderDashboard(prediction, position, seniors, lifecycle, salary, stageRole);

    } catch (err) {
        console.error(err);
        alert("Failed to analyze data. Make sure backend is running on :8000");
    } finally {
        loader.classList.add('hidden');
    }
}

function renderDashboard(pred, pos, sen, life, sal, role) {
    dashboard.classList.remove('hidden');

    // Main Pred
    const titleObj = {
        class10: pred.predicted_stream,
        class12: pred.predicted_course,
        college: pred.predicted_domain
    };
    
    document.getElementById('main-prediction-title').textContent = titleObj[role];
    const confBar = document.getElementById('confidence-bar');
    confBar.style.width = `${pred.confidence_pct}%`;
    document.getElementById('confidence-text').textContent = `Confidence: ${pred.confidence_pct}%`;

    // Position
    document.getElementById('acad-percentile').textContent = `${pos.academic_percentile}%`;
    document.getElementById('skill-percentile').textContent = `${pos.skill_percentile}%`;
    document.getElementById('readiness-score').textContent = `${pos.readiness_score}`;
    document.getElementById('ranking-message').innerHTML = `<strong>${pos.ranking_label}</strong>: ${pos.ranking_message}`;

    // Seniors
    document.getElementById('motivation-note').textContent = sen.motivation_note;
    const senList = document.getElementById('seniors-list');
    senList.innerHTML = sen.matched_seniors.map(s => `
        <div class="senior-card">
            <strong>${s.name}</strong> • ${s.similarity_pct}% Match
            <p>"${s.success_story}"</p>
        </div>
    `).join('');

    // Lifecycle
    const lifeList = document.getElementById('lifecycle-timeline');
    lifeList.innerHTML = life.stages.map(s => `
        <div class="timeline-item ${s.status}" data-icon="${s.icon}">
            <h4>${s.title}</h4>
            ${s.status === 'current' ? `<p style="color:var(--primary); font-size: 0.85rem">${life.current_tip}</p>` : ''}
        </div>
    `).join('');

    // Chart
    renderChart(pred, sal, role);
    dashboard.scrollIntoView({behavior: 'smooth'});
}

function renderChart(pred, sal, role) {
    const ctx = document.getElementById('analysisChart').getContext('2d');
    if (currentChart) currentChart.destroy();

    if (role === 'college' && sal) {
        // Salary Projection Chart
        const labels = sal['5_year_projection'].map(x => x.year);
        const data = sal['5_year_projection'].map(x => x.salary_lpa);

        currentChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Expected Salary (LPA)',
                    data: data,
                    borderColor: '#10b981',
                    backgroundColor: 'rgba(16, 185, 129, 0.1)',
                    borderWidth: 3,
                    tension: 0.4,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: { labels: { color: '#fff' } }
                },
                scales: {
                    y: { ticks: { color: '#ccc' }, grid: { color: 'rgba(255,255,255,0.1)' } },
                    x: { ticks: { color: '#ccc' }, grid: { color: 'rgba(255,255,255,0.1)' } }
                }
            }
        });
    } else {
        // Probability Chart
        let labels, data;
        if (role === 'class10') {
            labels = Object.keys(pred.all_stream_probabilities);
            data = Object.values(pred.all_stream_probabilities);
        } else if (role === 'class12') {
            // Sort to show top 5
            const sorted = Object.entries(pred.all_course_probabilities).sort((a,b)=>b[1]-a[1]).slice(0,5);
            labels = sorted.map(x=>x[0]);
            data = sorted.map(x=>x[1]);
        }
        
        currentChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'AI Recommendation Probability (%)',
                    data: data,
                    backgroundColor: 'rgba(59, 130, 246, 0.8)',
                    borderColor: '#3b82f6',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: { labels: { color: '#fff' } }
                },
                scales: {
                    y: { ticks: { color: '#ccc' }, grid: { color: 'rgba(255,255,255,0.1)' } },
                    x: { ticks: { color: '#ccc' }, grid: { display: false } }
                }
            }
        });
    }
}
