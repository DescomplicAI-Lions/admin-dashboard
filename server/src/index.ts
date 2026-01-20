import express from 'express';
import type { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import pkg from 'pg';

const { Pool } = pkg;
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Rota integrada para o Dashboard
app.get('/api/dashboard', async (req: Request, res: Response) => {
  try {
    // 1. Busca contagem real de usuários da tabela do UserService
    const usersCountResult = await pool.query('SELECT COUNT(*) FROM users');
    const totalUsers = usersCountResult.rows[0].count;

    // 2. Busca transações fazendo JOIN com a tabela de usuários para pegar o NOME
    let transactions = [];
    try {
      const transResult = await pool.query(`
        SELECT 
          t.id, 
          u.nome as "userName", 
          t.date, 
          t.products, 
          t.cost 
        FROM transactions t
        LEFT JOIN users u ON t.user_id = u.id
        ORDER BY t.date DESC 
        LIMIT 10
      `);
      transactions = transResult.rows;
    } catch (dbErr) {
      console.warn("⚠️ Falha ao buscar transações reais. Verifique as tabelas.");
    }

    // 3. Busca dados para o gráfico de Pizza (Distribuição por Cargo/Role)
    const rolesResult = await pool.query(`
      SELECT role as name, COUNT(*) as value 
      FROM users 
      GROUP BY role
    `);

    res.json({
      metrics: {
        totalCustomers: totalUsers || "0", // Agora vem do banco!
        todaySales: "R$ 12.500",
        monthlySales: "R$ 285.000",
        yearlySales: "R$ 3.250.000",
        roi: "32%",
        monthlyGoal: "85%",
        avgTicket: "R$ 245",
        conversion: "12.5%",
      },
      chartData: [
        { name: "Jan", vendas: 4000, custo: 2400 },
        { name: "Fev", vendas: 3000, custo: 1398 },
        { name: "Mar", vendas: 9800, custo: 2000 },
        { name: "Abr", vendas: 3908, custo: 2780 },
        { name: "Mai", vendas: 4800, custo: 1890 },
        { name: "Jun", vendas: 3800, custo: 2390 },
      ],
      // Dados dinâmicos para o gráfico de pizza (Roles do UserService)
      pieData: rolesResult.rows.length > 0 ? rolesResult.rows : [
        { name: "Sem Dados", value: 1 }
      ],
      transactions: transactions.length > 0 ? transactions : [
        { id: 1, userName: "Usuário Exemplo", date: "2024-01-20", products: 0, cost: 0.0 }
      ]
    });
  } catch (err: any) {
    console.error("❌ Erro fatal no endpoint:", err.message);
    res.status(500).json({ error: "Erro interno do servidor", details: err.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});