# Panduan & Prompt Ilustrasi Slide Kuliah
## Mata Kuliah: Jaringan Komputer
### Pertemuan 12: Application Layer — HTTP, FTP, E-mail, dan DNS

---

## 📌 Filosofi Desain Visual & Batasan (*Strict Constraints*)

Sesuai arahan dan evaluasi pengampu mata kuliah:
1. **Prinsip Minimalisme Pedagogis (Diagram $\neq$ Infografis Rangkuman):**
   - **Bebas Teks Berulang:** Diagram visual **tidak boleh menduplikasi** butir-butir teks (*bullet points*) atau paragraf penjelasan yang sudah tertulis di slide presentasi.
   - **Peran Diagram sebagai *Visual Anchor*:** Diagram berfungsi memvisualisasikan mekanisme fisik/logis, alur sekuensial, topologi spasial, atau komparasi waktu secara instan, sehingga dosen tidak perlu membaca penjelasan dua kali.
   - **Skala & Keterbacaan Tinggi:** Elemen visual dibuat besar, tebal, dan lapang. Ukuran tipografi minimal 15px–18px untuk label sekunder dan 20px–28px untuk label entitas utama agar terbaca jelas dari jarak jauh di ruang kelas.
2. **Bebas Identitas & Logo Institusi:**
   - Dilarang keras memuat logo kampus (ITERA atau perguruan tinggi mana pun), nama dosen pengampu, simbol instansi, lambang watermark, atau identitas pribadi lainnya.
3. **Terminologi Teknis Standar Industri (Tanpa Terjemahan Canggung):**
   - Wajib menggunakan istilah baku bahasa Inggris untuk seluruh konsep dan terminologi jaringan komputer:
     - Gunakan **Server** (bukan *peladen*)
     - Gunakan **Client** (bukan *peminta layanan*)
     - Gunakan **Peer-to-Peer / P2P**
     - Gunakan **Browser / Web Browser** (bukan *peramban*)
     - Gunakan **TCP 3-Way Handshake** (bukan *jabat tangan tiga arah*)
     - Gunakan **Round-Trip Time (RTT)**
     - Gunakan **Request** dan **Response** (bukan *permintaan* dan *tanggapan*)
     - Gunakan **Cookie / Cookies**
     - Gunakan **Web Cache / Proxy Server / Cache HIT / Cache MISS / Conditional GET**
     - Gunakan **Bottleneck** (bukan *titik macet*)
     - Gunakan **Throughput, Latency / Delay, Bandwidth**
     - Gunakan **Head-of-Line (HOL) Blocking**
     - Gunakan **Binary Framing & Multiplexing**
     - Gunakan **Control Connection & Data Connection**
     - Gunakan **Out-of-Band Control**
     - Gunakan **Active Mode & Passive Mode (PASV)**
     - Gunakan **Firewall & NAT**
     - Gunakan **User Agent, Mail Server, Message Queue, Mailbox**
     - Gunakan **Push Protocol (SMTP) & Pull Protocol (POP3 / IMAP / Webmail)**
     - Gunakan **Root DNS Server, TLD Server, Authoritative Server, Local DNS Resolver**
     - Gunakan **Iterated Query & Recursive Query**
     - Gunakan **DNS Cache Poisoning / Spoofing & DNSSEC**
   - Kalimat pengantar dan keterangan fungsional tetap menggunakan Bahasa Indonesia yang baik, lugas, presisi, dan **100% bebas kesalahan eja / ketik (typo)**.
4. **Format Vektor Murni (SVG Scalable Vector Graphics):**
   - Seluruh ilustrasi diimplementasikan dalam format SVG modern beresolusi tajam tanpa rasterisasi buram, dengan sudut membulat (*rounded corners*), palet warna berstandar Tailwind/Catppuccin (Navy `#1e3a8a`, Blue `#2563eb`, Emerald `#16a34a`, Amber `#d97706`, Crimson `#dc2626`, Slate `#0f172a`), serta bayangan halus (*subtle drop-shadow*).

