import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';
import './FAQ.css';

interface FAQItem {
  id: number;
  question: string;
  answer: string;
}

const FAQ: React.FC = () => {
  const [openItems, setOpenItems] = useState<number[]>([]);

  const faqItems: FAQItem[] = [
    {
      id: 1,
      question: "14'lük nedir?",
      answer: "14'lük koleksiyonu, 14 ayar saf altın kalitesiyle üretilmiş, Klasik (Dikdörtgen), yuvarlak, kalp ve yonca formlarında özel tasarımlar sunar. 1 gr'dan 100 gr'a kadar geniş gramaj seçenekleriyle, hem birikim hem hediye ihtiyacına hitap eder. Her ürün sertifikalıdır, özel ambalajlarda sunulur ve farklı kullanım alanları için klasik ve hediye ambalaj alternatifleri mevcuttur.\n\nAltın Anne e-ticaret platformu ve garantisiyle sunulan 14'lük, tüketiciye güven verirken satıcı için de güçlü bir marka desteği oluşturur. Sertifikalı paketleme, sigortalı kargo ve laboratuvar testleriyle doğrulanmış kalite standartları sayesinde, her ürün yüksek güvenilirlik ve değer sunar."
    },
    {
      id: 2,
      question: "Bu ürün birikim altını mı?",
      answer: "14'lük altın, güvenilir bir altın olarak tasarlanmıştır. Hem birikim değeri hem de estetik değer taşır. 14 ayar altın kalitesinde olup, Altın Anne güvencesiyle üretilmektedir. Geleneksel birikim altınından farklı olarak, aynı zamanda hediye olarak da kullanılabilir."
    },
    {
      id: 3,
      question: "Hangi gramajlarda mevcut?",
      answer: "14'lük altın ürünlerimiz şuan için 1g, 2.5g, 5g, 10g gramaj seçeneklerinde mevcuttur. Bu çeşitlilik sayesinde her bütçeye uygun seçenekler sunuyoruz. İleride farklı gramaj seçenekleri de ürün yelpazemize eklenecektir."
    },
    {
      id: 4,
      question: "14'lük ile gram altın/ziynet arasındaki fark nedir?",
      answer: "14'lük altın, gram altına alternatif olarak tasarlanmış özel bir konsepttir. Gram altının yüksek maliyeti ve ziynet eşyalarının birikim değeri eksikliği arasında köprü kuran, hem estetik hem de ekonomik değer taşıyan ürünlerdir. Düşük gramaj seçenekleri ile her keseye uygun fiyatlar sunar."
    },
    {
      id: 5,
      question: "Altının ayarı nedir?",
      answer: "14'lük altın ürünlerimiz 14 ayar altındır. Bu, altının %58.5 oranında saf altın içerdiği anlamına gelir. Bu ayar, hem dayanıklılık hem de değer açısından optimal bir seçimdir."
    },
    {
      id: 6,
      question: "14 ayar ürün düğünde hediye olarak verilir mi?",
      answer: "Evet. Altın Anne 14'lük ürünleri, şık tasarımı ve sertifikalı güvenli ambalajı sayesinde düğünlerde ve özel günlerde hediye olarak gönül rahatlığıyla verilebilir."
    },
    {
      id: 7,
      question: "14 ayar altını kuyumcular geri alır mı?",
      answer: "Evet. Altın Anne iş birliği yapılan kuyumcular, 14 ayar ürünleri geri alım sistemine dahil eder. Ayrıca e-ticaret kanalı üzerinden de geri alım süreci şeffaf şekilde işletilir. Altın Anne iş birliği olan kuyumcular 14'lük ürününü alabileceği gibi, iş birliği yapmayan kuyumculara ise sitemizde yer alan fiyatları göstererek satış yapabilirsiniz."
    },
    {
      id: 8,
      question: "14 ayar altın değer kaybettirir mi?",
      answer: "Hayır. 14 ayar altın, içindeki has altın miktarına göre fiyatlanır. Altın fiyatı yükseldiğinde 14 ayar altının da değeri aynı oranda yükselir. Altın Anne markası altında satılan ürünler sertifikalı olduğu için değer kaybı riski yoktur."
    },
    {
      id: 9,
      question: "Satarken zarar eder miyim?",
      answer: "14'lük ürünler, Altın Anne'nin geri alım garantisi kapsamında şeffaf fiyat politikası ile geri alınır. QR kod üzerinden anlık geri alım fiyatını görebilir, ürünü yetkili kanallarda kolayca nakde çevirebilirsiniz."
    },
    {
      id: 10,
      question: "Nereden satın alabilirim?",
      answer: "14'lük altın ürünlerimizi resmi satış kanalımız olan Altın Anne'den ve anlaşmalı tüm kuyumculardan güvenle satın alabilirsiniz"
    },
    {
      id: 11,
      question: "Ambalaj güvenilir mi?",
      answer: "Evet. Tüm ürünler QR kodlu, sertifikalı, mor ışıkta belli olan hologramlı, mühürlü ambalaj ile sunulur. Ambalaj açıldığında belli olur ve ürünü kolayca doğrulamanızı sağlar. Bu sistem, sahte ya da düşük ayarlı ürün riskini tamamen ortadan kaldırır."
    },
    {
      id: 12,
      question: "QR kod ne işe yarar?",
      answer: "QR kodu okutarak: Ürünün doğruluğunu ve ayarını görebilirsiniz, Sertifika bilgilerini kontrol edebilirsiniz, Güncel geri alım fiyatını öğrenebilirsiniz."
    },
    {
      id: 13,
      question: "Kargo ve sigorta süreci nasıl işliyor?",
      answer: "Tüm gönderilerimiz sigortalı kargo ile güvenle taşınır. Özel ambalajlama ile ürünleriniz korunur ve kimlik kontrolü ile güvenli teslimat yapılır. Kargo süreci genellikle 1-3 iş günü içerisinde tamamlanır."
    }
  ];

  const toggleItem = (id: number) => {
    setOpenItems(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  return (
    <div className="faq">
      <Helmet>
        <title>Sık Sorulan Sorular - 14'lük Hakkında Merak Edilenler | 14luk.com</title>
        <meta name="description" content="14'lük nedir? Hangi gramajlarda mevcut? Geri alım nasıl yapılır? 14'lük hakkında merak edilen tüm soruların cevapları burada." />
        <meta name="keywords" content="14'lük SSS, sık sorulan sorular, 14 ayar altın, geri alım, gramaj, fiyat" />
        <link rel="canonical" href="https://14luk.com/sik-sorulan-sorular" />
        
        <meta property="og:title" content="Sık Sorulan Sorular - 14'lük" />
        <meta property="og:description" content="14'lük hakkında merak edilen tüm soruların cevapları." />
        <meta property="og:url" content="https://14luk.com/sik-sorulan-sorular" />
      </Helmet>
      
      {/* Hero Section */}
      <section className="faq-hero">
        <div className="faq-hero-container">
          <h1 className="faq-hero-title">Sık Sorulan Sorular</h1>
          <p className="faq-hero-subtitle">
            14'lük hakkında merak ettiğiniz her şey
          </p>
        </div>
      </section>

      {/* FAQ Content */}
      <section className="faq-content">
        <div className="faq-container">
          <div className="faq-intro">
            <div className="intro-icon">
              <HelpCircle size={60} />
            </div>
            <h2>Merak Ettikleriniz</h2>
            <p>
              14'lük konsepti hakkında en çok sorulan soruları ve cevaplarını 
              aşağıda bulabilirsiniz. Başka sorularınız varsa bizimle iletişime geçebilirsiniz.
            </p>
          </div>

          <div className="faq-list">
            {faqItems.map((item) => (
              <div key={item.id} className="faq-item">
                <button 
                  className="faq-question"
                  onClick={() => toggleItem(item.id)}
                >
                  <span>{item.question}</span>
                  {openItems.includes(item.id) ? (
                    <ChevronUp size={24} />
                  ) : (
                    <ChevronDown size={24} />
                  )}
                </button>
                {openItems.includes(item.id) && (
                  <div className="faq-answer">
                    <p>{item.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default FAQ;
