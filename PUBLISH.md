# Publish to GitHub Pages (ad6190 only)

Use your **personal** account **ad6190** only—not adbhatnagar/AD credentials.

Your site will be at **https://ad6190.github.io/nxaditi-blog/**.

---

## 1. Use ad6190 with GitHub CLI

In Terminal, log in as **ad6190** so `gh` stops using adbhatnagar:

```bash
gh auth login -h github.com -p https -w
```

- When asked which account to log into, choose **GitHub.com** (not Enterprise).
- When asked for a preferred protocol, choose **HTTPS** (or SSH if you prefer).
- Complete the browser flow and sign in as **ad6190** (personal).

To confirm:

```bash
gh auth status
```

You should see **ad6190** for github.com, not adbhatnagar.

(Optional: to stop using the work account for github.com:  
`gh auth logout -h github.com -u adbhatnagar`)

---

## 2. Create the repo and push (ad6190)

From the project folder, create the repo under **ad6190** and push:

```bash
cd /Users/aditi.bhatnagar/Documents/aditi_labs/nxaditi-blog

gh repo create nxaditi-blog --public --source=. --remote=origin --push --description "React blog from Obsidian vault"
```

If `origin` already exists and points somewhere else, either remove it first or let `gh` overwrite:

```bash
git remote remove origin
gh repo create nxaditi-blog --public --source=. --remote=origin --push --description "React blog from Obsidian vault"
```

That creates **ad6190/nxaditi-blog** and pushes `main`.

---

## 3. Turn on GitHub Pages

1. Open **https://github.com/ad6190/nxaditi-blog**
2. **Settings** → **Pages**
3. Under **Build and deployment**, set **Source** to **GitHub Actions**
4. Save

The “Deploy blog to GitHub Pages” workflow will run on the push from step 2. When it finishes, the site is live at **https://ad6190.github.io/nxaditi-blog/**.
