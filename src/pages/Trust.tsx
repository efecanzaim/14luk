import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Shield, Award, Truck, Package, CheckCircle, Star, Building, FileText } from 'lucide-react';
import './Trust.css';

const Trust: React.FC = () => {
  return (
    <div className="trust">
      <Helmet>
        <title>Güven ve Kalite - Altın Anne Güvencesi | 14luk.com</title>
        <meta name="description" content="Sertifikalı paketleme, sigortalı kargo ve laboratuvar testleriyle doğrulanmış kalite standartları. 14'lük her ürün yüksek güvenilirlik ve değer sunar." />
        <meta name="keywords" content="güven, kalite, sertifika, sigortalı kargo, Altın Anne, 14 ayar altın güvenliği" />
        <link rel="canonical" href="https://14luk.com/guven-ve-kalite" />
        
        <meta property="og:title" content="Güven ve Kalite - Altın Anne Güvencesi" />
        <meta property="og:description" content="Sertifikalı paketleme, sigortalı kargo ve laboratuvar testleriyle doğrulanmış kalite standartları." />
        <meta property="og:url" content="https://14luk.com/guven-ve-kalite" />
      </Helmet>
      
      {/* Hero Section */}
      <section className="trust-hero">
        <div className="trust-hero-container">
          <h1 className="trust-hero-title">Güven ve Kalite</h1>
          <p className="trust-hero-subtitle">
            Sertifikalı paketleme, sigortalı kargo ve laboratuvar testleriyle doğrulanmış kalite standartları sayesinde, her ürün yüksek güvenilirlik ve değer sunar
          </p>
        </div>
      </section>

      {/* Gold Quality Section */}
      <section className="gold-quality">
        <div className="trust-container">
          <div className="quality-content">
            <h2>14 Ayar Saf Altın Kalitesi</h2>
            <div className="quality-grid">
              <div className="quality-card">
                <div className="quality-icon">
                  <Award size={50} />
                </div>
                <h3>Hologramlı Ambalaj</h3>
                <p>Sahteciliğe karşı mühürlü yapısı ve açıldığında belli olan paketleme sistemiyle tam güven sağlar</p>
              </div>
              <div className="quality-card">
                <div className="quality-icon">
                  <FileText size={50} />
                </div>
                <h3>Seri Numarası ile Takip</h3>
                <p>Her ürün seri numarası ile kayıtlı kimlik taşır, ayar, gramaj ve orijinalliği kolayca kontrol edilebilir</p>
              </div>
              <div className="quality-card">
                <div className="quality-icon">
                  <Star size={50} />
                </div>
                <h3>Karekod ile Güvenli Alışveriş</h3>
                <p>QR kod doğrulaması sayesinde şeffaf fiyatlandırması ile anlık fiyatları görüntüleyerek gönül rahatlığıyla tercih edilebilir</p>
              </div>
              <div className="quality-card">
                <div className="quality-icon">
                  <Shield size={50} />
                </div>
                <h3>585 Milyem Standart</h3>
                <p>Tüm ürünlerimiz minimum 585 milyem değerini karşılar, negatif tolerans kesinlikle uygulanmaz</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Altın Anne Section */}
      <section className="demas-section">
        <div className="trust-container">
          <div className="demas-content">
            <div className="demas-info">
              <h2>Altın Anne Güvencesi</h2>
              <p>
                Altın Anne e-ticaret platformu ve garantisiyle sunulan 14'lük, 
                tüketiciye güven verirken satıcı için de güçlü bir marka desteği oluşturur. 
                Sertifikalı paketleme, sigortalı kargo ve laboratuvar testleriyle doğrulanmış kalite standartları sayesinde, 
                her ürün yüksek güvenilirlik ve değer sunar.
              </p>
              <div className="demas-features">
                <div className="demas-feature">
                  <CheckCircle size={24} />
                  <span>E-ticaret platformu ve güçlü marka desteği</span>
                </div>
                <div className="demas-feature">
                  <CheckCircle size={24} />
                  <span>Sertifikalı paketleme ve sigortalı kargo</span>
                </div>
                <div className="demas-feature">
                  <CheckCircle size={24} />
                  <span>Laboratuvar testleriyle doğrulanmış kalite</span>
                </div>
                <div className="demas-feature">
                  <CheckCircle size={24} />
                  <span>Şeffaf geri alım garantisi</span>
                </div>
              </div>
            </div>
            <div className="demas-visual">
              <div className="building-icon">
                <Building size={100} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Shipping Section */}
      <section className="shipping-section">
        <div className="trust-container">
          <h2>Güvenli Kargo ve Teslimat Süreci</h2>
          <div className="shipping-grid">
            <div className="shipping-card">
              <div className="shipping-icon">
                <Truck size={50} />
              </div>
              <h3>Sigortalı Kargo</h3>
              <p>Tüm gönderilerimiz sigortalı kargo ile güvenle taşınır. Özel ambalajlama ile ürünleriniz korunur ve kimlik kontrolü ile güvenli teslimat yapılır</p>
            </div>
            <div className="shipping-card">
              <div className="shipping-icon">
                <Package size={50} />
              </div>
              <h3>Şık ve Güvenli Blister Ambalajı</h3>
              <p>Sahteciliğe karşı mühürlü yapısı ve açıldığında belli olan paketleme sistemiyle tam güven sağlar</p>
            </div>
            <div className="shipping-card">
              <div className="shipping-icon">
                <Shield size={50} />
              </div>
              <h3>Kargo Süreci</h3>
              <p>Kargo süreci genellikle 1-3 iş günü içerisinde tamamlanır. Tüm satışlar sigortalı kargo, sertifika ve ambalaj güvencesiyle yapılmaktadır</p>
            </div>
          </div>
        </div>
      </section>

      {/* Altın Anne Section */}
      <section className="altin-anne-section">
        <div className="trust-container">
          <div className="altin-anne-content">
            <div className="altin-anne-info">
              <h2>14'lük ile Tam Güven</h2>
              <p>
                Şık ve güvenli blister ambalajı, sahteciliğe karşı mühürlü yapısı ve açıldığında belli olan paketleme sistemiyle tam güven sağlar. 
                Karekod doğrulaması sayesinde ürünün gramajı, ayarı ve orijinalliği kolayca kontrol edilebilir.
              </p>
              <div className="altin-anne-features">
                <div className="feature-item">
                  <div className="feature-number">QR</div>
                  <div className="feature-text">Kod Doğrulama</div>
                </div>
                <div className="feature-item">
                  <div className="feature-number">Sertifika</div>
                  <div className="feature-text">Laboratuvar Testi</div>
                </div>
                <div className="feature-item">
                  <div className="feature-number">Mühürlü</div>
                  <div className="feature-text">Güvenli Ambalaj</div>
                </div>
                <div className="feature-item">
                  <div className="feature-number">Ayar Güvencesi</div>
                  <div className="feature-text">Negatif tolerans yoktur</div>
                </div>
              </div>
            </div>
            <div className="altin-anne-cta">
              <Link to="/altin-anne" className="altin-anne-button">
                Altın Anne'de Alışveriş Yap
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Trust;
