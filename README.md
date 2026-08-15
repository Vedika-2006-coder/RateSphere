# RateSphere Insights

You are a senior full-stack engineer, software architect, database architect, security engineer, product designer, UX specialist, and QA engineer.

Build a complete, production-quality full-stack web application called:

RATESPHERE

Tagline:

"Discover. Rate. Trust."

This application is being developed for a competitive Full Stack Intern Coding Challenge. It will be evaluated against many similar submissions.

The goal is NOT to create a simple CRUD demo.

Build a genuinely functional, polished, secure, responsive, maintainable application that strictly satisfies the official challenge requirements while providing a distinctive and professional user experience.

IMPORTANT:

Build the ACTUAL WORKING APPLICATION.

Do NOT create:

- static mockups

- fake authentication

- fake statistics

- fake API responses

- non-functional buttons

- hardcoded dashboard statistics

- fake database behavior

- placeholder functionality for required features

- a role selector on the login page

- public demo passwords or credentials

All required functionality must be implemented end-to-end wherever the environment supports it.

============================================================

1. OFFICIAL CHALLENGE REQUIREMENTS

============================================================

The application is a store-rating platform.

Users can submit ratings from 1 to 5 for registered stores.

There are exactly THREE roles:

1. System Administrator

2. Normal User

3. Store Owner

There must be ONE common login system for all roles.

The user must NOT select their role before logging in.

The authenticated user's role must come from the database/backend.

After successful authentication, redirect according to role:

Normal User:

 /dashboard

Store Owner:

 /owner/dashboard

System Administrator:

 /admin/dashboard

Backend authorization is mandatory.

The challenge permits:

Frontend:

ReactJS

Backend:

ExpressJS OR Loopback OR NestJS

Database:

PostgreSQL OR MySQL

For this implementation, use:

FRONTEND:

React.js

JavaScript

Vite

React Router

Tailwind CSS

Lucide React

React Hook Form

Zod

Recharts

BACKEND:

Node.js

Express.js

REST APIs

DATABASE:

MySQL

mysql2

AUTHENTICATION:

JWT

bcrypt/bcryptjs

IMPORTANT:

MySQL and Express.js are mandatory for this implementation.

Do NOT replace MySQL with:

- PostgreSQL

- Supabase database

- MongoDB

- Firebase

Do NOT replace Express.js with:

- Supabase Edge Functions

- another backend framework

============================================================

2. LOVABLE ENVIRONMENT CONSTRAINT

============================================================

If the current Lovable environment cannot directly execute an Express.js + MySQL backend:

DO NOT silently substitute another backend or database.

Instead:

1. Build the complete React frontend.

2. Create the Express.js backend source code and configuration where supported.

3. Create the MySQL schema.

4. Create the seed SQL.

5. Create a clean frontend API/service layer.

6. Use environment variables for the API URL.

7. Make the project portable to VS Code.

8. Clearly document any external setup required.

9. Keep the architecture ready for the Express REST API.

The final source must be exportable to GitHub and continue to work in VS Code.

Never replace MySQL or Express.js just to make the preview appear functional.

============================================================

3. PROJECT STRUCTURE

============================================================

Use a clean full-stack structure similar to:

RateSphere/

├── frontend/

│   ├── src/

│   │   ├── components/

│   │   ├── pages/

│   │   ├── layouts/

│   │   ├── routes/

│   │   ├── hooks/

│   │   ├── services/

│   │   ├── context/

│   │   ├── schemas/

│   │   └── utils/

│   └── ...

│

├── backend/

│   ├── src/

│   │   ├── config/

│   │   ├── controllers/

│   │   ├── middleware/

│   │   ├── routes/

│   │   ├── services/

│   │   ├── repositories/

│   │   ├── validators/

│   │   └── utils/

│   └── ...

│

├── database/

│   ├── schema.sql

│   └── seed.sql

│

├── .env.example

├── .gitignore

└── README.md

If Lovable requires a different project structure, preserve framework conventions while maintaining the same separation of concerns.

============================================================

4. DATABASE DESIGN

============================================================

Use normalized MySQL.

Minimum tables:

users

stores

ratings

USERS:

id

name

email

password_hash

address

role

created_at

updated_at

ROLE VALUES:

administrator

normal_user

store_owner

EMAIL:

Must be unique.

STORES:

id

name

email

