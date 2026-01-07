# How to Publish Your Catalog

## 🎯 The Problem (Solved!)

Previously, your catalog was **only visible on your device** because products were stored in browser localStorage. Customers couldn't see any products!

Now, with the **Publish Catalog** feature, you can share your catalog with everyone.

---

## 🚀 Quick Start Guide

### **Step 1: Add Products** (Admin Dashboard)

1. Open: `https://arunsaispk12.github.io/print-genie-catalog/public/`
2. Go to **"Add Product"** tab
3. Add your products with images and details
4. Products are saved to your browser

### **Step 2: Publish Catalog** (Make it Public)

1. Go to **"View Catalog"** tab
2. Click **"🚀 Publish Catalog"** button
3. Confirm the action
4. A file named `catalog-data.json` will download

### **Step 3: Update GitHub** (Terminal/Command Line)

Open your terminal and run these commands:

```bash
cd /path/to/print-genie-catalog

# Move the downloaded file to the right location
# (Replace the path with where your file was downloaded)
cp ~/Downloads/catalog-data.json public/catalog-data.json

# Commit and push to GitHub
git add public/catalog-data.json
git commit -m "Update catalog data"
git push
```

### **Step 4: Wait & Share** (1-2 Minutes)

1. Wait 1-2 minutes for GitHub Pages to deploy
2. Click **"📤 Share Link"** button
3. Copy the catalog URL
4. Share with your customers!

---

## 📋 Complete Workflow

### **For You (Admin):**

```
Add Products → Publish Catalog → Download JSON → Commit to GitHub → Share Link
```

### **For Customers:**

```
Receive Link → Browse Products → See Prices → Contact You to Order
```

---

## 🔄 How It Works

### **Before (Broken):**
```
Your Browser (localStorage)
    ↓
    Only you see products
    ↓
Customers see empty catalog ❌
```

### **After (Working):**
```
Your Browser (localStorage)
    ↓
Click "Publish Catalog"
    ↓
Download catalog-data.json
    ↓
Commit to GitHub
    ↓
GitHub Pages serves the file
    ↓
Customers see all products ✅
```

---

## 💡 Important Notes

### **When to Publish:**

Publish your catalog every time you:
- ✅ Add new products
- ✅ Update product prices
- ✅ Change product descriptions
- ✅ Update stock quantities
- ✅ Delete products

### **Data Flow:**

1. **Admin Dashboard** (`index.html`)
   - Stores products in localStorage
   - Exports to `catalog-data.json`

2. **GitHub Repository** (`catalog-data.json`)
   - Stores the published data
   - Accessible to everyone

3. **Public Catalog** (`catalog.html`)
   - Reads from `catalog-data.json`
   - Shows products to customers

---

## 🔒 Repository Security

### **Is My Data Safe?**

Your GitHub repository is **public**, which means:

✅ **Safe:**
- Product names, descriptions, prices
- Product images (if using URLs)
- SKU codes
- Stock quantities

⚠️ **Don't Store:**
- Customer personal information
- Payment details
- Private business data
- Sensitive documents

### **If You Need Privacy:**

Option 1: Make repo private (GitHub Pages won't work on free plan)
Option 2: Use a different hosting service
Option 3: Keep sensitive data separate

---

## 🌐 Your URLs

| Page | URL | Purpose |
|------|-----|---------|
| **Admin Dashboard** | `https://arunsaispk12.github.io/print-genie-catalog/public/` | Manage products (private) |
| **Public Catalog** | `https://arunsaispk12.github.io/print-genie-catalog/public/catalog.html` | Share with customers |

---

## 🐛 Troubleshooting

### **Problem: Customers see empty catalog**

**Solution:**
1. Make sure you clicked "🚀 Publish Catalog"
2. Check if `catalog-data.json` was committed to GitHub
3. Wait 1-2 minutes for GitHub Pages to deploy
4. Hard refresh the catalog page (Ctrl+Shift+R)

### **Problem: File download doesn't work**

**Solution:**
1. Check browser's download settings
2. Allow downloads from the site
3. Check Downloads folder
4. Try a different browser

### **Problem: Git push fails**

**Solution:**
```bash
# Make sure you're in the right directory
cd /storage/emulated/0/CLI_PATH/print-genie-catalog

# Check git status
git status

# Add the file
git add public/catalog-data.json

# Commit
git commit -m "Update catalog data"

# Push
git push
```

### **Problem: Products not updating on public catalog**

**Solution:**
1. Clear browser cache on customer's device
2. Hard refresh (Ctrl+Shift+R or Cmd+Shift+R)
3. Check if latest commit is on GitHub
4. Wait a bit longer for GitHub Pages

---

## 📱 Mobile Workflow (Android/Termux)

If you're using Termux on Android:

```bash
# Navigate to repo
cd /storage/emulated/0/CLI_PATH/print-genie-catalog

# Move downloaded file
mv /storage/emulated/0/Download/catalog-data.json public/

# Commit and push
git add public/catalog-data.json
git commit -m "Update catalog data"
git push
```

---

## ⚡ Quick Tips

1. **Publish Regularly**
   - Publish after adding multiple products
   - Don't need to publish after every single product
   - Once a day is usually enough

2. **Test Before Sharing**
   - After publishing, open catalog link yourself
   - Verify all products appear
   - Check images load correctly
   - Test on mobile device

3. **Backup Your Data**
   - The downloaded `catalog-data.json` is a backup
   - Keep a copy somewhere safe
   - Export CSV regularly too

4. **Version Control**
   - Git keeps history of all your catalogs
   - You can always revert to old versions
   - Use descriptive commit messages

---

## 🎓 Advanced: Automate Publishing

If you want to automate this process:

### **Option 1: GitHub Actions** (Recommended)

Create `.github/workflows/update-catalog.yml`:

```yaml
name: Update Catalog
on:
  workflow_dispatch:
    inputs:
      catalog_data:
        description: 'Catalog JSON data'
        required: true

jobs:
  update:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Update catalog
        run: |
          echo '${{ github.event.inputs.catalog_data }}' > public/catalog-data.json
          git config user.name "GitHub Actions"
          git config user.email "actions@github.com"
          git add public/catalog-data.json
          git commit -m "Auto-update catalog"
          git push
```

### **Option 2: GitHub API** (Advanced)

Use JavaScript to push directly via GitHub API (requires personal access token).

---

## 📞 Need Help?

If you're stuck:

1. Check the error message carefully
2. Review this guide again
3. Check GitHub repository issues
4. Open a new issue with:
   - What you're trying to do
   - What's happening instead
   - Error messages (if any)
   - Screenshots (helpful)

---

## ✅ Checklist

Before sharing your catalog:

- [ ] Added products in admin dashboard
- [ ] Clicked "🚀 Publish Catalog"
- [ ] Downloaded `catalog-data.json`
- [ ] Replaced file in `public/catalog-data.json`
- [ ] Committed to GitHub
- [ ] Pushed to GitHub
- [ ] Waited 1-2 minutes
- [ ] Tested catalog link yourself
- [ ] Verified products appear
- [ ] Ready to share with customers!

---

**Last Updated:** January 8, 2026
**Version:** 1.2.0
