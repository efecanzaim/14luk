import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ShoppingBag, HandCoins, Star, Weight, TrendingUp, Shield } from 'lucide-react';
import Silk from '../components/Silk';
import CardSwap, { Card } from '../components/CardSwap';
import ChartModal from '../components/ChartModal';
import io from 'socket.io-client';
import './Home.css';

const Home: React.FC = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [currentDateTime, setCurrentDateTime] = useState(new Date());
  const [socketData, setSocketData] = useState<any>({});
  const [isConnected, setIsConnected] = useState(false);
  const [fourteenLukPrice, setFourteenLukPrice] = useState<any>(null);
  const [isChartModalOpen, setIsChartModalOpen] = useState(false);
  const [selectedChart, setSelectedChart] = useState<{symbol: string, title: string}>({symbol: '', title: ''});
  const [priceChangeAnimation, setPriceChangeAnimation] = useState<{[key: string]: 'up' | 'down' | ''}>({});
  const prevPricesRef = useRef<{[key: string]: number}>({});

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const socket = io('wss://api.haremaltin.com', {
      transports: ["websocket"],
      rejectUnauthorized: false
    });

    socket.on('connect', () => {
      setIsConnected(true);
    });

    socket.on('disconnect', () => {
      setIsConnected(false);
    });

    socket.on('price_changed', (data) => {
      if (data.data) {
        setSocketData((prevData: any) => ({
          ...prevData,
          ...data.data
        }));
      }
    });

    socket.on('connect_error', (error) => {
      console.error('Haremin API bağlantı hatası:', error);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  // 14'lük fiyatını API'den çek
  useEffect(() => {
    const fetch14LukPrice = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL || 'https://14luk.com/backend/api'}/get_price_history.php?symbol=14LUK&hours=1`);
        const result = await response.json();
        if (result.success && result.data && result.data.length > 0) {
          const latestData = result.data[result.data.length - 1];
          setFourteenLukPrice(latestData);
        }
      } catch (error) {
        console.error('14LUK fiyat hatası:', error);
      }
    };

    fetch14LukPrice();
    const interval = setInterval(fetch14LukPrice, 60000); // 1 dakikada bir
    return () => clearInterval(interval);
  }, []);

  const formatPrice = (price: string | number | undefined, showLoading: boolean = false) => {
    if (!price) return showLoading ? 'Yükleniyor...' : '-.--';
    const numPrice = typeof price === 'string' ? parseFloat(price) : price;
    if (isNaN(numPrice)) return showLoading ? 'Yükleniyor...' : '-.--';
    return numPrice.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  // Fark hesaplama (önceki kapanışa göre değişim %)
  const calculateChange = (currentPrice: string | number | undefined, closePrice: number | undefined, direction: string | undefined) => {
    if (!currentPrice || !closePrice || closePrice === 0) {
      return { text: '-.--', className: '', icon: '→' };
    }
    
    const current = typeof currentPrice === 'string' ? parseFloat(currentPrice) : currentPrice;
    
    if (isNaN(current)) {
      return { text: '-.--', className: '', icon: '→' };
    }
    
    const change = ((current - closePrice) / closePrice) * 100;
    
    // Yön belirleme
    let className = '';
    let icon = '→';
    
    if (direction === 'up' || (direction === '' && change > 0)) {
      className = 'artis';
      icon = '↑';
    } else if (direction === 'down' || (direction === '' && change < 0)) {
      className = 'azalis';
      icon = '↓';
    }
    
    const formattedChange = Math.abs(change).toFixed(2);
    return {
      text: `${icon}%${formattedChange}`,
      className,
      icon
    };
  };

  // ONS Altın fiyatları
  const onsAlis = socketData?.ONS?.alis;
  const onsSatis = socketData?.ONS?.satis;
  const onsKapanis = socketData?.ONS?.kapanis;
  const onsDirection = socketData?.ONS?.dir?.satis_dir;

  // Has Altın fiyatları
  const hasAltinAlis = socketData?.ALTIN?.alis;
  const hasAltinSatis = socketData?.ALTIN?.satis;
  const hasAltinKapanis = socketData?.ALTIN?.kapanis;
  const hasAltinDirection = socketData?.ALTIN?.dir?.satis_dir;

  // 14'lük fiyatları - Alış: Haremin'den hesaplama, Satış: GramFiyat'tan
  const ondortlukAlis = hasAltinAlis ? (parseFloat(hasAltinAlis) * 0.580) : undefined;
  const ondortlukSatis = fourteenLukPrice?.sellPrice || fourteenLukPrice?.price;
  
  // 14'lük için fark hesaplama - önceki fiyatla karşılaştır
  const prev14LukPrice = prevPricesRef.current['14LUK'];
  const current14LukPrice = ondortlukSatis ? parseFloat(ondortlukSatis) : undefined;
  
  // Fark hesaplama fonksiyonu (14'lük için)
  const calculate14LukChange = () => {
    if (!current14LukPrice || !prev14LukPrice || prev14LukPrice === 0) {
      return { text: '-.--', className: '', icon: '→' };
    }
    
    const change = ((current14LukPrice - prev14LukPrice) / prev14LukPrice) * 100;
    
    let className = '';
    let icon = '→';
    
    if (change > 0) {
      className = 'artis';
      icon = '↑';
    } else if (change < 0) {
      className = 'azalis';
      icon = '↓';
    }
    
    const formattedChange = Math.abs(change).toFixed(2);
    return {
      text: `${icon}%${formattedChange}`,
      className,
      icon
    };
  };
  
  const ondortlukChange = calculate14LukChange();

  useEffect(() => {
    const preloadImages = () => {
      const imageUrls = [
        `${process.env.PUBLIC_URL}/14lukklasik.png`,
        `${process.env.PUBLIC_URL}/14lukyuvarlak.png`,
        `${process.env.PUBLIC_URL}/14lukkalp.png`,
        `${process.env.PUBLIC_URL}/14lukyonca.png`
      ];
      
      imageUrls.forEach(url => {
        const img = new Image();
        img.src = url;
      });
    };
    
    preloadImages();
  }, []);

  useEffect(() => {
    const checkPriceChange = (key: string, newPrice: number | undefined) => {
      if (!newPrice) return;
      
      const prevPrice = prevPricesRef.current[key];
      if (prevPrice && prevPrice !== newPrice) {
        const direction = newPrice > prevPrice ? 'up' : 'down';
        setPriceChangeAnimation(prev => ({ ...prev, [key]: direction }));
        setTimeout(() => {
          setPriceChangeAnimation(prev => ({ ...prev, [key]: '' }));
        }, 1000);
      }
      
      prevPricesRef.current[key] = newPrice;
    };

    const onsSatisNum = onsSatis ? parseFloat(onsSatis as string) : undefined;
    const hasAltinSatisNum = hasAltinSatis ? parseFloat(hasAltinSatis as string) : undefined;
    
    checkPriceChange('ons', onsSatisNum);
    checkPriceChange('hasAltin', hasAltinSatisNum);
    checkPriceChange('ondortluk', current14LukPrice);
  }, [onsSatis, hasAltinSatis, ondortlukSatis]);

  const openChart = (symbol: string, title: string) => {
    setSelectedChart({ symbol, title });
    setIsChartModalOpen(true);
  };

  const closeChart = () => {
    setIsChartModalOpen(false);
  };

  const getCurrentBuyPrice = () => {
    if (selectedChart.symbol === 'XAUUSD') {
      return onsAlis ? parseFloat(onsAlis as string) : undefined;
    } else if (selectedChart.symbol === 'ALTIN') {
      return hasAltinAlis ? parseFloat(hasAltinAlis as string) : undefined;
    } else if (selectedChart.symbol === '14LUK') {
      return ondortlukAlis;
    }
    return undefined;
  };

  const getCurrentSellPrice = () => {
    if (selectedChart.symbol === 'XAUUSD') {
      return onsSatis ? parseFloat(onsSatis as string) : undefined;
    } else if (selectedChart.symbol === 'ALTIN') {
      return hasAltinSatis ? parseFloat(hasAltinSatis as string) : undefined;
    } else if (selectedChart.symbol === '14LUK') {
      return ondortlukSatis;
    }
    return undefined;
  };

  return (
    <div className="home">
      <Helmet>
        <title>14'lük Altın - Herkese, Her Keseye | Altın Anne Güvencesiyle</title>
        <meta name="description" content="14'lük koleksiyonu, 14 ayar saf altın kalitesiyle üretilmiş, Klasik, yuvarlak, kalp ve yonca formlarında özel tasarımlar. 1gr'dan 100gr'a kadar geniş gramaj seçenekleriyle, hem birikim hem hediye ihtiyacına hitap eder." />
        <meta name="keywords" content="14'lük, 14lük, altın, birikim, hediye, koleksiyon, 14 ayar, Altın Anne, kuyumculuk, gram altın" />
        <link rel="canonical" href="https://14luk.com/" />
        
        {/* Open Graph */}
        <meta property="og:title" content="14'lük Altın - Herkese, Her Keseye" />
        <meta property="og:description" content="14 ayar saf altın kalitesinde, Klasik, yuvarlak, kalp ve yonca formlarında 14'lük altın ürünleri. Altın Anne güvencesiyle" />
        <meta property="og:url" content="https://14luk.com/" />
        <meta property="og:type" content="website" />
        
        {/* Twitter */}
        <meta name="twitter:title" content="14'lük Altın - Herkese, Her Keseye" />
        <meta name="twitter:description" content="14 ayar saf altın kalitesinde, Klasik, yuvarlak, kalp ve yonca formlarında 14'lük altın ürünleri" />
      </Helmet>
      
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
                14'lük
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
                <Link to="/dogrulama" className="hero-cta tertiary">
                  <Shield size={20} />
                  <span>Doğrulama</span>
                </Link>
              </div>
              <div className="hero-info">
                <p className="hero-info-text">
                  <strong>Altın Anne güvencesiyle</strong> 14 ayar saf altın kalitesinde üretilen 14'lük koleksiyonumuz, 
                  <span className="highlight-text"> "Herkese, Her Keseye"</span> anlayışıyla 
                  <span className="highlight-text"> hediye + birikim + koleksiyon</span> üçlü işlev sunuyor.
                  <span className="highlight-text"> Klasik, yuvarlak, kalp ve yonca</span> formlarında, 
                  <span className="highlight-text"> 1gr'dan 100gr'a</span> kadar geniş gramaj yelpazesi ile 
                  her bütçeye uygun, özel tasarım hediyelik mücevherat eşyası.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Altın Fiyatları Section */}
      <section className="altin-fiyatlari-section">
        <div className="home-container">
          <div className="altin-fiyatlari-card">
            <h2>
              Altın Fiyatları
              {isConnected && (
                <span style={{ 
                  marginLeft: '12px', 
                  fontSize: '14px', 
                  color: '#5aff91',
                  fontWeight: 'normal'
                }}>
                  ● Canlı
                </span>
              )}
            </h2>
            <div className="timestamp">
              {currentDateTime.toLocaleDateString('tr-TR')} - {currentDateTime.toLocaleTimeString('tr-TR')}
            </div>
            
            <div className="fiyat-tablosu">
              <div className="tablo-baslik">
                <div className="urun-tipi">Ürün Tipi</div>
                <div className="alis">Alış (₺)</div>
                <div className="satis">Satış (₺)</div>
                <div className="fark">Fark</div>
              </div>
              
              <div 
                className={`tablo-satir clickable-row ${priceChangeAnimation.ons ? `price-change-${priceChangeAnimation.ons}` : ''}`}
                onClick={() => openChart('XAUUSD', 'ONS Altın')}
                title="Grafik için tıklayın"
              >
                <div className="urun-tipi">ONS Altın</div>
                <div className="alis">{formatPrice(onsAlis)}</div>
                <div className="satis">{formatPrice(onsSatis)}</div>
                <div className={`fark ${calculateChange(onsSatis, onsKapanis, onsDirection).className}`}>
                  {calculateChange(onsSatis, onsKapanis, onsDirection).text}
                </div>
                <div className="chart-icon">
                  <TrendingUp size={20} strokeWidth={2.5} />
                </div>
              </div>
              
              <div 
                className={`tablo-satir clickable-row ${priceChangeAnimation.hasAltin ? `price-change-${priceChangeAnimation.hasAltin}` : ''}`}
                onClick={() => openChart('ALTIN', 'Has Altın')}
                title="Grafik için tıklayın"
              >
                <div className="urun-tipi">Has Altın</div>
                <div className="alis">{formatPrice(hasAltinAlis)}</div>
                <div className="satis">{formatPrice(hasAltinSatis)}</div>
                <div className={`fark ${calculateChange(hasAltinSatis, hasAltinKapanis, hasAltinDirection).className}`}>
                  {calculateChange(hasAltinSatis, hasAltinKapanis, hasAltinDirection).text}
                </div>
                <div className="chart-icon">
                  <TrendingUp size={20} strokeWidth={2.5} />
                </div>
              </div>
              
              <div 
                className={`tablo-satir clickable-row ${priceChangeAnimation.ondortluk ? `price-change-${priceChangeAnimation.ondortluk}` : ''}`}
                onClick={() => openChart('14LUK', '14\'lük Altın')}
                title="Grafik için tıklayın"
              >
                <div className="urun-tipi">14'lük</div>
                <div className="alis">{formatPrice(ondortlukAlis)}</div>
                <div className="satis">{formatPrice(ondortlukSatis)}</div>
                <div className={`fark ${ondortlukChange.className}`}>
                  {ondortlukChange.text}
                </div>
                <div className="chart-icon">
                  <TrendingUp size={20} strokeWidth={2.5} />
                </div>
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
                  Hediye + Birikim + Koleksiyon Üçü Bir Arada!
                </h3>
                <div className="product-full-description">
                  14'lük, pazardaki diğer altın ürünlerine kıyasla daha düşük bütçelerle erişilebilen, ziynet ürünlerine göre ise birikim değerini koruyan özel bir konsepttir. Yüksek işçilik maliyetlerini ortadan kaldırarak hem birikim hem de hediye değeri sunar. Klasik (Dikdörtgen), yuvarlak, kalp ve yonca formlarında tasarlanan koleksiyonumuz; 1gr'dan 100gr'a kadar geniş gramaj seçenekleriyle her bütçeye uygun, 14 ayar saf altın kalitesinde özel tasarım hediyelik mücevherat eşyası. Çok amaçlı kullanım imkanıyla modern tüketicinin tüm beklentilerine yanıt veren yenilikçi bir alternatif.
                </div>
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
                    alt="14'lük - Değerli Ama Uygun" 
                    loading="eager"
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
                    alt="14'lük - Altın Anne Güvencesi" 
                    loading="eager"
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
                    alt="14'lük - 14 Ayar Altın" 
                    loading="eager"
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
                    alt="14'lük - 14 Ayar Altın" 
                    loading="eager"
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
                  loading="eager"
                />
              </div>
              
              <div className="product-info">
                <h3 className="product-name">Klasik 14'lük</h3>
                <p className="product-description">Klasik tasarım, zamansız güzellik. Geleneksel altın birikimine modern bir alternatif. Hediye ve birikim olarak kullanma seçeneği.</p>
                
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
                      <span>Birikim değeri</span>
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
                  loading="eager"
                />
              </div>
              
              <div className="product-info">
                <h3 className="product-name">Yuvarlak 14'lük</h3>
                <p className="product-description">Ziynet benzeri şık görünüm. Estetik ve değerli, her duruma uygun. Çok amaçlı kullanım imkanı sunar.</p>
                
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
                  loading="eager"
                />
              </div>
              
              <div className="product-info">
                <h3 className="product-name">Kalp 14'lük (Yakında)</h3>
                <p className="product-description">Hediyelik ve duygusal değer. Özel günlerde anlamlı hediye. Şık tasarımlar sayesinde düğünlerde tercih edilir.</p>
                
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
                  src={`${process.env.PUBLIC_URL}/14luk-yonca.png`} 
                  alt="Yonca 14'lük"
                  className="product-photo"
                  loading="eager"
                />
              </div>
              
              <div className="product-info">
                <h3 className="product-name">Yonca 14'lük (Yakında)</h3>
                <p className="product-description">Şans ve bereket sembolü. Özel tasarım ile şansınızı artırın. Koleksiyon değeri taşıyan özel parça.</p>
                
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

      {/* Chart Modal */}
      <ChartModal
        isOpen={isChartModalOpen}
        onClose={closeChart}
        symbol={selectedChart.symbol}
        title={selectedChart.title}
        currentPrice={getCurrentSellPrice()}
        buyPrice={getCurrentBuyPrice()}
        sellPrice={getCurrentSellPrice()}
      />
    </div>
  );
};

export default Home;