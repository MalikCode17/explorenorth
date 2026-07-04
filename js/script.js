// ==========================================
// FUNGSI HELPER UI CUSTOM MODAL
// ==========================================
// Fungsi ini menggantikan alert() bawaan browser agar lebih estetik
function showCustomAlert(title, message, type = 'warning') {
    const overlay = document.createElement('div');
    overlay.className = 'custom-modal-overlay';
    
    let icon = type === 'warning' ? '⚠️' : '✅';
    
    overlay.innerHTML = `
        <div class="custom-modal-box">
            <div class="modal-icon">${icon}</div>
            <h3 class="modal-title">${title}</h3>
            <p class="modal-text">${message}</p>
            <div class="modal-actions">
                <button class="btn-modal btn-modal-primary" id="btnAlertOk">OK Mengerti</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(overlay);
    
    document.getElementById('btnAlertOk').addEventListener('click', () => {
        overlay.remove();
    });
}

// Fungsi ini menggantikan confirm() bawaan browser agar lebih estetik
function showCustomConfirm(title, message, onConfirm) {
    const overlay = document.createElement('div');
    overlay.className = 'custom-modal-overlay';
    
    overlay.innerHTML = `
        <div class="custom-modal-box">
            <div class="modal-icon">❓</div>
            <h3 class="modal-title">${title}</h3>
            <p class="modal-text">${message}</p>
            <div class="modal-actions">
                <button class="btn-modal btn-modal-secondary" id="btnConfirmCancel">Batal</button>
                <button class="btn-modal btn-modal-danger" id="btnConfirmOk">Ya, Hapus</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(overlay);
    
    document.getElementById('btnConfirmCancel').addEventListener('click', () => {
        overlay.remove(); // Tutup jika dibatalkan
    });
    
    document.getElementById('btnConfirmOk').addEventListener('click', () => {
        overlay.remove(); // Tutup modal
        onConfirm();      // Jalankan fungsi penghapusan
    });
}


