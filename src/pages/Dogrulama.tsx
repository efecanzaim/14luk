import React, { useState } from 'react';
import './Dogrulama.css';

const Dogrulama: React.FC = () => {
  const [verificationStatus, setVerificationStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [serialNumber, setSerialNumber] = useState('');

  const handleCertificateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget as HTMLFormElement);
    const certificateNumber = formData.get('certificateNumber') as string;
    
    if (certificateNumber) {
      setSerialNumber(certificateNumber);
      setVerificationStatus('loading');
      
      // simulate verification
      const validCertificates = ['123456', '123457', '123458'];
      const isSuccess = validCertificates.includes(certificateNumber.toUpperCase());
      
      setTimeout(() => {
        setVerificationStatus(isSuccess ? 'success' : 'error');
      }, 2000);
    }
  };

  const handleCertificateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    
    // if field is empty, reset image
    if (value.trim() === '') {
      setSerialNumber('');
      setVerificationStatus('idle');
    }
  };

  return (
    <div className="dogrulama">
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
                        <img src={`${process.env.PUBLIC_URL}/14luk-kare.png`} alt="14'lük Altın" />
                        {verificationStatus === 'loading' && (
                          <div className="loading-overlay">
                            <div className="loading-spinner"></div>
                            <div className="loading-text">Doğrulanıyor...</div>
                          </div>
                        )}
                        {serialNumber && verificationStatus === 'success' && (
                          <div className="certificate-overlay">
                            {serialNumber}
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
                    {verificationStatus === 'success' && (
                      <div className="verification-message success">
                        Seri numarası eşleşti
                      </div>
                    )}
                    {verificationStatus === 'error' && (
                      <div className="verification-message error">
                        Seri numarası eşleşmedi
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
