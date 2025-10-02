import React, { useState } from 'react';
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
      answer: "14'lük, 585 milyem (14 ayar) altından üretilmiş, hem yatırım hem takı hem de hediye olarak kullanılabilen bir altın ürünüdür. Daha düşük bütçelerle altına erişim sağlayarak küçük yatırımcıya da imkân sunar."
    },
    {
      id: 2,
      question: "Bu ürün yatırım altını mı?",
      answer: "14'lük altın, takı niteliğinde ama güvenilir altın olarak tasarlanmıştır. Hem yatırım değeri hem de estetik değer taşır. 14 ayar altın kalitesinde olup, Altın Anne güvencesiyle üretilmektedir. Geleneksel yatırım altınından farklı olarak, aynı zamanda takı olarak da kullanılabilir."
    },
    {
      id: 3,
      question: "Hangi gramajlarda mevcut?",
      answer: "14'lük altın ürünlerimiz 1g, 2.5g, 5g, 10g gramaj seçeneklerinde mevcuttur. Bu çeşitlilik sayesinde her bütçeye uygun seçenekler sunuyoruz."
    },
    {
      id: 4,
      question: "14'lük ile gram altın arasındaki fark nedir?",
      answer: "14'lük altın, gram altına alternatif olarak tasarlanmış özel bir konsepttir. Gram altının yüksek maliyeti ve ziynet eşyalarının yatırım değeri eksikliği arasında köprü kuran, hem estetik hem de ekonomik değer taşıyan ürünlerdir. Düşük gramaj seçenekleri ile her keseye uygun fiyatlar sunar."
    },
    {
      id: 5,
      question: "Altının ayarı nedir?",
      answer: "14'lük altın ürünlerimiz 14 ayar altındır. Bu, altının %58.5 oranında saf altın içerdiği anlamına gelir. Bu ayar, hem dayanıklılık hem de değer açısından optimal bir seçimdir."
    },
    {
      id: 6,
      question: "14 ayar ürün düğünde takı olarak verilir mi?",
      answer: "Evet. Altın Anne 14'lük ürünleri, şık tasarımı ve sertifikalı güvenli ambalajı sayesinde düğünlerde ve özel günlerde hediye olarak gönül rahatlığıyla takılabilir."
    },
    {
      id: 7,
      question: "14 ayar altını kuyumcular geri alır mı?",
      answer: "Evet. Altın Anne iş birliği yapılan kuyumcular, 14 ayar ürünleri geri alım sistemine dahil eder. Ayrıca e-ticaret kanalı üzerinden de geri alım süreci şeffaf şekilde işletilir."
    },
    {
      id: 8,
      question: "14 ayar altın değer kaybettirir mi?",
      answer: "Hayır. 14 ayar altın, içindeki has altın miktarına göre fiyatlanır. Altın fiyatı yükseldiğinde 14 ayar altının da değeri yükselir. Altın Anne markası altında satılan ürünler sertifikalı olduğu için değer kaybı riski yoktur."
    },
    {
      id: 9,
      question: "Satarken zarar eder miyim?",
      answer: "14'lük ürünler, Altın Anne'nin geri alım garantisi kapsamında şeffaf fiyat politikası ile geri alınır. QR kod üzerinden anlık geri alım fiyatını görebilir, ürünü yetkili kanallarda kolayca nakde çevirebilirsiniz."
    },
    {
      id: 10,
      question: "Nereden satın alabilirim?",
      answer: "14'lük altın ürünlerimizi resmi satış kanalımız olan Altın Anne'den ve anlaşmalı tüm kuyumculardan güvenle satın alabilirsiniz."
    },
    {
      id: 11,
      question: "Ambalaj güvenilir mi?",
      answer: "Evet. Tüm ürünler QR kodlu, sertifikalı, mühürlü ambalaj ile sunulur. Ambalaj açıldığında belli olur ve ürünü kolayca doğrulamanızı sağlar. Bu sistem, sahte ya da düşük ayarlı ürün riskini tamamen ortadan kaldırır."
    },
    {
      id: 12,
      question: "QR kod ne işe yarar?",
      answer: "QR kodu okutarak: • Ürünün doğruluğunu ve ayarını görebilirsiniz, • Sertifika bilgilerini kontrol edebilirsiniz, • Güncel geri alım fiyatını öğrenebilirsiniz."
    },
    {
      id: 13,
      question: "Kargo ve sigorta süreci nasıl işliyor?",
      answer: "Tüm gönderilerimiz sigortalı kargo ile güvenle taşınır. Özel ambalajlama ile ürünleriniz korunur ve kimlik kontrolü ile güvenli teslimat yapılır. Kargo süreci genellikle 1-3 iş günü içerisinde tamamlanır."
    },
    {
      id: 14,
      question: "Altın Anne kimdir?",
      answer: "DEMAŞ A.Ş., Borsa İstanbul üyesi olan köklü bir altın firmasıdır. Sektörde güvenilirliği ve kalitesi ile tanınan firma, 14'lük altın konseptini geliştirerek sektöre yenilik getirmiştir."
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
      {/* Hero Section */}
      <section className="faq-hero">
        <div className="faq-hero-container">
          <h1 className="faq-hero-title">Sık Sorulan Sorular</h1>
          <p className="faq-hero-subtitle">
            14'lük altın hakkında merak ettiğiniz her şey
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
              14'lük altın konsepti hakkında en çok sorulan soruları ve cevaplarını 
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
