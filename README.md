# RateSphere — Discover. Rate. Trust.

RateSphere is a full-stack **store discovery and rating platform** where users can discover stores, submit ratings, and manage their reviews. It provides separate role-based dashboards for **Normal Users, Store Owners, and Administrators**.

### Tech Stack

* **Frontend:** React, TypeScript, Vite, Tailwind CSS
* **Backend:** Node.js, Express.js
* **Database:** MySQL
* **Authentication:** JWT + bcrypt

## Demo Login Credentials

| Role          | Email                       | Password         |
| ------------- | --------------------------- | ---------------- |
| Administrator | `admin@ratesphere.dev`      | `Admin@123`    |
| Store Owner   | `rajeshwari@ratesphere.dev` | `Rajeshwari@123` |
| Normal User   | `harsh@ratesphere.dev`      | `User@123`       |

Use these development accounts to test the role-based features of RateSphere.

### Role Access

* **Administrator:** Dashboard, Users, Stores, Ratings and management features
* **Store Owner:** Dashboard, My Store, Ratings and Analytics
* **Normal User:** Dashboard, Stores, My Ratings and rating submission

### Run Locally

```bash
npm install
npm run dev
```

Backend:

```bash
cd backend
npm install
npm run dev
```

GitHub: https://github.com/Vedika-2006-coder/RateSphere
