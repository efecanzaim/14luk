import React, { useEffect, useState } from 'react';
import { HashRouter as Router, Routes, Route, useLocation, Link } from 'react-router-dom';
import { ShoppingCart, House, Menu, X } from 'lucide-react';
import Footer from './components/Footer';
import './components/FixedNavbar.css';
import Home from './pages/Home';
import About from './pages/About';
import Products from './pages/Products';
import Trust from './pages/Trust';
import Press from './pages/Press';
import FAQ from './pages/FAQ';
import TalepFormu from './pages/TalepFormu';
import Dogrulama from './pages/Dogrulama';
import Redirect from './pages/Redirect';
import './App.css';

// Navigation data
const navItems = [
  { label: 'ANA SAYFA', href: '/', ariaLabel: 'Ana sayfaya git', icon: <House size={20} strokeWidth={2.5} /> },
  { label: 'ÜRÜNLER', href: '/urunler', ariaLabel: 'Ürünleri görüntüle' },
  { label: 'HAKKIMIZDA', href: '/hakkimizda', ariaLabel: 'Hakkımızda bilgi al' },
  { label: 'GÜVEN & KALİTE', href: '/guven-ve-kalite', ariaLabel: 'Güven ve kalite bilgileri' },
  { label: 'BASINDA BİZ', href: '/basinda-biz', ariaLabel: 'Basında çıkan haberler' },
  { label: 'SSS', href: '/sik-sorulan-sorular', ariaLabel: 'Sık sorulan sorular' },
  { label: 'TALEP FORMU', href: '/talep-formu', ariaLabel: 'Talep formu' },
  { label: 'DOĞRULAMA', href: '/dogrulama', ariaLabel: 'Doğrulama' },
  { label: 'SATIN AL', href: '/altin-anne', ariaLabel: 'Satın al', icon: <ShoppingCart size={20} strokeWidth={2.5} /> }
];

function AppContent() {
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Sayfa değiştiğinde en üste scroll
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  // Scroll event listener
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsScrolled(scrollTop > 50); // 50px scroll sonrası renk gelsin
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  return (
    <div className="App">
      <nav className={`fixed-navbar ${isScrolled ? 'scrolled' : ''}`}>
        <div className="navbar-container">
          <div className="navbar-logo">
            <span className="logo-text">14'lük</span>
          </div>
          <div className="navbar-links">
            {navItems.map((item, index) => (
              <Link
                key={index}
                to={item.href}
                className={`navbar-link ${location.pathname === item.href ? 'active' : ''}`}
                aria-label={item.ariaLabel}
              >
                {item.icon && <span className="navbar-icon">{item.icon}</span>}
                {item.label}
              </Link>
            ))}
          </div>
          
          <button 
            className="mobile-menu-button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Menüyü aç/kapat"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
        
        {/* Mobile Menu */}
        <div className={`mobile-menu ${isMobileMenuOpen ? 'open' : ''}`}>
          {navItems.map((item, index) => (
            <Link
              key={index}
              to={item.href}
              className={`mobile-menu-link ${location.pathname === item.href ? 'active' : ''}`}
              aria-label={item.ariaLabel}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {item.icon && <span className="navbar-icon">{item.icon}</span>}
              {item.label}
            </Link>
          ))}
        </div>
      </nav>
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/hakkimizda" element={<About />} />
          <Route path="/urunler" element={<Products />} />
          <Route path="/guven-ve-kalite" element={<Trust />} />
          <Route path="/basinda-biz" element={<Press />} />
          <Route path="/sik-sorulan-sorular" element={<FAQ />} />
          <Route path="/talep-formu" element={<TalepFormu />} />
          <Route path="/dogrulama" element={<Dogrulama />} />
          <Route path="/altin-anne" element={<Redirect />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
