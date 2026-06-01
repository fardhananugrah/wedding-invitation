# 📋 Panduan Setup Google Apps Script - Undangan Pernikahan

## 🎯 Daftar Isi
1. [Persiapan](#persiapan)
2. [Setup Google Sheet](#setup-google-sheet)
3. [Setup Google Apps Script](#setup-google-apps-script)
4. [Deploy Web App](#deploy-web-app)
5. [Testing](#testing)
6. [Troubleshooting](#troubleshooting)

---

## 🔧 Persiapan

### Yang Anda Butuhkan:
- Akun Google
- Browser modern (Chrome, Firefox, Safari)
- File dari repository ini:
  - `Code.gs`
  - `index.html`
  - `appsscript.json`

---

## 📊 Setup Google Sheet

### Step 1: Buat Google Sheet Baru
1. Buka https://sheets.google.com
2. Klik **"+ Create"** atau **"New spreadsheet"**
3. Beri nama: **"Undangan Pernikahan Andra & Rezky"**
4. Tunggu sheet terbuat

### Step 2: Copy Sheet ID
1. Lihat URL di address bar:
   ```
   https://docs.google.com/spreadsheets/d/[ID_INI]/edit
   ```
2. Copy bagian `[ID_INI]` (hanya ID, tanpa `/edit`)
3. Simpan ID ini, kita akan gunakan di langkah selanjutnya

**Contoh Sheet ID:**
```
1F9z8X9_z8X9z8X9z8X9z8X9z8X9z8X9z8X9z8
```

---

## 🔨 Setup Google Apps Script

### Step 1: Buka Apps Script
1. Di Google Sheet Anda, klik menu **Extensions**
2. Pilih **Apps Script**
3. Tab baru akan terbuka dengan editor Apps Script

### Step 2: Replace Kode
1. Di Apps Script, Anda akan melihat file `Code.gs` dengan kode default
2. **Hapus semua kode default** (Ctrl+A, kemudian Delete)
3. Paste kode dari file `Code.gs` yang ada di repository

### Step 3: Update SPREADSHEET_ID
1. Cari baris ini di `Code.gs`:
   ```javascript
   const SPREADSHEET_ID = "YOUR_SPREADSHEET_ID_HERE";
   ```
2. Ganti dengan Sheet ID yang sudah Anda copy:
   ```javascript
   const SPREADSHEET_ID = "1F9z8X9_z8X9z8X9z8X9z8X9z8X9z8X9z8X9z8";
   ```

### Step 4: Buat HTML File
1. Di Editor Apps Script, klik **+** di sebelah "Files"
2. Pilih **HTML**
3. Beri nama: **index**
4. Hapus kode default
5. Paste kode dari file `index.html`
6. Klik **Save** (Ctrl+S)

### Step 5: Upload appsscript.json (Opsional)
1. Di Editor Apps Script, klik **+** di sebelah "Files"
2. Pilih **JSON**
3. Beri nama: **appsscript**
4. Paste kode dari file `appsscript.json`
5. Klik **Save**

---

## 🚀 Deploy Web App

### Step 1: Jalankan Setup Function
1. Di dropdown function (atas kiri), pilih **setupSpreadsheet**
2. Klik tombol **▶️ Run**
3. Muncul popup "Authorization required"
4. Klik **Review permissions**
5. Pilih akun Google Anda
6. Klik **Allow**
7. Tunggu sampai selesai (lihat di Execution log)

### Step 2: Deploy sebagai Web App
1. Klik **Deploy** (tombol biru di atas)
2. Pilih **New deployment** (atau klik ⚙️ di samping deployment lama)
3. Di dialog, pilih **Type**: **Web app**
4. Isi configuration:
   - **Execute as**: Pilih akun Google Anda
   - **Who has access**: Pilih **Anyone** atau **Anyone with Google Account**
5. Klik **Deploy**
6. Dialog baru muncul dengan URL deployment
7. **COPY URL TERSEBUT**

**Format URL:**
```
https://script.google.com/macros/d/[DEPLOYMENT_ID]/userwithscript
```

### Step 3: Test URL
1. Paste URL tersebut ke browser
2. Lihat apakah halaman undangan terbuka
3. Jika blank/error, cek browser console (F12)

---

## ✅ Testing

### Test 1: Buka Halaman Utama
1. Buka deployment URL di browser
2. Harusnya melihat cover page dengan:
   - Judul "The Wedding of Andra & Rezky"
   - Nama tamu undangan
   - Tombol "Open Invitation"

### Test 2: Buka Invitation
1. Klik tombol **Open Invitation**
2. Halaman harus scroll ke atas
3. Background berubah ke tema padang pasir
4. Music seharusnya mulai diputar
5. Tombol music player muncul di kanan bawah

### Test 3: Test RSVP
1. Scroll ke bagian "Kirim Ucapan & Konfirmasi Kehadiran"
2. Isi form:
   - Nama: "Test Tamu"
   - Status: "Hadir"
   - Pesan: "Selamat!"
3. Klik "Kirim Ucapan"
4. Alert muncul "Ucapan berhasil disimpan!"
5. Comment harus muncul di bawah

### Test 4: Cek Google Sheet
1. Buka Google Sheet Anda
2. Cek sheet "Guests" dan "Comments"
3. Data yang Anda input di Step 3 harus tersimpan

### Test 5: Test dengan Parameter
1. Buka URL dengan parameter:
   ```
   https://script.google.com/macros/d/[DEPLOYMENT_ID]/userwithscript?to=Nama%20Saya
   ```
2. Nama tamu seharusnya berubah menjadi "Nama Saya"
3. Bagikan URL ini ke tamu undangan

---

## 📱 Share dengan Tamu

### Cara 1: Direct Link
Bagikan URL deployment langsung:
```
https://script.google.com/macros/d/[DEPLOYMENT_ID]/userwithscript
```

### Cara 2: Dengan Nama Tamu
Bagikan dengan parameter nama:
```
https://script.google.com/macros/d/[DEPLOYMENT_ID]/userwithscript?to=Nama%20Tamu
```

### Cara 3: Via WhatsApp
```
Assalamualaikum, ini link undangan kami. Silakan klik untuk melihat:

[Paste URL di sini]

Terima kasih! 🎉
```

### Cara 4: Via QR Code
Gunakan QR code generator online:
1. Buka https://www.qr-code-generator.com
2. Paste URL Anda
3. Download QR code
4. Print di undangan fisik

---

## 🐛 Troubleshooting

### Error: "Invalid Spreadsheet ID"
**Penyebab:** Sheet ID salah atau tidak ada akses
**Solusi:**
1. Cek kembali Sheet ID (jangan ada spasi)
2. Pastikan Google Sheet sudah dibuat
3. Jalankan `setupSpreadsheet()` lagi

### Error: "Blank Page"
**Penyebab:** HTML tidak ter-load
**Solusi:**
1. Buka console browser (F12)
2. Cek error message
3. Pastikan file `index.html` sudah di-paste dengan benar

### Error: "Quota Exceeded"
**Penyebab:** Terlalu banyak request
**Solusi:**
1. Tunggu beberapa saat
2. Refresh browser
3. Hubungi support Google

### RSVP Tidak Masuk Sheet
**Penyebab:** Function `submitComment()` error
**Solusi:**
1. Buka Apps Script Logs (View → Logs)
2. Lihat error message
3. Pastikan kode `Code.gs` sudah benar
4. Jalankan `setupSpreadsheet()` lagi

### Musik Tidak Diputar
**Penyebab:** URL musik tidak valid atau browser block autoplay
**Solusi:**
1. Klik tombol music player di kanan bawah
2. Atau update URL musik di Google Sheet (Sheet Config)

---

## 🔐 Keamanan

### Data Tamu Aman?
Ya! Data tersimpan di Google Sheet yang:
- Private/Secure
- Bisa di-backup otomatis
- Tidak akan diakses orang lain

### Bisa Orang Lain Hacking?
Tidak, karena:
- Apps Script dijalankan di server Google
- Tidak ada informasi sensitif di kode
- Hanya bisa POST data ke sheet, tidak bisa delete/modify

---

## 📊 Statistik Kehadiran

### Lihat di Google Sheet
1. Buka Sheet "Guests"
2. Hitung baris dengan "Hadir"
3. Hitung baris dengan "Tidak Hadir"

### Export Data
1. Buka Sheet "Guests" atau "Comments"
2. Klik **File** → **Download** → **CSV/Excel**
3. Data siap untuk editing atau print

---

## 🎨 Customization

### Update Data Pernikahan

#### Via Google Sheet (Recommended)
1. Buka Sheet "Config"
2. Edit Value sesuai kebutuhan
3. Data otomatis terupdate di halaman

#### Via Code (Permanent)
1. Edit di `Code.gs` function `getWeddingConfig()`
2. Deploy ulang

### Update Musik
1. Cari URL musik baru (mp3 format)
2. Di Sheet "Config", update row "URL Musik"
3. Atau edit di `index.html` line:
   ```html
   <source id="wedding-music-src" src="[URL_MUSIK_BARU]" type="audio/mpeg">
   ```

### Update Tanggal Acara
1. Di `index.html`, cari:
   ```javascript
   let targetDateStr = "May 06, 2026 10:00:00";
   ```
2. Ubah dengan tanggal Anda

---

## 📚 Referensi

- [Google Apps Script Documentation](https://developers.google.com/apps-script)
- [Google Sheets API](https://developers.google.com/sheets/api)
- [Tailwind CSS](https://tailwindcss.com)
- [AOS Library](https://michalsnik.github.io/aos/)

---

## 🆘 Butuh Bantuan?

Jika ada masalah:
1. Cek bagian **Troubleshooting** di atas
2. Buka console browser (F12) untuk error details
3. Cek Logs di Apps Script (View → Logs)
4. Hubungi developer atau buat issue di GitHub

---

**Selamat! Undangan digital Anda sudah siap! 🎉**
