// Google Apps Script - Backend untuk Undangan Pernikahan
// Setup: Ganti SPREADSHEET_ID dengan ID Google Sheet Anda

const SPREADSHEET_ID = "YOUR_SPREADSHEET_ID_HERE";
const SHEET_NAME_CONFIG = "Config";
const SHEET_NAME_GUESTS = "Guests";
const SHEET_NAME_COMMENTS = "Comments";

// ===== SETUP AWAL =====
// Jalankan function ini sekali untuk setup spreadsheet
function setupSpreadsheet() {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  
  // Buat sheet jika belum ada
  if (!ss.getSheetByName(SHEET_NAME_CONFIG)) {
    ss.insertSheet(SHEET_NAME_CONFIG);
  }
  if (!ss.getSheetByName(SHEET_NAME_GUESTS)) {
    ss.insertSheet(SHEET_NAME_GUESTS);
  }
  if (!ss.getSheetByName(SHEET_NAME_COMMENTS)) {
    ss.insertSheet(SHEET_NAME_COMMENTS);
  }

  // Setup Config sheet
  const configSheet = ss.getSheetByName(SHEET_NAME_CONFIG);
  if (configSheet.getLastRow() < 2) {
    configSheet.appendRow(["Key", "Value"]);
    configSheet.appendRow(["Nama Pria", "Andra Ramadhan M. S.Ag."]);
    configSheet.appendRow(["IG Pria", "@andra_ig"]);
    configSheet.appendRow(["Nama Wanita", "Rezky Catur Oktora, S.H."]);
    configSheet.appendRow(["IG Wanita", "@rezky_ig"]);
    configSheet.appendRow(["Tanggal Acara", "Rabu, 06 Mei 2026"]);
    configSheet.appendRow(["Lokasi Acara", "Gedung Serbaguna SMK DARUSSALAM"]);
    configSheet.appendRow(["No Rekening", "7991653213"]);
    configSheet.appendRow(["Nama Rekening", "A.n. Andra Ramadhan"]);
    configSheet.appendRow(["URL Musik", "https://archive.org/download/dj-losdol-zein-fvnky-kok-tutup-tutupi-nomere-mbok-ganti-dj-tiktok-2026-320-kbps/DJ%20LOSDOL%20ZEIN%20FVNKY%20%F0%9F%8E%B5%20KOK%20TUTUP%20TUTUPI%20NOMERE%20MBOK%20GANTI%20-%20DJ%20TIKTOK%202026%20-%20%28320%20Kbps%29.mp3"]);
    
    // Format header
    configSheet.getRange(1, 1, 1, 2).setFontWeight('bold').setBackground('#FFC800');
  }

  // Setup Guests sheet
  const guestsSheet = ss.getSheetByName(SHEET_NAME_GUESTS);
  if (guestsSheet.getLastRow() < 2) {
    guestsSheet.appendRow(["No", "Nama", "Status", "Pesan", "Timestamp"]);
    guestsSheet.getRange(1, 1, 1, 5).setFontWeight('bold').setBackground('#FFC800');
  }

  // Setup Comments sheet
  const commentsSheet = ss.getSheetByName(SHEET_NAME_COMMENTS);
  if (commentsSheet.getLastRow() < 2) {
    commentsSheet.appendRow(["No", "Nama", "Status", "Pesan", "Timestamp"]);
    commentsSheet.getRange(1, 1, 1, 5).setFontWeight('bold').setBackground('#FFC800');
  }

  Logger.log("✅ Spreadsheet setup selesai!");
  return { success: true, message: "Setup berhasil! Sheet siap digunakan." };
}

// ===== SERVE HTML =====
function doGet() {
  const html = HtmlService.createHtmlOutputFromFile('index')
      .setWidth(500)
      .setHeight(800);
  return html;
}

// ===== HANDLE POST/GET =====
function doPost(e) {
  const action = e.parameter.action;
  
  switch(action) {
    case 'submitComment':
      return ContentService.createTextOutput(
        JSON.stringify(submitComment(e.parameter.nama, e.parameter.status, e.parameter.pesan))
      ).setMimeType(ContentService.MimeType.JSON);
    
    case 'getConfig':
      return ContentService.createTextOutput(
        JSON.stringify(getWeddingConfig())
      ).setMimeType(ContentService.MimeType.JSON);
    
    case 'getComments':
      return ContentService.createTextOutput(
        JSON.stringify(getComments())
      ).setMimeType(ContentService.MimeType.JSON);
    
    case 'getStats':
      return ContentService.createTextOutput(
        JSON.stringify(getAttendanceStats())
      ).setMimeType(ContentService.MimeType.JSON);
    
    case 'updateConfig':
      return ContentService.createTextOutput(
        JSON.stringify(updateConfig(e.parameter.key, e.parameter.value))
      ).setMimeType(ContentService.MimeType.JSON);
    
    default:
      return ContentService.createTextOutput(
        JSON.stringify({ success: false, error: "Action tidak dikenal" })
      ).setMimeType(ContentService.MimeType.JSON);
  }
}

