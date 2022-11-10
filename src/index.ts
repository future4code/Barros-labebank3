import expres from "express";
import cors from "cors";

const app = expres();

app.use(expres.json());
app.use(cors());





























app.listen(3003, () => {
    console.log("Server is running in http://localhost:3003");
});