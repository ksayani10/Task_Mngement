// api/src/server.ts
import app from "./index";
import tasksRouter from "./routes/tasks";
import projectsRouter from "./routes/projects"; 

app.use(projectsRouter); 
app.use(tasksRouter);
console.log("Starting API...");
const PORT = Number(process.env.PORT ?? 4000);
app.listen(PORT, () => {
  console.log(`API → http://localhost:${PORT}`);
});
