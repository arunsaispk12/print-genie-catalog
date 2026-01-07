# Print Genie - Access Structure & URLs

## 🔒 Security & Privacy Improvements

Your catalog now has proper separation between public and admin areas!

---

## 🌐 Public URLs (Share with Customers)

### **Main Catalog (Public)**
```
https://arunsaispk12.github.io/print-genie-catalog/
```
- **Redirects to:** Public catalog view
- **Shows:** Product catalog only
- **Safe to share:** Yes, share this with everyone!
- **Visible:** Product listings, search, filters
- **Hidden:** Admin tools, source code, documentation

### **Direct Catalog Link**
```
https://arunsaispk12.github.io/print-genie-catalog/public/catalog.html
```
- Same as above, direct access
- Both URLs work the same way

---

## 🔐 Admin URLs (Keep Private!)

### **Admin Dashboard** ⚠️ KEEP SECRET
```
https://arunsaispk12.github.io/print-genie-catalog/public/admin.html
```
- **Access:** Only you should know this URL
- **Features:** Add products, manage catalog, settings, publish
- **Security:** Obscure URL (not index.html anymore)
- **Bookmark this:** Save in your browser for easy access
- **Don't share:** Keep this URL private

---

## 📁 What's Hidden vs Public

### ✅ **Publicly Accessible:**
- Product catalog viewer
- Product images (if using URLs)
- Product data (catalog-data.json)
- Catalog styles

### 🔒 **Hidden from Casual Browsing:**
- Admin dashboard (moved from index.html to admin.html)
- Source code files (discouraged by robots.txt)
- Documentation files (.md files)
- Admin styles and scripts
- Settings and configuration

### ⚠️ **Still Visible on GitHub.com:**
- Repository code (if public repo)
- Commit history
- Documentation files
- All source files

**Why?** GitHub Pages serves from a public repository. Files are visible on github.com but not easily browsable via the live site.

---

## 🎯 URL Structure

```
Root (/)
  └─ index.html → Redirects to /public/catalog.html
  └─ robots.txt → Tells search engines what to index
  └─ .nojekyll → Prevents Jekyll processing

/public/
  ├─ catalog.html ✅ PUBLIC - Product catalog
  ├─ catalog-styles.css ✅ PUBLIC - Catalog styling
  ├─ catalog-data.json ✅ PUBLIC - Product data
  ├─ admin.html 🔒 PRIVATE - Admin dashboard
  └─ styles.css 🔒 PRIVATE - Admin styling

/src/
  ├─ app.js 🔒 PRIVATE - Admin logic
  ├─ catalog.js 🔒 PRIVATE - Catalog logic
  └─ data/ 🔒 PRIVATE - Data files

/*.md 🔒 PRIVATE - Documentation files
```

---

## 🔍 How This Improves Security

### **Before:**
```
Main URL → Shows directory listing or index.html
People could browse all files
Admin was at obvious /public/index.html
Docs visible in browser
```

### **After:**
```
Main URL → Redirects to catalog (public view)
Admin at obscure /public/admin.html
robots.txt discourages indexing of admin
No directory listing
Docs discouraged by robots.txt
```

---

## 🛡️ Security Levels

### **Level 1: Casual Browsing** ✅ PROTECTED
- Users typing main URL see only catalog
- No obvious admin links
- Search engines won't index admin (robots.txt)
- Documentation not easily found

### **Level 2: Source Code** ⚠️ VISIBLE
- Anyone can view on github.com
- Source code is public
- Commit history visible
- **Solution:** This is normal for open source projects

### **Level 3: Admin Access** ✅ PROTECTED
- Requires knowing exact URL (/public/admin.html)
- No authentication (anyone with URL can access)
- **Solution:** Keep URL secret, or add authentication (requires backend)

---

## 💡 Best Practices

### **For Customers:**
✅ Share: `https://arunsaispk12.github.io/print-genie-catalog/`
✅ They see: Beautiful product catalog
✅ They can: Browse, search, contact you
❌ They don't see: Admin tools, source code, docs

### **For You:**
✅ Bookmark: `https://arunsaispk12.github.io/print-genie-catalog/public/admin.html`
✅ Access: Use this for managing products
✅ Keep secret: Don't share this URL
✅ Use: Configure auto-publish in Settings tab

---

## 🔐 Additional Security Options

### **Option 1: Different Repository (Recommended)**
Create two separate repos:
- **print-genie-catalog-public** (public) → Only catalog files
- **print-genie-admin** (private) → Admin dashboard

### **Option 2: Private Repository**
Make repo private:
- ❌ GitHub Pages won't work (on free plan)
- ✅ Source code hidden
- Alternative: Use paid GitHub plan or different hosting

### **Option 3: Add Authentication**
Add password protection:
- Requires backend service (not static hosting)
- Options: Netlify, Vercel, Firebase
- More complex setup

### **Option 4: Use Subdomain**
- **catalog.printgenie.com** → Public catalog
- **admin.printgenie.com** → Admin dashboard
- Requires: Custom domain + DNS setup

---

## ⚠️ Important Notes

### **Repository Visibility**

Your GitHub repository is **PUBLIC**, which means:

✅ **OK to be public:**
- Product catalog code
- Product data (prices, descriptions)
- Public-facing styles and scripts
- This is normal for static sites

❌ **Never commit:**
- Customer personal data
- Payment information
- API keys or secrets
- Private business documents

### **Admin URL Security**

The admin dashboard at `/public/admin.html` has:
- ✅ Obscure URL (not guessable)
- ✅ No links from public pages
- ✅ Not indexed by search engines
- ❌ No password protection (anyone with URL can access)

**To keep secure:**
- Don't share the admin URL
- Clear browser history on shared devices
- Use private/incognito when accessing admin on public WiFi
- Consider adding authentication if needed

---

## 📊 Access Summary

| URL | Purpose | Share? | Security |
|-----|---------|--------|----------|
| `/` | Public Catalog | ✅ YES | Public |
| `/public/catalog.html` | Public Catalog | ✅ YES | Public |
| `/public/admin.html` | Admin Dashboard | ❌ NO | Obscured URL |
| GitHub repo | Source Code | ℹ️ Visible | Public repo |

---

## 🆘 If Admin URL Gets Exposed

If someone accidentally gets your admin URL:

1. **Rename the file:**
   ```bash
   mv public/admin.html public/manage-products-2024.html
   # or any random name
   ```

2. **Commit and push:**
   ```bash
   git add .
   git commit -m "Rename admin"
   git push
   ```

3. **Update your bookmark:**
   - New URL: `https://arunsaispk12.github.io/print-genie-catalog/public/manage-products-2024.html`

4. **Optional - Add basic auth:**
   - Requires backend service
   - Contact me if you need help with this

---

## ✅ Checklist

Security setup:
- [x] Root index.html redirects to catalog
- [x] Admin renamed from index.html to admin.html
- [x] robots.txt discourages indexing
- [x] .nojekyll prevents Jekyll processing
- [x] No admin links in public pages
- [ ] Bookmark admin URL
- [ ] Don't share admin URL
- [ ] Share only main URL with customers

---

## 🎯 Quick Reference

**Share with customers:**
```
https://arunsaispk12.github.io/print-genie-catalog/
```

**Your admin access (keep secret):**
```
https://arunsaispk12.github.io/print-genie-catalog/public/admin.html
```

**Bookmark both:**
- Add catalog to your business cards
- Bookmark admin for easy access
- Never share admin link!

---

**Last Updated:** January 8, 2026
**Security Level:** Obscurity-based (no authentication)
**Recommendation:** Suitable for most use cases, upgrade to authenticated system if handling sensitive data