// ===== GET KONFIGURASI PERNIKAHAN =====
function getWeddingConfig() {
  try {
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const configSheet = ss.getSheetByName(SHEET_NAME_CONFIG);
    
    const data = configSheet.getDataRange().getValues();
    const config = {};

    data.forEach((row, index) => {
      if (index > 0 && row[0] && row[1]) {
        config[row[0]] = row[1];
      }
    });

    return {
      success: true,
      data: {
        pria: {
          nama: config['Nama Pria'] || 'Andra Ramadhan M. S.Ag.',
          ig: config['IG Pria'] || '@andra_ig'
        },
        wanita: {
          nama: config['Nama Wanita'] || 'Rezky Catur Oktora, S.H.',
          ig: config['IG Wanita'] || '@rezky_ig'
        },
        acara: {
          tanggal: config['Tanggal Acara'] || 'Rabu, 06 Mei 2026',
          lokasi: config['Lokasi Acara'] || 'Gedung Serbaguna SMK DARUSSALAM'
        },
        rekening: {
          nomor: config['No Rekening'] || '7991653213',
          nama: config['Nama Rekening'] || 'A.n. Andra Ramadhan'
        },
        musik: config['URL Musik'] || ''
      }
    };
  } catch (error) {
    Logger.log("Error di getWeddingConfig: " + error);
    return {
      success: false,
      error: error.toString()
    };
  }
}

// ===== GET SEMUA COMMENTS =====
function getComments() {
  try {
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const commentsSheet = ss.getSheetByName(SHEET_NAME_COMMENTS);
    
    const data = commentsSheet.getDataRange().getValues();
    const comments = [];

    for (let i = 1; i < data.length; i++) {
      const row = data[i];
      if (row[1]) {
        comments.push({
          nama: row[1] || '',
          status: row[2] || '',
          pesan: row[3] || '',
          timestamp: row[4] || ''
        });
      }
    }

    // Reverse untuk tampil terbaru dulu
    return {
      success: true,
      data: comments.reverse()
    };
  } catch (error) {
    Logger.log("Error di getComments: " + error);
    return {
      success: false,
      error: error.toString()
    };
  }
}

// ===== SUBMIT COMMENT BARU =====
function submitComment(nama, status, pesan) {
  try {
    if (!nama || !status || !pesan) {
      return {
        success: false,
        error: "Semua field harus diisi"
      };
    }

    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const commentsSheet = ss.getSheetByName(SHEET_NAME_COMMENTS);
    const guestsSheet = ss.getSheetByName(SHEET_NAME_GUESTS);

    // Format timestamp Indonesia
    const timestamp = new Date().toLocaleString('id-ID', {
      timeZone: 'Asia/Jakarta',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });

    // Tambah ke Comments sheet
    const commentRowNum = commentsSheet.getLastRow() + 1;
    commentsSheet.appendRow([
      commentRowNum - 1,
      nama,
      status,
      pesan,
      timestamp
    ]);

    // Tambah ke Guests sheet (untuk tracking kehadiran)
    const guestRowNum = guestsSheet.getLastRow() + 1;
    guestsSheet.appendRow([
      guestRowNum - 1,
      nama,
      status,
      pesan,
      timestamp
    ]);

    return {
      success: true,
      message: "Ucapan berhasil disimpan!",
      data: {
        nama: nama,
        status: status,
        pesan: pesan,
        timestamp: timestamp
      }
    };
  } catch (error) {
    Logger.log("Error di submitComment: " + error);
    return {
      success: false,
      error: error.toString()
    };
  }
}

// ===== UPDATE KONFIGURASI =====
function updateConfig(key, value) {
  try {
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const configSheet = ss.getSheetByName(SHEET_NAME_CONFIG);
    
    const data = configSheet.getDataRange().getValues();
    
    for (let i = 1; i < data.length; i++) {
      if (data[i][0] === key) {
        configSheet.getRange(i + 1, 2).setValue(value);
        return {
          success: true,
          message: "Config berhasil diupdate"
        };
      }
    }

    return {
      success: false,
      error: "Key tidak ditemukan"
    };
  } catch (error) {
    Logger.log("Error di updateConfig: " + error);
    return {
      success: false,
      error: error.toString()
    };
  }
}

// ===== GET STATISTIK KEHADIRAN =====
function getAttendanceStats() {
  try {
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const guestsSheet = ss.getSheetByName(SHEET_NAME_GUESTS);
    
    const data = guestsSheet.getDataRange().getValues();
    let hadir = 0;
    let tidakHadir = 0;

    for (let i = 1; i < data.length; i++) {
      if (data[i][2] === "Hadir") hadir++;
      else if (data[i][2] === "Tidak Hadir") tidakHadir++;
    }

    return {
      success: true,
      data: {
        hadir: hadir,
        tidakHadir: tidakHadir,
        total: hadir + tidakHadir
      }
    };
  } catch (error) {
    Logger.log("Error di getAttendanceStats: " + error);
    return {
      success: false,
      error: error.toString()
    };
  }
}
