# Inventory System (MERN) — Activity 1.3 Web Application Development

A small inventory web app with full CRUD, built on the MERN stack
(MongoDB, Express, React, Node.js).

## Structure
```
server/   Express + Mongoose REST API  (port 5000)
client/   React (Vite) front-end       (port 5173)
```

## Run locally
Requires Node.js and MongoDB (local install or a free MongoDB Atlas cluster).

```bash
# 1) API
cd server
cp .env.example .env      # edit MONGO_URI if using Atlas
npm install
npm run dev

# 2) Front-end (new terminal)
cd client
npm install
npm run dev               # open http://localhost:5173
```

## REST API
| Method | Endpoint          | Purpose        |
|--------|-------------------|----------------|
| POST   | /api/items        | Create item    |
| GET    | /api/items        | List items     |
| GET    | /api/items/:id    | Get one item   |
| PUT    | /api/items/:id    | Update item    |
| DELETE | /api/items/:id    | Delete item    |

Item fields: `name`, `sku` (unique), `category`, `quantity` (>= 0), `price` (>= 0).
Errors: 400 validation / invalid id, 404 not found, 409 duplicate SKU.

## Testing
Use Thunder Client, Postman or Insomnia with the requests in `server/requests.http`.