---

## 📊 Matriks Distribusi Ilustrasi Slide `pertemuan12.html`

Seluruh 22 diagram telah diintegrasikan secara penuh menggantikan grafik lama dan raster PNG berkualitas rendah:

| No. Slide | Judul Slide | Nama Berkas SVG | Dimensi | Fokus Mekanisme Visual |
| :---: | :--- | :--- | :---: | :--- |
| **04** | Paradigma Aplikasi: Client–Server | `paradigma_client_server.svg` | $960 \times 540$ | Heterogeneous Clients $\leftrightarrow$ Internet Cloud $\leftrightarrow$ Centralized Always-On Server Rack. |
| **05** | Paradigma Aplikasi: Peer-to-Peer (P2P) | `paradigma_peer_to_peer.svg` | $960 \times 540$ | Topologi mesh 5-peer terdesentralisasi, pertukaran chunk dua arah, badge "No Central Server". |
| **06** | Profil QoS Layanan Transpor | `qos_transpor_matrix.svg` | $800 \times 500$ | 4 pilar kebutuhan aplikasi: Data Integrity, Throughput, Delay Sensitivity, dan Security. |
| **07** | Pemetaan Protokol Transpor (TCP vs UDP) | `tcp_vs_udp_app_services.svg` | $800 \times 500$ | Komparasi kontras: Reliable Connection-Oriented (TCP) vs Lightweight Best-Effort (UDP). |
| **09** | Arsitektur Dokumen Web & Stateless | `web_arsitektur_objek.svg` | $800 \times 500$ | Base HTML file mengarahkan relasi URL ke beberapa referenced objects (CSS, PNG, JS, Video). |
| **10** | Koneksi HTTP: Non-Persistent vs Persistent | `http_non_persistent_vs_persistent.svg` | $960 \times 540$ | Sequence ladder: Perbandingan $4\times\text{RTT}$ (buka-tutup TCP per objek) vs $2\times\text{RTT}$ (TCP tetap buka). |
| **11** | Anatomi Pesan HTTP Request | `http_format_request.svg` | $800 \times 500$ | Struktur 4 blok RFC 7230: Request Line, Header Lines, Baris Kosong `\r\n`, dan Entity Body. |
| **12** | Anatomi Pesan HTTP Response | `http_format_response.svg` | $800 \times 500$ | Struktur 4 blok RFC 7230: Status Line (`200 OK`), Header Lines, Baris Kosong `\r\n`, dan Data Payload. |
| **13** | Manajemen Status HTTP via Cookies | `mekanisme_cookies_http.svg` | $960 \times 540$ | Alur 4 langkah: Request awal, `Set-Cookie: 1634`, penyimpanan lokal browser, dan auto-attach cookie. |
| **14** | Web Cache & Conditional GET | `web_cache_conditional_get.svg` | $960 \times 540$ | Dua track horizontal: Cache HIT instan ($<10\text{ ms}$) vs Validasi Conditional GET (`304 Not Modified`). |
| **15** | Analisis Kinerja Caching & Topologi | `topologi_kinerja_caching.svg` | $960 \times 540$ | LAN 1 Gbps vs Bottleneck Link 1.54 Mbps, evaluasi drop utilisasi dari 97% (macet) ke 58% (normal). |
| **16** | Evolusi Web: HTTP/1.1 vs HTTP/2 vs HTTP/3 | `evolusi_http1_http2_http3.svg` | $960 \times 540$ | Pipeline fisik: HOL Blocking (1.1), Binary Frame Multiplexing (2), Independent QUIC Streams (3). |
| **18** | FTP: Arsitektur Dual-Channel Out-of-Band | `ftp_arsitektur_dual_channel.svg` | $960 \times 540$ | Pemisahan Control Connection (Port 21, perintah) dan Data Connection (Port 20, transfer berkas). |
| **19** | Transmisi FTP: Active vs Passive (PASV) | `ftp_active_vs_passive_mode.svg` | $960 \times 540$ | Komparasi traversal firewall: Active Mode diblokir firewall vs Passive Mode lolos aman. |
| **20** | Ekosistem E-mail End-to-End | `ekosistem_email_end_to_end.svg` | $960 \times 540$ | Alur Alice $\to$ SMTP $\to$ Message Queue $\to$ Inter-server $\to$ Mailbox $\to$ IMAP/POP3 Pull $\to$ Bob. |
| **21** | Alur Dialog Pesan SMTP | `smtp_command_interaction.svg` | $800 \times 500$ | Sekuens interaktif 3 fase: Handshake (`HELO`), Mail Transfer (`MAIL FROM`, `RCPT TO`, `DATA`), Quit. |
| **24** | DNS: Layanan Translasi Hostname ke IP | `dns_hostname_translation.svg` | $800 \times 500$ | Mesin konversi nama domain ramah manusia (`www.itera.ac.id`) menjadi IP biner routing (`103.111.201.21`). |
| **25** | Hirarki Global Server DNS | `hirarki_server_dns_global.svg` | $960 \times 540$ | Struktur pohon terbalik 4 level: Root (`.`), TLD (`.com`, `.id`, `.edu`), Authoritative, dan Local Resolver. |
| **26** | Metode Resolusi DNS: Iterated Query | `resolusi_dns_iterated.svg` | $800 \times 500$ | Sekuens 1–8: Local Resolver aktif bertanya ke Root, TLD, dan Authoritative. Server puncak ringan. |
| **27** | Metode Resolusi DNS: Recursive Query | `resolusi_dns_recursive.svg` | $800 \times 500$ | Sekuens delegasi berantai ke atas: Penumpukan beban memori dan koneksi di Server Akar (Ditolak). |
| **28** | Format Resource Record (RR) DNS | `dns_resource_records.svg` | $800 \times 500$ | Visualisasi komparasi 4 tuple basis data: Type A (IPv4), NS (Name Server), CNAME (Alias), MX (Mail). |
| **29** | Keamanan DNS: Cache Poisoning vs DNSSEC | `dns_cache_poisoning_vs_dnssec.svg` | $960 \times 540$ | Serangan injeksi IP palsu ke resolver vs Proteksi verifikasi digital signature kriptografi DNSSEC. |