// Menunggu seluruh elemen DOM (HTML) termuat dengan sempurna
document.addEventListener('DOMContentLoaded', function() {
    
    // TAHAP 6, 7 & 9: Validasi Form, Simpan & Edit LocalStorage
    const bookingForm = document.getElementById('bookingForm');
    
    if (bookingForm) {
        // --- LOGIKA EDIT (Jika ada data yang sedang diedit) ---
        const editId = localStorage.getItem('editId');
        let isEditMode = false;
        
        if (editId) {
            isEditMode = true;
            const riwayatData = JSON.parse(localStorage.getItem('riwayatReservasi')) || [];
            const dataToEdit = riwayatData.find(item => item.id == editId);
            
            if (dataToEdit) {
                document.getElementById('namaLengkap').value = dataToEdit.namaLengkap;
                document.getElementById('nomorHp').value = dataToEdit.nomorHp;
                document.getElementById('destinasi').value = dataToEdit.destinasi;
                document.getElementById('paketWisata').value = dataToEdit.paketWisata;
                document.getElementById('tanggal').value = dataToEdit.tanggal;
                document.getElementById('jumlahPeserta').value = dataToEdit.jumlahPeserta;
                document.getElementById('catatan').value = dataToEdit.catatan;
                
                const btnSubmit = bookingForm.querySelector('.btn-submit');
                if (btnSubmit) {
                    btnSubmit.textContent = "Simpan Perubahan";
                }
            }
        }

        bookingForm.addEventListener('submit', function(event) {
            event.preventDefault();

            const namaLengkap = document.getElementById('namaLengkap').value.trim();
            const nomorHp = document.getElementById('nomorHp').value.trim();
            const destinasi = document.getElementById('destinasi').value;
            const paketWisata = document.getElementById('paketWisata').value;
            const tanggal = document.getElementById('tanggal').value;
            const jumlahPeserta = parseInt(document.getElementById('jumlahPeserta').value, 10);
            const catatan = document.getElementById('catatan').value.trim();
            
            // 1. Validasi Seluruh Field Wajib Isi
            if (!namaLengkap || !nomorHp || !destinasi || !paketWisata || !tanggal || isNaN(jumlahPeserta)) {
                showCustomAlert("Peringatan Form", "Mohon lengkapi semua field form yang diwajibkan!", "warning");
                return; 
            }

            // 2. Validasi Nomor HP Hanya Boleh Angka
            const phoneRegex = /^[0-9]+$/;
            if (!phoneRegex.test(nomorHp)) {
                showCustomAlert("Input Tidak Valid", "Nomor HP tidak valid! Anda hanya diperbolehkan memasukkan angka.", "warning");
                return;
            }

            // 3. Validasi Tanggal Wajib Dipilih 
            if (tanggal === "") {
                showCustomAlert("Peringatan Tanggal", "Tanggal keberangkatan wajib dipilih!", "warning");
                return;
            }

            // 4. Validasi Jumlah Peserta Minimal 1
            if (jumlahPeserta < 1) {
                showCustomAlert("Peringatan Peserta", "Jumlah peserta minimal adalah 1 orang.", "warning");
                return;
            }

            let riwayatData = JSON.parse(localStorage.getItem('riwayatReservasi')) || [];

            if (isEditMode) {
                const index = riwayatData.findIndex(item => item.id == editId);
                if (index !== -1) {
                    riwayatData[index] = {
                        id: parseInt(editId), 
                        namaLengkap: namaLengkap,
                        nomorHp: nomorHp,
                        destinasi: destinasi,
                        paketWisata: paketWisata,
                        tanggal: tanggal,
                        jumlahPeserta: jumlahPeserta,
                        catatan: catatan
                    };
                }
                localStorage.removeItem('editId');
            } else {
                const dataBaru = {
                    id: Date.now(),
                    namaLengkap: namaLengkap,
                    nomorHp: nomorHp,
                    destinasi: destinasi,
                    paketWisata: paketWisata,
                    tanggal: tanggal,
                    jumlahPeserta: jumlahPeserta,
                    catatan: catatan
                };
                riwayatData.push(dataBaru);
            }

            localStorage.setItem('riwayatReservasi', JSON.stringify(riwayatData));

            // Tampilkan custom modal sukses
            showCustomAlert(
                isEditMode ? "Berhasil Diperbarui!" : "Berhasil Disimpan!", 
                isEditMode ? "Data reservasi berhasil diubah. Anda akan dialihkan ke halaman riwayat." : "Pemesanan berhasil dibuat. Anda akan dialihkan ke halaman riwayat.", 
                "success"
            );
            
            // Sembunyikan form agar layar fokus ke modal
            bookingForm.style.display = 'none';

            // Ubah teks tombol "OK Mengerti" menjadi memutar agar user tahu sedang dialihkan, atau biarkan auto redirect
            const btnOk = document.getElementById('btnAlertOk');
            if (btnOk) {
                btnOk.style.display = 'none'; // Sembunyikan tombol OK karena akan otomatis redirect
            }

            setTimeout(() => {
                window.location.href = "riwayat.html";
            }, 2000);
            
        });
    }

    // ==========================================
    // TAHAP 8: Menampilkan Data ke Tabel Riwayat
    // ==========================================
    const riwayatTableBody = document.getElementById('riwayatTableBody');
    
    function renderTable() {
        if (!riwayatTableBody) return; 
        
        let riwayatData = JSON.parse(localStorage.getItem('riwayatReservasi')) || [];
        
        riwayatTableBody.innerHTML = '';

        if (riwayatData.length === 0) {
            riwayatTableBody.innerHTML = `
                <tr id="emptyRowMessage">
                    <td colspan="9" style="text-align: center; padding: 20px;">Belum ada data reservasi.</td>
                </tr>
            `;
            return;
        }

        riwayatData.forEach((data, index) => {
            const tr = document.createElement('tr');
            
            tr.innerHTML = `
                <td>${index + 1}</td>
                <td>${data.namaLengkap}</td>
                <td>${data.nomorHp}</td>
                <td>${data.destinasi}</td>
                <td>${data.paketWisata}</td>
                <td>${data.tanggal}</td>
                <td>${data.jumlahPeserta}</td>
                <td>${data.catatan || '-'}</td>
                <td>
                    <button class="btn-action btn-edit" onclick="editData(${data.id})">Edit</button>
                    <button class="btn-action btn-delete" onclick="hapusData(${data.id})">Hapus</button>
                </td>
            `;
            
            riwayatTableBody.appendChild(tr);
        });
    }

    renderTable();

});

window.editData = function(id) {
    localStorage.setItem('editId', id);
    window.location.href = "booking.html";
};

// ==========================================
// TAHAP 10: Deklarasi fungsi global Hapus
// ==========================================
window.hapusData = function(id) {
    // Menggunakan custom confirm modal alih-alih confirm bawaan
    showCustomConfirm(
        "Konfirmasi Hapus", 
        "Apakah Anda yakin ingin menghapus data reservasi ini? Tindakan ini tidak dapat dibatalkan.",
        function() {
            // Callback jika pengguna menekan "Ya, Hapus"
            let riwayatData = JSON.parse(localStorage.getItem('riwayatReservasi')) || [];
            riwayatData = riwayatData.filter(item => item.id != id);
            localStorage.setItem('riwayatReservasi', JSON.stringify(riwayatData));
            window.location.reload();
        }
    );
};
