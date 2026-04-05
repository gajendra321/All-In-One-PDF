/* ========================================
   PDF Tools Pro - Main JavaScript
   ======================================== */

// Dark Mode Toggle
const themeToggle = document.getElementById('themeToggle');
const html = document.documentElement;

function setTheme(t) {
  html.setAttribute('data-theme', t);
  localStorage.setItem('theme', t);
  themeToggle.textContent = t === 'dark' ? '☀️' : '🌙';
}

// Init theme
const saved = localStorage.getItem('theme');
const prefer = window.matchMedia('(prefers-color-scheme:dark)').matches ? 'dark' : 'light';
setTheme(saved || prefer);

themeToggle?.addEventListener('click', () => {
  setTheme(html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark');
});

// Tool Search Filter (Homepage)
const searchInput = document.getElementById('toolSearch');
if (searchInput) {
  searchInput.addEventListener('input', () => {
    const q = searchInput.value.toLowerCase().trim();
    const cards = document.querySelectorAll('.tool-card');
    let visible = 0;
    cards.forEach(c => {
      const name = c.getAttribute('data-name') || '';
      const match = name.includes(q);
      c.style.display = match ? '' : 'none';
      if (match) visible++;
    });
    const nr = document.getElementById('noResults');
    if (nr) nr.style.display = visible === 0 ? 'block' : 'none';
  });
}

// Scroll Animations
const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('animate-in');
      observer.unobserve(e.target);
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.tool-card, .feature-card, .step, .faq-item').forEach(el => {
  observer.observe(el);
});

// ========================================
// TOOL PAGE FUNCTIONALITY
// ========================================

const uploadZone = document.getElementById('uploadZone');
const fileInput = document.getElementById('fileInput');
const fileList = document.getElementById('fileList');
const fileItems = document.getElementById('fileItems');
const processBtn = document.getElementById('processBtn');
const progressSection = document.getElementById('progressSection');
const progressBar = document.getElementById('progressBar');
const progressText = document.getElementById('progressText');
const downloadSection = document.getElementById('downloadSection');

let files = [];

if (uploadZone) {
  // Click to upload
  uploadZone.addEventListener('click', () => fileInput.click());

  // Drag & drop
  uploadZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    uploadZone.classList.add('dragover');
  });
  uploadZone.addEventListener('dragleave', () => {
    uploadZone.classList.remove('dragover');
  });
  uploadZone.addEventListener('drop', (e) => {
    e.preventDefault();
    uploadZone.classList.remove('dragover');
    addFiles(e.dataTransfer.files);
  });

  // File input change
  fileInput.addEventListener('change', () => {
    addFiles(fileInput.files);
    fileInput.value = '';
  });
}

function addFiles(newFiles) {
  for (const f of newFiles) {
    if (f.type === 'application/pdf' || f.name.endsWith('.pdf')) {
      files.push(f);
    }
  }
  renderFiles();
}

function renderFiles() {
  if (!fileItems) return;
  fileItems.innerHTML = '';
  files.forEach((f, i) => {
    const div = document.createElement('div');
    div.className = 'file-item';
    div.innerHTML = `
      <span class="file-icon">📄</span>
      <div class="file-info">
        <div class="file-name">${f.name}</div>
        <div class="file-size">${formatSize(f.size)}</div>
      </div>
      <button class="remove-file" onclick="removeFile(${i})">✕</button>
    `;
    fileItems.appendChild(div);
  });
  if (fileList) fileList.classList.toggle('active', files.length > 0);
}

function removeFile(i) {
  files.splice(i, 1);
  renderFiles();
}

function formatSize(bytes) {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / 1048576).toFixed(1) + ' MB';
}

// Process (Simulated)
if (processBtn) {
  processBtn.addEventListener('click', () => {
    if (files.length === 0) {
      alert('Please select at least one PDF file.');
      return;
    }
    startProcessing();
  });
}

function startProcessing() {
  if (progressSection) progressSection.classList.add('active');
  if (downloadSection) downloadSection.classList.remove('active');

  let pct = 0;
  const iv = setInterval(() => {
    pct += Math.random() * 12 + 3;
    if (pct >= 100) {
      pct = 100;
      clearInterval(iv);
      setTimeout(showDownload, 400);
    }
    if (progressBar) progressBar.style.width = pct + '%';
    if (progressText) progressText.textContent = `Processing... ${Math.round(pct)}%`;
  }, 200);
}

function showDownload() {
  if (progressSection) progressSection.classList.remove('active');
  if (downloadSection) downloadSection.classList.add('active');
}

function downloadFile() {
  // Simulated download
  const a = document.createElement('a');
  a.href = '#';
  a.download = 'processed.pdf';
  alert('This is a demo. In production, the processed file would download here.');
}

function resetTool() {
  files = [];
  renderFiles();
  if (downloadSection) downloadSection.classList.remove('active');
  if (progressSection) progressSection.classList.remove('active');
  if (progressBar) progressBar.style.width = '0%';
}

// FAQ Accordion
document.querySelectorAll('.faq-q').forEach(btn => {
  btn.addEventListener('click', () => {
    const item = btn.parentElement;
    const answer = item.querySelector('.faq-a');
    const isOpen = item.classList.contains('open');

    // Close all
    document.querySelectorAll('.faq-item').forEach(fi => {
      fi.classList.remove('open');
      fi.querySelector('.faq-a').style.maxHeight = null;
    });

    if (!isOpen) {
      item.classList.add('open');
      answer.style.maxHeight = answer.scrollHeight + 'px';
    }
  });
});

// Mobile menu (simple toggle)
const mobileBtn = document.getElementById('mobileMenuBtn');
const navLinks = document.querySelector('.nav-links');
if (mobileBtn && navLinks) {
  mobileBtn.addEventListener('click', () => {
    navLinks.style.display = navLinks.style.display === 'flex' ? 'none' : 'flex';
  });
}
