const navigationLinks = [...document.querySelectorAll('.contents a')];
const sections = navigationLinks.map(link => document.querySelector(link.getAttribute('href'))).filter(Boolean);

function updateActiveSection() {
  const marker = window.innerHeight * 0.28;
  let active = sections[0];
  for (const section of sections) {
    if (section.getBoundingClientRect().top <= marker) active = section;
  }
  for (const link of navigationLinks) {
    if (link.getAttribute('href') === `#${active?.id}`) link.setAttribute('aria-current', 'location');
    else link.removeAttribute('aria-current');
  }
}

let framePending = false;
window.addEventListener('scroll', () => {
  if (framePending) return;
  framePending = true;
  window.requestAnimationFrame(() => {
    updateActiveSection();
    framePending = false;
  });
}, { passive: true });
window.addEventListener('resize', updateActiveSection);
updateActiveSection();

for (const button of document.querySelectorAll('[data-copy]')) {
  button.addEventListener('click', async () => {
    const status = document.getElementById('copy-status');
    try {
      await navigator.clipboard.writeText(button.dataset.copy);
      button.textContent = '已复制';
      status.textContent = '运行命令已复制到剪贴板。';
      window.setTimeout(() => { button.textContent = '复制命令'; }, 1800);
    } catch {
      status.textContent = '无法访问剪贴板，请选中命令手动复制。';
      button.textContent = '请手动复制';
    }
  });
}
