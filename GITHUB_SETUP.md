# GitHub Setup Guide for Print Genie Catalog

## Initial Setup (First Time Only)

### 1. Create GitHub Repository

#### Option A: Via GitHub Website
1. Go to [github.com](https://github.com)
2. Click the **+** icon (top right) → **New repository**
3. Fill in details:
   - **Repository name:** `print-genie-catalog`
   - **Description:** `3D Printing Catalog Builder and Management System`
   - **Visibility:** Private (recommended for business)
   - **DO NOT** initialize with README (we already have one)
4. Click **Create repository**

#### Option B: Via GitHub CLI (if installed)
```bash
gh repo create print-genie-catalog --private --source=. --remote=origin
```

### 2. Configure Git (if not already done)

```bash
# Set your name and email
git config --global user.name "Your Name"
git config --global user.email "your.email@printgenie.com"

# Verify configuration
git config --list
```

### 3. Connect Local Repository to GitHub

After creating the repository on GitHub, you'll see a URL like:
`https://github.com/yourusername/print-genie-catalog.git`

Run these commands in your project directory:

```bash
# Navigate to project
cd print-genie-catalog

# Rename default branch to main (optional, modern standard)
git branch -M main

# Add GitHub as remote origin
git remote add origin https://github.com/yourusername/print-genie-catalog.git

# Verify remote was added
git remote -v
```

### 4. Initial Commit and Push

```bash
# Stage all files
git add .

# Create initial commit
git commit -m "Initial commit: Print Genie Catalog System v1.0

- Complete category structure with 11 main categories
- SKU generation system with material/color/size encoding
- Product naming guide and conventions
- Web-based catalog builder with local storage
- Documentation for all components
- Export to CSV functionality"

# Push to GitHub
git push -u origin main
```

## Daily Workflow

### Making Changes

```bash
# Check status of changes
git status

# Stage specific files
git add docs/CATEGORY_STRUCTURE.md
git add src/app.js

# Or stage all changes
git add .

# Commit with descriptive message
git commit -m "Add new category for seasonal products"

# Push to GitHub
git push
```

### Commit Message Guidelines

Use clear, descriptive messages:

**Good Examples:**
```bash
git commit -m "Add jewelry category with 5 subcategories"
git commit -m "Fix SKU generator color code validation"
git commit -m "Update product naming guide with seasonal examples"
git commit -m "Improve catalog table mobile responsiveness"
```

**Bad Examples:**
```bash
git commit -m "updates"
git commit -m "fix"
git commit -m "changes"
```

## Collaboration Workflow

### Pulling Latest Changes

```bash
# Fetch and merge latest changes from GitHub
git pull origin main
```

### Working with Branches

```bash
# Create new branch for feature
git checkout -b feature/add-resin-category

# Make changes and commit
git add .
git commit -m "Add resin printing category"

# Push branch to GitHub
git push -u origin feature/add-resin-category

# Create Pull Request on GitHub
# After review and merge, switch back to main
git checkout main
git pull origin main

# Delete local feature branch
git branch -d feature/add-resin-category
```

## Common Tasks

### View Commit History
```bash
git log --oneline
git log --graph --oneline --all
```

### Undo Changes (Before Commit)
```bash
# Discard changes in specific file
git checkout -- src/app.js

# Discard all changes
git reset --hard
```

### Undo Last Commit (Keep Changes)
```bash
git reset --soft HEAD~1
```

### Create a Release Tag
```bash
git tag -a v1.0.0 -m "Release version 1.0.0"
git push origin v1.0.0
```

## Repository Settings (Recommended)

### 1. Add Collaborators
- Go to repository → **Settings** → **Collaborators**
- Add team members

### 2. Branch Protection (Optional)
- Go to **Settings** → **Branches**
- Add rule for `main` branch:
  - ☑ Require pull request reviews
  - ☑ Require status checks to pass
  - ☑ Include administrators

### 3. Repository Description & Topics
- Add topics: `3d-printing`, `catalog`, `inventory`, `sku-generator`
- Update description and website URL

## Troubleshooting

### Issue: Push Rejected
```bash
# Someone else pushed changes
git pull --rebase origin main
git push
```

### Issue: Merge Conflicts
```bash
# Pull latest changes
git pull origin main

# Git will mark conflicts in files
# Edit files to resolve conflicts
# Look for <<<<<<< HEAD markers

# After resolving
git add .
git commit -m "Resolve merge conflicts"
git push
```

### Issue: Wrong Commit Message
```bash
# Amend last commit message (before push)
git commit --amend -m "Correct commit message"

# Force push if already pushed (use carefully!)
git push --force
```

### Issue: Forgot to Add File to Commit
```bash
# Add missing file to last commit
git add forgotten-file.js
git commit --amend --no-edit
git push --force
```

## GitHub Features to Use

### 1. Issues
Track bugs, features, and tasks:
- Go to **Issues** tab → **New issue**
- Use labels: `bug`, `enhancement`, `documentation`

### 2. Projects (Kanban Board)
Organize development workflow:
- Go to **Projects** → **New project**
- Create columns: To Do, In Progress, Done

### 3. Wiki
Additional documentation:
- Enable Wiki in **Settings**
- Document workflows, guidelines

### 4. Actions (CI/CD)
Automate testing and deployment (advanced):
- Create `.github/workflows/` directory
- Add YAML workflow files

## Backup Strategy

### Regular Exports
```bash
# Clone repository as backup
git clone https://github.com/yourusername/print-genie-catalog.git backup-2026-01-07

# Export catalog data (from web app)
# Use "Export CSV" button regularly
```

### Multiple Remotes (Optional)
```bash
# Add secondary remote (e.g., GitLab, Bitbucket)
git remote add backup https://gitlab.com/yourusername/print-genie-catalog.git

# Push to both
git push origin main
git push backup main
```

## Security Best Practices

1. **Never commit sensitive data:**
   - API keys
   - Passwords
   - Customer information
   - Financial data

2. **Use `.gitignore`** (already configured)

3. **Review commits before pushing:**
   ```bash
   git diff --cached
   ```

4. **Use Private Repository** for business code

5. **Enable 2FA** on GitHub account

## Quick Reference

```bash
# Daily workflow
git status                 # Check what changed
git add .                  # Stage all changes
git commit -m "message"    # Commit changes
git push                   # Upload to GitHub
git pull                   # Download latest changes

# Branch workflow
git checkout -b new-feature    # Create new branch
git checkout main              # Switch to main
git merge new-feature          # Merge branch
git branch -d new-feature      # Delete branch

# Information
git log                    # View history
git diff                   # View changes
git remote -v              # View remotes
git branch                 # List branches
```

---

**Questions?** Check [GitHub Docs](https://docs.github.com) or consult your team lead.
