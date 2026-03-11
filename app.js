document.addEventListener('DOMContentLoaded', () => {
    const studentGrid = document.getElementById('student-grid');
    const searchInput = document.getElementById('search-input');
    const roleFilter = document.getElementById('role-filter');
    const sortBy = document.getElementById('sort-by');
    const resultsCount = document.getElementById('results-count');
    const themeToggle = document.getElementById('theme-toggle');
    const toastContainer = document.getElementById('toast-container');
    const sunIcon = document.getElementById('sun-icon');
    const moonIcon = document.getElementById('moon-icon');
    
    let allStudents = [];

    /**
     * SECTION 1: DATA LOADING
     */
    const loadStudents = () => {
        if (window.STUDENT_DATA && window.STUDENT_DATA.length > 0) {
            allStudents = window.STUDENT_DATA;
        } else {
            allStudents = generateMockStudents(8);
        }
    };

    const generateMockStudents = (count) => {
        const firstNames = ['Alex', 'Jordan', 'Taylor', 'Casey', 'Morgan', 'Riley', 'Skyler', 'Quinn'];
        const lastNames = ['Smith', 'Chen', 'Rodriguez', 'Kim', 'Gomez', 'Taylor', 'Wilson', 'Lee'];
        const rolesList = ['Frontend Developer', 'AI Researcher', 'UI Designer', 'Backend Engineer', 'Data Scientist', 'Fullstack Dev'];
        const skillsList = ['React', 'Python', 'Node.js', 'PyTorch', 'Figma', 'TypeScript', 'Docker', 'Gemini API'];
        
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
                timestamp: Date.now() - Math.random() * 10000000
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
                <div class="student-actions">
                    <button class="action-btn" onclick="showToast('Viewing profile of ${student.name}')" title="View Profile">
                        <i data-lucide="user"></i>
                    </button>
                    <button class="action-btn" onclick="showToast('Message sent to ${student.name}')" title="Send Message">
                        <i data-lucide="mail"></i>
                    </button>
                    <button class="action-btn" onclick="showToast('Skills endorsed for ${student.name}')" title="Endorse Skills">
                        <i data-lucide="award"></i>
                    </button>
                </div>
            </div>
        `).join('');

        resultsCount.innerText = `Showing ${filteredList.length} Student${filteredList.length === 1 ? '' : 's'}`;
        
        // Re-initialize icons for new cards
        if (window.lucide) {
            lucide.createIcons();
        }
    };

    const filterAndSortStudents = () => {
        const searchTerm = searchInput.value.toLowerCase();
        const selectedRole = roleFilter.value;
        const sortOrder = sortBy.value;

        let filtered = allStudents.filter(student => {
            const matchesSearch = student.name.toLowerCase().includes(searchTerm) || 
                                 student.skills.some(s => s.toLowerCase().includes(searchTerm));
            const matchesRole = selectedRole === 'all' || student.role === selectedRole;
            return matchesSearch && matchesRole;
        });

        // Sorting Logic
        if (sortOrder === 'name') {
            filtered.sort((a, b) => a.name.localeCompare(b.name));
        } else if (sortOrder === 'role') {
            filtered.sort((a, b) => a.role.localeCompare(b.role));
        } else if (sortOrder === 'newest') {
            filtered.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
        }

        renderStudents(filtered);
    };

    /**
     * SECTION 3: THEME & UI LOGIC
     */
    themeToggle.addEventListener('click', () => {
        const isDark = document.body.getAttribute('data-theme') === 'dark';
        const newTheme = isDark ? 'light' : 'dark';
        
        document.body.setAttribute('data-theme', newTheme);
        sunIcon.style.display = isDark ? 'block' : 'none';
        moonIcon.style.display = isDark ? 'none' : 'block';
        
        showToast(`Switching to ${newTheme} mode...`);
    });

    window.showToast = (message) => {
        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.innerHTML = `<i data-lucide="check-circle"></i> <span>${message}</span>`;
        toastContainer.appendChild(toast);
        
        if (window.lucide) lucide.createIcons();

        setTimeout(() => {
            toast.style.animation = 'slideOut 0.3s ease forwards';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    };

    // Listeners
    searchInput.addEventListener('input', filterAndSortStudents);
    roleFilter.addEventListener('change', filterAndSortStudents);
    sortBy.addEventListener('change', filterAndSortStudents);

    // Initial Load & Render
    loadStudents();
    filterAndSortStudents();
});
