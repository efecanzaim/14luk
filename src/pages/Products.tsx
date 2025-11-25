import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ShoppingBag, Star, Weight} from 'lucide-react';
import './Products.css';

interface Product {
  id: string;
  name: string;
  type: 'square' | 'circle' | 'heart' | 'clover';
  description: string;
  weights: string[];
  price: string;
  features: string[];
  image: string;
}

const Products: React.FC = () => {
  const products: Product[] = [
    {
      id: '1',
      name: 'Klasik 14\'lük',
      type: 'square',
      description: 'Klasik tasarım, zamansız güzellik. Geleneksel altın birikimine modern bir alternatif. Hediye ve birikim olarak kullanma seçeneği.',
      weights: ['1g', '2.5g', '5g', '10g', '20g', '50g', '100g'],
      price: 'Erişilebilir fiyatlar',
      features: ['14 ayar altın', 'Klasik tasarım', 'Birikim değeri', 'Hediye + birikim kullanımı'],
      image: `${process.env.PUBLIC_URL}/14luk-kare.png`
    },
    {
      id: '2',
      name: 'Yuvarlak 14\'lük',
      type: 'circle',
      description: 'Ziynet benzeri şık görünüm. Estetik ve değerli, her duruma uygun. Çok amaçlı kullanım imkanı sunar.',
      weights: ['1g', '2.5g', '5g', '10g', '20g', '50g', '100g'],
      price: 'Erişilebilir fiyatlar',
      features: ['14 ayar altın', 'Şık tasarım', 'Ziynet benzeri', 'Çok amaçlı kullanım', 'Uygun fiyat'],
      image: `${process.env.PUBLIC_URL}/14luk-yuvarlak.png`
    },
    {
      id: '3',
      name: 'Kalp 14\'lük (Yakında)',
      type: 'heart',
      description: 'Hediyelik ve duygusal değer. Özel günlerde anlamlı hediye. Şık tasarımlar sayesinde düğünlerde tercih edilir.',
      weights: ['1g', '2.5g', '5g', '10g', '20g', '50g', '100g'],
      price: 'Erişilebilir fiyatlar',
      features: ['14 ayar altın', 'Kalp tasarım', 'Hediye + koleksiyon', 'Duygusal değer'],
      image: `${process.env.PUBLIC_URL}/14luk-kalp.png`
    },
    {
      id: '4',
      name: 'Yonca 14\'lük (Yakında)',
      type: 'clover',
      description: 'Şans ve bereket sembolü. Özel tasarım ile şansınızı artırın. Koleksiyon değeri taşıyan özel parça.',
      weights: ['1g', '2.5g', '5g', '10g', '20g', '50g', '100g'],
      price: 'Erişilebilir fiyatlar',
      features: ['14 ayar altın', 'Yonca tasarım', 'Şans sembolü', 'Koleksiyon değeri'],
      image: `${process.env.PUBLIC_URL}/14luk-yonca.png`
    }
  ];



  return (
    <div className="products">
      <Helmet>
        <title>14'lük Ürünleri - Klasik, Yuvarlak, Kalp ve Yonca | 14luk.com</title>
        <meta name="description" content="14 ayar saf altın kalitesiyle üretilmiş 14'lük koleksiyonu. Klasik (Dikdörtgen), yuvarlak, kalp ve yonca formlarında özel tasarımlar. 1gr'dan 100gr'a kadar geniş gramaj seçenekleri." />
        <meta name="keywords" content="14'lük ürünler, klasik altın, yuvarlak altın, kalp altın, yonca altın, 14 ayar, gram altın" />
        <link rel="canonical" href="https://14luk.com/urunler" />
        
        <meta property="og:title" content="14'lük Ürünleri - Klasik, Yuvarlak, Kalp ve Yonca" />
        <meta property="og:description" content="14 ayar saf altın kalitesiyle üretilmiş 14'lük koleksiyonu. 1gr'dan 100gr'a kadar geniş gramaj seçenekleri." />
        <meta property="og:url" content="https://14luk.com/urunler" />
      </Helmet>
      
      {/* Hero Section */}
      <section className="products-hero">
        <div className="products-hero-container">
          <h1 className="products-hero-title">14'lük Koleksiyonu</h1>
          <p className="products-hero-subtitle">
            14 ayar saf altın kalitesiyle üretilmiş, Klasik (Dikdörtgen), yuvarlak, kalp ve yonca formlarında özel tasarımlar. 
            1 gr'dan 100 gr'a kadar geniş gramaj seçenekleriyle, hem birikim hem hediye ihtiyacına hitap eder.
          </p>
        </div>
      </section>


      {/* Products Grid */}
      <section className="products-grid-section">
        <div className="products-container">
          <div className="products-grid">
            {products.map((product) => (
              <div key={product.id} className="product-card">
                <div className="product-image">
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="product-photo"
                    loading="eager"
                  />
                </div>
                
                <div className="product-info">
                  <h3 className="product-name">{product.name}</h3>
                  <p className="product-description">{product.description}</p>
                  
                  <div className="product-features">
                    <h4>Özellikler:</h4>
                    <ul>
                      {product.features.map((feature, index) => (
                        <li key={index}>
                          <Star size={16} />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="product-weights">
                    <h4>Gramaj Seçenekleri:</h4>
                    <div className="weight-options">
                      {product.weights.map((weight, index) => (
                        <span key={index} className="weight-option">
                          <Weight size={14} />
                          {weight}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="product-price">
                    <span className="price-label">{product.price}</span>
                  </div>

                  <div className="product-actions">
                    {product.type === 'heart' || product.type === 'clover' ? (
                      <div className="coming-soon-button">
                        <span>Yakında</span>
                      </div>
                    ) : (
                      <Link to="/altin-anne" className="buy-button">
                        <ShoppingBag size={20} />
                        <span>Satın Al</span>
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
};

export default Products;