---

## 🎨 Spesifikasi Prompt & Konsep Visual Detail

### 1. Slide 04: Paradigma Client–Server (`paradigma_client_server.svg`)
* **Tujuan Pedagogis:** Menampilkan arsitektur komputasi terpusat di mana server data center selalu aktif melayani berbagai macam klien yang tidak berkomunikasi langsung satu sama lain.
* **Elemen Visual:**
  - Kiri: Kartu biru berisi klien heterogen (Desktop, Laptop, Smartphone) dengan label `Dynamic IP`. Indikator merah `✕ No Client-to-Client`.
  - Tengah: Awan internet dengan panah biru tebal ke kanan bertuliskan `Request ➔` dan panah hijau tebal ke kiri bertuliskan `⬅ Response`.
  - Kanan: Kartu hijau berisi menara Server Rack berlampu LED dengan label `Permanent Static IP` dan `Always-On Host`.
* **Prompt Bahasa Indonesia:**
  > Diagram arsitektur Client-Server modern flat vector. Latar putih bersih. Sisi kiri menampilkan kartu perangkat klien (Desktop, Laptop, Smartphone) berlabel Dynamic IP dengan badge "No Client-to-Client". Sisi tengah awan internet dengan panah tebal Request biru ke kanan dan panah tebal Response hijau ke kiri. Sisi kanan menara server rack data center berlabel Permanent Static IP dan Always-On Host. Elemen berukuran besar, tajam, profesional, tanpa teks paragraf berulang, tanpa logo kampus.

---

