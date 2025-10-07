import React, { useState } from 'react';
import './TalepFormu.css';

const TalepFormu: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [isPrivacyAccepted, setIsPrivacyAccepted] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!isPrivacyAccepted) {
      alert('Lütfen kişisel verilerin işlenmesi hakkındaki bilgilendirmeyi onaylayınız.');
      return;
    }
    
    setIsSubmitting(true);
    setSubmitStatus('idle');

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      phone: formData.get('phone') as string,
      subject: formData.get('subject') as string,
      message: formData.get('message') as string,
      timestamp: new Date().toLocaleString('tr-TR')
    };

    try {
      const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbx_hRiDEy3D2p14RmkDxEZpPh0yQE5GelMt3Lkgfucm8fN0RsXR_ntAqEIgwrqo1JX6/exec';
      
      console.log('Gönderilen veri:', data);
      
      const response = await fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
      });

      console.log('Response:', response);
      setSubmitStatus('success');
      (e.target as HTMLFormElement).reset();
    } catch (error) {
      console.error('Form gönderim hatası:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="talep-formu">
      {/* Hero Section */}
      <section className="talep-formu-hero">
        <div className="talep-formu-hero-container">
          <h1 className="talep-formu-hero-title">Bayi Talep Formu</h1>
          <p className="talep-formu-hero-subtitle">
            Bayi talepleriniz için bizimle iletişime geçin
          </p>
        </div>
      </section>

      {/* Form Section */}
      <section className="talep-formu-content">
        <div className="talep-formu-container">
          <div className="form-card">
            <h2>Bayi Talep Formu</h2>
            <p>Özel ürün talepleriniz, özel gramaj istekleriniz veya diğer sorularınız için aşağıdaki formu doldurabilirsiniz.</p>
            
            <form className="talep-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="name">Ad Soyad *</label>
                <input type="text" id="name" name="name" required />
              </div>
              
              <div className="form-group">
                <label htmlFor="email">E-posta *</label>
                <input type="email" id="email" name="email" required />
              </div>
              
              <div className="form-group">
                <label htmlFor="phone">Telefon</label>
                <input type="tel" id="phone" name="phone" />
              </div>
              
              <div className="form-group">
                <label htmlFor="subject">Konu *</label>
                <select id="subject" name="subject" required>
                  <option value="">Konu seçiniz</option>
                  <option value="bayilik-basvurusu">Bayilik Başvurusu</option>
                  <option value="ozel-gramaj">Özel Gramaj Talebi</option>
                  <option value="toplu-siparis">Toplu Sipariş</option>
                  <option value="ozel-tasarim">Özel Tasarım</option>
                  <option value="diger">Diğer</option>
                </select>
              </div>
              
              <div className="form-group">
                <label htmlFor="message">Mesajınız *</label>
                <textarea id="message" name="message" rows={5} required placeholder="Talebinizi detaylı olarak açıklayınız..."></textarea>
              </div>
              
              <div className="privacy-checkbox">
                <label className="checkbox-label">
                  <input 
                    type="checkbox" 
                    checked={isPrivacyAccepted}
                    onChange={(e) => setIsPrivacyAccepted(e.target.checked)}
                    required
                  />
                  <span className="checkbox-text">
                    Yukarıdaki alanlar üzerinden tarafımıza açıklayacağınız kişisel verileriniz Demaş Hediyelik Eşya Anonim Şirketi tarafından iletişim faaliyetlerinin yürütülmesi, talep / şikayetlerin takibi, iş süreçlerinin iyileştirilmesine yönelik önerilerin alınması ve değerlendirilmesi, mal / hizmet satış sonrası destek hizmetlerinin yürütülmesi, müşteri memnuniyetine yönelik aktivitelerin yürütülmesi, müşteri ilişkileri yönetimi süreçlerinin yürütülmesi amaçlarıyla işlenecektir. Ayrıntılı bilgiye{' '}
                    <a 
                      href="https://altinanne.com/iletisim-formu-aydinlatma-metni" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="privacy-link"
                    >
                      İletişim Formu Aydınlatma Metni
                    </a>
                    'nden ulaşabilirsiniz.
                    <br /><br />
                    Serbest alanlarda bizlerle paylaşacağınız kişisel verileriniz Demaş Hediyelik Eşya Anonim Şirketi tarafından aydınlatma metninde belirtilen amaçlar ile sınırlı olarak işlenmiş sayılacaktır. Özel nitelikli kişisel veri (ırk, etnik köken, siyasi düşünce, felsefi inanç, din, mezhep veya diğer inançlar, kılık ve kıyafet, dernek, vakıf ya da sendika üyeliği, sağlık, cinsel hayat, ceza mahkûmiyet ve güvenlik tedbirleriyle ilgili veriler ile biyometrik ve genetik veriler) ve üçüncü kişilere ait kişisel verilerin paylaşılmamasına özen gösterilmesini rica ederiz.
                  </span>
                </label>
              </div>
              
              <button 
                type="submit" 
                className="submit-button"
                disabled={isSubmitting || !isPrivacyAccepted}
              >
                {isSubmitting ? 'Gönderiliyor...' : 'Bayi Talebi Gönder'}
              </button>
              
              {submitStatus === 'success' && (
                <div className="success-message">
                  ✅ Bayi talebiniz başarıyla gönderildi! En kısa sürede size dönüş yapacağız.
                </div>
              )}
              
              {submitStatus === 'error' && (
                <div className="error-message">
                  ❌ Form gönderilirken bir hata oluştu. Lütfen tekrar deneyin veya bizimle iletişime geçin.
                </div>
              )}
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};

export default TalepFormu;
