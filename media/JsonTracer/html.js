const html = function (styleUri, webview, scriptUri, nonce) {
  return `<!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width,initial-scale=1,shrink-to-fit=no">
          <meta name="theme-color" content="#000000">
          <title>json-tracer</title>
          <link rel="stylesheet" type="text/css" href="${styleUri}">
          <meta http-equiv="Content-Security-Policy" content="default-src ${webview.cspSource}; style-src ${webview.cspSource}; img-src ${webview.cspSource} https: http: data: blob:; script-src 'unsafe-inline' http: https:;">
        </head>
  
        <body>
          <noscript>You need to enable JavaScript to run this app.</noscript>
          <div id="root">
            <main>
              <nav>
                <div class="left-btns">
                  <button class="capture-btn">capture</button>
                  <button class="load-btn">Load</button>
                  <div class="file-name"></div>
                  <div class="set-data"></div>
                </div>
                <div class="right-btns">
                  <button class="zoom-in-btn" value="50">ZoomIn</button>
                  <button class="zoom-out-btn" value="-50">ZoomOut</button>
                  <input type="range" min="100" max="200" value="100">
                </div>
              </nav>
              <article class="dash-board">
                <div class="graph"></div>
              </article>
              <article class="detail-container">
                <header>
                  <span>Detail</span>
                </header>
                <section>
                  <div class="selected"></div>
                </section>
              </article>
            </main>
          </div>
          <script nonce="${nonce}" type="module" src="${scriptUri}"></script>
        </body>
        </html>`;
};

module.exports = html;