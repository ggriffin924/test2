document.addEventListener('DOMContentLoaded', () => {
    const studentGrid = document.getElementById('student-grid');
    
    /**
     * SECTION 1: DATA CONFIGURATION
     * In a real workshop, students will drop images into 'student_profiles/' 
     * and ask the Gemini CLI to update this list.
     */
    const realStudents = [
        // AI will add students here, for example:
        // { name: 'Griffin Odwyer', image: 'student_profiles/Griffin Odwyer.png', role: 'Workshop Lead', skills: ['AI', 'GitHub', 'CLI'] }
    ];

    const firstNames = ['Alex', 'Jordan', 'Taylor', 'Casey', 'Morgan', 'Riley', 'Skyler', 'Quinn'];
    const lastNames = ['Smith', 'Chen', 'Rodriguez', 'Kim', 'Gomez', 'Taylor', 'Wilson', 'Lee'];
    const roles = ['Frontend Developer', 'AI Researcher', 'UI Designer', 'Backend Engineer', 'Data Scientist', 'Fullstack Dev'];
    const skills = ['React', 'Python', 'Node.js', 'PyTorch', 'Figma', 'TypeScript', 'Docker', 'Gemini API'];

    /**
     * SECTION 2: MOCK STUDENT GENERATION
     */
    const generateMockStudents = (count) => {
        const students = [];
        for (let i = 0; i < count; i++) {
            const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
            const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
            const studentSkills = [];
            for (let j = 0; j < 3; j++) {
                const skill = skills[Math.floor(Math.random() * skills.length)];
                if (!studentSkills.includes(skill)) studentSkills.push(skill);
            }
            
            students.push({
                name: `${firstName} ${lastName}`,
                role: roles[Math.floor(Math.random() * roles.length)],
                initials: firstName[0] + lastName[0],
                skills: studentSkills,
                isMock: true
            });
        }
        return students;
    };

    /**
     * SECTION 3: RENDERING LOGIC
     */
    const renderStudents = (real, mock) => {
        const allStudents = [...real, ...mock];
        studentGrid.innerHTML = allStudents.map((student, index) => `
            <div class="student-card" style="animation-delay: ${index * 0.1}s">
                <div class="profile-image-container">
                    ${student.image 
                        ? `<img src="${student.image}" alt="${student.name}" class="profile-image">`
                        : `<div class="profile-placeholder">${student.initials}</div>`
                    }
                </div>
                <h2>${student.name}</h2>
                <span class="student-role">${student.role}</span>
                <div class="skills-tags">
                    ${student.skills.map(skill => `<span class="skill-tag">${skill}</span>`).join('')}
                </div>
            </div>
        `).join('');
    };

    const mockStudents = generateMockStudents(8);
    renderStudents(realStudents, mockStudents);

    /**
     * SECTION 4: ENGAGEMENT CHART
     */
    const ctx = document.getElementById('engagementChart').getContext('2d');
    const gradient = ctx.createLinearGradient(0, 0, 0, 400);
    gradient.addColorStop(0, 'rgba(192, 132, 252, 0.4)');
    gradient.addColorStop(1, 'rgba(192, 132, 252, 0)');

    new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            datasets: [{
                label: 'Student Activity Index',
                data: [65, 78, 90, 85, 95, 70, 88],
                borderColor: '#c084fc',
                borderWidth: 4,
                tension: 0.4,
                fill: true,
                backgroundColor: gradient,
                pointBackgroundColor: '#c084fc',
                pointBorderColor: '#fff',
                pointHoverRadius: 8
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
                y: { beginAtZero: true, grid: { color: 'rgba(255, 255, 255, 0.05)' }, ticks: { color: '#94a3b8' } },
                x: { grid: { display: false }, ticks: { color: '#94a3b8' } }
            }
        }
    });
});
