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

for (const [index, pre] of [...document.querySelectorAll('.guide-document pre')].entries()) {
  const code = pre.querySelector('code');
  if (!code) continue;
  const wrapper = document.createElement('div');
  wrapper.className = 'command';
  const header = document.createElement('div');
  header.className = 'command-header';
  const label = document.createElement('span');
  const language = code.className.replace('language-', '');
  label.textContent = ({ python: 'Python', matlab: 'MATLAB', sh: 'Shell', text: '文本' })[language] || '代码';
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'copy-button';
  button.textContent = '复制代码';
  button.dataset.copy = code.textContent;
  button.dataset.copyLabel = '复制代码';
  button.setAttribute('aria-label', `复制第 ${index + 1} 段代码`);
  header.append(label, button);
  pre.before(wrapper);
  wrapper.append(header, pre);
}

for (const button of document.querySelectorAll('[data-copy]')) {
  button.addEventListener('click', async () => {
    const status = document.getElementById('copy-status');
    try {
      await navigator.clipboard.writeText(button.dataset.copy);
      button.textContent = '已复制';
      status.textContent = '内容已复制到剪贴板。';
      window.setTimeout(() => { button.textContent = button.dataset.copyLabel || '复制命令'; }, 1800);
    } catch {
      status.textContent = '无法访问剪贴板，请选中命令手动复制。';
      button.textContent = '请手动复制';
    }
  });
}
