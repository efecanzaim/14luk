import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin } from 'lucide-react';
import './Footer.css';

const Footer: React.FC = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-content">
          <div className="footer-section">
            <h3 className="footer-title">14'lük Altın</h3>
            <p className="footer-description">
              Her keseye uygun, değerli ve güvenilir altın ürünleri. 
              DEMAŞ A.Ş. güvencesiyle.
            </p>
          </div>

          <div className="footer-section">
            <h4 className="footer-subtitle">Hızlı Linkler</h4>
            <ul className="footer-links">
              <li><Link to="/hakkimizda">Hakkımızda</Link></li>
              <li><Link to="/urunler">Ürünler</Link></li>
              <li><Link to="/guven-ve-kalite">Güven & Kalite</Link></li>
              <li><Link to="/sik-sorulan-sorular">SSS</Link></li>
            </ul>
          </div>

          <div className="footer-section">
            <h4 className="footer-subtitle">İletişim</h4>
            <div className="contact-info">
              <div className="contact-item">
                <Phone size={16} />
                <span>+90 (212) 702 32 57</span>
              </div>
              <div className="contact-item">
                <Mail size={16} />
                <span>info@altinanne.com</span>
              </div>
              <div className="contact-item">
                <MapPin size={16} />
                <span>Yenibosna Merkez Mah. Kuyumcukent Sok. Kuyumcukent AVM No:4M/Z265 Bahçelievler/İstanbul</span>
              </div>
            </div>
          </div>

          <div className="footer-section">
            <h4 className="footer-subtitle">Altın Anne</h4>
            <p className="footer-description">
              Resmi satış kanalımız Altın Anne'den güvenle alışveriş yapın.
            </p>
            <Link to="/altin-anne" className="footer-cta">
              Altın Anne'ye Git
            </Link>
          </div>
        </div>

        <div className="footer-bottom">
          <div className="footer-bottom-content">
            <p>&copy; 2025 14'lük Tüm hakları saklıdır.</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
