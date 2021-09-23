import * as path from 'path';
import * as vscode from 'vscode';

export class Visualizer {
  /**
   * Track the currently panel. Only allow a single panel to exist at a time.
   */
  public static currentPanel: Visualizer|undefined;

  private static readonly viewType = 'Visualizer';

  private readonly _panel: vscode.WebviewPanel;
  private readonly _extensionPath: string;
  private _disposables: vscode.Disposable[] = [];

  public static createOrShow(extensionPath: string) {
    const column =
        vscode.window.activeTextEditor ? vscode.window.activeTextEditor.viewColumn : undefined;

    // If we already have a panel, show it.
    // Otherwise, create a new panel.
    if (Visualizer.currentPanel) {
      Visualizer.currentPanel._panel.reveal(column);
    } else {
      Visualizer.currentPanel = new Visualizer(extensionPath, column || vscode.ViewColumn.One);
    }
  }

  private constructor(extensionPath: string, column: vscode.ViewColumn) {
    this._extensionPath = extensionPath;

    // Create and show a new webview panel
    this._panel = vscode.window.createWebviewPanel(Visualizer.viewType, 'ONE vscode', column, {
      // Enable javascript in the webview
      enableScripts: true,

      // And restric the webview to only loading content from our extension's `media` directory.
      localResourceRoots: [vscode.Uri.file(this._extensionPath)]
    });

    // Set the webview's initial html content
    this._panel.webview.html = this._getHtmlForWebview();


    // Listen for when the panel is disposed
    // This happens when the user closes the panel or when the panel is closed programatically
    this._panel.onDidDispose(() => this.dispose(), null, this._disposables);

    // Handle messages from the webview
    this._panel.webview.onDidReceiveMessage(message => {
      switch (message.command) {
        case 'alert':
          vscode.window.showErrorMessage(message.text);
          return;
      }
    }, null, this._disposables);
  }

  public doRefactor() {
    // Send a message to the webview webview.
    // You can send any JSON serializable data.
    this._panel.webview.postMessage({command: 'refactor'});
  }

  public dispose() {
    Visualizer.currentPanel = undefined;

    // Clean up our resources
    this._panel.dispose();

    while (this._disposables.length) {
      const x = this._disposables.pop();
      if (x) {
        x.dispose();
      }
    }
  }

  private _getHtmlForWebview() {
    const scriptPathOnDisk = vscode.Uri.file(path.join(this._extensionPath, 'index.js'));
    const scriptUri = scriptPathOnDisk.with({scheme: 'vscode-resource'});
    const stylePathOnDisk = vscode.Uri.file(path.join(this._extensionPath, 'style.css'));
    const styleUri = stylePathOnDisk.with({scheme: 'vscode-resource'});

    // Use a nonce to whitelist which scripts can be run
    const nonce = getNonce();

    return `<!DOCTYPE html>
			<html lang="en">
			<head>
				<meta charset="utf-8">
				<meta name="viewport" content="width=device-width,initial-scale=1,shrink-to-fit=no">
				<meta name="theme-color" content="#000000">
				<title>React App</title>
				<link rel="stylesheet" type="text/css" href="${styleUri}">
				<meta http-equiv="Content-Security-Policy" content="default-src *; img-src vscode-webview: vscode-resource: https: data: http: blob:; script-src 'nonce-${
        nonce}';style-src vscode-resource: 'unsafe-inline' http: https: data:;">
        <base href="${vscode.Uri.file(this._extensionPath).with({
      scheme: 'vscode-resource'
    })}/">
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
  }
}

function getNonce() {
  let text = '';
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (let i = 0; i < 32; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}