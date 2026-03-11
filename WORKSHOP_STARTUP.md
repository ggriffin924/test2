# 🚀 Workshop: Build with Gemini CLI in 45 Minutes

Welcome! In this workshop, we will build a professional personal portfolio from scratch using the **Gemini CLI** to control your computer and push to GitHub.

---

## 📋 Part 1: Prerequisites & Setup (10 Mins)

### 1. Required Accounts
*   **GitHub Account:** [github.com](https://github.com)
*   **Google Account:** (Use your existing Gmail/Google account)

### 2. Install Tools (Node.js, Git, & VS Code)
*   **Windows (PowerShell - Run as Administrator):**
    ```powershell
    winget install OpenJS.NodeJS
    winget install Git.Git
    winget install Microsoft.VisualStudioCode
    # IMPORTANT: Close and RE-OPEN your PowerShell window after installation
    ```
*   **macOS (Terminal):**
    ```bash
    brew install node git --cask visual-studio-code
    ```

### 3. Verify & Authenticate
Ensure these work, then login to Gemini:
```bash
git --version
node -v
code --version

npm install -g @google/gemini-cli
gemini auth login
```

---

## 🛠️ Part 2: Project Initialization (5 Mins)

1.  **Create a GitHub Repo:** Go to GitHub and create a NEW repository named `gemini-portfolio`. **Do not** add a README or .gitignore yet.
2.  **Copy the HTTPS URL:** Click the green **"<> Code"** button and copy the **HTTPS** URL (e.g., `https://github.com/USER/repo.git`).
3.  **Setup Local Folder:**
    ```bash
    mkdir gemini-portfolio
    cd gemini-portfolio
    code .
    ```
4.  **Start Gemini:**
    ```bash
    gemini
    ```

---

## 🤖 Part 3: Building & Pushing with AI (15 Mins)

### 1. The "Magic" Setup Prompt
Paste this into the Gemini chat (replace the URL with yours):
> "Initialize a git repository, set the remote origin to [YOUR_REPO_URL], and create a modern dark-mode personal portfolio with index.html, styles.css, and app.js."

### 2. Set Project Preferences
Teach Gemini about your project structure:
> "Save a project preference that screenshots should be stored in a folder named 'screenshots' in the root of this project."

### 3. Preview Your Site
Run this in the Gemini chat to see what you've built:
*   **Windows:** `!Invoke-Item index.html`
*   **macOS:** `!open index.html`

### 4. Push to GitHub
When you're ready, simply tell Gemini:
> "Commit all my files with the message 'Initial portfolio' and push them to the main branch on GitHub."

---

## 🌎 Part 4: Hosting Remotely (GitHub Pages) (10 Mins)

Now, let's make your site live for the whole world to see!

1.  **Go to your GitHub Repo** in your browser.
2.  Click the **Settings** tab.
3.  On the left sidebar, click **Pages**.
4.  Under **Build and deployment** > **Branch**:
    *   Change the dropdown from **None** to **main**.
    *   Ensure the folder is set to **/(root)**.
    *   Click **Save**.
5.  **Wait 1-2 minutes**, then refresh the page. You will see a message: *"Your site is live at..."* followed by your URL!

---

## ✅ Part 5: Wrap Up (5 Mins)
*   How did the AI handle the context?
*   Try adding a README: `Write a professional README.md for this project and push it to GitHub.`
