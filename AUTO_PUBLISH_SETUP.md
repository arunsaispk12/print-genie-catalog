# One-Click Auto-Publish Setup Guide

## 🎉 What's New?

**No more manual downloads or git commands!** Your catalog now publishes to GitHub with **ONE CLICK** from your browser!

---

## ⚡ Quick Setup (5 Minutes)

### Step 1: Create GitHub Token

1. **Open GitHub Settings:**
   - Go to: https://github.com/settings/tokens
   - Or: GitHub → Settings → Developer Settings → Personal Access Tokens → Tokens (classic)

2. **Generate New Token:**
   - Click **"Generate new token (classic)"**
   - Note: `Print Genie Auto-Publish`
   - Expiration: Choose `90 days` or `No expiration`
   - Select scopes: ✅ **`repo`** (Full control of private repositories)
   - Scroll down and click **"Generate token"**

3. **Copy Your Token:**
   - ⚠️ **IMPORTANT:** Copy the token **immediately**!
   - It looks like: `ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`
   - You won't see it again!

### Step 2: Configure in Dashboard

1. **Open Your Dashboard:**
   ```
   https://arunsaispk12.github.io/print-genie-catalog/public/
   ```

2. **Go to Settings Tab:**
   - Click **"⚙️ Settings"** tab (wait for page to load)

3. **Enter Your Information:**
   - **GitHub Username:** `arunsaispk12`
   - **Repository Name:** `print-genie-catalog`
   - **Personal Access Token:** `paste your token here`
   - **Branch Name:** `main` (default)

4. **Test Connection:**
   - Click **"🔗 Test Connection"** button
   - Wait for confirmation
   - Should show: ✅ Connection successful!

5. **Save Settings:**
   - Click **"💾 Save Settings"** button
   - Confirmation: ✅ GitHub settings saved!

### Step 3: Test Auto-Publish!

1. **Add a Test Product:**
   - Go to "Add Product" tab
   - Fill in any product details
   - Click "Add Product to Catalog"

2. **Publish It:**
   - Go to "View Catalog" tab
   - Click **"🚀 Publish Catalog"** button
   - Confirm the dialog
   - Watch it publish automatically! ✨

3. **Verify Success:**
   - Should show: ✅ Catalog published successfully!
   - Wait 1-2 minutes for GitHub Pages to deploy
   - Open your catalog: `https://arunsaispk12.github.io/print-genie-catalog/public/catalog.html`
   - Your test product should appear!

---

## 🚀 Daily Usage (SO EASY!)

From now on, every time you add or update products:

```
1. Add products in admin dashboard
2. Click "🚀 Publish Catalog"
3. Confirm
4. Done! ✅

No downloads, no terminal, no git commands!
```

Your customers will see updates in 1-2 minutes automatically.

---

## 🔒 Security Notes

### Where is My Token Stored?

- ✅ Stored in **your browser's localStorage only**
- ✅ Only on **this device**
- ✅ **Never** sent to any server except api.github.com
- ✅ **Never** shared or logged
- ✅ Can be cleared anytime in Settings tab

### Is This Safe?

**YES!** Here's why:
- Token only gives access to your repositories (nothing else)
- Token is device-specific (not synced across browsers)
- You control the token (can delete/regenerate anytime)
- Standard GitHub API practice
- Uses HTTPS (encrypted)

### Best Practices:

1. **Use token expiration** - Set to 90 days, regenerate periodically
2. **Clear on shared devices** - Don't configure on public computers
3. **Use HTTPS only** - Never on public WiFi without VPN
4. **Keep token secret** - Don't share or screenshot

---

## 🔧 Troubleshooting

### Problem: "Authentication failed"

**Solution:**
- Token expired or invalid
- Go to GitHub → Regenerate token
- Update in Settings tab
- Test connection again

### Problem: "Repository not found"

**Solution:**
- Check username: Should be `arunsaispk12` (your actual username)
- Check repo name: Should be `print-genie-catalog` (exact match)
- Make sure repo exists and you have write access

### Problem: "Publishing failed"

**Solutions:**
1. **Check internet connection** - Must be online
2. **Verify token permissions** - Needs `repo` scope
3. **Test connection** - Use "Test Connection" button
4. **Check browser console** - F12 → Console tab for errors
5. **Try manual mode** - Falls back if API fails

### Problem: "Button does nothing"