address

owner_id

created_at

updated_at

owner_id references the store owner's user account.

RATINGS:

id

user_id

store_id

rating

created_at

updated_at

rating must be an integer from 1 to 5.

A normal user can have only ONE rating for a particular store.

Enforce:

UNIQUE(user_id, store_id)

Use:

- primary keys

- foreign keys

- unique constraints

- NOT NULL constraints

- appropriate indexes

- timestamps

- referential integrity

Use parameterized SQL.

Prevent SQL injection.

Create:

database/schema.sql

database/seed.sql

Do not expose password_hash through APIs.

============================================================

5. AUTHENTICATION

============================================================

Create ONE common login page.

Fields:

Email

Password

Do NOT display:

- role selection

- administrator credentials

- store owner credentials

- normal user credentials

- demo passwords

- JWT secrets

- database credentials

Login flow:

React

→ POST /api/auth/login

→ Express

→ find user by email

→ bcrypt password verification

→ determine role from database

→ generate JWT

→ return safe user information

→ frontend redirects according to role

JWT must contain only necessary claims.

Never return password_hash.

Never store plaintext passwords.

Implement:

- login

- logout

- protected sessions/token handling

- password change

============================================================

6. NORMAL USER REGISTRATION

============================================================

Public registration must create ONLY:

normal_user

Users must NOT be able to select:

administrator

store_owner

during public signup.

Signup fields:

Name

Email

Address

Password

Confirm Password

After successful registration:

- show a polished success message

- redirect to login

============================================================

7. VALIDATION

============================================================

Apply validation on BOTH frontend and backend.

NAME:

Minimum 20 characters.

Maximum 60 characters.

ADDRESS:

Maximum 400 characters.

PASSWORD:

8–16 characters.

Must contain:

- at least one uppercase letter

- at least one special character

EMAIL:

Standard email validation.

RATING:

Integer from 1 to 5.

Use clear validation messages.

Example:

"Password must be 8–16 characters and contain at least one uppercase letter and one special character."

Do not rely only on frontend validation.

============================================================

8. NORMAL USER FUNCTIONALITY

============================================================

Normal users can:

- register

- login

- logout

- change password

- view all registered stores

- search stores by Name

- search stores by Address

- submit ratings from 1 to 5

- modify their own rating

- view their current submitted rating

Store listings must display:

- Store Name

- Address

- Overall Rating

- User's Submitted Rating

- option to submit rating

- option to modify rating

Create an excellent interactive star-rating component.

The rating interaction should support:

- hover feedback

- selected state

- numerical rating

- accessible labels

- keyboard accessibility

- loading state

- success state

- error state

When a rating is submitted or modified:

- update the UI without unnecessary full-page reload

- persist to MySQL

- update relevant rating statistics

Prevent duplicate ratings using both:

- backend logic

- database UNIQUE(user_id, store_id)

============================================================

9. NORMAL USER DASHBOARD

============================================================

Route:

/dashboard

Create a polished dashboard.

Display useful real database information such as:

- personalized welcome message

- total registered stores

- number of stores rated by the current user

- user's average submitted rating

Provide:

- store discovery

- search

- sorting

- store cards/list

- current rating indicators

Do not use hardcoded statistics.

============================================================

10. STORE OWNER

============================================================

Store owners can:

- login

- logout

- change password

Store owners can view ONLY their authorized store data.

Route:

/owner/dashboard

Display:

- Store Name

- Address

- Average Rating

- Total Ratings

Also display the users who submitted ratings for the owner's store:

- User Name

- User Email

- Rating

- Rating Date

Display real rating statistics:

- average rating

- rating distribution from 1 to 5

- recent rating activity where appropriate

All statistics must come from MySQL.

Never hardcode chart values.

CRITICAL SECURITY REQUIREMENT:

A Store Owner must not be able to access another owner's store by:

- changing the URL

- changing a store ID

- modifying a request

- calling an API directly

Every owner resource request must be authorized on the backend.

If multiple stores belong to one owner, show only that owner's authorized stores.

============================================================

11. ADMINISTRATOR

============================================================

Route:

/admin/dashboard

Display real database statistics:

- Total Users

- Total Stores

- Total Submitted Ratings

Administrator can:

- add normal users

- add store owners

- add administrator users

- add stores

- view users

- view stores

- view user details

- view store details

- search