### 2. Slide 05: Paradigma Peer-to-Peer (`paradigma_peer_to_peer.svg`)
* **Tujuan Pedagogis:** Menunjukkan desentralisasi mesh di mana semua peer berkedudukan setara dan bertukar chunk file langsung tanpa perantara server pusat.
* **Elemen Visual:**
  - 5 node peer (`Peer A` s.d. `Peer E`) tersusun dalam formasi simetris melingkar, masing-masing dengan ikon laptop.
  - Garis koneksi mesh putus-putus antar seluruh peer dengan panah transfer data aktif dua arah (biru dan hijau).
  - Di tengah lingkaran terdapat badge merah bertuliskan `❌ No Central Server`.
  - Footer pill: `⚡ Self-Scalability: Peers upload and download chunks directly`.

---

### 3. Slide 10: Analisis Waktu RTT HTTP (`http_non_persistent_vs_persistent.svg`)
* **Tujuan Pedagogis:** Memberikan perbandingan waktu tempuh bolak-balik (Round-Trip Time) antara HTTP/1.0 ($4\times\text{RTT}$ untuk 2 objek) dengan HTTP/1.1 ($2\times\text{RTT}$ untuk 2 objek) secara visual dan intuitif.
* **Elemen Visual:**
  - Panel Kiri (Non-Persistent): Garis waktu vertikal Client dan Server. Objek 1: TCP SYN $\to$ SYN-ACK (1 RTT), GET $\to$ 200 OK (1 RTT), Penutupan TCP. Objek 2: Mengulang kembali Handshake (1 RTT) dan Request (1 RTT). Total: **4 RTT**.
  - Panel Kanan (Persistent): Handshake hanya 1 kali di awal (1 RTT). Koneksi TCP tetap terbuka (`TCP Remains OPEN`). Objek 1 (1 RTT), Objek 2 (1 RTT). Total: **Cuma 1 RTT per objek tambahan**.

---

### 4. Slide 13: Mekanisme Cookies HTTP (`mekanisme_cookies_http.svg`)
* **Tujuan Pedagogis:** Memvisualisasikan bagaimana status pengguna (*state*) dipertahankan di atas protokol HTTP yang bersifat *stateless* melalui 4 langkah transaksional.
* **Elemen Visual:**
  - Kolom 1 (Browser Klien) dengan kotak `Cookie Storage: ID=1634`.
  - Kolom 2 (Web Server) dan Kolom 3 (Database Toko).
  - Langkah 1: Panah Request awal tanpa cookie.
  - Langkah 2: Panah Respon server dengan header `Set-Cookie: ID=1634`.
  - Pembatas waktu: `⏳ 1 Minggu Kemudian...`
  - Langkah 3: Panah Request berikutnya otomatis menyertakan header `Cookie: ID=1634`.
  - Langkah 4: Server mencocokkan ke database dan mengembalikan respon khusus profil pengguna.

---

### 5. Slide 14: Web Cache & Validasi Conditional GET (`web_cache_conditional_get.svg`)
* **Tujuan Pedagogis:** Menjelaskan penghematan waktu dan bandwidth melalui pembedaan alur Cache HIT lokal dengan validasi pembaruan berkas via `Conditional GET`.
* **Elemen Visual:**
  - Jalur Atas (Cache HIT): Client meminta `/logo.png`, dilayani langsung oleh Web Proxy Cache secara instan ($<10\text{ ms}$). Origin Server di internet berstatus redup/idle.
  - Jalur Bawah (Conditional GET): Proxy Cache mengirim `GET /logo.png + If-Modified-Since` ke Origin Server. Server merespon status `HTTP 304 Not Modified` tanpa mengirim ulang payload isi file.

---

### 6. Slide 15: Topologi Analisis Kinerja Caching (`topologi_kinerja_caching.svg`)
* **Tujuan Pedagogis:** Memperlihatkan mengapa link akses 1.54 Mbps menjadi *bottleneck* kemacetan delay dan bagaimana Local Cache 1 Gbps memangkas utilisasi ke batas aman.
* **Elemen Visual:**
  - Kiri: Institutional LAN (1 Gbps) memuat workstation dan Local Web Proxy Cache.
  - Tengah: Pipa sempit merah bertuliskan `Access Link: 1.54 Mbps` dengan tanda bahaya `⚠️ BOTTLENECK`.
  - Kanan: Public Internet dengan origin server.
  - Dua batang metrik komparasi: Tanpa Cache (Merah 97% macet) vs Dengan Cache (Hijau 58% lancar).

