import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, ArrowRight, Star, Shield, Truck, Award } from 'lucide-react';
import './Redirect.css';

const Redirect: React.FC = () => {
  const [countdown, setCountdown] = useState(5);
  const [hasRedirected, setHasRedirected] = useState(false);
  const hasRedirectedRef = useRef(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1 && !hasRedirectedRef.current) {
          hasRedirectedRef.current = true;
          setHasRedirected(true);
          window.location.href = 'https://altinanne.com';
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []); // empty dependency array

  return (
    <div className="redirect">
      {/* Hero Section */}
      <section className="redirect-hero">
        <div className="redirect-hero-container">
          <div className="redirect-content">
            <h1 className="redirect-title">Altın Anne'ye Yönlendiriliyorsunuz</h1>
            <p className="redirect-subtitle">
              Resmi satış kanalımız Altın Anne'den güvenle alışveriş yapın
            </p>
            
            <div className="countdown-section">
              {!hasRedirected ? (
                <div className="countdown-timer">
                  <span className="countdown-number">{countdown}</span>
                  <span className="countdown-text">saniye</span>
                </div>
              ) : (
                <div className="success-message">
                  <h2>Başarılı bir şekilde yönlendirildiniz!</h2>
                </div>
              )}
              {!hasRedirected && (
                <p className="countdown-message">
                  Otomatik yönlendirme için bekleyin veya aşağıdaki butona tıklayın
                </p>
              )}
            </div>

            <div className="redirect-actions">
              <a 
                href="https://altinanne.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="redirect-button primary"
              >
                <ShoppingBag size={20} />
                <span>Altın Anne'de Satın Al</span>
                <ArrowRight size={20} />
              </a>
              <Link to="/" className="redirect-button secondary">
                <span>Ana Sayfaya Dön</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="redirect-features">
        <div className="redirect-container">
          <h2>Altın Anne Avantajları</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">
                <Shield size={40} />
              </div>
              <h3>Güvenli Alışveriş</h3>
              <p>SSL sertifikası ile güvenli ödeme sistemi</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <Truck size={40} />
              </div>
              <h3>Hızlı Kargo</h3>
              <p>24 saat içinde kargo, sigortalı teslimat</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <Star size={40} />
              </div>
              <h3>Müşteri Desteği</h3>
              <p>7/24 müşteri hizmetleri ve destek</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <Award size={40} />
              </div>
              <h3>Kalite Garantisi</h3>
              <p>Altın Anne güvencesi ile kaliteli ürünler</p>
            </div>
          </div>
        </div>
      </section>

      {/* Product Preview */}
      <section className="product-preview">
        <div className="redirect-container">
          <div className="preview-content">
            <h2>14'lük Ürünleri</h2>
            <p>
              Altın Anne'de 14'lük ürünlerimizin tamamını bulabilir, 
              güvenle satın alabilirsiniz.
            </p>
            <div className="golden-products">
              <div className="golden-item">
                <div className="golden-image">
                  <img src="/14luk-kare.png" alt="14'lük Dikdörtgen Altın" loading="eager" />
                </div>
                <span className="golden-name">Dikdörtgen</span>
              </div>
              <div className="golden-item">
                <div className="golden-image">
                  <img src="/14luk-yuvarlak.png" alt="14'lük Yuvarlak Altın" loading="eager" />
                </div>
                <span className="golden-name">Yuvarlak</span>
              </div>
              <div className="golden-item">
                <div className="golden-image">
                  <img src="/14luk-kalp.png" alt="14'lük Kalp Altın" loading="eager" />
                </div>
                <span className="golden-name">Kalp</span>
              </div>
              <div className="golden-item">
                <div className="golden-image">
                  <img src="/14luk-yonca.png" alt="14'lük Yonca Altın" loading="eager" />
                </div>
                <span className="golden-name">Yonca</span>
              </div>
            </div>
            <a 
              href="https://altinanne.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="preview-button"
            >
              <ShoppingBag size={20} />
              <span>Altın Anne'de İncele</span>
            </a>
          </div>
        </div>
      </section>

      {/* Contact Info */}
      <section className="redirect-contact">
        <div className="redirect-container">
          <div className="contact-info">
            <h3>İhtiyacınız mı var?</h3>
            <p>Alışveriş öncesi sorularınız için bizimle iletişime geçin</p>
            <div className="contact-buttons">
              <a 
                href="https://api.whatsapp.com/send?phone=905319498765" 
                target="_blank" 
                rel="noopener noreferrer"
                className="contact-button"
              >
                İletişime Geç
              </a>
              <Link to="/sik-sorulan-sorular" className="contact-button secondary">
                SSS
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Redirect;
