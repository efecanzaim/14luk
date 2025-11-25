import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Target, Award, Users, TrendingUp, Shield, Star } from 'lucide-react';
import './About.css';

const About: React.FC = () => {
  return (
    <div className="about">
      <Helmet>
        <title>Hakkımızda - 14'lük Nedir? | 14luk.com</title>
        <meta name="description" content="14'lük, Altın Anne güvencesiyle sektöre kazandırılan yenilikçi, modern, güvenilir ve benzersiz bir ürün serisidir. 14 ayar altın kalitesinde, hediye + birikim + koleksiyon üçlü işlev." />
        <meta name="keywords" content="14'lük nedir, hakkımızda, 14 ayar altın, Altın Anne, birikim, hediye, koleksiyon" />
        <link rel="canonical" href="https://14luk.com/hakkimizda" />
        
        <meta property="og:title" content="Hakkımızda - 14'lük Nedir?" />
        <meta property="og:description" content="14'lük, Altın Anne güvencesiyle sektöre kazandırılan yenilikçi, modern ve güvenilir bir ürün serisidir." />
        <meta property="og:url" content="https://14luk.com/hakkimizda" />
      </Helmet>
      
      {/* Hero Section */}
      <section className="about-hero">
        <div className="about-hero-container">
          <h1 className="about-hero-title">14'lük Konsepti</h1>
          <p className="about-hero-subtitle">
            "Herkese, Her Keseye" anlayışıyla sektöre kazandırılan yenilikçi, modern, güvenilir ve benzersiz bir ürün serisi
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="about-content">
        <div className="about-container">
          <div className="about-14k-info">
            <h2>14 Ayar Altın: Erişilebilir ve Güvenilir Seçim</h2>
            <div className="info-content">
                <p>
                <strong>14 ayar altın, 22 ayar ziynet veya 24 ayar gram altına göre %30-40 daha düşük fiyatla aynı gramajda altın alabilmenizi sağlar. </strong> 
                Yüksek işçilik maliyetlerini ortadan kaldırarak hem birikim hem de hediye değeri sunar.
              </p>
              <p>
                14 ayar altın, %58.5 saf altın içerir ve geri kalan %41.5'i gümüş, bakır gibi dayanıklılık sağlayan metallerdir. 
                Bu karışım sayesinde hem altının değerini korur hem de günlük kullanımda çok daha dayanıklı olur.
              </p>
              <p>
                <strong>Altın fiyatlarındaki hızlı ve ivmeli yükseliş, birikim yapmak isteyen kişilerin altına erişimini zorlaştırmaktadır. </strong> 
                Geleneksel gram altın artan fiyatlar ile erişilmez hale gelirken, ziynet ürünler ise birikim yapma değeri taşımakta yetersiz kalmaktadır.
              </p>
                <p>
                14'lük konsepti, daha uygun fiyatlarla birikim yapmayı mümkün kılarak "Altın almak bir lüks değil, herkesin hakkı" anlayışını 
                "Herkese, Her Keseye" sloganı ile güçlendirmeyi hedeflemektedir.
              </p>
            </div>
          </div>

          <div className="about-intro">
            <h2>14'lük Nedir?</h2>
            <p>
              14'lük koleksiyonu, 14 ayar saf altın kalitesiyle üretilmiş, Klasik (Dikdörtgen), yuvarlak, kalp ve yonca formlarında özel tasarımlar sunar. 1 gr'dan 100 gr'a kadar geniş gramaj seçenekleriyle, hem birikim hem hediye ihtiyacına hitap eder. Her ürün sertifikalıdır, özel ambalajlarda sunulur ve farklı kullanım alanları için klasik ve hediye ambalaj alternatifleri mevcuttur.
            </p>
            <p>
              Altın Anne e-ticaret platformu ve garantisiyle sunulan 14'lük, tüketiciye güven verirken satıcı için de güçlü bir marka desteği oluşturur. Sertifikalı paketleme, sigortalı kargo ve laboratuvar testleriyle doğrulanmış kalite standartları sayesinde, her ürün yüksek güvenilirlik ve değer sunar.
            </p>
          </div>

          <div className="about-comparison">
            <h2>Pazardaki Diğer Ürünlerle Karşılaştırma</h2>
            <div className="comparison-grid">
              <div className="comparison-item">
                <div className="comparison-icon">
                  <TrendingUp size={40} />
                </div>
                <h3>Pazardaki Mevcut Ürünler</h3>
                <ul>
                  <li>Düşük İşçilikli Takı: Geri alım bedeli standart değil</li>
                  <li>Ziynet Altın: Yüksek işçilik maliyeti</li>
                  <li>Gram Altın: Küçük bütçeler için erişim zor</li>
                  <li>Hatıra Para: Birikim değeri sınırlı</li>
                </ul>
              </div>
              <div className="comparison-item highlight">
                <div className="comparison-icon">
                  <Star size={40} />
                </div>
                <h3>14'lük</h3>
                <ul>
                  <li>Fiyat Erişilebilirliği: %30-40 daha düşük fiyat</li>
                  <li>Çok Amaçlı Kullanım: Hediye + koleksiyon + birikim</li>
                  <li>Güvenli Ambalaj: QR kodlu, sertifikalı, mühürlü</li>
                  <li>Şeffaf Geri Alım: Anlık fiyat görüntüleme</li>
                  <li>1gr'dan 100gr'a geniş gramaj yelpazesi</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="about-features">
            <h2>14'lük'ü Diğerlerinden Ayıran Farklılıklar</h2>
            <div className="features-grid">
              <div className="feature-item">
                <div className="feature-icon">
                  <Target size={40} />
                </div>
                <h3>Fiyat Erişilebilirliği</h3>
                <p>22 ayar ziynet veya 24 ayar gram altına göre %30-40 daha düşük fiyat ile erişilebilirlik sağlar</p>
              </div>
              <div className="feature-item">
                <div className="feature-icon">
                  <Award size={40} />
                </div>
                <h3>Çok Amaçlı Kullanım</h3>
                <p>Hediye + birikim + koleksiyon olarak üçlü işlev sunar</p>
              </div>
              <div className="feature-item">
                <div className="feature-icon">
                  <Shield size={40} />
                </div>
                <h3>Güvenli Ambalaj</h3>
                <p>QR kodlu, sertifikalı, mühürlü paketleme ile sahtecilik riski yok</p>
              </div>
              <div className="feature-item">
                <div className="feature-icon">
                  <Users size={40} />
                </div>
                <h3>Şeffaf Geri Alım</h3>
                <p>QR kod üzerinden güncel fiyat anlık görülebilir, şeffaf geri alım mekanizması</p>
              </div>
            </div>
          </div>

          <div className="about-companies">
            <h2>Altın Anne Güvencesi</h2>
            <div className="companies-content">
              <div className="company-info">
                <h3>Altın Anne</h3>
                <p>
                  Altın Anne, 14'lük ürünlerinin resmi satış kanalıdır. 
                  E-ticaret platformu ve garantisiyle sunulan 14'lük, tüketiciye güven verirken 
                  satıcı için de güçlü bir marka desteği oluşturur.
                </p>
                <ul>
                  <li>Resmi satış kanalı ve güçlü marka desteği</li>
                  <li>Sertifikalı paketleme ve sigortalı kargo</li>
                  <li>Laboratuvar testleriyle doğrulanmış kalite standartları</li>
                  <li>Şeffaf geri alım garantisi</li>
                </ul>
              </div>
            </div>
          </div>

        </div>
      </section>
    </div>
  );
};

export default About;
