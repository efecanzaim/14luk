import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, HandCoins, Star, Weight } from 'lucide-react';
import Silk from '../components/Silk';
import CardSwap, { Card } from '../components/CardSwap';
import './Home.css';

const Home: React.FC = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero">
        <div style={{ 
          width: '100%', 
          height: '100%', 
          position: 'absolute',
          top: 0,
          left: 0,
          zIndex: 1
        }}>
          <Silk 
            speed={7}
            scale={1}
            color="#041234"
            noiseIntensity={1}
            rotation={0}
          />
          <div className="hero-container">
            <div className="hero-content">
              <h1 className="hero-title">
                14'lük Altın
                <span className="hero-subtitle">
                  Herkese, her keseye
                  <HandCoins className="hero-coins-icon" size={32} />
                </span>
              </h1>
              <div className="hero-actions">
                <Link to="/altin-anne" className="hero-cta primary">
                  <ShoppingBag size={20} />
                  <span>Hemen Satın Al</span>
                </Link>
                <Link to="/urunler" className="hero-cta secondary">
                  <span>Ürünleri İncele</span>
                </Link>
              </div>
              <div className="hero-info">
                <p className="hero-info-text">
                  <strong>Altın Anne güvencesiyle</strong> 14 ayar saf altın kalitesinde <strong>KV GOLD</strong> tarafından üretilen 14'lük koleksiyonumuz, 
                  yatırım değerinizi korurken şıklığınızı da tamamlıyor.
                  <span className="highlight-text"> Kare, yuvarlak, kalp ve yonca</span> formlarında, 
                  <span className="highlight-text"> 1gr'den 100gr'ye</span> kadar geniş gramaj yelpazesi ile 
                  her bütçeye uygun, özel tasarım yatırım hediyelik mücevherat eşyası.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <div className="features-container">
          <h2 className="section-title">14'lük Koleksiyonu</h2>
          <div className="features-content" style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            gap: isMobile ? '0px' : '40px', 
            width: '100%',
            margin: '0',
            padding: isMobile ? '5px 10px 5px 10px' : '10px 20px 5px 20px',
            minHeight: isMobile ? '300px' : '500px'
          }}>
            {/* Yazı Alanı - Sol */}
            <div style={{ 
              flex: '1', 
              maxWidth: '800px', 
              order: 1,
              padding: isMobile ? '5px 0px 0px 0px' : '10px',
              minHeight: isMobile ? '200px' : '400px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <div className="features-text-container">
                <h3 className="main-headline">
                  Hem yatırım yapın hem de şıklığınızı tamamlayın!
                </h3>
                <p className="product-description">
                  Yatırımın değerini, şıklığınızla buluşturun. Kare, yuvarlak ve kalp formlarında tasarlanan koleksiyonumuz; bileklik ve kolye olarak kullanılabilecek zamansız parçalar sunuyor.
                </p>
                <p className="product-specs">
                  1gr, 2.5gr, 5gr, 10gr, 20gr, 50gr, 100gr seçenekleri ile her bütçeye uygun, 14 ayar yüksek kaliteli özel tasarım yatırım hediyelik mücevherat eşyası.
                </p>
                <p className="product-tagline">
                  Hem yatırım hem de stilinizi tamamlayan özel bir koleksiyon.
                </p>
              </div>
            </div>

            {/* Kartlar - Sağ */}
            <div style={{ 
              height: isMobile ? '150px' : '450px',
              flex: '1',
              maxWidth: '550px',
              position: 'relative', 
              order: 2,
              overflow: 'hidden',
              padding: isMobile ? '0px 0px 5px 0px' : '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <CardSwap
                width={isMobile ? 650 : 450}
                height={isMobile ? 450 : 300}
                cardDistance={40}
                verticalDistance={50}
                delay={5000}
                pauseOnHover={false}
              >
                <Card style={{ backgroundColor: '#ffb600', color: '#041234', padding: 0, overflow: 'hidden' }}>
                  <img 
                    src={`${process.env.PUBLIC_URL}/14lukklasik.png`} 
                    alt="14'lük Altın - Değerli Ama Uygun" 
                    style={{ 
                      width: '100%', 
                      height: '100%', 
                      objectFit: 'cover',
                      display: 'block'
                    }} 
                  />
                </Card>
                <Card style={{ backgroundColor: '#041234', color: '#fff', padding: 0, overflow: 'hidden' }}>
                  <img 
                    src={`${process.env.PUBLIC_URL}/14lukyuvarlak.png`} 
                    alt="14'lük Altın - DEMAŞ Güvencesi" 
                    style={{ 
                      width: '100%', 
                      height: '100%', 
                      objectFit: 'cover',
                      display: 'block'
                    }} 
                  />
                </Card>
                <Card style={{ backgroundColor: '#1a2d5c', color: '#fff', padding: 0, overflow: 'hidden' }}>
                  <img 
                    src={`${process.env.PUBLIC_URL}/14lukkalp.png`} 
                    alt="14'lük Altın - 14 Ayar Altın" 
                    style={{ 
                      width: '100%', 
                      height: '100%', 
                      objectFit: 'cover',
                      display: 'block'
                    }} 
                  />
                </Card>
                <Card style={{ backgroundColor: '#1a2d5c', color: '#fff', padding: 0, overflow: 'hidden' }}>
                  <img 
                    src={`${process.env.PUBLIC_URL}/14lukyonca.png`} 
                    alt="14'lük Altın - 14 Ayar Altın" 
                    style={{ 
                      width: '100%', 
                      height: '100%', 
                      objectFit: 'cover',
                      display: 'block'
                    }} 
                  />
                </Card>
              </CardSwap>
            </div>
          </div>
        </div>
      </section>

      {/* Product Types Section */}
      <section className="product-types">
        <div className="product-types-container">
          <h2 className="section-title">Ürün Çeşitlerimiz</h2>
          <div className="products-grid">
            <div className="product-card">
              <div className="product-image">
                <img 
                  src={`${process.env.PUBLIC_URL}/14luk-kare.png`} 
                  alt="Dikdörtgen 14'lük"
                  className="product-photo"
                />
              </div>
              
              <div className="product-info">
                <h3 className="product-name">Klasik 14'lük</h3>
                <p className="product-description">Klasik tasarım, zamansız güzellik. Geleneksel altın yatırımına modern bir alternatif.</p>
                
                <div className="product-features">
                  <h4>Özellikler:</h4>
                  <ul>
                    <li>
                      <Star size={16} />
                      <span>14 ayar altın</span>
                    </li>
                    <li>
                      <Star size={16} />
                      <span>Klasik tasarım</span>
                    </li>
                    <li>
                      <Star size={16} />
                      <span>Yatırım değeri</span>
                    </li>
                    <li>
                      <Star size={16} />
                      <span>Hediyelik uygun</span>
                    </li>
                  </ul>
                </div>

                <div className="product-weights">
                  <h4>Gramaj Seçenekleri:</h4>
                  <div className="weight-options">
                    <span className="weight-option">
                      <Weight size={14} />
                      1gr
                    </span>
                    <span className="weight-option">
                      <Weight size={14} />
                      2.5gr
                    </span>
                    <span className="weight-option">
                      <Weight size={14} />
                      5gr
                    </span>
                    <span className="weight-option">
                      <Weight size={14} />
                      10gr
                    </span>
                    <span className="weight-option">
                      <Weight size={14} />
                      20gr
                    </span><span className="weight-option">
                      <Weight size={14} />
                      50gr
                    </span><span className="weight-option">
                      <Weight size={14} />
                      100gr
                    </span>
                  </div>
                </div>

                <div className="product-price">
                  <span className="price-label">Uygun fiyatlar</span>
                </div>

                <div className="product-actions">
                  <Link to="/altin-anne" className="buy-button">
                    <ShoppingBag size={20} />
                    <span>Satın Al</span>
                  </Link>
                </div>
              </div>
            </div>

            <div className="product-card">
              <div className="product-image">
                <img 
                  src={`${process.env.PUBLIC_URL}/14luk-yuvarlak.png`} 
                  alt="Yuvarlak 14'lük"
                  className="product-photo"
                />
              </div>
              
              <div className="product-info">
                <h3 className="product-name">Yuvarlak 14'lük</h3>
                <p className="product-description">Ziynet benzeri şık görünüm. Estetik ve değerli, her duruma uygun.</p>
                
                <div className="product-features">
                  <h4>Özellikler:</h4>
                  <ul>
                    <li>
                      <Star size={16} />
                      <span>14 ayar altın</span>
                    </li>
                    <li>
                      <Star size={16} />
                      <span>Şık tasarım</span>
                    </li>
                    <li>
                      <Star size={16} />
                      <span>Ziynet benzeri</span>
                    </li>
                    <li>
                      <Star size={16} />
                      <span>Çok amaçlı kullanım</span>
                    </li>
                  </ul>
                </div>

                <div className="product-weights">
                  <h4>Gramaj Seçenekleri:</h4>
                  <div className="weight-options">
                    <span className="weight-option">
                      <Weight size={14} />
                      1gr
                    </span>
                    <span className="weight-option">
                      <Weight size={14} />
                      2.5gr
                    </span>
                    <span className="weight-option">
                      <Weight size={14} />
                      5gr
                    </span>
                    <span className="weight-option">
                      <Weight size={14} />
                      10gr
                    </span>
                    <span className="weight-option">
                      <Weight size={14} />
                      20gr
                    </span>
                    <span className="weight-option">
                      <Weight size={14} />
                      50gr
                    </span>
                    <span className="weight-option">
                      <Weight size={14} />
                      100gr
                    </span>
                  </div>
                </div>

                <div className="product-price">
                  <span className="price-label">Uygun fiyatlar</span>
                </div>

                <div className="product-actions">
                  <Link to="/altin-anne" className="buy-button">
                    <ShoppingBag size={20} />
                    <span>Satın Al</span>
                  </Link>
                </div>
              </div>
            </div>

            <div className="product-card">
              <div className="product-image">
                <img 
                  src={`${process.env.PUBLIC_URL}/14luk-kalp.png`} 
                  alt="Kalp 14'lük"
                  className="product-photo"
                />
              </div>
              
              <div className="product-info">
                <h3 className="product-name">Kalp 14'lük (Yakında)</h3>
                <p className="product-description">Hediyelik ve duygusal değer. Özel günlerde anlamlı hediye.</p>
                
                <div className="product-features">
                  <h4>Özellikler:</h4>
                  <ul>
                    <li>
                      <Star size={16} />
                      <span>14 ayar altın</span>
                    </li>
                    <li>
                      <Star size={16} />
                      <span>Kalp tasarım</span>
                    </li>
                    <li>
                      <Star size={16} />
                      <span>Hediyelik uygun</span>
                    </li>
                    <li>
                      <Star size={16} />
                      <span>Duygusal değer</span>
                    </li>
                  </ul>
                </div>

                <div className="product-weights">
                  <h4>Gramaj Seçenekleri:</h4>
                  <div className="weight-options">
                    <span className="weight-option">
                      <Weight size={14} />
                      1gr
                    </span>
                    <span className="weight-option">
                      <Weight size={14} />
                      2.5gr
                    </span>
                    <span className="weight-option">
                      <Weight size={14} />
                      5gr
                    </span>
                    <span className="weight-option">
                      <Weight size={14} />
                      10gr
                    </span>
                    <span className="weight-option">
                      <Weight size={14} />
                      20gr
                    </span>
                    <span className="weight-option">
                      <Weight size={14} />
                      50gr
                    </span>
                    <span className="weight-option">
                      <Weight size={14} />
                      100gr
                    </span>
                  </div>
                </div>

                <div className="product-price">
                  <span className="price-label">Uygun fiyatlar</span>
                </div>

                <div className="product-actions">
                  <div className="coming-soon-button">
                    <span>Yakında</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="product-card">
              <div className="product-image">
                <img 
                  src={`${process.env.PUBLIC_URL}/14luk-kare.png`} 
                  alt="Yonca 14'lük"
                  className="product-photo"
                />
              </div>
              
              <div className="product-info">
                <h3 className="product-name">Yonca 14'lük (Yakında)</h3>
                <p className="product-description">Şans ve bereket sembolü. Özel tasarım ile şansınızı artırın.</p>
                
                <div className="product-features">
                  <h4>Özellikler:</h4>
                  <ul>
                    <li>
                      <Star size={16} />
                      <span>14 ayar altın</span>
                    </li>
                    <li>
                      <Star size={16} />
                      <span>Yonca tasarım</span>
                    </li>
                    <li>
                      <Star size={16} />
                      <span>Şans sembolü</span>
                    </li>
                    <li>
                      <Star size={16} />
                      <span>Özel koleksiyon</span>
                    </li>
                  </ul>
                </div>

                <div className="product-weights">
                  <h4>Gramaj Seçenekleri:</h4>
                  <div className="weight-options">
                    <span className="weight-option">
                      <Weight size={14} />
                      1gr
                    </span>
                    <span className="weight-option">
                      <Weight size={14} />
                      2.5gr
                    </span>
                    <span className="weight-option">
                      <Weight size={14} />
                      5gr
                    </span>
                    <span className="weight-option">
                      <Weight size={14} />
                      10gr
                    </span>
                    <span className="weight-option">
                      <Weight size={14} />
                      20gr
                    </span>
                    <span className="weight-option">
                      <Weight size={14} />
                      50gr
                    </span>
                    <span className="weight-option">
                      <Weight size={14} />
                      100gr
                    </span>
                  </div>
                </div>

                <div className="product-price">
                  <span className="price-label">Uygun fiyatlar</span>
                </div>

                <div className="product-actions">
                  <div className="coming-soon-button">
                    <span>Yakında</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;