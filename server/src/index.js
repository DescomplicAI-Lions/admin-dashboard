import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import pkg from 'pg';
const { Pool } = pkg; // Destruturação correta para módulos ESM
dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});
app.get('/api/dashboard', async (req, res) => {
    try {
        // Aqui você fará as queries no Postgres depois
        res.json({
            metrics: { totalCustomers: "1,240", todaySales: "R$ 12.500" },
            chartData: [],
            pieData: [],
            transactions: []
        });
    }
    catch (err) {
        res.status(500).json({ error: "Erro interno" });
    }
});
app.listen(5000, () => console.log("🚀 Server running on port 5000"));
//# sourceMappingURL=index.js.map