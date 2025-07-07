# Express API for Warehouse app

This folder serves as the scaffold of the application that is a part of the interview process for candidates attending on the position in CloudTalk.

Backend API server built with Express, Prisma, and TypeScript.

---

🚀 Getting Started

Prerequisites:

- Node.js v22.11.0 or higher
- npm package manager

- Set in .env:
  ```
  DATABASE_URL="file:./dev.db"
Installation:

```
npm install
```

---
🔧 Prisma Setup

📦 Create your SQLite database:

```
npx prisma migrate dev --name init
```
⚙️ Generate the client:

```
npx prisma generate
```

🌱 Seed sample data (optional):

```
npm run seed
```

---

Running the Development Server:

```
npm run start
```


Make sure your .env file is configured properly and Prisma migrations are applied before seeding.

---

🧪 Running Tests

Run tests with Jest:

```
npm test
```

---

🏪 Products API (/products):
POST /products – Create a new product

GET /products – List all products (paginated with page and limit query params)

GET /products/:id – Get a product by ID

PATCH /products/:id – Update a product by ID

DELETE /products/:id – Delete a product by ID


Create a new product (POST /products)
```
curl -X POST http://localhost:3000/products \
-H "Content-Type: application/json" \
-d '{
"name": "Sample Product",
"quantity": 100,
"unitPrice": 29.99,
"imageUrl": "http://example.com/image.jpg",
"description": "This is a sample product."
}'
```


Get all products (GET /products)

Supports optional pagination query params: limit (default 10), page (default 1)
```
curl http://localhost:3000/products?limit=5&page=1
```
Get product by ID (GET /products/:id)

Replace :id with actual product ID, e.g., 1
```
curl http://localhost:3000/products/1

```

Update product by ID (PATCH /products/:id)

Replace :id with actual product ID, e.g., 1

Partial update allowed, only send fields you want to change.
```
curl -X PATCH http://localhost:3000/products/1 \
  -H "Content-Type: application/json" \
  -d '{
    "quantity": 150,
    "unitPrice": 25.50
  }'

```
Delete product by ID (DELETE /products/:id)
Replace :id with actual product ID, e.g., 1
```
curl -X DELETE http://localhost:3000/products/1
```
TODO:
- Create test DB
- Refactoring
