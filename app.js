document.addEventListener('DOMContentLoaded', () => {
    const studentGrid = document.getElementById('student-grid');
    const searchInput = document.getElementById('search-input');
    const roleFilter = document.getElementById('role-filter');
    const resultsCount = document.getElementById('results-count');
    const themeButtons = document.querySelectorAll('.theme-btn');
    
    let allStudents = [];

    /**
     * SECTION 1: DATA LOADING
     * We now check for window.STUDENT_DATA which is set by students-data.js.
     * This avoids CORS issues when opening the file locally.
     */
    const loadStudents = () => {
        if (window.STUDENT_DATA && window.STUDENT_DATA.length > 0) {
            allStudents = window.STUDENT_DATA;
            console.log('✅ Loaded real students from students-data.js');
        } else {
            console.warn('⚠️ Falling back to mock students...');
            allStudents = generateMockStudents(8);
        }
    };

    const firstNames = ['Alex', 'Jordan', 'Taylor', 'Casey', 'Morgan', 'Riley', 'Skyler', 'Quinn'];
    const lastNames = ['Smith', 'Chen', 'Rodriguez', 'Kim', 'Gomez', 'Taylor', 'Wilson', 'Lee'];
    const rolesList = ['Frontend Developer', 'AI Researcher', 'UI Designer', 'Backend Engineer', 'Data Scientist', 'Fullstack Dev'];
    const skillsList = ['React', 'Python', 'Node.js', 'PyTorch', 'Figma', 'TypeScript', 'Docker', 'Gemini API'];

    const generateMockStudents = (count) => {
        const students = [];
        for (let i = 0; i < count; i++) {
            const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
            const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
            const studentSkills = [];
            for (let j = 0; j < 3; j++) {
                const skill = skillsList[Math.floor(Math.random() * skillsList.length)];
                if (!studentSkills.includes(skill)) studentSkills.push(skill);
            }
            students.push({
                name: `${firstName} ${lastName}`,
                role: rolesList[Math.floor(Math.random() * rolesList.length)],
                initials: firstName[0] + lastName[0],
                skills: studentSkills,
                isMock: true
            });
        }
        return students;
    };

    /**
     * SECTION 2: RENDERING & FILTERING
     */
    const renderStudents = (filteredList) => {
        if (filteredList.length === 0) {
            studentGrid.innerHTML = `<div style="grid-column: 1/-1; text-align: center; padding: 3rem; color: var(--text-secondary);">No students found matching your criteria.</div>`;
            resultsCount.innerText = `0 Students Found`;
            return;
        }

        studentGrid.innerHTML = filteredList.map((student, index) => `
            <div class="student-card" style="animation: fadeInUp 0.5s ease forwards; animation-delay: ${index * 0.05}s">
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

        resultsCount.innerText = `Showing ${filteredList.length} Student${filteredList.length === 1 ? '' : 's'}`;
    };

    const filterStudents = () => {
        const searchTerm = searchInput.value.toLowerCase();
        const selectedRole = roleFilter.value;

        const filtered = allStudents.filter(student => {
            const matchesSearch = student.name.toLowerCase().includes(searchTerm) || 
                                 student.skills.some(s => s.toLowerCase().includes(searchTerm));
            const matchesRole = selectedRole === 'all' || student.role === selectedRole;
            return matchesSearch && matchesRole;
        });

        renderStudents(filtered);
    };

    // Listeners for Search and Filter
    searchInput.addEventListener('input', filterStudents);
    roleFilter.addEventListener('change', filterStudents);

    /**
     * SECTION 3: THEME SWAPPING
     */
    themeButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const theme = btn.getAttribute('data-theme');
            document.body.setAttribute('data-theme', theme);
            themeButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
        });
    });

    // Initial Load & Render
    loadStudents();
    renderStudents(allStudents);
});
