# RateSphere API (Express.js + MySQL)

REST API powering the RateSphere store-rating platform.

```bash
cd backend
cp .env.example .env      # fill in DB credentials + JWT_SECRET
npm install
npm run db:reset          # creates schema, then loads development seed data
npm run dev               # http://localhost:4000/api
```

Layering: `routes → controllers → services → repositories → MySQL`.
All SQL is parameterised; sort columns are resolved through allow-lists.

See the root `README.md` for full API documentation.
