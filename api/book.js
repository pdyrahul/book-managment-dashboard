export default async function handler(req, res) {
  const response = await fetch("https://books-api.free.beeceptor.com/api/books", {
    method: req.method,
    headers: { "Content-Type": "application/json" },
    body: req.method !== "GET" ? JSON.stringify(req.body) : undefined,
  });

  const data = await response.json();
  res.status(response.status).json(data);
}
