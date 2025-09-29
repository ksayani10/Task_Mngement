// api/src/server.ts
import app from "./index";

console.log("Starting API...");
const PORT = Number(process.env.PORT ?? 4000);
app.listen(PORT, () => {
  console.log(`API → http://localhost:${PORT}`);
});
