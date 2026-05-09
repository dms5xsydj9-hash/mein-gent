(function() {
  // Widget Container
  const container = document.createElement('div');
  container.id = 'lapizza-chat-widget';
  container.style.cssText = `
    position: fixed;
    bottom: 20px;
    right: 20px;
    z-index: 99999;
    font-family: Arial, sans-serif;
  `;

  // Chat Button
  const button = document.createElement('button');
  button.id = 'lapizza-chat-btn';
  button.innerHTML = '💬';
  button.style.cssText = `
    width: 60px;
    height: 60px;
    border-radius: 50%;
    background: #e8001c;
    border: none;
    cursor: pointer;
    font-size: 28px;
    box-shadow: 0 4px 20px rgba(232,0,28,0.4);
    transition: transform 0.2s;
  `;

  // Chat Iframe
  const iframe = document.createElement('iframe');
  iframe.src = 'https://mein-gent-production.up.railway.app';
  iframe.style.cssText = `
    display: none;
    width: 380px;
    height: 500px;
    border: none;
    border-radius: 20px;
    box-shadow: 0 10px 40px rgba(0,0,0,0.2);
    margin-bottom: 10px;
  `;

  // Toggle
  let open = false;
  button.onclick = function() {
    open = !open;
    iframe.style.display = open ? 'block' : 'none';
    button.innerHTML = open ? '✕' : '💬';
    button.style.transform = open ? 'rotate(0deg)' : '';
  };

  container.appendChild(iframe);
  container.appendChild(button);
  document.body.appendChild(container);
})();