- filter

- sort

- logout

============================================================

12. ADMIN USER MANAGEMENT

============================================================

Create a professional user-management interface.

Display:

Name

Email

Address

Role

Support:

- search

- filtering

- ascending sorting

- descending sorting

- pagination where useful

Filtering/search should support:

Name

Email

Address

Role

Administrator can create:

normal_user

store_owner

administrator

Passwords must be securely hashed.

When viewing a user:

Display:

Name

Email

Address

Role

If the user is a Store Owner, display their associated store's rating information as required by the challenge.

Never display password hashes.

============================================================

13. ADMIN STORE MANAGEMENT

============================================================

Create a professional store-management page.

Store fields:

Store Name

Email

Address

Owner

Display:

Store Name

Email

Address

Rating

Also show owner information where appropriate.

Support:

- search

- filtering

- ascending sorting

- descending sorting

- pagination where useful

Search/filter:

Store Name

Email

Address

Owner

Sorting:

Name

Email

Address

Rating

Average rating must come from actual ratings in MySQL.

============================================================

14. ROLE-BASED AUTHORIZATION

============================================================

Implement protected routes.

Frontend route protection is for UX only.

Backend authorization is the actual security mechanism.

Create:

authentication middleware

role authorization middleware

resource ownership checks

Rules:

Normal User:

- cannot access administrator APIs

- cannot access store-owner APIs

- can modify only their own ratings

- cannot change their own role

Store Owner:

- cannot access administrator APIs

- can access only their authorized store data

Administrator:

- can access administrator management APIs

Never trust role information sent from the frontend.

============================================================

15. REST API

============================================================

Create clean REST APIs.

Authentication:

POST /api/auth/register

POST /api/auth/login

PATCH /api/auth/password

Stores:

GET /api/stores

GET /api/stores/:id

POST /api/stores

Ratings:

POST /api/stores/:storeId/ratings

PUT /api/stores/:storeId/ratings

GET /api/stores/:storeId/ratings

Users:

GET /api/users

GET /api/users/:id

POST /api/users

Dashboards:

GET /api/user/dashboard

GET /api/owner/dashboard

GET /api/admin/dashboard

Use appropriate HTTP methods and status codes.

Use:

400 validation error

401 authentication error

403 authorization error

404 not found

409 conflict

500 server error

Use consistent JSON error responses.

Never expose stack traces or sensitive implementation details.

============================================================

16. UI/UX

============================================================

This application will compete with many similar submissions.

The visual quality must be significantly better than a basic CRUD application.

Brand:

RateSphere

Tagline:

"Discover. Rate. Trust."

Design direction:

Premium modern SaaS + trustworthy store discovery platform.

Use:

- sophisticated typography

- excellent spacing

- strong visual hierarchy

- elegant cards

- refined shadows

- tasteful gradients

- high-quality Lucide icons

- polished charts

- clean tables

- subtle transitions

- responsive layouts

Avoid:

- generic admin templates

- excessive gradients

- childish colors

- excessive animations

- unnecessary stock photography

- clutter

- visually unrelated components

Maintain one consistent design system throughout the entire application.

============================================================

17. LANDING PAGE

============================================================

Create a memorable professional landing page.

Hero:

RateSphere

"Discover. Rate. Trust."

Explain the product clearly:

Discover stores.

Share ratings.

Build trust.

Include:

- primary Explore Stores CTA

- Login CTA

- Sign Up CTA

- store discovery preview

- rating visualization

- trust/reputation concept

- How It Works section

- professional footer

Do not use fake platform statistics that could be mistaken for real production data.

Any visual store examples must be clearly treated as illustrative UI content.

============================================================

18. LOGIN

============================================================

Create a premium login experience.

Fields:

Email

Password

Features:

- show/hide password

- validation

- loading state

- error state

- keyboard accessibility

- polished transitions

Do NOT include:

- role selection

- demo credentials

- public passwords

============================================================

19. SIGNUP

============================================================

Create a polished registration experience.

Fields:

Full Name

Email

Address

Password

Confirm Password

Clearly communicate the password requirements.

Public signup always creates:

normal_user

============================================================

20. ROLE-AWARE NAVIGATION

============================================================

Normal User navigation:

Dashboard

Stores

My Ratings

Change Password

Logout

Store Owner navigation:

Dashboard

My Store

