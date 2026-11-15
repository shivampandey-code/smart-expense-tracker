# Smart Expense Tracker — Final Project Report

## 1. Project Objective
The main objective of Smart Expense Tracker is to develop a responsive and interactive web application that helps users manage their personal income and expenses in one place. The project demonstrates the practical use of HTML, CSS and JavaScript concepts learned during the six-week web development internship. It also provides experience in using Git for version control, maintaining a GitHub repository and deploying a website through GitHub Pages.

## 2. Project Overview
Smart Expense Tracker is a browser-based personal finance dashboard. Users can record a transaction by entering its title, amount, date, category and an optional note. Each record can be classified as income or expense. The dashboard automatically calculates total income, total expenses and the current balance. It also presents a monthly income-versus-expense chart and a category-wise spending breakdown to help users understand their spending habits. The transaction section supports searching, filtering, editing and deleting records. Data is stored in the browser's Local Storage, so it remains available after refreshing the page on the same browser and device.

## 3. Technologies Used
The project uses HTML5 to create semantic page sections, forms, navigation and tables. CSS3 is used for visual styling, the box model, Flexbox, CSS Grid, transitions and media queries. Vanilla JavaScript (ES6) handles application logic, functions, arrays, objects, event listeners, DOM manipulation, validation and Local Storage. Git and GitHub are used for source-code version control and repository hosting. GitHub Pages is used to publish the static website.

## 4. Main Features
The major features include a responsive dashboard, income and expense summaries, transaction creation, editing and deletion, input validation, search, type and category filters, a monthly cash-flow chart, category spending visualization and browser-based data persistence. The interface is designed to work on desktop, tablet and mobile screens.

## 5. Screenshots
The final submission should include screenshots of the dashboard, the add-transaction form, a transaction list containing sample entries, the analytics section and the mobile layout. These screenshots can be captured after opening the website in a browser.

## 6. Repository and Live Links
GitHub Repository: Add your public repository URL here.
Live Website: Add your GitHub Pages URL here.

## 7. Challenges Faced and Solutions
A key challenge was keeping the dashboard figures and charts updated after transactions changed. I solved this by maintaining transaction records in a JavaScript array and calling a common rendering function after each operation. Another challenge was retaining records after a refresh. Local Storage solved this for the current browser. Responsive CSS Grid, Flexbox and media queries helped the layout adapt to smaller screens.

## 8. Key Learnings and Future Improvements
This project strengthened my knowledge of semantic HTML, responsive CSS, JavaScript logic, DOM events, arrays, objects, browser storage and GitHub deployment. In future versions, I would like to add user authentication, cloud synchronization, budget alerts, recurring transactions, CSV/PDF export and more detailed reports.
