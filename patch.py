import re

with open("/Users/tanto/Library/CloudStorage/OneDrive-Personal/ITERA/Jaringan Komputer/2026/Presentasi/pertemuan02.html", "r") as f:
    content = f.read()

target = """            <section>
                <h3>IP vs MAC Address</h3>
                <img src="assets/ip_mac_analogy_1788845679947.jpg"
                    style="width:65%; border-radius:10px; margin-bottom: 20px; box-shadow: 0 4px 8px rgba(0,0,0,0.2);"
                    alt="IP vs MAC Analogi">
                <div style="display: flex; gap: 20px;">
                    <div style="flex: 1;" class="card text-center">
                        <div style="font-size: 0.5em; color: #f44336;"><i class="bi bi-person-vcard"></i></div>
                        <h4 class="highlight-red">MAC Address (Layer 2)</h4>
                        <div class="text-smaller text-left">
                            <ul>
                                <li>Analogi: <strong>KTP / Paspor</strong></li>
                                <li>Sifat: Permanen, bawaan pabrik</li>
                                <li>Contoh: <code>0A:1B:2C...</code></li>
                                <li>Cakupan: Lokal (LAN)</li>
                            </ul>
                        </div>
                    </div>
                    <div style="flex: 1;" class="card text-center">
                        <div style="font-size: 0.5em; color: #4caf50;"><i class="bi bi-house-door"></i></div>
                        <h4 class="highlight-green">IP Address (Layer 3)</h4>
                        <div class="text-smaller text-left">
                            <ul>
                                <li>Analogi: <strong>Alamat Rumah/Kos</strong></li>
                                <li>Sifat: Dinamis, bisa berubah lokasi</li>
                                <li>Contoh: <code>192.168.1.10</code></li>
                                <li>Cakupan: Global (Internet)</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>"""

replacement = """            <section>
                <h3>IP vs MAC Address</h3>
                <div style="display: flex; align-items: center; gap: 15px;">
                    <!-- Kolom Kiri: MAC Address -->
                    <div style="flex: 1.2;" class="card text-center">
                        <div style="font-size: 2em; color: #f44336; margin-bottom: 10px;"><i class="bi bi-person-vcard"></i></div>
                        <h4 class="highlight-red" style="font-size: 0.9em;">MAC Address (Layer 2)</h4>
                        <div class="text-smaller text-left" style="font-size: 0.55em; line-height: 1.3;">
                            <ul style="padding-left: 1em;">
                                <li>Analogi: <strong>KTP / Paspor</strong></li>
                                <li>Sifat: Permanen, bawaan pabrik</li>
                                <li>Contoh: <br><code>0A:1B:2C...</code></li>
                                <li>Cakupan: Lokal (LAN)</li>
                            </ul>
                        </div>
                    </div>
                    
                    <!-- Kolom Tengah: Gambar -->
                    <div style="flex: 2.5;">
                        <img src="assets/ip_mac_analogy_1788845679947.jpg"
                            style="width:100%; max-height: 60vh; object-fit: contain; border-radius:10px; box-shadow: 0 4px 8px rgba(0,0,0,0.2); margin: 0;"
                            alt="IP vs MAC Analogi">
                    </div>
                    
                    <!-- Kolom Kanan: IP Address -->
                    <div style="flex: 1.2;" class="card text-center">
                        <div style="font-size: 2em; color: #4caf50; margin-bottom: 10px;"><i class="bi bi-house-door"></i></div>
                        <h4 class="highlight-green" style="font-size: 0.9em;">IP Address (Layer 3)</h4>
                        <div class="text-smaller text-left" style="font-size: 0.55em; line-height: 1.3;">
                            <ul style="padding-left: 1em;">
                                <li>Analogi: <strong>Rumah/Kos</strong></li>
                                <li>Sifat: Dinamis, bisa berubah</li>
                                <li>Contoh: <br><code>192.168.1.10</code></li>
                                <li>Cakupan: Global (Internet)</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>"""

new_content = content.replace(target, replacement)

with open("/Users/tanto/Library/CloudStorage/OneDrive-Personal/ITERA/Jaringan Komputer/2026/Presentasi/pertemuan02.html", "w") as f:
    f.write(new_content)

if new_content != content:
    print("SUCCESS")
else:
    print("NOT FOUND")