Ratings

Analytics

Change Password

Logout

Administrator navigation:

Dashboard

Users

Stores

Ratings

Change Password

Logout

Only show navigation relevant to the authenticated role.

However, remember:

Hiding navigation is NOT security.

Backend authorization is mandatory.

============================================================

21. SEARCH, FILTERING AND SORTING

============================================================

Search/filter/sort must be genuinely functional.

Do not make controls decorative.

Normal User:

Search stores by:

- Name

- Address

Administrator Users:

Search/filter by:

- Name

- Email

- Address

- Role

Administrator Stores:

Search/filter by:

- Name

- Email

- Address

- Owner

Support ascending and descending sorting for key fields.

Use backend query parameters where appropriate.

Use efficient SQL queries.

Add pagination where useful.

============================================================

22. RESPONSIVE DESIGN

============================================================

The entire application must work properly on:

- desktop

- laptop

- tablet

- mobile

Mobile requirements:

- responsive navigation

- sidebar/drawer

- stacked cards

- usable forms

- responsive tables

- touch-friendly rating controls

Do not simply shrink the desktop layout.

============================================================

23. ACCESSIBILITY

============================================================

Implement:

- semantic HTML

- proper form labels

- keyboard navigation

- visible focus states

- aria labels

- accessible buttons

- accessible star rating

- adequate contrast

- reduced-motion support

Do not communicate information using color alone.

============================================================

24. LOADING, EMPTY AND ERROR STATES

============================================================

Every data-driven page must have:

- loading state

- empty state

- error state

- success state

Examples:

"No stores found."

"You haven't rated any stores yet."

"No users have rated your store yet."

Use skeleton loaders where appropriate.

Never leave blank screens while data is loading.

============================================================

25. SECURITY

============================================================

Implement:

- bcrypt/bcryptjs password hashing

- JWT authentication

- role-based authorization

- resource ownership checks

- parameterized MySQL queries

- backend validation

- Helmet

- appropriate CORS configuration

- environment variables

- secure error handling

Never expose:

- JWT secret

- database password

- password hashes

- API secrets

Do not put secrets into frontend source code.

============================================================

26. ENVIRONMENT

============================================================

Create:

.env.example

Include:

DB_HOST=

DB_PORT=

DB_USER=

DB_PASSWORD=

DB_NAME=

JWT_SECRET=

PORT=

VITE_API_BASE_URL=

Never commit actual secrets.

Create a proper .gitignore.

============================================================

27. DEVELOPMENT SEED DATA

============================================================

Create realistic development seed data for:

- 1 administrator

- multiple store owners

- multiple normal users

- multiple stores

- realistic ratings

Passwords must be hashed.

Do NOT display seed credentials in the public application.

Document development setup appropriately in README without exposing credentials in the production UI.

Ensure seed relationships demonstrate:

- multiple users

- multiple stores

- multiple store owners

- multiple ratings

- owner-specific data isolation

============================================================

28. DATABASE INTEGRITY

============================================================

Ensure:

- duplicate emails are prevented

- duplicate user/store ratings are prevented

- invalid ratings cannot be inserted

- foreign keys are valid

- store ownership is valid

- orphaned rating records cannot occur

- average ratings are calculated from ratings

- role values are constrained

- timestamps are maintained

============================================================

29. README

============================================================

Create a professional README containing:

- project overview

- features

- technology stack

- architecture

- project structure

- MySQL setup

- database creation

- schema initialization

- seed initialization

- environment variables

- frontend startup

- backend startup

- API documentation

- authentication flow

- role permissions

- security practices

- testing instructions

- production build instructions

- deployment guidance

The README must make it easy to continue the project in VS Code.

============================================================

30. TESTING

============================================================

Before considering the application complete, test the major workflows.

Authentication:

- registration

- login

- logout

- wrong password

- invalid email

- duplicate email

- password validation

- role-based redirect

Normal User:

- view stores

- search by name

- search by address

- submit rating

- modify rating

- duplicate rating prevention

- view current rating

- change password

Store Owner:

- login

- dashboard

- average rating

- total ratings

- users who rated

- rating distribution

- data isolation

- change password

Administrator:

- dashboard totals

- create normal user

- create store owner

- create administrator

- create store

- view users

- view stores

- user details

- store details

- search

- filtering

- sorting

Security:

- protected routes

