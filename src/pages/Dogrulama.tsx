import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import './Dogrulama.css';

const API_URL = process.env.REACT_APP_VERIFY_API_URL || 'https://14luk.com/backend/api/verify.php';

interface VerificationResult {
  serialNumber: string;
  productType: string;
  productionDate: string;
  weight: string;
}

const Dogrulama: React.FC = () => {
  const [verificationStatus, setVerificationStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [productData, setProductData] = useState<VerificationResult | null>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageRetryCount, setImageRetryCount] = useState(0);
  const getWeightFileName = (weight: string): string => {
  const weightLower = weight.toLowerCase().replace(/\s/g, '');
  
    if (weightLower.includes('2.5gr') || weightLower.includes('2.5g')) {
      return '2-5-gr';
    }
    if (weightLower.includes('10gr') || weightLower.includes('10g')) {
      return '10-gr';
    }
    if (weightLower.includes('5gr') || weightLower.includes('5g')) {
      return '5-gr';
    }
    if (weightLower.includes('1gr') || weightLower.includes('1g')) {
      return '1-gr';
    }
    
    return '1-gr';
  };

  const getProductTypeFileName = (productType: string): string => {
    const typeLower = productType.toLowerCase();
    
    if (typeLower.includes('yuvarlak')) return 'yuvarlak';
    if (typeLower.includes('kalp')) return 'kalp';
    if (typeLower.includes('yonca')) return 'yonca';
    if (typeLower.includes('klasik')) return 'klasik';
    
    return 'klasik';
  };

  const handleCertificateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget as HTMLFormElement);
    const certificateNumber = formData.get('certificateNumber') as string;
    
    if (!certificateNumber || certificateNumber.trim() === '') {
      return;
    }
    
    setVerificationStatus('loading');
    setErrorMessage('');
    setProductData(null);
    setImageLoaded(false);
    setImageRetryCount(0);
    
    try {
      const [response] = await Promise.all([
        fetch(API_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            certificateNumber: certificateNumber.trim()
          })
        }),
        new Promise(resolve => setTimeout(resolve, 1500)) // 1.5 saniye loading
      ]);
      
      const result = await response.json();
      
      if (result.success && result.data) {
        setProductData(result.data);
        setVerificationStatus('success');
      } else {
        setErrorMessage(result.message || 'Sertifika numarası bulunamadı.');
        setVerificationStatus('error');
      }
      
    } catch (error) {
      setErrorMessage('Doğrulama sırasında bir hata oluştu. Lütfen tekrar deneyin.');
      setVerificationStatus('error');
    }
  };

  const handleCertificateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    
    if (value.trim() === '') {
      setVerificationStatus('idle');
      setProductData(null);
      setErrorMessage('');
    }
  };

  return (
    <div className="dogrulama">
      <Helmet>
        <title>Ürün Doğrulama - 14'lük Sertifika Kontrolü | 14luk.com</title>
        <meta name="description" content="14'lük ürünlerinizin orijinallik ve kalite doğrulaması. QR kod ile sertifika numaranızı kontrol edin." />
        <meta name="keywords" content="ürün doğrulama, sertifika kontrolü, QR kod, 14'lük doğrulama" />
        <link rel="canonical" href="https://14luk.com/dogrulama" />
      </Helmet>
      
      {/* Hero Section */}
      <section className="dogrulama-hero">
        <div className="dogrulama-hero-container">
          <h1 className="dogrulama-hero-title">Doğrulama</h1>
          <p className="dogrulama-hero-subtitle">
            Ürünlerinizin orijinallik ve kalite doğrulaması
          </p>
        </div>
      </section>

      {/* Content Section */}
      <section className="dogrulama-content">
        <div className="dogrulama-container">
          <div className="dogrulama-card">
            <h2>Ürün Doğrulama Sistemi</h2>
            <p>
              Altın Anne güvencesiyle üretilen 14'lük ürünlerimizin orijinallik ve kalite doğrulaması 
              için aşağıdaki bilgileri kullanabilirsiniz.
            </p>
            
            <div className="dogrulama-methods">
              <div className="method-card">
                <h3>Sertifika Numarası</h3>
                <p>Her ürünümüzde bulunan sertifika numarasını girerek ürününüzün doğruluğunu kontrol edebilirsiniz.</p>
                <form onSubmit={handleCertificateSubmit} className="verification-form">
                  <input 
                    type="text" 
                    name="certificateNumber"
                    placeholder="Sertifika numarasını giriniz" 
                    onChange={handleCertificateChange}
                    required
                  />
                  <button type="submit" className="verify-button">Doğrula</button>
                </form>
              </div>
              
              <div className="method-card">
                <div className="product-verification">
                  <div className="product-image-container">
                    <div className="dogrulama-product-image">
                      <div className={`dogrulama-product-photo ${verificationStatus === 'idle' ? 'blurred' : verificationStatus}`}>
                        {productData ? (
                          <>
                            {/* Doğru resim - yüklenene kadar gizli */}
                            <img 
                              src={`${process.env.PUBLIC_URL}/kart_fotolari/${getProductTypeFileName(productData.productType)}-${getWeightFileName(productData.weight)}.png`} 
                              alt={`14'lük ${productData.productType} - ${productData.weight}`}
                              loading="eager"
                              style={{ 
                                display: imageLoaded ? 'block' : 'none',
                                transition: 'opacity 0.3s ease'
                              }}
                            onError={(e) => {
                              const originalSrc = e.currentTarget.src;
                              
                              if (imageRetryCount < 2) {
                                setImageRetryCount(prev => prev + 1);
                                setTimeout(() => {
                                  e.currentTarget.src = originalSrc + '?retry=' + Date.now();
                                }, 1000);
                              } else {
                                e.currentTarget.src = `${process.env.PUBLIC_URL}/${
                                  productData.productType === 'Yuvarlak' ? '14lukyuvarlak.png' :
                                  productData.productType === 'Kalp' ? '14lukkalp.png' :
                                  productData.productType === 'Yonca' ? '14lukyonca.png' :
                                  productData.productType === 'Klasik' ? '14lukklasik.png' :
                                  '14lukklasik.png'
                                }`;
                              }
                            }}
                            onLoad={() => {
                              setImageLoaded(true);
                            }}
                          />
                          
                          {!imageLoaded && (
                            <img 
                              src={`${process.env.PUBLIC_URL}/14lukklasik.png`} 
                              alt="14'lük Altın"
                              className="blurred-placeholder"
                              loading="eager"
                              style={{ 
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                width: '100%',
                                height: '100%'
                              }}
                              onError={(e) => {
                                setTimeout(() => {
                                  e.currentTarget.src = `${process.env.PUBLIC_URL}/14lukklasik.png?retry=${Date.now()}`;
                                }, 500);
                              }}
                            />
                          )}
                          </>
                        ) : (
                          <img 
                            src={`${process.env.PUBLIC_URL}/14lukklasik.png`} 
                            alt="14'lük Altın"
                            loading="eager"
                            className="blurred-placeholder"
                            onError={(e) => {
                              setTimeout(() => {
                                e.currentTarget.src = `${process.env.PUBLIC_URL}/14lukklasik.png?retry=${Date.now()}`;
                              }, 500);
                            }}
                          />
                        )}
                        {verificationStatus === 'loading' && (
                          <div className="loading-overlay">
                            <div className="loading-spinner"></div>
                            <div className="loading-text">Doğrulanıyor...</div>
                          </div>
                        )}
                        {verificationStatus === 'success' && (
                          <div className="status-icon success">✓</div>
                        )}
                        {verificationStatus === 'error' && (
                          <div className="status-icon error">✗</div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="verification-messages">
                      {verificationStatus === 'success' && productData && (
                        <div className="verification-message success">
                          <div className="verification-header">
                            <div className="verification-icon">✓</div>
                            <div className="verification-title">Sertifika Doğrulandı</div>
                          </div>
                          <div className="verification-details">
                            <div className="verification-item">
                              <span className="verification-label">Seri No:</span>
                              <span className="verification-value">{productData.serialNumber}</span>
                            </div>
                            <div className="verification-item">
                              <span className="verification-label">Ürün Modeli:</span>
                              <span className="verification-value">{productData.productType}</span>
                            </div>
                            <div className="verification-item">
                              <span className="verification-label">Üretim Tarihi:</span>
                              <span className="verification-value">{productData.productionDate}</span>
                            </div>
                            <div className="verification-item">
                              <span className="verification-label">Ağırlık:</span>
                              <span className="verification-value">{productData.weight}</span>
                            </div>
                          </div>
                        </div>
                      )}
                      {verificationStatus === 'error' && (
                        <div className="verification-message error">
                          {errorMessage || 'Seri numarası eşleşmedi'}
                        </div>
                      )}
                    </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Dogrulama;