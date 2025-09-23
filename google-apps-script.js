function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    
    const sheet = SpreadsheetApp.getActiveSheet();
    
    if (sheet.getLastRow() === 0) {
      sheet.getRange(1, 1, 1, 6).setValues([
        ['Tarih', 'Ad Soyad', 'E-posta', 'Telefon', 'Konu', 'Mesaj']
      ]);
      sheet.getRange(1, 1, 1, 6).setFontWeight('bold');
    }
    
    const safePhone = data.phone ? data.phone.replace(/\+/g, '') : '';
    
    const newRow = [
      data.timestamp || new Date().toLocaleString('tr-TR'),
      data.name || '',
      data.email || '',
      safePhone,
      data.subject || '',
      data.message || ''
    ];
    
    const lastRow = sheet.getLastRow() + 1;
    sheet.getRange(lastRow, 1, 1, 6).setValues([newRow]);
    
    return ContentService
      .createTextOutput(JSON.stringify({success: true}))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    console.error('Hata:', error);
    return ContentService
      .createTextOutput(JSON.stringify({success: false, error: error.toString()}))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function testFunction() {
  const testData = {
    name: 'Test Kullanıcı',
    email: 'test@example.com',
    phone: '0555 123 45 67',
    subject: 'Test Konusu',
    message: 'Bu bir test mesajıdır.',
    timestamp: new Date().toLocaleString('tr-TR')
  };
  
  const mockEvent = {
    postData: {
      contents: JSON.stringify(testData)
    }
  };
  
  const result = doPost(mockEvent);
  console.log(result.getContent());
}