---

### 7. Slide 16: Evolusi Protokol Web HTTP/1.1 vs 2 vs 3 (`evolusi_http1_http2_http3.svg`)
* **Tujuan Pedagogis:** Menjelaskan perbedaan fundamental penanganan transmisi data: *Head-of-Line Blocking*, *Multiplexing Binary Frames*, dan *Independent QUIC Streams*.
* **Elemen Visual:**
  - Pipeline 1 (HTTP/1.1 TCP): Antrean sekuensial; paket pertama macet bertanda ❌ menahan paket di belakangnya (HOL Blocking).
  - Pipeline 2 (HTTP/2 TCP): Pipa memuat frame biner warna-warni yang disisipkan bergantian (`Frame 1A`, `Frame 2A`, `Frame 1B`, `Frame 2B`).
  - Pipeline 3 (HTTP/3 QUIC/UDP): Tiga saluran independen terpisah. Jika Stream 1 mengalami drop paket, Stream 2 dan Stream 3 tetap mengalir lancar tanpa terganggu.

---

### 8. Slide 18: Arsitektur Dual-Channel FTP (`ftp_arsitektur_dual_channel.svg`)
* **Tujuan Pedagogis:** Menjelaskan konsep *Out-of-Band Control* pada FTP di mana saluran perintah dan saluran transfer data dipisahkan secara fisik.
* **Elemen Visual:**
  - Client di kiri dan Server di kanan.
  - Pipa Biru Atas: `Control Connection (Port 21)` untuk perintah teks (`USER`, `PASS`, `RETR`, `STOR`).
  - Pipa Hijau Bawah: `Data Connection (Port 20)` untuk transfer aliran byte berkas mentah.
  - Badge tengah: `⚡ OUT-OF-BAND CONTROL`.

---

### 9. Slide 19: Mode FTP Active vs Passive (`ftp_active_vs_passive_mode.svg`)
* **Tujuan Pedagogis:** Memperlihatkan alasan kegagalan koneksi FTP Active Mode di balik Firewall klien dan bagaimana Passive Mode menyelesaikan masalah tersebut.
* **Elemen Visual:**
  - Panel Kiri (Active Mode): Klien mengirim `PORT`. Server mencoba membuka koneksi balik ke klien, namun menabrak dinding bata `FIREWALL` klien dan **DIBLOKIR (❌)**.
  - Panel Kanan (Passive Mode): Klien mengirim `PASV`. Server membuka Port acak. Klien yang menginisiasi koneksi keluar menembus firewall secara legal dan **DIIZINKAN (✓)**.

---

### 10. Slide 20: Ekosistem E-mail End-to-End (`ekosistem_email_end_to_end.svg`)
* **Tujuan Pedagogis:** Menjelaskan pemisahan peran antara protokol pengiriman berbasis *Push* (SMTP) dengan protokol pengambilan berkas berbasis *Pull* (POP3/IMAP).
* **Elemen Visual:**
  - Alur linier 4 tahap: `Alice (User Agent)` $\xrightarrow{\text{SMTP}}$ `Sender Server (Message Queue)` $\xrightarrow{\text{SMTP Port 25}}$ `Receiver Server (User Mailbox)` $\xrightarrow{\text{IMAP/POP3}}$ `Bob (User Agent)`.
  - Penegasan di bawah: SMTP adalah protokol dorong (*Push*), sedangkan POP3/IMAP/Webmail adalah protokol tarik (*Pull*).

---

