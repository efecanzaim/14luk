import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Star, Weight} from 'lucide-react';
import './Products.css';

interface Product {
  id: string;
  name: string;
  type: 'square' | 'circle' | 'heart';
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
      name: 'Dikdörtgen 14\'lük',
      type: 'square',
      description: 'Klasik tasarım, zamansız güzellik. Geleneksel altın yatırımına modern bir alternatif.',
      weights: ['1g', '2.5g', '5g', '10g'],
      price: 'Uygun fiyatlar',
      features: ['585 ayar altın', 'Klasik tasarım', 'Yatırım değeri', 'Hediyelik uygun'],
      image: '/14luk.png'
    },
    {
      id: '2',
      name: 'Yuvarlak 14\'lük',
      type: 'circle',
      description: 'Ziynet benzeri şık görünüm. Estetik ve değerli, her duruma uygun.',
      weights: ['1g', '2.5g', '5g', '10g'],
      price: 'Uygun fiyatlar',
      features: ['585 ayar altın', 'Şık tasarım', 'Ziynet benzeri', 'Çok amaçlı kullanım'],
      image: '/14luk.png'
    },
    {
      id: '3',
      name: 'Kalp 14\'lük',
      type: 'heart',
      description: 'Hediyelik ve duygusal değer. Özel günlerde anlamlı hediye.',
      weights: ['1g', '2.5g', '5g', '10g'],
      price: 'Uygun fiyatlar',
      features: ['585 ayar altın', 'Kalp tasarım', 'Hediyelik uygun', 'Duygusal değer'],
      image: '/14luk.png'
    }
  ];



  return (
    <div className="products">
      {/* Hero Section */}
      <section className="products-hero">
        <div className="products-hero-container">
          <h1 className="products-hero-title">14'lük Ürün Çeşitleri</h1>
          <p className="products-hero-subtitle">
            Her zevke ve ihtiyaca uygun, kaliteli ve güvenilir altın ürünleri
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
                    <Link to="/altin-anne" className="buy-button">
                      <ShoppingBag size={20} />
                      <span>Satın Al</span>
                    </Link>
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
