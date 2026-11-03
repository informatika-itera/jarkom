# -*- coding: utf-8 -*-
"""
Script to rebuild pertemuan10.html with standard template consistent with pertemuan01-09.
"""

html_content = '''<!doctype html>
<html lang="id">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <title>Jaringan Komputer - Pertemuan 10: Inter-VLAN Routing &amp; VLANs</title>

    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/reveal.js@5.0.4/dist/reset.css">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/reveal.js@5.0.4/dist/reveal.css">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/reveal.js@5.0.4/dist/theme/simple.css" id="theme">
    <link rel="stylesheet" href="css/pkom-theme.css">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.css">

    <style>
        @media screen {
            .reveal .slides section {
                max-height: 100%;
                overflow-y: auto;
                padding-bottom: 20px;
            }

            .reveal img {
                max-height: 45vh;
                object-fit: contain;
            }
        }

        @media print {
            .reveal .slides section {
                max-height: none !important;
                height: auto !important;
                overflow: visible !important;
            }

            .reveal img,
            .card {
                page-break-inside: avoid;
            }
        }

        .reveal .card {
            margin-bottom: 10px;
        }

        /* images */
        .slide-img {
            width: 100%;
            height: auto;
            max-height: 44vh;
            object-fit: contain;
            border-radius: 8px;
            box-shadow: 0 4px 16px rgba(0, 0, 0, .14);
            display: block;
            margin: 0 auto;
        }

        .slide-img-sm {
            width: 100%;
            height: auto;
            max-height: 32vh;
            object-fit: contain;
            border-radius: 8px;
            box-shadow: 0 4px 16px rgba(0, 0, 0, .14);
            display: block;
            margin: 0 auto;
        }

        .layout-2col {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 16px;
            align-items: start;
            width: 100%;
        }

        .layout-text-img {
            display: grid;
            grid-template-columns: 52% 1fr;
            gap: 16px;
            align-items: center;
            width: 100%;
        }

        .layout-3col {
            display: grid;
            grid-template-columns: 1fr 1fr 1fr;
            gap: 12px;
            width: 100%;
        }

        .img-caption {
            font-size: .55em;
            color: #777;
            text-align: center;
            margin-top: .2em;
            font-style: italic;
        }

        /* Section bars & headers */
        .sec-bar {
            border-radius: 8px 8px 0 0;
            padding: 8px 16px;
            font-size: .75em;
            font-weight: 700;
            letter-spacing: .04em;
        }

        .sec-body {
            background: #fff;
            border: 1px solid #dee2e6;
            border-radius: 0 0 8px 8px;
            padding: 12px 16px;
            font-size: .68em;
            box-shadow: 0 2px 8px rgba(0, 0, 0, .05);
        }

        .card .sec-bar {
            font-size: .88em;
        }

        .card .sec-body {
            font-size: .82em;
        }

        .sec-bar-blue {
            background: #1565c0;
            color: #fff;
        }

        .sec-bar-orange {
            background: #e65100;
            color: #fff;
        }

        .sec-bar-green {
            background: #1b5e20;
            color: #fff;
        }

        .sec-bar-purple {
            background: #4a148c;
            color: #fff;
        }

        .sec-bar-red {
            background: #b71c1c;
            color: #fff;
        }

        /* Info boxes */
        .info-box {
            border-left: 4px solid #1565c0;
            background: #e8f0fe;
            border-radius: 0 8px 8px 0;
            padding: 10px 14px;
            font-size: .68em;
            margin-top: .5em;
            line-height: 1.5;
        }

        .info-box-warn {
            border-left: 4px solid #e65100;
            background: #fff3e0;
            border-radius: 0 8px 8px 0;
            padding: 10px 14px;
            font-size: .68em;
            margin-top: .5em;
            line-height: 1.5;
        }

        .info-box-green {
            border-left: 4px solid #1b5e20;
            background: #e8f5e9;
            border-radius: 0 8px 8px 0;
            padding: 10px 14px;
            font-size: .68em;
            margin-top: .5em;
            line-height: 1.5;
        }

        .info-box-red {
            border-left: 4px solid #b71c1c;
            background: #ffebee;
            border-radius: 0 8px 8px 0;
            padding: 10px 14px;
            font-size: .68em;
            margin-top: .5em;
            line-height: 1.5;
        }

        .card .info-box,
        .card .info-box-warn,
        .card .info-box-green,
        .card .info-box-red {
            font-size: .88em;
        }

        .reveal h3 {
            font-size: 1.35em;
            margin-bottom: 12px;
        }

        .reveal table {
            font-size: .55em;
            width: 100%;
            border-collapse: collapse;
        }

        .reveal table th,
        .reveal table td {
            border: 1px solid #dee2e6;
            padding: 6px 10px;
            text-align: left;
        }

        .reveal table th {
            background: #1565c0;
            color: #fff;
            font-weight: 700;
        }

        .reveal table tr:nth-child(even) td {
            background: #f8f9fa;
        }

        .code-block {
            background: #282c34;
            color: #abb2bf;
            font-family: monospace;
            padding: 10px 14px;
            border-radius: 6px;
            font-size: .62em;
            text-align: left;
            overflow-x: auto;
            line-height: 1.45;
        }

        .tugas-box {
            background: linear-gradient(135deg, #1b5e20 0%, #2e7d32 100%);
            border-radius: 14px;
            padding: 22px 28px;
            color: #fff;
            text-align: left;
        }

        .tugas-box h3 {
            color: #fff !important;
            margin-top: 0;
            font-size: 1.2em;
        }

        .tugas-soal {
            background: rgba(255, 255, 255, .15);
            border-radius: 10px;
            padding: 14px 18px;
            margin: 10px 0;
        }

        .tugas-soal p {
            font-size: .6em;
            line-height: 1.6;
            margin: 0;
            color: #e8f5e9;
        }

        .tugas-soal .num {
            font-size: 1.1em;
            font-weight: 700;
            color: #ffeb3b;
        }

        .tugas-info {
            display: flex;
            gap: 10px;
            margin-top: 14px;
            flex-wrap: wrap;
        }

        .tugas-chip {
            background: rgba(255, 255, 255, .2);
            border-radius: 20px;
            padding: 6px 14px;
            font-size: .6em;
            color: #fff;
            display: flex;
            align-items: center;
            gap: 6px;
        }

        /* Dark mode overrides for custom components */
        [data-theme="dark"] .sec-body {
            background: #2a2a2a !important;
            color: #eee !important;
            border-color: #444 !important;
        }

        [data-theme="dark"] .code-block {
            background: #1e1e1e !important;
            color: #d4d4d4 !important;
            border: 1px solid #444;
        }

        [data-theme="dark"] .reveal table th {
            background: #1a365d !important;
        }

        [data-theme="dark"] .reveal table td {
            border-color: #444 !important;
        }

        [data-theme="dark"] .reveal table tr:nth-child(even) td {
            background: #222 !important;
        }
    </style>
</head>

<body>
    <div class="reveal">
        <div class="footer-branding">
            <div class="footer-logos"></div>
            <div class="footer-copyright">&copy; 2026 IF25-21008 Jaringan Komputer - ITERA</div>
        </div>

        <div class="slides">

            <!-- ━━━━━━━━━━━━━━ SLIDE 1: COVER ━━━━━━━━━━━━━━ -->
            <section>
                <div class="title-box">
                    <h1>Inter-VLAN Routing &amp; VLANs</h1>
                    <h3 class="subtitle">Pertemuan 10</h3>
                </div>
                <p>Konsep Virtual LAN, 802.1Q Trunking, DTP, Router-on-a-Stick &amp; Switch Layer 3</p>
                <p class="text-small">Referensi Utama: Kurose &amp; Ross — <em>Computer Networking (8th Ed)</em> &amp; Cisco Networking Academy</p>
                <p class="text-small"><em>Dosen Pengampu:</em></p>
                <div style="display:flex; justify-content:center; gap:15px; margin-top:10px; font-size:.5em; color:#777; flex-wrap:wrap;">
                    <div><i class="bi bi-person-fill"></i> Rajif Agung Yunmar, S.Kom., M.Cs.</div>
                    <div><i class="bi bi-person-fill"></i> I Wayan Wiprayoga Wisesa, S.Kom., M.Kom.</div>
                    <div><i class="bi bi-person-fill"></i> Hartanto Tantriawan, S.Kom., M.Kom.</div>
                    <div><i class="bi bi-person-fill"></i> Ilham Firman Ashari, S.Kom., M.T.</div>
                </div>
                <aside class="notes">Selamat datang di Pertemuan 10. Hari ini kita akan membahas tuntas teknologi Virtual LAN (VLAN), mekanisme 802.1Q Trunking, protokol DTP, serta teknik Inter-VLAN Routing menggunakan Router-on-a-Stick dan Switch Layer 3.</aside>
            </section>

            <!-- ━━━━━━━━━━━━━━ SLIDE 2: OUTLINE ━━━━━━━━━━━━━━ -->
            <section>
                <h3>Outline Materi</h3>
                <div class="layout-2col">
                    <div class="card text-left text-smaller">
                        <p style="font-weight:700; color:#1565c0; font-size:.85em; margin:0;">1. Konsep Dasar &amp; Arsitektur VLAN</p>
                        <ul style="margin-bottom:8px;">
                            <li>Motivasi, Masalah Broadcast Domain &amp; Isolasi Trafik</li>
                            <li>Port-Based VLANs, Keuntungan &amp; Tipe-Tipe VLAN</li>
                        </ul>

                        <p style="font-weight:700; color:#e65100; font-size:.85em; margin:0;">2. VLAN Trunking &amp; Protokol Tagging</p>
                        <ul style="margin-bottom:8px;">
                            <li>Konsep Link TRUNK, Tagging ISL vs IEEE 802.1Q (Dot1Q)</li>
                            <li>Dynamic Trunking Protocol (DTP) &amp; Tabel Negosiasi</li>
                        </ul>
                    </div>
                    <div class="card text-left text-smaller">
                        <p style="font-weight:700; color:#1b5e20; font-size:.85em; margin:0;">3. Konfigurasi Cisco IOS &amp; Troubleshooting</p>
                        <ul style="margin-bottom:8px;">
                            <li>Sintaks Pembuatan VLAN, Assignment &amp; Allowed Trunk</li>
                            <li>Solusi Mismatch Native VLAN, Mode &amp; Allowed List</li>
                        </ul>

                        <p style="font-weight:700; color:#6a1b9a; font-size:.85em; margin:0;">4. Metode Inter-VLAN Routing</p>
                        <ul>
                            <li>Traditional vs Router-on-a-Stick (ROAS) vs SVI (Switch L3)</li>
                            <li>Praktikum Mandiri Cisco Packet Tracer</li>
                        </ul>
                    </div>
                </div>
                <aside class="notes">Berikut adalah peta alur pembelajaran kita hari ini: mulai dari pemahaman mengapa VLAN dibutuhkan, bagaimana frame diberi tag saat melintasi trunk, hingga cara menghubungkan subnet antar VLAN dengan routing.</aside>
            </section>

            <!-- ━━━━━━━━━━━━━━ SLIDE 3: ROADMAP ━━━━━━━━━━━━━━ -->
            <section>
                <h3>Link Layer &amp; LANs: Roadmap</h3>
                <div class="layout-text-img">
                    <div class="card text-left text-smaller">
                        <p>Pembahasan Link Layer mencakup beberapa sub-topik utama dalam hierarki jaringan lokal:</p>
                        <ul>
                            <li>A day in the life of a web request</li>
                            <li>LANs (Local Area Networks)</li>
                            <li>Addressing &amp; ARP (Address Resolution Protocol)</li>
                            <li>Ethernet Protocol &amp; Frame Standard</li>
                            <li>Switches (Self-learning &amp; Filtering)</li>
                            <li><strong class="highlight-blue">VLANs (Virtual LANs) — Fokus Kita Hari Ini</strong></li>
                        </ul>
                        <div class="info-box">
                            VLAN menjadi fondasi esensial dalam segmentasi jaringan modern skala enterprise maupun data center.
                        </div>
                    </div>
                    <div>
                        <img src="images/week10/image1.png" class="slide-img" alt="Link Layer Roadmap">
                        <div class="img-caption">Posisi materi VLAN dalam taksonomi Link Layer &amp; LANs (Kurose &amp; Ross)</div>
                    </div>
                </div>
                <aside class="notes">Ingatkan mahasiswa tentang posisi VLAN di Link Layer. Sebelumnya kita sudah membahas Ethernet dan Switch biasa, sekarang kita tingkatkan kapabilitas switch dengan VLAN.</aside>
            </section>

            <!-- ━━━━━━━━━━━━━━ BAGIAN 1: KONSEP DASAR VLAN ━━━━━━━━━━━━━━ -->
            <section>
                <h2>1. Konsep Dasar &amp; Arsitektur VLAN</h2>
                <p class="text-small" style="color: #666; margin-top: 10px;">Broadcast Domain, Isolasi Trafik, dan Klasifikasi Tipe VLAN</p>
            </section>

            <!-- Slide 5 -->
            <section>
                <h3>Virtual LANs (VLANs): Motivasi</h3>
                <div class="layout-text-img">
                    <div class="card text-left text-smaller">
                        <p>Apa yang terjadi ketika ukuran LAN semakin membesar (scaling) dan pengguna sering berpindah titik koneksi?</p>
                        <p><strong>Masalah pada Single Broadcast Domain:</strong></p>
                        <ul>
                            <li>Semua trafik layer-2 broadcast (ARP request, DHCP discovery, unknown unicast flooding) harus melintasi <strong>seluruh LAN</strong>.</li>
                            <li>Efisiensi jaringan menurun drastis karena CPU host terbebani memproses paket broadcast.</li>
                            <li>Timbul masalah keamanan (<strong>Security</strong>) dan privasi, karena trafik dapat di-sniff di seluruh port switch.</li>
                        </ul>
                    </div>
                    <div>
                        <img src="images/week10/image2.png" class="slide-img" alt="Motivasi VLAN">
                        <div class="img-caption">Ilustrasi masalah skalaritas dan luapan broadcast pada LAN tunggal</div>
                    </div>
                </div>
                <aside class="notes">Jelaskan bahwa broadcast domain yang terlalu besar adalah musuh utama performa jaringan lokal.</aside>
            </section>

            <!-- Slide 6 -->
            <section>
                <h3>Motivasi Administratif</h3>
                <div class="layout-text-img">
                    <div class="card text-left text-smaller">
                        <p>Seringkali terdapat kendala di mana pengguna dari divisi/departemen berbeda berada di ruangan atau switch fisik yang sama.</p>
                        <p><strong>Contoh Kasus Nyata:</strong></p>
                        <ul>
                            <li>Seorang staf dari departemen <strong>Computer Science (CS)</strong> pindah meja kerja ke gedung <strong>Electrical Engineering (EE)</strong>.</li>
                            <li>Secara fisik kabel terhubung ke switch di gedung EE, tetapi secara logikal ia harus tetap berada di subnet CS bersama server dan rekan kerjanya.</li>
                        </ul>
                        <div class="info-box-green">
                            VLAN memungkinkan pembentukan kelompok logikal yang independen dari lokasi fisik port switch.
                        </div>
                    </div>
                    <div>
                        <img src="images/week10/image3.png" class="slide-img" alt="Motivasi Administratif">
                        <div class="img-caption">Pemisahan logikal departemen CS dan EE lintas gedung</div>
                    </div>
                </div>
                <aside class="notes">Gambarkan analogi kepindahan kantor tanpa perlu menarik ulang kabel fisik melintasi gedung.</aside>
            </section>

            <!-- Slide 7 -->
            <section>
                <h3>Port-Based VLANs</h3>
                <div class="layout-text-img">
                    <div class="card text-left text-smaller">
                        <p>Switch yang mendukung kapabilitas VLAN dapat dikonfigurasi untuk mendefinisikan beberapa <strong>Virtual LANs</strong> di atas satu infrastruktur fisik tunggal.</p>
                        <p><strong>Mekanisme Port-based VLAN:</strong></p>
                        <ul>
                            <li>Port pada switch dikelompokkan oleh software switch, sehingga switch fisik tunggal beroperasi seolah-olah menjadi <strong>beberapa switch virtual terpisah</strong>.</li>
                            <li><strong>Contoh:</strong> Port 1–8 dialokasikan untuk <em>EE VLAN</em>.</li>
                            <li><strong>Contoh:</strong> Port 9–15 dialokasikan untuk <em>CS VLAN</em>.</li>
                        </ul>
                    </div>
                    <div>
                        <img src="images/week10/image4.png" class="slide-img" alt="Port-based VLANs">
                        <div class="img-caption">Pengelompokan port switch fisik ke dalam VLAN terpisah</div>
                    </div>
                </div>
                <aside class="notes">Port-based VLAN adalah metode paling umum dan paling mudah dikonfigurasi pada switch Cisco maupun vendor lain.</aside>
            </section>

            <!-- Slide 8 -->
            <section>
                <h3>Traffic Isolation &amp; Dynamic Membership</h3>
                <div class="layout-text-img">
                    <div class="card text-left text-smaller">
                        <ul>
                            <li><strong>Traffic Isolation:</strong> Frame dari/ke port 1–8 <strong>hanya</strong> bisa mencapai port 1–8. Tidak akan pernah bocor ke port 9–15 secara layer 2.</li>
                            <li><strong>Dynamic Membership:</strong> Selain nomor port, anggota VLAN dapat ditentukan dinamis berdasarkan MAC address perangkat (menggunakan VMPS / 802.1X).</li>
                            <li><strong>Forwarding between VLANs:</strong> Untuk menghubungkan antar-VLAN, mutlak dibutuhkan proses <strong>Routing (Layer 3)</strong>.</li>
                            <li>Switch modern menggabungkan fungsi switch L2 dan router L3 dalam satu perangkat: <strong>Multilayer / Layer 3 Switch</strong>.</li>
                        </ul>
                    </div>
                    <div>
                        <img src="images/week10/image5.png" class="slide-img" alt="Traffic Isolation">
                        <div class="img-caption">Isolasi trafik broadcast dan perlunya routing antar VLAN</div>
                    </div>
                </div>
                <aside class="notes">Tekankan bahwa VLAN memisahkan jaringan di Layer 2. Tanpa perangkat Layer 3, PC beda VLAN tidak akan pernah bisa saling ping.</aside>
            </section>

            <!-- Slide 9 -->
            <section>
                <h3>VLANs Spanning Multiple Switches</h3>
                <div class="layout-text-img">
                    <div class="card text-left text-smaller">
                        <p>Bagaimana jika anggota suatu VLAN tersebar di beberapa switch fisik yang berbeda?</p>
                        <ul>
                            <li><strong>Trunk Port:</strong> Port khusus yang membawa frame antar-VLAN sekaligus melalui satu link fisik tunggal.</li>
                            <li>Frame yang melintasi link trunk disisipkan penanda identitas VLAN (<strong>802.1Q tag</strong>) agar switch penerima mengetahui ke VLAN mana frame harus diteruskan.</li>
                            <li>Port Access di ujung switch tetap menerima frame Ethernet standar (tag dilepas sebelum frame sampai ke PC).</li>
                        </ul>
                    </div>
                    <div>
                        <img src="images/week10/image6.jpg" class="slide-img" alt="VLAN Spanning Switches">
                        <div class="img-caption">VLAN melintasi multiple switch menggunakan koneksi Trunk</div>
                    </div>
                </div>
                <aside class="notes">Jelaskan peran link trunk: daripada menarik 1 kabel untuk tiap VLAN, cukup 1 kabel trunk untuk membawa semua VLAN.</aside>
            </section>

            <!-- Slide 10 -->
            <section>
                <h3>802.1Q VLAN Frame Format</h3>
                <div class="layout-text-img">
                    <div class="card text-left text-smaller">
                        <p>Standar <strong>IEEE 802.1Q</strong> menyisipkan field Tag sebesar <strong>4-Byte</strong> ke dalam header frame Ethernet standar:</p>
                        <ul>
                            <li><strong>TPID (2 byte):</strong> Tag Protocol Identifier bernilai hex <code>0x8100</code> menandakan frame 802.1Q.</li>
                            <li><strong>TCI (2 byte):</strong> Tag Control Information terdiri dari:
                                <ul>
                                    <li><strong>Priority (3 bit):</strong> Nilai prioritas QoS (802.1p CoS).</li>
                                    <li><strong>CFI / DEI (1 bit):</strong> Canonical Format Indicator.</li>
                                    <li><strong>VLAN ID (12 bit):</strong> Mendukung hingga <strong>4094</strong> nomor VLAN.</li>
                                </ul>
                            </li>
                            <li><strong>Recomputed CRC (FCS):</strong> Checksum 4-byte di akhir frame dihitung ulang setelah tag disisipkan.</li>
                        </ul>
                    </div>
                    <div>
                        <img src="images/week10/image7.png" class="slide-img" alt="802.1Q Frame Format">
                        <div class="img-caption">Anatomi tag 4-byte 802.1Q yang disisipkan di antara Source MAC dan Type/Length</div>
                    </div>
                </div>
                <aside class="notes">Soroti bahwa VLAN ID berukuran 12 bit (2^12 = 4096 kemungkinan ID, 1-4094 usable).</aside>
            </section>

            <!-- Slide 11 -->
            <section>
                <h3>EVPN: Ethernet VPNs (VXLANs)</h3>
                <div class="layout-text-img">
                    <div class="card text-left text-smaller">
                        <p>Pada skala Cloud dan Data Center raksasa, batas 4094 VLAN konvensional tidak lagi mencukupi. Digunakanlah <strong>EVPN</strong> dan <strong>VXLAN</strong>.</p>
                        <ul>
                            <li>Switch Layer 2 secara logikal terhubung melintasi jaringan Layer 3 menggunakan <strong>IP sebagai underlay</strong>.</li>
                            <li>Frame Ethernet dienkapsulasi ke dalam paket UDP/IP (VXLAN header dengan 24-bit VNI = 16 juta segmen jaringan).</li>
                            <li>Menerapkan paradigma <strong>Overlay Network</strong> (L2 di atas L3), memungkinkan migrasi Virtual Machine (VM) antar server data center tanpa putus koneksi.</li>
                        </ul>
                    </div>
                    <div>
                        <img src="images/week10/image8.png" class="slide-img" alt="EVPN & VXLAN">
                        <div class="img-caption">Arsitektur tunneling L2 over L3 pada EVPN / VXLAN data center</div>
                    </div>
                </div>
                <aside class="notes">Ini adalah wawasan teknologi terkini: VXLAN menyelesaikan keterbatasan 4094 VLAN di lingkungan data center modern.</aside>
            </section>

            <!-- Slide 12 -->
            <section>
                <h3>Overview: Switch Tanpa VLAN</h3>
                <div class="layout-text-img">
                    <div class="card text-left text-smaller">
                        <p>Kondisi operasional default switch pabrikan sebelum dikonfigurasi VLAN:</p>
                        <ul>
                            <li><strong>1 Collision Domain per port:</strong> Setiap port memiliki collision domain terisolasi (full duplex).</li>
                            <li><strong>1 Broadcast Domain raksasa:</strong> Semua port tergabung dalam satu domain broadcast yang sama (default VLAN 1).</li>
                            <li>Semua host berada dalam satu subnet IP yang sama.</li>
                            <li>Setiap host dapat berkomunikasi langsung satu sama lain tanpa memerlukan bantuan router.</li>
                        </ul>
                    </div>
                    <div>
                        <img src="images/week10/image9.png" class="slide-img" alt="Switch tanpa VLAN">
                        <div class="img-caption">Switch default: Satu domain broadcast melingkupi seluruh port</div>
                    </div>
                </div>
            </section>

            <!-- Slide 13 -->
            <section>
                <h3>Overview: Switch Dengan 2 VLAN</h3>
                <div class="layout-text-img">
                    <div class="card text-left text-smaller">
                        <p>Setelah switch dikonfigurasi dengan 2 VLAN berbeda (misal VLAN 10 Merah dan VLAN 20 Biru):</p>
                        <ul>
                            <li>Terbentuk <strong>2 Broadcast Domain terpisah</strong> secara logikal di dalam satu kotak switch fisik.</li>
                            <li>Paket broadcast dari VLAN Merah <strong>hanya</strong> disebarkan ke port-port anggota VLAN Merah.</li>
                            <li>Tiap VLAN mewakili subnet IP berbeda (contoh: <code>192.168.10.0/24</code> vs <code>192.168.20.0/24</code>).</li>
                            <li>Host di VLAN Merah tidak bisa langsung berkomunikasi ke VLAN Biru.</li>
                        </ul>
                    </div>
                    <div>
                        <img src="images/week10/image10.jpg" class="slide-img" alt="Switch dengan 2 VLAN">
                        <div class="img-caption">Pemisahan broadcast domain menjadi dua segmen mandiri</div>
                    </div>
                </div>
            </section>

            <!-- Slide 14 -->
            <section>
                <h3>Rangkuman Konsep: Apa itu VLAN?</h3>
                <div class="layout-text-img">
                    <div class="card text-left text-smaller">
                        <p><strong>VLAN adalah pengelompokan logik</strong> dari perangkat-perangkat jaringan yang terhubung ke port switch, seakan-akan berada pada segmen fisik terpisah.</p>
                        <ul>
                            <li>VLAN dapat diberi nama untuk kemudahan manajemen (contoh: <code>VLAN 10 Sales</code>, <code>VLAN 20 HRD</code>).</li>
                            <li><strong>Pada Switch:</strong> Administrator membuat VLAN dan memetakan port ke VLAN tersebut.</li>
                            <li><strong>Pada Host:</strong> Host dikonfigurasikan dengan alamat IP sesuai subnet VLAN bersangkutan.</li>
                        </ul>
                        <div class="info-box">
                            <strong>Rumus Utama:</strong><br>
                            1 VLAN = 1 Broadcast Domain = 1 Subnet IP Terpisah.
                        </div>
                    </div>
                    <div>
                        <img src="images/week10/image11.jpg" class="slide-img" alt="Definisi VLAN">
                        <div class="img-caption">Konsep dasar pemetaan VLAN pada port switch</div>
                    </div>
                </div>
            </section>

            <!-- Slide 15 -->
            <section>
                <h3>Keuntungan VLAN (1/2)</h3>
                <div class="layout-text-img">
                    <div class="card text-left text-smaller">
                        <div class="sec-bar sec-bar-blue">Security &amp; Cost Reduction</div>
                        <div class="sec-body">
                            <p><strong>1. Peningkatan Keamanan (Security):</strong></p>
                            <ul>
                                <li>Data sensitif (divisi Keuangan/SDM) dapat dipisahkan secara broadcast dari pengguna umum.</li>
                                <li>Mencegah serangan packet sniffing dan unauthorized broadcast across divisions.</li>
                            </ul>
                            <p style="margin-top: 10px;"><strong>2. Penghematan Biaya (Cost Reduction):</strong></p>
                            <ul>
                                <li>Tidak perlu membeli switch fisik terpisah untuk setiap divisi baru.</li>
                                <li>Satu switch fisik berkapasitas tinggi dapat melayani puluhan grup kerja berbeda.</li>
                            </ul>
                        </div>
                    </div>
                    <div>
                        <img src="images/week10/image12.png" class="slide-img" alt="Keuntungan VLAN 1">
                        <div class="img-caption">Manfaat keamanan dan efisiensi pengadaan perangkat keras</div>
                    </div>
                </div>
            </section>

            <!-- Slide 16 -->
            <section>
                <h3>Keuntungan VLAN (2/2)</h3>
                <div class="layout-text-img">
                    <div class="card text-left text-smaller">
                        <div class="sec-bar sec-bar-green">Performance &amp; Flexibility</div>
                        <div class="sec-body">
                            <p><strong>3. Performa Lebih Tinggi:</strong></p>
                            <ul>
                                <li>Mengecilkan ukuran broadcast domain mengurangi beban CPU perangkat dan menghemat bandwidth link.</li>
                            </ul>
                            <p style="margin-top: 8px;"><strong>4. Efisiensi Proyek &amp; Manajemen:</strong></p>
                            <ul>
                                <li>Mempermudah pengelolaan QoS (prioritas trafik multimedia / suara).</li>
                            </ul>
                            <p style="margin-top: 8px;"><strong>5. Fleksibilitas Geografis:</strong></p>
                            <ul>
                                <li>Karyawan beda ruangan/lantai tetap berada di satu grup VLAN yang sama tanpa pemindahan kabel.</li>
                            </ul>
                        </div>
                    </div>
                    <div>
                        <img src="images/week10/image13.jpg" class="slide-img" alt="Keuntungan VLAN 2">
                        <div class="img-caption">Optimalisasi alur trafik dan fleksibilitas tim kerja</div>
                    </div>
                </div>
            </section>

            <!-- Slide 17 -->
            <section>
                <h3>Karakteristik VLAN ID</h3>
                <div class="layout-text-img">
                    <div class="card text-left text-smaller">
                        <p>Penomoran VLAN pada switch Cisco terbagi ke dalam dua rentang (range) utama:</p>
                        <ul>
                            <li><strong>Normal-range VLAN (1 – 1005):</strong>
                                <ul>
                                    <li>ID 1002–1005 dicadangkan untuk Token Ring &amp; FDDI.</li>
                                    <li>VLAN 1 dan 1002–1005 otomatis dibuat dan <strong>tidak bisa dihapus</strong>.</li>
                                    <li>Konfigurasi range normal tersimpan di dalam file <code>vlan.dat</code> pada memori flash switch.</li>
                                </ul>
                            </li>
                            <li><strong>Extended-range VLAN (1006 – 4094):</strong>
                                <ul>
                                    <li>Digunakan oleh Enterprise besar dan ISP (Metro Ethernet).</li>
                                    <li>Tersimpan langsung di dalam <code>running-config</code> switch (NVRAM).</li>
                                </ul>
                            </li>
                        </ul>
                    </div>
                    <div>
                        <img src="images/week10/image14.png" class="slide-img" alt="VLAN ID Range">
                        <div class="img-caption">Rentang nomor VLAN normal vs extended pada Cisco IOS</div>
                    </div>
                </div>
                <aside class="notes">Jelaskan letak file vlan.dat pada flash: saat menghapus startup-config, vlan.dat TIDAK terhapus otomatis.</aside>
            </section>

            <!-- Slide 18 -->
            <section>
                <h3>Tipe-Tipe VLAN (1/2)</h3>
                <div class="layout-text-img">
                    <div class="card text-left text-smaller">
                        <p>Klasifikasi fungsional VLAN dalam arsitektur kampus/perusahaan:</p>
                        <ul>
                            <li><strong>Data VLAN (User VLAN):</strong><br>
                                Dikhususkan untuk membawa trafik data yang dihasilkan pengguna biasa (web browsing, email, transfer file).</li>
                            <li><strong>Default VLAN:</strong><br>
                                Pada switch Cisco, semua port pada kondisi bawaan pabrik merupakan anggota dari <strong>VLAN 1</strong>. Default VLAN tidak dapat diganti namanya maupun dihapus.</li>
                            <li><strong>Native VLAN:</strong><br>
                                VLAN yang dialokasikan khusus pada port 802.1Q trunk untuk membawa frame yang <em>tidak diberi tag (untagged frames)</em> demi kompatibilitas perangkat lama.</li>
                        </ul>
                    </div>
                    <div>
                        <img src="images/week10/image15.png" class="slide-img" alt="Tipe VLAN 1">
                        <div class="img-caption">Data VLAN, Default VLAN 1, dan Native VLAN pada switch</div>
                    </div>
                </div>
            </section>

            <!-- Slide 19 -->
            <section>
                <h3>Tipe-Tipe VLAN (2/2)</h3>
                <div class="layout-text-img">
                    <div class="card text-left text-smaller">
                        <ul>
                            <li><strong>Management VLAN:</strong><br>
                                VLAN yang dialokasikan khusus untuk mengakses manajemen switch. IP address switch (SVI <code>interface vlan X</code>) dikonfigurasikan di sini agar administrator dapat me-remote switch via SSH / HTTPS dengan aman.
                                <div class="info-box-warn" style="margin-top: 6px;">
                                    <strong>Best Practice Keamanan:</strong> Jangan gunakan VLAN 1 sebagai Management VLAN!
                                </div>
                            </li>
                            <li style="margin-top: 10px;"><strong>Voice VLAN:</strong><br>
                                VLAN khusus untuk mengalirkan trafik IP Telephony (VoIP). Memerlukan pengaturan QoS prioritas tinggi dan jaminan latency rendah.</li>
                        </ul>
                    </div>
                    <div>
                        <img src="images/week10/image16.png" class="slide-img" alt="Tipe VLAN 2">
                        <div class="img-caption">Pemisahan jalur Management dan Voice untuk keamanan &amp; stabilitas</div>
                    </div>
                </div>
            </section>

            <!-- Slide 20 -->
            <section>
                <h3>Lebih Dalam: Voice VLAN</h3>
                <div class="card text-left text-smaller">
                    <p>Trafik panggilan suara (VoIP) membutuhkan penanganan istimewa (QoS) di dalam jaringan karena sangat sensitif terhadap gangguan:</p>
                    <div class="layout-3col" style="margin-top: 10px;">
                        <div class="card" style="border-left: 4px solid #1565c0;">
                            <h4 style="font-size: .85em; color: #1565c0;"><i class="bi bi-speedometer2"></i> Jaminan Bandwidth</h4>
                            <p style="font-size: .85em; margin: 0;">Membutuhkan bandwidth stabil tanpa fluktuasi agar audio tidak patah-patah.</p>
                        </div>
                        <div class="card" style="border-left: 4px solid #e65100;">
                            <h4 style="font-size: .85em; color: #e65100;"><i class="bi bi-hourglass-split"></i> Toleransi Latency</h4>
                            <p style="font-size: .85em; margin: 0;">Delay transmisi <em>end-to-end</em> harus berada di bawah <strong>150 ms</strong>.</p>
                        </div>
                        <div class="card" style="border-left: 4px solid #2e7d32;">
                            <h4 style="font-size: .85em; color: #2e7d32;"><i class="bi bi-bar-chart-steps"></i> Prioritas Antrean</h4>
                            <p style="font-size: .85em; margin: 0;">Frame suara harus memiliki nilai 802.1p CoS tinggi (CoS 5) di switch queue.</p>
                        </div>
                    </div>
                    <div class="info-box" style="margin-top: 10px;">
                        <strong>Penerapan Nyata:</strong> Satu port switch terhubung ke IP Phone, lalu PC dicolokkan ke port switch di belakang IP Phone. Switch secara cerdas membedakan Voice VLAN (tagged) dan Data PC (untagged) pada kabel tunggal tersebut.
                    </div>
                </div>
                <aside class="notes">Jelaskan konfigurasi switchport voice vlan 150 pada port yang menyambung ke Cisco IP Phone.</aside>
            </section>

            <!-- Slide 21 -->
            <section>
                <h3>VLAN Membership (Keanggotaan)</h3>
                <div class="layout-text-img">
                    <div class="card text-left text-smaller">
                        <p><strong>1. Static VLAN Membership:</strong></p>
                        <ul>
                            <li>Port switch dikonfigurasi secara <strong>manual</strong> oleh network engineer.</li>
                            <li>Lokasi fisik port menentukan keanggotaan VLAN (Port 1–2 = VLAN 10, Port 3 = VLAN 20). Paling stabil dan umum digunakan.</li>
                        </ul>
                        <p style="margin-top: 10px;"><strong>2. Dynamic VLAN Membership:</strong></p>
                        <ul>
                            <li>Keanggotaan diatur otomatis oleh server <strong>VMPS</strong> (VLAN Membership Policy Server) atau 802.1X.</li>
                            <li>Port ditentukan berdasarkan <strong>MAC Address</strong> atau kredensial user saat perangkat terhubung.</li>
                        </ul>
                    </div>
                    <div>
                        <img src="images/week10/image17.png" class="slide-img" alt="VLAN Membership">
                        <div class="img-caption">Pemetaan keanggotaan port statis vs dinamis</div>
                    </div>
                </div>
            </section>

            <!-- ━━━━━━━━━━━━━━ BAGIAN 2: TRUNKING & TAGGING ━━━━━━━━━━━━━━ -->
            <section>
                <h2>2. VLAN Trunking &amp; Protokol Tagging</h2>
                <p class="text-small" style="color: #666; margin-top: 10px;">Link Trunk, Format Frame IEEE 802.1Q, ISL, dan Negosiasi Dinamis DTP</p>
            </section>

            <!-- Slide 23 -->
            <section>
                <h3>Konsep TRUNK Link</h3>
                <div class="layout-text-img">
                    <div class="card text-left text-smaller">
                        <p><strong>Trunk</strong> adalah link penghubung point-to-point antara Switch ke Switch, atau Switch ke Router.</p>
                        <ul>
                            <li>Trunk berfungsi memperluas jangkauan VLAN melintasi beberapa switch fisik.</li>
                            <li>Satu kabel Trunk fisik mampu membawa trafik dari <strong>berbagai macam VLAN</strong> secara bersamaan.</li>
                            <li>Agar frame tidak tertukar antar VLAN saat melintas, frame disisipkan label identitas VLAN (<strong>Tagging</strong>).</li>
                            <li>Dua teknologi tagging L2: <strong>Cisco ISL</strong> (legacy) dan <strong>IEEE 802.1Q</strong> (standar industri).</li>
                        </ul>
                    </div>
                    <div>
                        <img src="images/week10/image18.png" class="slide-img" alt="Konsep Trunk Link">
                        <div class="img-caption">Satu link trunk membawa frame bertag dari banyak VLAN</div>
                    </div>
                </div>
            </section>

            <!-- Slide 24 -->
            <section>
                <h3>Tagging: ISL (Inter-Switch Link)</h3>
                <div class="layout-text-img">
                    <div class="card text-left text-smaller">
                        <p>Protokol enkapsulasi tagging kepemilikan Cisco sebelum standar 802.1Q diadopsi luas:</p>
                        <ul>
                            <li><strong>Cisco Proprietary:</strong> Hanya dapat digunakan sesama perangkat Cisco murni.</li>
                            <li><strong>Cara Kerja:</strong> Membungkus (mengenkapsulasi) frame asli seutuhnya ke dalam frame baru dengan menambahkan <strong>26-byte Header</strong> di depan dan <strong>4-byte CRC Trailer</strong> di belakang (Total overhead 30 bytes).</li>
                            <li><strong>Kelemahan:</strong> Beban overhead besar dan <em>tidak mendukung Native VLAN</em> (frame tanpa enkapsulasi ISL akan di-drop).</li>
                        </ul>
                    </div>
                    <div>
                        <img src="images/week10/image19.png" class="slide-img" alt="Enkapsulasi ISL">
                        <div class="img-caption">ISL membungkus seluruh frame Ethernet original dengan overhead 30 bytes</div>
                    </div>
                </div>
            </section>

            <!-- Slide 25 -->
            <section>
                <h3>Tagging: 802.1Q (Dot1Q)</h3>
                <div class="layout-text-img">
                    <div class="card text-left text-smaller">
                        <p>Protokol penandaan frame terbuka yang menjadi standar industri global:</p>
                        <ul>
                            <li><strong>Open Standard IEEE:</strong> Kompatibel lintas vendor (Cisco, Juniper, MikroTik, HP).</li>
                            <li><strong>Efisiensi Tinggi:</strong> Tidak membungkus ulang frame, melainkan menyisipkan <strong>Tag 4-byte</strong> tepat di dalam header Ethernet asli.</li>
                            <li><strong>Mendukung Native VLAN:</strong> Jika ada frame tanpa tag (untagged) lewat di link trunk, frame otomatis dimasukkan ke Native VLAN (default VLAN 1).</li>
                        </ul>
                    </div>
                    <div>
                        <img src="images/week10/image20.png" class="slide-img" alt="Tagging 802.1Q">
                        <div class="img-caption">Internal tagging 4-byte 802.1Q tanpa membungkus ulang frame</div>
                    </div>
                </div>
            </section>

            <!-- Slide 26 -->
            <section>
                <h3>DTP (Dynamic Trunking Protocol)</h3>
                <div class="card text-left text-smaller">
                    <p>DTP adalah protokol milik Cisco yang berfungsi melakukan <strong>negosiasi otomatis</strong> status port (Access vs Trunk) saat terhubung dengan port switch seberang.</p>
                    <div class="layout-2col" style="margin-top: 10px;">
                        <div class="card" style="border-left: 4px solid #1565c0;">
                            <h4 style="font-size:.85em; color:#1565c0;">Mode Access &amp; Trunk (Hardcoded)</h4>
                            <ul>
                                <li><strong>Access:</strong> Mengunci port permanen sebagai Access (non-trunk), mengabaikan tawaran seberang.</li>
                                <li><strong>Trunk:</strong> Memaksa port permanen sebagai Trunk link, mengirimkan negosiasi DTP ke seberang.</li>
                            </ul>
                        </div>
                        <div class="card" style="border-left: 4px solid #e65100;">
                            <h4 style="font-size:.85em; color:#e65100;">Mode Dinamis (Dynamic Auto vs Desirable)</h4>
                            <ul>
                                <li><strong>Dynamic Auto:</strong> Pasif. Mau menjadi Trunk hanya jika diajak aktif oleh port seberang.</li>
                                <li><strong>Dynamic Desirable:</strong> Aktif. Secara proaktif membujuk port seberang untuk membentuk Trunk.</li>
                            </ul>
                        </div>
                    </div>
                </div>
                <aside class="notes">Banyak switch modern default-nya Dynamic Auto. Jika kedua sisi Dynamic Auto, trunk TIDAK akan terbentuk (menjadi Access).</aside>
            </section>

            <!-- Slide 27 -->
            <section>
                <h3>Interaksi Switchport Mode (Tabel DTP)</h3>
                <div class="layout-text-img">
                    <div class="card text-left text-smaller">
                        <p>Matriks hasil negosiasi mode switchport antar dua switch yang terhubung:</p>
                        <table>
                            <thead>
                                <tr>
                                    <th>Port Lokal</th>
                                    <th>Port Remote</th>
                                    <th>Hasil Link</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>Dynamic Auto</td>
                                    <td>Dynamic Auto</td>
                                    <td style="color:#c62828; font-weight:bold;">Access</td>
                                </tr>
                                <tr>
                                    <td>Dynamic Auto</td>
                                    <td>Dynamic Desirable</td>
                                    <td style="color:#2e7d32; font-weight:bold;">Trunk</td>
                                </tr>
                                <tr>
                                    <td>Dynamic Desirable</td>
                                    <td>Dynamic Desirable</td>
                                    <td style="color:#2e7d32; font-weight:bold;">Trunk</td>
                                </tr>
                                <tr>
                                    <td>Trunk</td>
                                    <td>Dynamic Auto / Desirable</td>
                                    <td style="color:#2e7d32; font-weight:bold;">Trunk</td>
                                </tr>
                                <tr>
                                    <td>Trunk</td>
                                    <td>Access</td>
                                    <td style="color:#d84315; font-weight:bold;">Error (Mismatch)</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div>
                        <img src="images/week10/image21.png" class="slide-img" alt="Tabel DTP">
                        <div class="img-caption">Hasil negosiasi DTP pada switchport interface</div>
                    </div>
                </div>
            </section>

            <!-- Slide 28 -->
            <section>
                <h3>Kapan Memakai Access / Trunk?</h3>
                <div class="layout-text-img">
                    <div class="card text-left text-smaller">
                        <div class="sec-bar sec-bar-blue">Panduan Penerapan Mode Port</div>
                        <div class="sec-body">
                            <p><strong>Mode Access (<code>switchport mode access</code>):</strong></p>
                            <ul>
                                <li>Gunakan ketika port terhubung langsung ke end-device (PC, Server, Laptop, Printer).</li>
                                <li>Hanya mengalirkan 1 VLAN spesifik tanpa tag 802.1Q.</li>
                            </ul>
                            <p style="margin-top: 10px;"><strong>Mode Trunk (<code>switchport mode trunk</code>):</strong></p>
                            <ul>
                                <li>Gunakan ketika port terhubung ke Switch lain atau ke Router (ROAS).</li>
                                <li>Default-nya membawa trafik dari seluruh VLAN yang ada (VLAN 1–4094).</li>
                            </ul>
                        </div>
                    </div>
                    <div>
                        <img src="images/week10/image22.png" class="slide-img" alt="Access vs Trunk">
                        <div class="img-caption">Topologi tipikal: Port Access ke PC dan Port Trunk antar Switch/Router</div>
                    </div>
                </div>
            </section>

            <!-- ━━━━━━━━━━━━━━ BAGIAN 3: KONFIGURASI & TROUBLESHOOTING ━━━━━━━━━━━━━━ -->
            <section>
                <h2>3. Konfigurasi Cisco IOS &amp; Troubleshooting</h2>
                <p class="text-small" style="color: #666; margin-top: 10px;">Implementasi CLI, Allowed VLAN, dan Penanganan Berbagai Error Mismatch</p>
            </section>

            <!-- Slide 30 -->
            <section>
                <h3>Konfigurasi VLAN: Create &amp; Membership</h3>
                <div class="card text-left text-smaller">
                    <p>Langkah-langkah pembuatan VLAN dan pemetaan port Access pada Cisco IOS CLI:</p>
                    <div class="layout-2col" style="margin-top: 8px;">
                        <div>
                            <p style="font-weight:700; color:#1565c0; margin:0 0 4px 0;">Langkah 1: Membuat VLAN &amp; Penamaan</p>
                            <div class="code-block">
Switch# configure terminal
Switch(config)# vlan 10
Switch(config-vlan)# name IT_Support
Switch(config-vlan)# exit
                            </div>
                        </div>
                        <div>
                            <p style="font-weight:700; color:#1b5e20; margin:0 0 4px 0;">Langkah 2: Menetapkan Port sebagai Access</p>
                            <div class="code-block">
Switch(config)# interface FastEthernet 0/1
Switch(config-if)# switchport mode access
Switch(config-if)# switchport access vlan 10
Switch(config-if)# no shutdown
                            </div>
                        </div>
                    </div>
                    <div class="info-box-green" style="margin-top: 10px;">
                        <strong>Tip:</strong> Gunakan perintah <code>interface range f0/1 - 10</code> jika ingin memasukkan banyak port sekaligus ke VLAN yang sama.
                    </div>
                </div>
            </section>

            <!-- Slide 31 -->
            <section>
                <h3>Konfigurasi VLAN: Delete &amp; Verifikasi</h3>
                <div class="card text-left text-smaller">
                    <p style="font-weight:700; color:#c62828; margin:0 0 4px 0;">Menghapus Port dari VLAN / Menghapus VLAN:</p>
                    <div class="code-block">
! Mengembalikan port ke VLAN default (VLAN 1):
Switch(config-if)# no switchport access vlan

! Menghapus entitas VLAN dari switch:
Switch(config)# no vlan 10
                    </div>
                    <div class="info-box-warn" style="margin: 8px 0;">
                        <strong>Penting:</strong> Selalu pindahkan port anggota ke VLAN lain sebelum menghapus VLAN! Port yang tertinggal di VLAN yang telah dihapus akan menjadi tidak aktif (inaktif).
                    </div>
                    <p style="font-weight:700; color:#1565c0; margin:8px 0 4px 0;">Perintah Verifikasi Utama:</p>
                    <div class="code-block">
Switch# show vlan brief          ! Memeriksa daftar VLAN aktif &amp; port anggotanya
Switch# show vlan id 10          ! Memeriksa detail spesifik VLAN 10
Switch# show interfaces status   ! Memeriksa status port (vlan, duplex, speed)
                    </div>
                </div>
            </section>

            <!-- Slide 32 -->
            <section>
                <h3>Konfigurasi Trunking (Allowed VLAN)</h3>
                <div class="layout-text-img">
                    <div class="card text-left text-smaller">
                        <p>Secara default link Trunk meloloskan seluruh VLAN (1–4094). Demi keamanan dan penghematan bandwidth, kita wajib membatasi VLAN yang diizinkan lewat (<strong>VLAN Pruning / Allowed List</strong>):</p>
                        <div class="code-block" style="margin: 8px 0;">
Switch(config)# interface f0/1
Switch(config-if)# switchport mode trunk
Switch(config-if)# switchport trunk allowed vlan 1-20
Switch(config-if)# switchport trunk allowed vlan add 30
                        </div>
                        <p>Hanya VLAN 1 s.d. 20 dan 30 yang diperbolehkan lewat; VLAN lain yang tidak terdaftar akan otomatis di-drop pada link trunk ini.</p>
                    </div>
                    <div>
                        <img src="images/week10/image23.png" class="slide-img" alt="Konfigurasi Allowed VLAN">
                        <div class="img-caption">Filter trafik Trunk dengan parameter switchport trunk allowed vlan</div>
                    </div>
                </div>
            </section>

            <!-- Slide 33 -->
            <section>
                <h3>Masalah Umum VLAN 1: Native VLAN Mismatch</h3>
                <div class="layout-text-img">
                    <div class="card text-left text-smaller">
                        <p>Terjadi ketika port trunk 802.1Q di ujung kiri dan kanan memiliki konfigurasi Native VLAN yang berbeda:</p>
                        <ul>
                            <li><strong>Skenario:</strong> Switch Kiri di-set Native VLAN 10, sedangkan Switch Kanan di-set Native VLAN 20.</li>
                        </ul>
                        <div class="info-box-warn">
                            <strong>Dampak Bahaya:</strong><br>
                            1. Muncul pesan peringatan berulang dari protokol CDP (<em>%CDP-4-NATIVE_VLAN_MISMATCH</em>).<br>
                            2. Terjadi kebocoran trafik: frame dari VLAN 10 di switch kiri masuk ke VLAN 20 di switch kanan tanpa melewati router!
                        </div>
                    </div>
                    <div>
                        <img src="images/week10/image24.png" class="slide-img" alt="Native VLAN Mismatch">
                        <div class="img-caption">Native VLAN Mismatch menyebabkan kebocoran cross-VLAN</div>
                    </div>
                </div>
                <aside class="notes">Native VLAN Mismatch adalah lubang keamanan (VLAN hopping attack vector) jika tidak dikonfigurasi konsisten.</aside>
            </section>

            <!-- Slide 34 -->
            <section>
                <h3>Masalah Umum VLAN 2 &amp; 3: Mode &amp; Allowed Mismatch</h3>
                <div class="layout-text-img">
                    <div class="card text-left text-smaller">
                        <p><strong>1. Trunk Mode Mismatch:</strong></p>
                        <ul>
                            <li>Satu sisi dikonfigurasi <code>trunk</code>, sedangkan sisi seberang dikunci <code>access</code>.</li>
                            <li><strong>Dampak:</strong> Link putus total (broken link) karena format frame tagging tidak dikenali oleh sisi access.</li>
                        </ul>
                        <p style="margin-top: 8px;"><strong>2. Allowed VLAN Mismatch:</strong></p>
                        <ul>
                            <li>Trunk kiri mengizinkan VLAN 10, 20, 30; Trunk kanan hanya mengizinkan 10, 20.</li>
                            <li><strong>Dampak:</strong> Pengguna VLAN 30 di switch kiri tidak bisa menghubungi host VLAN 30 di switch kanan.</li>
                        </ul>
                    </div>
                    <div>
                        <img src="images/week10/image25.png" class="slide-img" alt="Mode & Allowed Mismatch">
                        <div class="img-caption">Dampak kegagalan konfigurasi mode dan allowed list antar trunk</div>
                    </div>
                </div>
            </section>

            <!-- ━━━━━━━━━━━━━━ BAGIAN 4: INTER-VLAN ROUTING ━━━━━━━━━━━━━━ -->
            <section>
                <h2>4. Metode Inter-VLAN Routing</h2>
                <p class="text-small" style="color: #666; margin-top: 10px;">Menghubungkan Antar-VLAN: Traditional, Router-on-a-Stick (ROAS), dan Switch Layer 3 (SVI)</p>
            </section>

            <!-- Slide 36 -->
            <section>
                <h3>Tantangan Baru: Inter-VLAN Routing</h3>
                <div class="card text-left text-smaller">
                    <p>Secara desain, VLAN mengisolasi jaringan di Layer 2. Namun di dunia nyata, host VLAN 10 (Sales) seringkali perlu berkomunikasi dengan host VLAN 20 (HRD) atau mengakses Server bersama.</p>
                    <div class="info-box">
                        Karena <strong>1 VLAN = 1 Subnet IP berbeda</strong>, Switch Layer 2 tidak memiliki kemampuan meneruskan paket antar-subnet. Diperlukan <strong>perangkat Layer 3 (Router atau Switch L3)</strong> untuk melakukan routing.
                    </div>
                    <p style="font-weight:700; margin-top:12px;">Evolusi Tiga Metode Inter-VLAN Routing:</p>
                    <div class="layout-3col" style="margin-top: 8px;">
                        <div class="card" style="border-top: 4px solid #b71c1c;">
                            <h4 style="font-size:.85em; color:#b71c1c;">1. Traditional</h4>
                            <p style="font-size:.8em;">1 kabel fisik per VLAN ke router. Sangat boros port dan usang.</p>
                        </div>
                        <div class="card" style="border-top: 4px solid #e65100;">
                            <h4 style="font-size:.85em; color:#e65100;">2. Router-on-a-Stick</h4>
                            <p style="font-size:.8em;">1 kabel trunk fisik dengan sub-interface logikal (dot1q) di router.</p>
                        </div>
                        <div class="card" style="border-top: 4px solid #1b5e20;">
                            <h4 style="font-size:.85em; color:#1b5e20;">3. Switch Layer 3</h4>
                            <p style="font-size:.8em;">Routing internal hardware ASIC via SVI dengan performa wire-speed.</p>
                        </div>
                    </div>
                </div>
            </section>

            <!-- Slide 37 -->
            <section>
                <h3>1. Traditional Inter-VLAN Routing</h3>
                <div class="layout-text-img">
                    <div class="card text-left text-smaller">
                        <p>Metode generasi pertama yang digunakan saat router dan switch masih terpisah secara ketat:</p>
                        <ul>
                            <li>Switch mengalokasikan 1 port Access khusus ke Router untuk VLAN 10.</li>
                            <li>Switch mengalokasikan 1 port Access <em>lainnya</em> ke Router untuk VLAN 20.</li>
                            <li>Router harus memiliki antarmuka fisik terpisah untuk setiap VLAN.</li>
                        </ul>
                        <div class="info-box-warn">
                            <strong>Kelemahan Fatal:</strong> Tidak skalabel! Jika ada 50 VLAN, router harus memiliki 50 interface fisik. Biaya sangat mahal dan port fisik terbuang percuma.
                        </div>
                    </div>
                    <div>
                        <img src="images/week10/image26.jpg" class="slide-img" alt="Traditional Inter-VLAN">
                        <div class="img-caption">Traditional routing: 1 kabel fisik didedikasikan untuk setiap VLAN</div>
                    </div>
                </div>
            </section>

            <!-- Slide 38 -->
            <section>
                <h3>2. Router-on-a-Stick (ROAS)</h3>
                <div class="layout-text-img">
                    <div class="card text-left text-smaller">
                        <p>Solusi cerdas yang sangat populer untuk jaringan skala kecil dan menengah:</p>
                        <ul>
                            <li>Koneksi Switch ke Router hanya menggunakan <strong>1 Kabel Fisik Tunggal</strong> yang dikonfigurasi sebagai <strong>TRUNK</strong>.</li>
                            <li>Di sisi Router, satu interface fisik (misal <code>Gig0/0</code>) dipecah secara logika menjadi banyak <strong>Sub-Interface</strong>:
                                <div class="code-block" style="margin: 6px 0;">
Router(config)# interface gig0/0.10
Router(config-subif)# encapsulation dot1Q 10
Router(config-subif)# ip address 192.168.10.1 255.255.255.0
                                </div>
                            </li>
                            <li>Tiap sub-interface bertindak sebagai Default Gateway untuk masing-masing subnet VLAN.</li>
                        </ul>
                    </div>
                    <div>
                        <img src="images/week10/image27.png" class="slide-img" alt="Router on a Stick">
                        <div class="img-caption">Router-on-a-Stick menggunakan sub-interface pada link trunk tunggal</div>
                    </div>
                </div>
                <aside class="notes">Pastikan sintaks encapsulation dot1Q dieksekusi SEBELUM memberi IP address pada sub-interface.</aside>
            </section>

            <!-- Slide 39 -->
            <section>
                <h3>3. Layer 3 Switch (Switch Virtual Interface)</h3>
                <div class="card text-left text-smaller">
                    <p>Teknologi standar modern untuk jaringan kampus dan Enterprise (Multilayer Switching):</p>
                    <div class="layout-2col" style="margin-top: 8px;">
                        <div class="card" style="border-left: 4px solid #1b5e20;">
                            <h4 style="font-size:.85em; color:#1b5e20;"><i class="bi bi-cpu-fill"></i> Hardware-Based Routing (ASIC)</h4>
                            <ul>
                                <li>Dilengkapi chip ASIC khusus yang mampu memproses routing secepat kecepatan kabel (<strong>Wire-speed performance</strong>).</li>
                                <li>Tidak memiliki bottleneck kabel tunggal seperti pada konsep Router-on-a-Stick.</li>
                            </ul>
                        </div>
                        <div class="card" style="border-left: 4px solid #1565c0;">
                            <h4 style="font-size:.85em; color:#1565c0;"><i class="bi bi-terminal-fill"></i> Konfigurasi SVI (Switch Virtual Interface)</h4>
                            <div class="code-block">
Switch(config)# ip routing
Switch(config)# interface vlan 10
Switch(config-if)# ip address 192.168.10.1 255.255.255.0
Switch(config-if)# no shutdown
                            </div>
                        </div>
                    </div>
                    <div class="info-box-green" style="margin-top: 10px;">
                        Perintah <code>ip routing</code> pada Switch Layer 3 mengaktifkan mesin routing global internal switch.
                    </div>
                </div>
                <aside class="notes">Banyak pemula lupa mengetik 'ip routing' di global config L3 switch, sehingga paket antar VLAN tetap tidak bisa routing.</aside>
            </section>

            <!-- ━━━━━━━━━━━━━━ SLIDE 40: RANGKUMAN ━━━━━━━━━━━━━━ -->
            <section>
                <h3>Rangkuman Pertemuan 10</h3>
                <div class="layout-2col">
                    <div class="card text-left text-smaller">
                        <div class="sec-bar sec-bar-blue">VLAN &amp; Trunking</div>
                        <div class="sec-body">
                            <ul>
                                <li><strong>VLAN (Virtual LAN):</strong> Memecah switch fisik tunggal menjadi beberapa broadcast domain logikal mandiri. <em>1 VLAN = 1 Broadcast Domain = 1 Subnet IP</em>.</li>
                                <li><strong>Trunk Link:</strong> Menghubungkan switch-to-switch atau switch-to-router untuk mengalirkan frame dari banyak VLAN sekaligus.</li>
                                <li><strong>IEEE 802.1Q:</strong> Standar terbuka penandaan frame (tagging) 4-byte (TPID <code>0x8100</code> + VLAN ID 12-bit). Mendukung <strong>Native VLAN</strong> untuk frame untagged.</li>
                                <li><strong>DTP:</strong> Negosiasi otomatis mode port (Access, Trunk, Dynamic Auto, Dynamic Desirable).</li>
                            </ul>
                        </div>
                    </div>
                    <div class="card text-left text-smaller">
                        <div class="sec-bar sec-bar-green">Inter-VLAN Routing</div>
                        <div class="sec-body">
                            <ul>
                                <li><strong>Kebutuhan L3:</strong> Komunikasi antar-VLAN mutlak memerlukan perangkat Layer 3 karena berada di subnet IP berbeda.</li>
                                <li><strong>Traditional:</strong> 1 kabel fisik per VLAN ke router — boros port fisik dan tidak skalabel.</li>
                                <li><strong>Router-on-a-Stick (ROAS):</strong> 1 kabel trunk fisik dengan banyak sub-interface logikal (<code>dot1q</code>) di router — ideal untuk skala kecil/menengah.</li>
                                <li><strong>Switch Layer 3 (SVI):</strong> Routing internal berbasis hardware ASIC melalui SVI — performa kilat (<em>wire-speed</em>) standar Enterprise modern.</li>
                            </ul>
                        </div>
                    </div>
                </div>
                <aside class="notes">Rangkum kembali dua pesan inti pertemuan ini: isolasi di Layer 2 dengan VLAN & Trunking, serta penyambungan kembali di Layer 3 dengan ROAS / SVI.</aside>
            </section>

            <!-- ━━━━━━━━━━━━━━ BAGIAN 5: TUGAS MANDIRI ━━━━━━━━━━━━━━ -->
            <section>
                <h2>5. Tugas Mandiri &amp; Simulasi Praktikum</h2>
                <p class="text-small" style="color: #666; margin-top: 10px;">Laboratorium Virtual Cisco Packet Tracer &amp; Validasi Routing</p>
            </section>

            <!-- Slide 42 -->
            <section>
                <div class="tugas-box">
                    <h3>📝 Tugas Praktikum Mandiri: Cisco Packet Tracer</h3>
                    <p style="font-size: .62em; margin-bottom: 10px; color: #e8f5e9;">
                        Rancang topologi dan buktikan implementasi <strong>Router-on-a-Stick (ROAS)</strong> dengan skenario lab berikut:
                    </p>
                    <div class="tugas-soal">
                        <p><span class="num">1.</span> Tambahkan <strong>1 Router (Cisco 2911)</strong> dan <strong>1 Switch (Cisco 2960)</strong> di lembar kerja Cisco Packet Tracer.</p>
                    </div>
                    <div class="tugas-soal">
                        <p><span class="num">2.</span> Buat 3 buah VLAN pada Switch: <strong>VLAN 10 (Sales)</strong>, <strong>VLAN 20 (HRD)</strong>, dan <strong>VLAN 30 (Guest)</strong>.</p>
                    </div>
                    <div class="tugas-soal">
                        <p><span class="num">3.</span> Pasang minimal 2 PC untuk masing-masing VLAN dan atur port switch yang terhubung sebagai <strong>Access Port</strong>.</p>
                    </div>
                    <div class="tugas-soal">
                        <p><span class="num">4.</span> Konfigurasikan link penghubung Switch ke Router sebagai mode <strong>Trunk</strong> 802.1Q.</p>
                    </div>
                    <div class="tugas-soal">
                        <p><span class="num">5.</span> Di Router, konfigurasikan <strong>Sub-Interface</strong> dengan enkapsulasi <code>encapsulation dot1Q &lt;vlan-id&gt;</code> sebagai Default Gateway tiap subnet.</p>
                    </div>
                    <div class="tugas-soal">
                        <p><span class="num">6.</span> Lakukan validasi <strong>Ping antar-VLAN</strong> dan sertakan tangkapan layar output <code>show ip route</code> serta <code>show vlan brief</code>.</p>
                    </div>
                    <div class="tugas-info">
                        <div class="tugas-chip"><i class="bi bi-clock-fill"></i> Batas Waktu: 1 Minggu</div>
                        <div class="tugas-chip"><i class="bi bi-file-earmark-zip-fill"></i> Format: .pkt &amp; Laporan PDF</div>
                        <div class="tugas-chip"><i class="bi bi-cloud-arrow-up-fill"></i> Pengumpulan: Google Classroom / LMS</div>
                    </div>
                </div>
                <aside class="notes">Pastikan mahasiswa memperhatikan IP subnetting tiap VLAN dan mencantumkan bukti ping successful antar PC beda VLAN.</aside>
            </section>

            <!-- ━━━━━━━━━━━━━━ SLIDE 43: PENUTUP / Q&A ━━━━━━━━━━━━━━ -->
            <section>
                <h2>Tanya Jawab &amp; Diskusi</h2>
                <div style="font-size: 2.2em; color: #1565c0; margin: 15px 0;">
                    <i class="bi bi-chat-dots-fill"></i>
                </div>
                <p>Pertemuan berikutnya: <strong>Pertemuan 11: Socket Programming (TCP &amp; UDP)</strong></p>
                <p class="text-small" style="color: #666; max-width: 720px; margin: 10px auto;">
                    Persiapkan pemahaman mengenai komunikasi antar-proses (IPC), socket API di lapisan Transport, serta pembuatan program client-server sederhana.
                </p>
                <aside class="notes">Beri kesempatan mahasiswa bertanya mengenai konsep Native VLAN, enkapsulasi dot1q sub-interface, atau konfigurasi switch L3 sebelum menutup sesi pertemuan.</aside>
            </section>

        </div><!-- /slides -->
    </div><!-- /reveal -->

    <script src="https://cdn.jsdelivr.net/npm/reveal.js@5.0.4/dist/reveal.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/reveal.js@5.0.4/plugin/notes/notes.js"></script>
    <script>
        Reveal.initialize({
            hash: true,
            slideNumber: 'c/t',
            transition: 'slide',
            plugins: [RevealNotes]
        });
    </script>

    <!-- Theme Toggle -->
    <button id="theme-toggle"
        style="position: fixed; bottom: 20px; left: 20px; z-index: 1000; padding: 10px; border-radius: 50%; background: #333; color: #fff; border: none; cursor: pointer; font-size: 16px; width: 40px; height: 40px; box-shadow: 0 4px 6px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center; transition: all 0.3s ease;">
        <i class="bi bi-moon-fill" id="theme-icon"></i>
    </button>
    <script>
        document.addEventListener("DOMContentLoaded", function () {
            const toggleBtn = document.getElementById('theme-toggle');
            const themeLink = document.getElementById('theme');
            const themeIcon = document.getElementById('theme-icon');
            if (!toggleBtn || !themeLink) return;

            const currentTheme = localStorage.getItem('reveal-theme') || 'simple';
            if (currentTheme === 'night') {
                themeLink.href = 'https://cdn.jsdelivr.net/npm/reveal.js@5.0.4/dist/theme/night.css';
                document.documentElement.setAttribute('data-theme', 'dark');
                themeIcon.classList.replace('bi-moon-fill', 'bi-sun-fill');
                toggleBtn.style.background = '#f1f1f1';
                toggleBtn.style.color = '#333';
            }

            toggleBtn.addEventListener('click', () => {
                if (themeLink.href.includes('simple.css')) {
                    themeLink.href = 'https://cdn.jsdelivr.net/npm/reveal.js@5.0.4/dist/theme/night.css';
                    document.documentElement.setAttribute('data-theme', 'dark');
                    localStorage.setItem('reveal-theme', 'night');
                    themeIcon.classList.replace('bi-moon-fill', 'bi-sun-fill');
                    toggleBtn.style.background = '#f1f1f1';
                    toggleBtn.style.color = '#333';
                } else {
                    themeLink.href = 'https://cdn.jsdelivr.net/npm/reveal.js@5.0.4/dist/theme/simple.css';
                    document.documentElement.removeAttribute('data-theme');
                    localStorage.setItem('reveal-theme', 'simple');
                    themeIcon.classList.replace('bi-sun-fill', 'bi-moon-fill');
                    toggleBtn.style.background = '#333';
                    toggleBtn.style.color = '#fff';
                }
            });
        });
    </script>
</body>

</html>
'''

with open("pertemuan10.html", "w", encoding="utf-8") as f:
    f.write(html_content)

print("pertemuan10.html updated successfully!")
