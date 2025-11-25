/**
 * Fiyat Verilerini Toplama ve Gönderme Servisi
 * 
 * Güvenlik: API key, rate limiting, hata yönetimi
 */

import io from 'socket.io-client';

interface PriceData {
  symbol: string;
  buy_price: number;
  sell_price: number;
  close_price?: number;
  direction?: string;
}

interface HaremData {
  ONS?: {
    alis: string;
    satis: string;
    kapanis?: string;
    dir?: {
      satis_dir?: string;
    };
  };
  ALTIN?: {
    alis: string;
    satis: string;
    kapanis?: string;
    dir?: {
      satis_dir?: string;
    };
  };
}

class PriceCollector {
  private socket: any = null;
  private isCollecting = false;
  private lastCollectionTime = 0;
  private readonly COLLECTION_INTERVAL = 2 * 60 * 1000; // 2 dakika
  private readonly API_KEY = process.env.REACT_APP_PRICE_API_KEY || 'default-secret-key-change-this';
  private readonly API_URL = process.env.REACT_APP_API_URL || 'https://14luk.com/backend/api';

  async startCollection(): Promise<void> {
    if (this.isCollecting) {
      console.log('Veri toplama zaten aktif');
      return;
    }

    try {
      this.isCollecting = true;
      await this.collectAndSendPrices();
      
      console.log('✓ Fiyat toplama servisi başlatıldı');
    } catch (error) {
      console.error('✗ Veri toplama başlatılamadı:', error);
    }
  }

  private async collectAndSendPrices(): Promise<void> {
    const now = Date.now();
    
    const lastCollectionStr = localStorage.getItem('lastPriceCollection');
    const lastCollection = lastCollectionStr ? parseInt(lastCollectionStr) : 0;
    
    if (now - lastCollection < 2 * 60 * 1000) {
      const remainingSeconds = Math.ceil((2 * 60 * 1000 - (now - lastCollection)) / 1000);
      console.log(`⏭️  Bu 2 dakika içinde zaten veri toplandı, ${remainingSeconds} saniye sonra tekrar denenecek`);
      return;
    }

    try {
      console.log('📊 Fiyat verileri toplanıyor...');
      
      const haremData = await this.fetchFromHaremin();
      
      if (haremData) {
        const formattedData = this.formatPriceData(haremData);
        const success = await this.sendToBackend(formattedData);
        
        if (success) {
          this.lastCollectionTime = now;
          localStorage.setItem('lastPriceCollection', now.toString());
          console.log('✅ Fiyat verileri başarıyla kaydedildi');
        }
      }
    } catch (error) {
      console.error('❌ Veri toplama hatası:', error);
    }
  }

  private fetchFromHaremin(): Promise<HaremData | null> {
    return new Promise((resolve, reject) => {
      const socket = io('wss://api.haremaltin.com', {
        transports: ['websocket'],
        rejectUnauthorized: false
      });

      let timeoutId: NodeJS.Timeout;

      timeoutId = setTimeout(() => {
        socket.disconnect();
        reject(new Error('Haremin API timeout'));
      }, 10000);

      socket.on('connect', () => {
        console.log('Haremin API\'ye bağlandı');
      });

      socket.on('price_changed', (data: any) => {
        if (data.data) {
          clearTimeout(timeoutId);
          socket.disconnect();
          resolve(data.data);
        }
      });

      socket.on('connect_error', (error: any) => {
        clearTimeout(timeoutId);
        socket.disconnect();
        reject(new Error('Haremin API bağlantı hatası: ' + error.message));
      });
    });
  }

  private formatPriceData(haremData: HaremData): PriceData[] {
    const prices: PriceData[] = [];

    // ONS Altın
    if (haremData.ONS) {
      prices.push({
        symbol: 'ONS',
        buy_price: parseFloat(haremData.ONS.alis),
        sell_price: parseFloat(haremData.ONS.satis),
        close_price: haremData.ONS.kapanis ? parseFloat(haremData.ONS.kapanis) : undefined,
        direction: haremData.ONS.dir?.satis_dir
      });
    }

    // Has Altın
    if (haremData.ALTIN) {
      prices.push({
        symbol: 'ALTIN',
        buy_price: parseFloat(haremData.ALTIN.alis),
        sell_price: parseFloat(haremData.ALTIN.satis),
        close_price: haremData.ALTIN.kapanis ? parseFloat(haremData.ALTIN.kapanis) : undefined,
        direction: haremData.ALTIN.dir?.satis_dir
      });

      // 14'lük hesapla (Alış: Has Altın × 0.580, Satış: Has Altın × 0.645)
      const ondortlukAlis = parseFloat(haremData.ALTIN.alis) * 0.580;
      const ondortlukSatis = parseFloat(haremData.ALTIN.satis) * 0.645;
      const ondortlukKapanis = haremData.ALTIN.kapanis ? parseFloat(haremData.ALTIN.kapanis) * 0.645 : undefined;

      prices.push({
        symbol: '14LUK',
        buy_price: ondortlukAlis,
        sell_price: ondortlukSatis,
        close_price: ondortlukKapanis,
        direction: haremData.ALTIN.dir?.satis_dir
      });
    }

    return prices;
  }

  /**
   * Backend'e veri gönder
   */
  private async sendToBackend(prices: PriceData[]): Promise<boolean> {
    try {
      const response = await fetch(`${this.API_URL}/save_prices.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': this.API_KEY
        },
        body: JSON.stringify({ prices })
      });

      const result = await response.json();

      if (result.success) {
        console.log(`✓ ${result.saved_count} fiyat kaydedildi`);
        return true;
      } else {
        console.error('Backend hatası:', result.message);
        return false;
      }
    } catch (error) {
      console.error('Backend gönderim hatası:', error);
      return false;
    }
  }

  /**
   * Veri toplamayı durdur
   */
  stopCollection(): void {
    this.isCollecting = false;
    if (this.socket) {
      this.socket.disconnect();
    }
    console.log('Fiyat toplama servisi durduruldu');
  }
}

export const priceCollector = new PriceCollector();
