const fs = require('fs');
const path = require('path');

const PROFILE_DIR = path.join(__dirname, 'student_profiles');
const OUTPUT_FILE = path.join(__dirname, 'students-data.js'); // Use a JS file to avoid CORS

const roles = ['Frontend Developer', 'AI Researcher', 'UI Designer', 'Backend Engineer', 'Data Scientist', 'Fullstack Dev'];
const skills = ['React', 'Python', 'Node.js', 'PyTorch', 'Figma', 'TypeScript', 'Docker', 'Gemini API'];

function syncProfiles() {
    console.log('🔄 Syncing student profiles...');

    if (!fs.existsSync(PROFILE_DIR)) {
        fs.mkdirSync(PROFILE_DIR);
    }

    const files = fs.readdirSync(PROFILE_DIR).filter(file => {
        return /\.(png|jpg|jpeg|webp|gif)$/i.test(file);
    });

    const students = files.map(file => {
        const name = path.parse(file).name;
        
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

    // Write as a global variable so app.js can see it without a fetch()
    const jsContent = `window.STUDENT_DATA = ${JSON.stringify(students, null, 4)};`;
    fs.writeFileSync(OUTPUT_FILE, jsContent);
    console.log(`✅ Successfully synced ${students.length} students to ${OUTPUT_FILE}`);
}

syncProfiles();

if (process.argv.includes('--watch')) {
    console.log(`👀 Watching for changes in ${PROFILE_DIR}...`);
    fs.watch(PROFILE_DIR, (eventType, filename) => {
        if (filename && /\.(png|jpg|jpeg|webp|gif)$/i.test(filename)) {
            setTimeout(syncProfiles, 100);
        }
    });
}