- unauthorized API access

- cross-owner access attempt

- modifying another user's rating

- role escalation attempt

UI:

- loading states

- empty states

- error states

- success states

- mobile layout

- keyboard accessibility

Fix discovered problems rather than hiding them.

============================================================

31. OPTIONAL PRODUCT DIFFERENTIATION

============================================================

After ALL official challenge requirements are working correctly, add a small number of meaningful product enhancements.

Do not add random features.

Possible enhancements:

1. Store rating distribution visualization.

2. Store rating-health indicator derived from real rating data.

3. Owner analytics derived from real ratings.

4. Recent rating activity.

5. Personalized user rating history.

These enhancements must NEVER replace or interfere with the official challenge requirements.

Do not add a generic AI chatbot.

If an AI feature is added, it must provide genuine value and must never invent data.

Core functionality must work even if an optional AI service is unavailable.

============================================================

32. CODE QUALITY

============================================================

Use:

- reusable components

- modular services

- clean controllers

- clean routes

- database repository/service separation

- reusable validation schemas

- meaningful names

- consistent error handling

- minimal duplication

Avoid:

- giant React components

- duplicated business logic

- hardcoded statistics

- hardcoded production data

- insecure shortcuts

- unnecessary dependencies

Keep the project understandable enough for a technical interview.

============================================================

33. PERFORMANCE

============================================================

Avoid:

- unnecessary API requests

- N+1 SQL queries

- excessive frontend re-renders

- unnecessarily large assets

- unnecessary dependencies

Use:

- database indexes

- pagination

- efficient SQL

- lazy loading where useful

- appropriate caching/memoization only when beneficial

============================================================

34. FINAL QUALITY AUDIT

============================================================

Before declaring the project complete, compare the implementation against EVERY official challenge requirement.

Do not mark a feature complete merely because the UI exists.

Verify that the underlying functionality actually works.

Verify:

1. One common login system.

2. Exactly three roles.

3. Normal user registration.

4. Administrator can add stores.

5. Administrator can add normal users.

6. Administrator can add administrators.

7. Administrator dashboard shows:

   - total users

   - total stores

   - total submitted ratings

8. Administrator can view stores with:

   - name

   - email

   - address

   - rating

9. Administrator can view normal/admin users with:

   - name

   - email

   - address

   - role

10. Administrator filtering works.

11. Administrator can view user details.

12. Store-owner rating information is shown where required.

13. Normal user can change password.

14. Normal user can view all stores.

15. Normal user can search by name and address.

16. Store listing displays:

   - store name

   - address

   - overall rating

   - user's submitted rating

   - rating action

17. User can submit 1–5 rating.

18. User can modify their rating.

19. Store owner can login.

20. Store owner can change password.

21. Store owner can see users who rated their store.

22. Store owner can see average rating.

23. All key tables support ascending/descending sorting.

24. Frontend validation works.

25. Backend validation works.

26. Database schema follows best practices.

27. Authorization is enforced on the backend.

28. Passwords are securely hashed.

29. MySQL is actually used.

30. Express.js is actually used.

============================================================

35. FINAL DEVELOPMENT PRIORITY

============================================================

Follow this priority order:

PRIORITY 1:

Official challenge requirements

PRIORITY 2:

Database integrity

PRIORITY 3:

Authentication and authorization

PRIORITY 4:

Backend/API correctness

PRIORITY 5:

Validation and security

PRIORITY 6:

Search/filter/sorting

PRIORITY 7:

Responsive UX

PRIORITY 8:

Visual polish

PRIORITY 9:

Meaningful product differentiation

Never sacrifice required functionality for visual effects.

============================================================

36. FINAL INSTRUCTION

============================================================

Build RateSphere as a serious full-stack application suitable for a live technical interview demonstration.

The final project must be:

- functional

- secure

- maintainable

- responsive

- accessible

- visually polished

- technically explainable

- exportable to GitHub

- runnable in VS Code

- based on React + Express + MySQL

- compliant with the official challenge requirements

Do not silently change the required technology stack.

Do not replace required functionality with mockups.

Do not create fake data for real dashboard statistics.

Do not expose demo credentials publicly.

Do not stop after generating only the landing page.

Implement the complete application and verify the complete role-based workflow.

START NOW.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/b5caa455-20c4-4b3f-b54d-6d23d1c469b3).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
