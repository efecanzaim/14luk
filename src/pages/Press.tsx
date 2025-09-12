import React from 'react';
import { Newspaper, Calendar, ExternalLink, Star, TrendingUp } from 'lucide-react';
import './Press.css';

interface PressItem {
  id: number;
  title: string;
  source: string;
  date: string;
  excerpt: string;
  category: 'news' | 'interview' | 'article';
  link: string;
}

const Press: React.FC = () => {
  const pressItems: PressItem[] = [
    {
      id: 1,
      title: "14'lük Altın Konsepti Sektörde Yenilik Getiriyor",
      source: "Altın Borsası Dergisi",
      date: "15 Aralık 2024",
      excerpt: "DEMAŞ A.Ş.'nin geliştirdiği 14'lük altın konsepti, geleneksel altın yatırımına alternatif sunarak sektörde büyük ilgi görüyor...",
      category: 'news',
      link: "#"
    },
    {
      id: 2,
      title: "Altın Anne ile E-ticarette Güvenli Alışveriş",
      source: "E-ticaret Haber",
      date: "10 Aralık 2024",
      excerpt: "DEMAŞ A.Ş.'nin e-ticaret markası Altın Anne, 14'lük altın ürünleri ile müşterilere güvenli alışveriş deneyimi sunuyor...",
      category: 'article',
      link: "#"
    },
    {
      id: 3,
      title: "DEMAŞ A.Ş. CEO'su ile Röportaj: 14'lük Altının Geleceği",
      source: "Finans Dünyası",
      date: "5 Aralık 2024",
      excerpt: "DEMAŞ A.Ş. CEO'su, 14'lük altın konseptinin geliştirilme süreci ve sektöre getirdiği yenilikler hakkında konuştu...",
      category: 'interview',
      link: "#"
    },
    {
      id: 4,
      title: "Borsa İstanbul Üyesi DEMAŞ'tan Yeni Ürün Lansmanı",
      source: "Borsa Haber",
      date: "1 Aralık 2024",
      excerpt: "Borsa İstanbul üyesi DEMAŞ A.Ş., 14'lük altın ürünlerinin lansmanını gerçekleştirdi. Ürünler büyük ilgi gördü...",
      category: 'news',
      link: "#"
    },
    {
      id: 5,
      title: "Altın Yatırımında Yeni Trend: 14'lük Altın",
      source: "Yatırım Dünyası",
      date: "25 Kasım 2024",
      excerpt: "Geleneksel altın yatırımından farklı olarak tasarlanan 14'lük altın, hem yatırım hem de takı değeri taşıyor...",
      category: 'article',
      link: "#"
    },
    {
      id: 6,
      title: "DEMAŞ A.Ş. ve Altın Anne Marka Değerini Artırıyor",
      source: "Marka Dünyası",
      date: "20 Kasım 2024",
      excerpt: "DEMAŞ A.Ş. ve Altın Anne markaları, 14'lük altın konsepti ile sektörde güçlü bir konum elde ediyor...",
      category: 'news',
      link: "#"
    }
  ];

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'news':
        return <Newspaper size={20} />;
      case 'interview':
        return <Star size={20} />;
      case 'article':
        return <TrendingUp size={20} />;
      default:
        return <Newspaper size={20} />;
    }
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'news':
        return 'Haber';
      case 'interview':
        return 'Röportaj';
      case 'article':
        return 'Makale';
      default:
        return 'Haber';
    }
  };

  return (
    <div className="press">
      {/* Hero Section */}
      <section className="press-hero">
        <div className="press-hero-container">
          <h1 className="press-hero-title">Basında Biz</h1>
          <p className="press-hero-subtitle">
            DEMAŞ A.Ş. ve Altın Anne ile ilgili haberler, röportajlar ve makaleler
          </p>
        </div>
      </section>

      {/* Press Stats */}
      <section className="press-stats">
        <div className="press-container">
          <div className="stats-grid">
            <div className="stat-item">
              <div className="stat-number">50+</div>
              <div className="stat-label">Basın Haberi</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">15+</div>
              <div className="stat-label">Röportaj</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">25+</div>
              <div className="stat-label">Makale</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">100K+</div>
              <div className="stat-label">Okunma</div>
            </div>
          </div>
        </div>
      </section>

      {/* Press Items */}
      <section className="press-items">
        <div className="press-container">
          <h2>Son Haberler ve Makaleler</h2>
          <div className="press-grid">
            {pressItems.map((item) => (
              <div key={item.id} className="press-card">
                <div className="press-card-header">
                  <div className="press-category">
                    {getCategoryIcon(item.category)}
                    <span>{getCategoryLabel(item.category)}</span>
                  </div>
                  <div className="press-date">
                    <Calendar size={16} />
                    <span>{item.date}</span>
                  </div>
                </div>
                
                <div className="press-card-content">
                  <h3 className="press-title">{item.title}</h3>
                  <p className="press-source">{item.source}</p>
                  <p className="press-excerpt">{item.excerpt}</p>
                </div>
                
                <div className="press-card-footer">
                  <a href={item.link} className="press-link">
                    <span>Devamını Oku</span>
                    <ExternalLink size={16} />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Press;
