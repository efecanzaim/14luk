import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Award, Truck, Package, CheckCircle, Star, Building, FileText } from 'lucide-react';
import './Trust.css';

const Trust: React.FC = () => {
  return (
    <div className="trust">
      {/* Hero Section */}
      <section className="trust-hero">
        <div className="trust-hero-container">
          <h1 className="trust-hero-title">Güven ve Kalite</h1>
          <p className="trust-hero-subtitle">
            DEMAŞ A.Ş. güvencesiyle, en yüksek kalite standartlarında hizmet
          </p>
        </div>
      </section>

      {/* Gold Quality Section */}
      <section className="gold-quality">
        <div className="trust-container">
          <div className="quality-content">
            <h2>585 Ayar Altın Kalitesi</h2>
            <div className="quality-grid">
              <div className="quality-card">
                <div className="quality-icon">
                  <Award size={50} />
                </div>
                <h3>Güvenilir Altın</h3>
                <p>585 ayar altın ile yüksek kalite standartları</p>
              </div>
              <div className="quality-card">
                <div className="quality-icon">
                  <FileText size={50} />
                </div>
                <h3>Sertifikalı</h3>
                <p>Her ürün için kalite sertifikası ve garanti</p>
              </div>
              <div className="quality-card">
                <div className="quality-icon">
                  <Star size={50} />
                </div>
                <h3>Test Edilmiş</h3>
                <p>Laboratuvar testleri ile doğrulanmış saflık</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* DEMAŞ Section */}
      <section className="demas-section">
        <div className="trust-container">
          <div className="demas-content">
            <div className="demas-info">
              <h2>DEMAŞ A.Ş. Güvencesi</h2>
              <p>
                Borsa İstanbul üyesi olan DEMAŞ A.Ş., altın sektöründe 
                köklü geçmişi ve güvenilirliği ile tanınan bir firmadır. 
                14'lük altın konseptini geliştirerek sektöre yenilik getirmiştir.
              </p>
              <div className="demas-features">
                <div className="demas-feature">
                  <CheckCircle size={24} />
                  <span>Borsa İstanbul üyeliği</span>
                </div>
                <div className="demas-feature">
                  <CheckCircle size={24} />
                  <span>Sigortalı kargo hizmeti</span>
                </div>
                <div className="demas-feature">
                  <CheckCircle size={24} />
                  <span>Sertifikalı paketleme</span>
                </div>
                <div className="demas-feature">
                  <CheckCircle size={24} />
                  <span>Müşteri memnuniyeti odaklı hizmet</span>
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
          <h2>Güvenli Kargo ve Teslimat</h2>
          <div className="shipping-grid">
            <div className="shipping-card">
              <div className="shipping-icon">
                <Truck size={50} />
              </div>
              <h3>Sigortalı Kargo</h3>
              <p>Tüm gönderilerimiz sigortalı kargo ile güvenle taşınır</p>
            </div>
            <div className="shipping-card">
              <div className="shipping-icon">
                <Package size={50} />
              </div>
              <h3>Sertifikalı Paketleme</h3>
              <p>Özel ambalajlama ile ürünleriniz korunur</p>
            </div>
            <div className="shipping-card">
              <div className="shipping-icon">
                <Shield size={50} />
              </div>
              <h3>Güvenli Teslimat</h3>
              <p>Kimlik kontrolü ile güvenli teslimat</p>
            </div>
          </div>
        </div>
      </section>

      {/* Altın Anne Section */}
      <section className="altin-anne-section">
        <div className="trust-container">
          <div className="altin-anne-content">
            <div className="altin-anne-info">
              <h2>Altın Anne Güvenilirliği</h2>
              <p>
                Altın Anne, DEMAŞ A.Ş.'nin resmi e-ticaret markası olarak, 
                müşteri memnuniyeti ve güvenilirlik odaklı hizmet vermektedir.
              </p>
              <div className="altin-anne-features">
                <div className="feature-item">
                  <div className="feature-number">100%</div>
                  <div className="feature-text">Güvenli Ödeme</div>
                </div>
                <div className="feature-item">
                  <div className="feature-number">7/24</div>
                  <div className="feature-text">Müşteri Desteği</div>
                </div>
                <div className="feature-item">
                  <div className="feature-number">24h</div>
                  <div className="feature-text">Hızlı Kargo</div>
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
