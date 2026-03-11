document.addEventListener('DOMContentLoaded', () => {
    const studentGrid = document.getElementById('student-grid');
    const searchInput = document.getElementById('search-input');
    const roleFilter = document.getElementById('role-filter');
    const sortBy = document.getElementById('sort-by');
    const resultsCount = document.getElementById('results-count');
    const themeSelect = document.getElementById('theme-select');
    const toastContainer = document.getElementById('toast-container');
    
    let allStudents = [];

    const hobbiesList = [
        'Underwater Basket Weaving', 'Urban Exploration', 'Competitive Latte Art', 
        'Retro Console Repair', 'Drone Racing', 'Bonsai Tree Sculpting', 
        'Analog Photography', 'Mechanical Keyboard Building', 'Geocaching'
    ];

    const rolesList = ['Frontend Developer', 'AI Researcher', 'UI Designer', 'Backend Engineer', 'Data Scientist', 'Fullstack Dev'];
    const skillsList = ['React', 'Python', 'Node.js', 'PyTorch', 'Figma', 'TypeScript', 'Docker', 'Gemini API'];

    /**
     * SECTION 1: DATA LOADING & PERSISTENCE
     */
    const loadStudents = () => {
        const storedData = localStorage.getItem('workshop_students');
        let baseData = window.STUDENT_DATA && window.STUDENT_DATA.length > 0 ? window.STUDENT_DATA : generateMockStudents(8);
        
        if (storedData) {
            const savedStudents = JSON.parse(storedData);
            // Merge saved data with base data to preserve persistence
            allStudents = baseData.map(student => {
                const saved = savedStudents.find(s => s.name === student.name);
                return saved ? { ...student, ...saved } : initStudent(student);
            });
        } else {
            allStudents = baseData.map(initStudent);
            saveToStorage();
        }
    };

    const initStudent = (student) => ({
        ...student,
        id: student.id || Math.random().toString(36).substr(2, 9),
        hobby: student.hobby || hobbiesList[Math.floor(Math.random() * hobbiesList.length)],
        endorsements: student.endorsements || 0,
        role: student.role || rolesList[Math.floor(Math.random() * rolesList.length)],
        skills: student.skills || getRandomSkills(3),
        timestamp: student.timestamp || Date.now()
    });

    const getRandomSkills = (count) => {
        const s = [];
        while (s.length < count) {
            const skill = skillsList[Math.floor(Math.random() * skillsList.length)];
            if (!s.includes(skill)) s.push(skill);
        }
        return s;
    };

    const generateMockStudents = (count) => {
        const firstNames = ['Alex', 'Jordan', 'Taylor', 'Casey', 'Morgan', 'Riley', 'Skyler', 'Quinn'];
        const lastNames = ['Smith', 'Chen', 'Rodriguez', 'Kim', 'Gomez', 'Taylor', 'Wilson', 'Lee'];
        return Array.from({ length: count }, () => {
            const fn = firstNames[Math.floor(Math.random() * firstNames.length)];
            const ln = lastNames[Math.floor(Math.random() * lastNames.length)];
            return { name: `${fn} ${ln}`, initials: fn[0] + ln[0], isMock: true };
        });
    };

    const saveToStorage = () => {
        localStorage.setItem('workshop_students', JSON.stringify(allStudents));
    };

    /**
     * SECTION 2: RENDERING
     */
    const renderStudents = (filteredList) => {
        if (filteredList.length === 0) {
            studentGrid.innerHTML = `<div style="grid-column: 1/-1; text-align: center; padding: 3rem; color: var(--text-secondary);">No students found.</div>`;
            return;
        }

        studentGrid.innerHTML = filteredList.map((student, index) => `
            <div class="student-card" id="card-${student.id}" style="animation: fadeInUp 0.5s ease forwards; animation-delay: ${index * 0.05}s">
                <div class="profile-image-container">
                    ${student.image 
                        ? `<img src="${student.image}" alt="${student.name}" class="profile-image">`
                        : `<div class="profile-placeholder">${student.initials || '??'}</div>`
                    }
                    <div class="endorsement-badge" id="badge-${student.id}">
                        <i data-lucide="award" style="width:10px;height:10px"></i>
                        <span>${student.endorsements}</span>
                    </div>
                </div>
                <h2>${student.name}</h2>
                <span class="student-hobby">Fave Hobby: ${student.hobby}</span>
                <span class="student-role">${student.role}</span>
                <div class="skills-tags">
                    ${student.skills.map(skill => `<span class="skill-tag">${skill}</span>`).join('')}
                </div>
                <div class="student-actions">
                    <button class="action-btn" onclick="regenerateStudent('${student.id}')" title="Regenerate Profile">
                        <i data-lucide="refresh-cw"></i>
                    </button>
                    <button class="action-btn" onclick="endorseStudent('${student.id}', event)" title="Endorse Skills">
                        <i data-lucide="zap"></i>
                    </button>
                    <button class="action-btn" onclick="showToast('Message sent to ${student.name}')" title="Send Message">
                        <i data-lucide="mail"></i>
                    </button>
                </div>
            </div>
        `).join('');
        resultsCount.innerText = `Showing ${filteredList.length} Students`;
        if (window.lucide) lucide.createIcons();
    };

    /**
     * SECTION 3: ACTIONS
     */
    window.regenerateStudent = (id) => {
        const idx = allStudents.findIndex(s => s.id === id);
        if (idx === -1) return;

        const btn = document.querySelector(`#card-${id} .action-btn i[data-lucide="refresh-cw"]`).parentElement;
        btn.classList.add('rotate');

        setTimeout(() => {
            allStudents[idx].role = rolesList[Math.floor(Math.random() * rolesList.length)];
            allStudents[idx].hobby = hobbiesList[Math.floor(Math.random() * hobbiesList.length)];
            allStudents[idx].skills = getRandomSkills(3);
            saveToStorage();
            filterAndSortStudents();
            showToast(`Regenerated ${allStudents[idx].name}'s profile!`);
        }, 600);
    };

    window.endorseStudent = (id, event) => {
        const idx = allStudents.findIndex(s => s.id === id);
        if (idx === -1) return;

        allStudents[idx].endorsements++;
        saveToStorage();

        // UI Update
        const badge = document.getElementById(`badge-${id}`);
        badge.querySelector('span').innerText = allStudents[idx].endorsements;
        badge.classList.add('pop');
        setTimeout(() => badge.classList.remove('pop'), 200);

        // Effects
        createParticles(event.clientX, event.clientY);
        showToast(`Endorsed ${allStudents[idx].name}!`);
    };

    const createParticles = (x, y) => {
        for (let i = 0; i < 12; i++) {
            const p = document.createElement('div');
            p.className = 'particle';
            const size = Math.random() * 8 + 4;
            p.style.width = `${size}px`;
            p.style.height = `${size}px`;
            p.style.background = `hsl(${Math.random() * 360}, 70%, 60%)`;
            p.style.left = `${x}px`;
            p.style.top = `${y}px`;
            
            const tx = (Math.random() - 0.5) * 200;
            const ty = (Math.random() - 0.5) * 200;
            p.style.setProperty('--tx', `${tx}px`);
            p.style.setProperty('--ty', `${ty}px`);
            p.style.animation = `particleFade 0.6s ease-out forwards`;
            
            document.body.appendChild(p);
            setTimeout(() => p.remove(), 600);
        }
    };

    window.showToast = (message) => {
        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.innerHTML = `<i data-lucide="check-circle"></i> <span>${message}</span>`;
        toastContainer.appendChild(toast);
        if (window.lucide) lucide.createIcons();
        setTimeout(() => { toast.style.opacity = '0'; setTimeout(() => toast.remove(), 300); }, 3000);
    };

    const filterAndSortStudents = () => {
        const term = searchInput.value.toLowerCase();
        const role = roleFilter.value;
        const sort = sortBy.value;

        let filtered = allStudents.filter(s => {
            const mS = s.name.toLowerCase().includes(term) || s.skills.some(sk => sk.toLowerCase().includes(term));
            const mR = role === 'all' || s.role === role;
            return mS && mR;
        });

        if (sort === 'name') filtered.sort((a, b) => a.name.localeCompare(b.name));
        else if (sort === 'role') filtered.sort((a, b) => a.role.localeCompare(b.role));
        else if (sort === 'newest') filtered.sort((a, b) => b.timestamp - a.timestamp);

        renderStudents(filtered);
    };

    themeSelect.addEventListener('change', (e) => {
        document.body.setAttribute('data-theme', e.target.value);
        showToast(`Switching to ${e.target.value} mode...`);
    });

    searchInput.addEventListener('input', filterAndSortStudents);
    roleFilter.addEventListener('change', filterAndSortStudents);
    sortBy.addEventListener('change', filterAndSortStudents);

    loadStudents();
    filterAndSortStudents();
});