**Solutions:**
1. **Hard refresh** - Ctrl+Shift+R (Cmd+Shift+R on Mac)
2. **Clear cache** - Browser settings → Clear cache
3. **Check console** - F12 → Console for JavaScript errors
4. **Try different browser** - Chrome, Firefox, Edge

### Problem: Settings won't save

**Solutions:**
1. **Check localStorage** - Make sure browser allows it
2. **Disable private mode** - Use normal browsing mode
3. **Allow cookies** - Browser needs localStorage enabled
4. **Try different browser** - Some browsers restrict localStorage

---

## 📱 Mobile Usage (Android/iPhone)

Yes, it works on mobile too!

1. Open dashboard on mobile browser
2. Go to Settings tab
3. Configure GitHub token (same steps)
4. Use "Publish Catalog" button from phone
5. No terminal needed!

---

## 🎯 What Happens When You Publish?

### Behind the Scenes:

```
1. Your browser bundles all products into JSON
2. Encodes it to base64
3. Sends to GitHub API:
   - Fetches current file SHA
   - Creates/updates catalog-data.json
   - Commits with message
4. GitHub saves the file
5. GitHub Pages rebuilds (1-2 min)
6. Your catalog is live!
```

### What Your Customers See:

- Open catalog link
- Fetch catalog-data.json from GitHub
- See all your published products
- Browse, search, filter
- No login required

---

## 🆘 Need Help?

### If Auto-Publish Isn't Working:

1. **Fallback Mode Still Works:**
   - Click "Publish Catalog"
   - Choose manual download
   - Use old git commands

2. **Check GitHub Token:**
   - Go to: https://github.com/settings/tokens
   - Find your token
   - Check expiration date
   - Verify `repo` scope is checked

3. **Test Manually:**
   - Open browser console (F12)
   - Run: `localStorage.getItem('githubSettings')`
   - Should show your settings (token masked)

4. **Clear and Reconfigure:**
   - Click "Clear Settings" in Settings tab
   - Create new token
   - Configure again

---

## 📊 Comparison

### Before Auto-Publish:
```
⏰ Time: 2-3 minutes per update
📝 Steps: 8 manual commands
💻 Required: Terminal access
🧠 Skill: Git knowledge needed
```

### After Auto-Publish:
```
⏰ Time: 10 seconds per update
📝 Steps: 1 button click
💻 Required: Just a browser
🧠 Skill: None needed!
```

---

## ✨ Tips

1. **Configure Once, Use Forever:**
   - Token stays saved in browser
   - No need to re-enter each time

2. **Publish Regularly:**
   - After adding multiple products
   - Once a day is usually enough
   - Customers see changes in 1-2 minutes

3. **Test Before Sharing:**
   - Publish your products
   - Open catalog link yourself
   - Verify everything looks good
   - Then share with customers

4. **Monitor Your Token:**
   - Set expiration reminder
   - Regenerate before expiry
   - Update in Settings if needed

5. **Backup Option:**
   - Manual download still available
   - Use if API has issues
   - Full backward compatibility

---

## 🎓 Advanced

### Token Scopes Explained:

**`repo` scope gives:**
- Read/write access to code
- Create/update files
- Create commits
- Required for Contents API

**Does NOT give:**
- Account password
- Personal information access
- Access to other repos (if using fine-grained token)
- Billing or admin access

### GitHub API Used:

```javascript
// Get file (to update existing)
GET /repos/:owner/:repo/contents/:path

// Create/update file
PUT /repos/:owner/:repo/contents/:path
{
  "message": "Update catalog",
  "content": "base64EncodedContent",
  "sha": "existingFileSHA" // if updating
}
```

### Rate Limits:

- **With auth token:** 5,000 requests/hour
- Your usage: ~2 requests per publish
- Plenty for normal use!

---

## 🎯 Checklist

Before first use:

- [ ] Created GitHub Personal Access Token
- [ ] Token has `repo` scope
- [ ] Copied token immediately
- [ ] Opened Settings tab in dashboard
- [ ] Entered username, repo, token
- [ ] Tested connection successfully
- [ ] Saved settings
- [ ] Added test product
- [ ] Published successfully
- [ ] Verified on public catalog
- [ ] Ready to share with customers!

---

## 🚀 You're All Set!

From now on, publishing your catalog is as easy as:

**1 Click → 2 Minutes → Live Catalog!**

No technical skills needed. No terminal commands. Just works! ✨

---

**Questions?** Open the Settings tab in your dashboard - all instructions are there!

**Last Updated:** January 8, 2026
