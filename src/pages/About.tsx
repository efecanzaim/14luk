import React from 'react';
import { Target, Award, Users, TrendingUp, Shield, Star } from 'lucide-react';
import './About.css';

const About: React.FC = () => {
  return (
    <div className="about">
      {/* Hero Section */}
      <section className="about-hero">
        <div className="about-hero-container">
          <h1 className="about-hero-title">14'lük Konsepti</h1>
          <p className="about-hero-subtitle">
            Gram altına ve ziynete alternatif, uygun fiyatlı özel tasarım yatırım hediyelik mücevherat eşyası
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="about-content">
        <div className="about-container">
          <div className="about-14k-info">
            <h2>14 Ayar Altın: Değerli ve Akıllı Seçim</h2>
            <div className="info-content">
              <p>
                <strong>14 ayar altın, altın yatırımında hiçbir şey kaybetmediğiniz, tam tersine kazandığınız bir seçimdir. </strong> 
                Çoğu kişi 14 ayar altının "düşük kalite" olduğunu düşünür, ancak bu tamamen yanlış bir algıdır.
              </p>
              <p>
                14 ayar altın, %58.5 saf altın içerir ve geri kalan %41.5'i gümüş, bakır gibi dayanıklılık sağlayan metallerdir. 
                Bu karışım sayesinde hem altının değerini korur hem de takı olarak kullanımda çok daha dayanıklı olur.
              </p>
              <p>
                <strong>En önemli avantajı ise işçilik maliyetlerinin düşük olmasıdır. </strong> 
                22 ayar veya 24 ayar altınlara göre çok daha uygun fiyatlarla aynı gramajda altın alabilirsiniz. 
                Yani aynı para ile daha fazla altın sahibi olursunuz.
              </p>
              <p>
                Altın Anne olarak, müşterilerimize en değerli yatırımı en uygun fiyatlarla sunuyoruz. 
                14 ayar altın ile hem yatırım değerinizi koruyor hem de estetik bir takıya sahip oluyorsunuz.
              </p>
            </div>
          </div>

          <div className="about-intro">
            <h2>14'lük Nedir?</h2>
            <p>
              14'lük altın, geleneksel altın yatırımından farklı olarak tasarlanmış 
              özel bir konsepttir. Bu ürünler, takı niteliğinde ama güvenilir altın 
              olarak, her keseye uygun fiyatlı ama değerli alternatifler sunar.
            </p>
            <p>
              Gram altının yüksek maliyeti ve ziynet eşyalarının yatırım değeri 
              eksikliği arasında köprü kuran 14'lük altın, hem estetik hem de 
              ekonomik değer taşır.
            </p>
          </div>

          <div className="about-comparison">
            <h2>Altın Yatırımından Farkı</h2>
            <div className="comparison-grid">
              <div className="comparison-item">
                <div className="comparison-icon">
                  <TrendingUp size={40} />
                </div>
                <h3>Geleneksel Altın Yatırımı</h3>
                <ul>
                  <li>Yüksek gramaj gereksinimi</li>
                  <li>Yüksek maliyet</li>
                  <li>Sadece yatırım amaçlı</li>
                  <li>Estetik değer yok</li>
                </ul>
              </div>
              <div className="comparison-item highlight">
                <div className="comparison-icon">
                  <Star size={40} />
                </div>
                <h3>14'lük Altın</h3>
                <ul>
                  <li>Özel tasarım yatırım hediyelik mücevherat eşyası</li>
                  <li>Düşük gramaj seçenekleri</li>
                  <li>Uygun fiyatlı</li>
                  <li>Hem yatırım hem takı</li>
                  <li>Estetik ve değerli</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="about-features">
            <h2>14'lük Altının Avantajları</h2>
            <div className="features-grid">
              <div className="feature-item">
                <div className="feature-icon">
                  <Target size={40} />
                </div>
                <h3>Her Keseye Uygun</h3>
                <p>Düşük gramaj seçenekleri ile her bütçeye uygun fiyatlar</p>
              </div>
              <div className="feature-item">
                <div className="feature-icon">
                  <Award size={40} />
                </div>
                <h3>Takı Niteliğinde</h3>
                <p>Estetik tasarım ve kaliteli işçilik ile takı değeri</p>
              </div>
              <div className="feature-item">
                <div className="feature-icon">
                  <Shield size={40} />
                </div>
                <h3>Güvenilir Altın</h3>
                <p>585 ayar altın ile yüksek kalite ve güvenilirlik</p>
              </div>
              <div className="feature-item">
                <div className="feature-icon">
                  <Users size={40} />
                </div>
                <h3>Hediyelik Değer</h3>
                <p>Özel günlerde hediye olarak verilebilecek anlamlı ürünler</p>
              </div>
            </div>
          </div>

          <div className="about-companies">
            <h2>DEMAŞ A.Ş. ve Altın Anne</h2>
            <div className="companies-content">
              <div className="company-info">
                <h3>DEMAŞ A.Ş.</h3>
                <p>
                  Borsa İstanbul üyesi olan DEMAŞ A.Ş., altın sektöründe 
                  güvenilirliği ve kalitesi ile tanınan köklü bir firmadır. 
                  14'lük altın konseptini geliştirerek, sektöre yenilikçi 
                  bir yaklaşım getirmiştir.
                </p>
                <ul>
                  <li>Borsa İstanbul üyeliği</li>
                  <li>Sigortalı kargo hizmeti</li>
                  <li>Sertifikalı paketleme</li>
                  <li>Müşteri memnuniyeti odaklı hizmet</li>
                </ul>
              </div>
              <div className="company-info">
                <h3>Altın Anne</h3>
                <p>
                  Altın Anne, DEMAŞ A.Ş.'nin e-ticaret markası olarak, 
                  14'lük altın ürünlerinin resmi satış kanalıdır. 
                  Güvenilir alışveriş deneyimi ve müşteri desteği ile 
                  hizmet vermektedir.
                </p>
                <ul>
                  <li>Resmi satış kanalı</li>
                  <li>Güvenli ödeme sistemi</li>
                  <li>7/24 müşteri desteği</li>
                  <li>Hızlı kargo ve teslimat</li>
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