### 11. Slide 25: Hirarki Global Server DNS (`hirarki_server_dns_global.svg`)
* **Tujuan Pedagogis:** Memvisualisasikan sistem basis data terdistribusi internet dalam bentuk struktur pohon terbalik (*inverted tree*).
* **Elemen Visual:**
  - Tingkat 1 (Puncak): `Root DNS Servers (.)` memuat 13 kluster anycast dunia.
  - Tingkat 2: `Top-Level Domain (TLD) Servers` memuat `.com`, `.id`, `.edu`, `.org`.
  - Tingkat 3: `Authoritative DNS Servers` institusional (`google.com`, `itera.ac.id`, `mit.edu`).
  - Tingkat Bawah: `Local DNS Resolver` yang menjembatani komputer klien ke hierarki global.

---

### 12. Slide 26: Resolusi DNS Iterated (`resolusi_dns_iterated.svg`)
* **Tujuan Pedagogis:** Menjelaskan cara kerja standar internet di mana Local DNS Resolver aktif bertanya berjenjang dan server akar hanya memberikan rujukan.
* **Elemen Visual:**
  - Local DNS Resolver berada di posisi sentral pencarian.
  - Panah bernomor urut 1 sampai 8: Host bertanya ke Local DNS (1,8); Local DNS ke Root (2,3); Local DNS ke TLD (4,5); Local DNS ke Authoritative (6,7).
  - Pesan kunci: Beban kerja berada di Local Resolver, Server Akar tetap terlindungi dan ringan.

---

### 13. Slide 27: Resolusi DNS Recursive (`resolusi_dns_recursive.svg`)
* **Tujuan Pedagogis:** Menjelaskan mengapa resolusi rekursif penuh dilarang di internet publik karena membebani antrean memori server akar.
* **Elemen Visual:**
  - Alur kueri didelegasikan berantai ke atas: Host $\to$ Local $\to$ Root $\to$ TLD $\to$ Authoritative.
  - Server Akar ditandai dengan ikon api/beban berat ⚠️ `Beban Rantai!`.
  - Pesan kunci: Server Akar terbebani menyimpan status ribuan koneksi konkuren; ditolak pada internet publik.

---

### 14. Slide 29: Keamanan DNS (`dns_cache_poisoning_vs_dnssec.svg`)
* **Tujuan Pedagogis:** Memvisualisasikan kerentanan manipulasi cache (*DNS Spoofing*) dan mekanisme pertahanan otentikasi kriptografi *DNSSEC*.
* **Elemen Visual:**
  - Sisi Kiri (Attack): Penyerang menyuntikkan balasan palsu berisi IP penipuan ke Local Resolver sebelum jawaban asli tiba. Klien dibelokkan ke web phishing.
  - Sisi Kanan (DNSSEC): Authoritative Server melampirkan tanda tangan digital (`RRSIG`). Resolver memvalidasi tanda tangan tersebut. Paket palsu tanpa kunci sah langsung ditolak dan dibuang (ikon perisai 🛡️).

---

## 💻 Panduan Pemeliharaan & Integrasi

Semua diagram SVG dihasilkan secara otomatis melalui skrip generator pada repositori:
```bash
python3 scratch/generate_ultra_clean_svgs.py
```
Output tersimpan pada direktori presentasi:
```
/Users/tanto/Library/CloudStorage/OneDrive-Personal/ITERA/Jaringan Komputer/2026/Presentasi/images/week12/
```
Format penyisipan pada file `pertemuan12.html` menggunakan grid dua kolom standar:
```html
<div class="layout-text-img">
    <div class="card text-left text-smaller">
        <!-- Poin materi kuliah yang dijelaskan dosen -->
    </div>
    <div class="card" style="display:flex; flex-direction:column; align-items:center; justify-content:center;">
        <img src="images/week12/nama_diagram.svg" class="slide-img" alt="Deskripsi Visual Singkat">
        <p class="img-caption">Gambar 12.X: Judul Konseptual Ilustrasi</p>
    </div>
</div>
```

---
*Dokumen ini merupakan panduan resmi standar desain grafis materi perkuliahan Jaringan Komputer — IF25-21008.*
