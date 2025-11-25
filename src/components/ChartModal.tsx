import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import './ChartModal.css';

interface ChartModalProps {
  isOpen: boolean;
  onClose: () => void;
  symbol: string;
  title: string;
  currentPrice?: number;
  buyPrice?: number;
  sellPrice?: number;
}

const API_URL = process.env.REACT_APP_API_URL || 'https://14luk.com/backend/api';

const ChartModal: React.FC<ChartModalProps> = ({ isOpen, onClose, symbol, title, currentPrice, buyPrice, sellPrice }) => {
  const [chartData, setChartData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  useEffect(() => {
    if (!isOpen) return;
    
    const fetchHistoricalData = async () => {
      setIsLoading(true);
      
      try {
        let apiSymbol = 'ONS';
        if (symbol === 'XAUUSD') {
          apiSymbol = 'ONS';
        } else if (symbol === '14LUK' || title.includes('14\'lük')) {
          apiSymbol = '14LUK';
        } else {
          apiSymbol = 'ALTIN';
        }
        
        const response = await fetch(`${API_URL}/get_price_history.php?symbol=${apiSymbol}&hours=24`);
        const result = await response.json();
        
        if (result.success && result.data && result.data.length > 0) {
          setChartData(result.data);
        } else {
          setChartData([]);
        }
      } catch (err) {
        console.error('Fiyat geçmişi hatası:', err);
        setChartData([]);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchHistoricalData();
  }, [isOpen, symbol, title, currentPrice, buyPrice, sellPrice]);
  
  // test verisi - şu anda kullanılmıyor ama gerekebilir
  // const generateFallbackData = (basePrice?: number) => {
  //   const data = [];
  //   const price = basePrice || 3988;
  //   const now = new Date();
  //   
  //   for (let i = 24; i >= 0; i--) {
  //     const time = new Date(now.getTime() - i * 60 * 60 * 1000);
  //     const randomChange = (Math.random() - 0.5) * 50;
  //     data.push({
  //       time: time.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }),
  //       price: parseFloat((price + randomChange).toFixed(2)),
  //     });
  //   }
  //   return data;
  // };

  if (!isOpen) return null;

  return (
    <div className="chart-modal-overlay" onClick={onClose}>
      <div className="chart-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="chart-modal-header">
          <div>
            <h2>{title} - Canlı Grafik</h2>
            {(buyPrice || sellPrice) && (
              <div className="current-prices">
                {buyPrice && (
                  <span className="price-item">
                    Alış: <strong>{buyPrice.toLocaleString('tr-TR', { minimumFractionDigits: 2 })} ₺</strong>
                  </span>
                )}
                {sellPrice && (
                  <span className="price-item">
                    Satış: <strong>{sellPrice.toLocaleString('tr-TR', { minimumFractionDigits: 2 })} ₺</strong>
                  </span>
                )}
              </div>
            )}
          </div>
          <button className="chart-modal-close" onClick={onClose}>
            <X size={24} />
          </button>
        </div>
        <div className="chart-modal-body">
          {isLoading ? (
            <div className="chart-loading">
              <div className="loading-spinner"></div>
              <p>Veriler yükleniyor...</p>
            </div>
          ) : null}
          
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ffb600" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#ffb600" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#2B2B43" />
              <XAxis 
                dataKey="time" 
                stroke="#d1d4dc"
                tick={{ fill: '#d1d4dc' }}
              />
              <YAxis 
                stroke="#d1d4dc"
                tick={{ fill: '#d1d4dc' }}
                domain={['auto', 'auto']}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#041234', 
                  border: '1px solid #ffb600',
                  borderRadius: '8px',
                  color: '#fff'
                }}
                labelStyle={{ color: '#ffb600' }}
                formatter={(value: any, name: string) => [
                  `${parseFloat(value).toLocaleString('tr-TR', { minimumFractionDigits: 2 })} ₺`,
                  'Fiyat:'
                ]}
                labelFormatter={(label: string) => `Saat: ${label}`}
              />
              <Area 
                type="monotone" 
                dataKey="price" 
                stroke="#ffb600" 
                strokeWidth={2}
                fillOpacity={1} 
                fill="url(#colorPrice)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default ChartModal;
