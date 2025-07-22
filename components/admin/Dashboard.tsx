
import React from 'react';
import { useAppContext } from '../../context/AppContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import { ShoppingCart, UserCheck, BarChart2 } from 'lucide-react';

const StatCard: React.FC<{ icon: React.ReactNode; title: string; value: string; color: string }> = ({ icon, title, value, color }) => (
    <div className="bg-white p-6 rounded-lg shadow flex items-start space-x-4">
        <div className={`p-3 rounded-full ${color}`}>
            {icon}
        </div>
        <div>
            <p className="text-sm text-slate-500">{title}</p>
            <p className="text-2xl font-bold text-secondary">{value}</p>
        </div>
    </div>
);

export const Dashboard: React.FC = () => {
  const { analyticsData } = useAppContext();

  const productChartData = Object.values(analyticsData.productStats)
    .sort((a, b) => b.addedToCart - a.addedToCart)
    .slice(0, 10); // Top 10 products

  const conversionRate = analyticsData.sessionsWithCartItems.size > 0 
    ? ((analyticsData.quotesCompleted / analyticsData.sessionsWithCartItems.size) * 100).toFixed(1)
    : '0.0';

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold text-secondary">Dashboard</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard 
            icon={<ShoppingCart size={24} className="text-white"/>} 
            title="Sessões com itens no carrinho" 
            value={analyticsData.sessionsWithCartItems.size.toString()} 
            color="bg-blue-500" 
        />
        <StatCard 
            icon={<UserCheck size={24} className="text-white"/>} 
            title="Orçamentos Finalizados" 
            value={analyticsData.quotesCompleted.toString()} 
            color="bg-green-500" 
        />
        <StatCard 
            icon={<BarChart2 size={24} className="text-white"/>} 
            title="Taxa de Conversão" 
            value={`${conversionRate}%`}
            color="bg-yellow-500" 
        />
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold text-secondary mb-4">Produtos Mais Adicionados ao Carrinho</h3>
        {productChartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={400}>
            <BarChart data={productChartData} margin={{ top: 5, right: 20, left: 0, bottom: 50 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" angle={-45} textAnchor="end" interval={0} style={{ fontSize: '12px' }} />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Legend />
                <Bar dataKey="addedToCart" name="Vezes adicionado" fill="#8884d8">
                    {productChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                </Bar>
            </BarChart>
            </ResponsiveContainer>
        ) : (
            <p className="text-slate-500">Ainda não há dados suficientes para exibir o gráfico.</p>
        )}
      </div>
    </div>
  );
};