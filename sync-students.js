const fs = require('fs');
const path = require('path');

const PROFILE_DIR = path.join(__dirname, 'student_profiles');
const OUTPUT_FILE = path.join(__dirname, 'students.json');

const roles = ['Frontend Developer', 'AI Researcher', 'UI Designer', 'Backend Engineer', 'Data Scientist', 'Fullstack Dev'];
const skills = ['React', 'Python', 'Node.js', 'PyTorch', 'Figma', 'TypeScript', 'Docker', 'Gemini API'];

/**
 * Synchronizes the student_profiles folder with the students.json file.
 */
function syncProfiles() {
    console.log('🔄 Syncing student profiles...');

    if (!fs.existsSync(PROFILE_DIR)) {
        fs.mkdirSync(PROFILE_DIR);
    }

    // Load existing data to preserve roles/skills
    let existingData = [];
    if (fs.existsSync(OUTPUT_FILE)) {
        try {
            existingData = JSON.parse(fs.readFileSync(OUTPUT_FILE, 'utf8'));
        } catch (e) {
            existingData = [];
        }
    }

    const files = fs.readdirSync(PROFILE_DIR).filter(file => {
        return /\.(png|jpg|jpeg|webp|gif)$/i.test(file);
    });

    const students = files.map(file => {
        const name = path.parse(file).name;
        const existingStudent = existingData.find(s => s.name === name);

        if (existingStudent) {
            return {
                ...existingStudent,
                image: `student_profiles/${file}` // Update image path if extension changed
            };
        }

        // Generate creative new profile data
        const randomRole = roles[Math.floor(Math.random() * roles.length)];
        const randomSkills = [];
        while (randomSkills.length < 3) {
            const s = skills[Math.floor(Math.random() * skills.length)];
            if (!randomSkills.includes(s)) randomSkills.push(s);
        }

        return {
            name: name,
            image: `student_profiles/${file}`,
            role: name.includes('Griffin') ? 'Course Instructor' : randomRole,
            skills: name.includes('Griffin') ? ['AI Engineering', 'Fullstack Development', 'System Architecture'] : randomSkills
        };
    });

    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(students, null, 4));
    console.log(`✅ Successfully synced ${students.length} students to ${OUTPUT_FILE}`);
}

// Initial Sync
syncProfiles();

// Watch Mode
if (process.argv.includes('--watch')) {
    console.log(`👀 Watching for changes in ${PROFILE_DIR}...`);
    fs.watch(PROFILE_DIR, (eventType, filename) => {
        if (filename && /\.(png|jpg|jpeg|webp|gif)$/i.test(filename)) {
            // Debounce for stability
            setTimeout(syncProfiles, 100);
        }
    });
}
