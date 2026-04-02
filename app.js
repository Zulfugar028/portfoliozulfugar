
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
    if (lineIdx >= lines.length) { lineIdx = 0; setTimeout(runLine, 1500); return; }
    const l = lines[lineIdx++];
    if (l.type === 'cmd') {
        termCursor.style.display = 'inline-block';
        typeCmd(l.text, () => {
            termCursor.style.display = 'none';
            setTimeout(() => {
                addLine('cmd', l.text);
                termCmd.textContent = '';
                setTimeout(runLine, 300);
            }, 200);
        });
    } else {
        addLine(l.type, l.text);
        setTimeout(runLine, 280);
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