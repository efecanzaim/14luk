import React from 'react';
import { Helmet } from 'react-helmet-async';
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
  image: string;
}

const Press: React.FC = () => {
  const pressItems: PressItem[] = [
    {
      id: 1,
      title: "Minikler, Ünlü Şef Mehmet Yalçınkaya ile mutfağa ilk adımlarını attı",
      source: "İHA - İhlas Haber Ajansı",
      date: "7 Ağustos 2025",
      excerpt: "Altın Anne markası, çocuklara hem mutfak sevgisi hem de tasarruf bilinci kazandıran özel bir etkinliğe imza attı. Ünlü Şef Mehmet Yalçınkaya'nın ev sahipliğinde GastroArena'da düzenlenen atölyede minik şefler, unutulmaz bir mutfak deneyimi yaşadı.",
      category: 'news',
      link: "https://www.iha.com.tr/istanbul-haberleri/minikler-unlu-sef-mehmet-yalcinkaya-ile-mutfaga-ilk-adimlarini-atti-280957767",
      image: "https://cdn.iha.com.tr/Contents/25-08/19/aw512842_01.jpg"
    },
    {
      id: 2,
      title: "Ünlü Şef Mehmet Yalçınkaya ile Minikler Mutfağa İlk Adımlarını Attı",
      source: "MSN Haber",
      date: "7 Ağustos 2025",
      excerpt: "Altın Anne markası tarafından düzenlenen 'Altın Anne Çocuk Buluşması' etkinliğinde çocuklar, ünlü şef Mehmet Yalçınkaya ile birlikte mutfakta pizza ve kurabiye yapımı öğrendi. Etkinlik, çocuklara tasarruf bilinci ve mutfak sevgisi kazandırmayı amaçlıyor.",
      category: 'news',
      link: "https://www.msn.com/tr-tr/haber/other/ünlü-şef-mehmet-yalçınkaya-ile-minikler-mutfağa-ilk-adımlarını-attı/ar-AA1K5rez",
      image: "https://cdn.iha.com.tr/Contents/25-08/19/aw512842_02.jpg"
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
      <Helmet>
        <title>Basında Biz - 14'lük Haberler ve Röportajlar | 14luk.com</title>
        <meta name="description" content="14'lük hakkında basında çıkan haberler, röportajlar ve makaleler. Son haberler ve güncel gelişmeler." />
        <meta name="keywords" content="14'lük haberler, basında biz, röportaj, makale, medya" />
        <link rel="canonical" href="https://14luk.com/basinda-biz" />
      </Helmet>
      
      {/* Hero Section */}
      <section className="press-hero">
        <div className="press-hero-container">
          <h1 className="press-hero-title">Basında Biz</h1>
          <p className="press-hero-subtitle">
            Altın Anne ile ilgili haberler, röportajlar ve makaleler
          </p>
        </div>
      </section>

      {/* Press Items */}
      <section className="press-items">
        <div className="press-container">
          <h2>Son Haberler ve Makaleler</h2>
          <div className="press-grid">
            {pressItems.map((item) => (
              <div key={item.id} className="press-card">
                <div className="press-card-image">
                  <img src={item.image} alt={item.title} />
                </div>
                
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
                  <a href={item.link} className="press-link" target="_blank" rel="noopener noreferrer">
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
