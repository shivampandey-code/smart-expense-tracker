# Smart Expense Tracker

A responsive personal finance dashboard built with HTML, CSS and vanilla JavaScript. Track income and expenses, view summaries, explore spending categories, and manage transactions.

## Features
- Add, edit and delete income/expense transactions
- Automatic balance, income and expense calculations
- Search transactions and filter by type/category
- Spending breakdown by category
- Monthly income vs expense chart
- Local Storage persistence (data stays in the same browser/device)
- Responsive layout for desktop, tablet and mobile
- Form validation and accessible labels

## Technologies
HTML5 · CSS3 · JavaScript (ES6) · DOM Manipulation · Local Storage

## Project structure
```text
smart-expense-tracker/
├── index.html
├── style.css
├── script.js
├── README.md
└── PROJECT-REPORT.md
```

## Run locally
1. Download or clone this repository.
2. Open `index.html` in a modern browser.
3. Add a transaction using the **Add transaction** button.

No build tools or backend are required.

## Deploy with GitHub Pages
1. Create a public GitHub repository named `smart-expense-tracker`.
2. Upload `index.html`, `style.css`, `script.js`, `README.md` and `PROJECT-REPORT.md` to the repository root.
3. Open **Settings → Pages**.
4. Under **Build and deployment**, choose **Deploy from a branch**.
5. Select branch **main** and folder **/(root)**, then click **Save**.
6. Wait for deployment. Your URL will be `https://YOUR-USERNAME.github.io/smart-expense-tracker/`.

## Git commands
```bash
git init
git status
git add .
git commit -m "Initial commit: create expense tracker structure"
git add index.html style.css script.js
git commit -m "Build responsive expense tracker dashboard"
git add .
git commit -m "Add transaction management and analytics"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/smart-expense-tracker.git
git push -u origin main
git log --oneline
```

## Important note
Transactions are stored in browser Local Storage. They do not automatically sync between devices or browsers. Do not use this demo as a bank account or for storing sensitive financial credentials.
