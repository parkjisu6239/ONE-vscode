import * as vscode from 'vscode';

export class JsonTracer {
  /**
   * Track the currently panel. Only allow a single panel to exist at a time.
   */
  public static currentPanel: JsonTracer | undefined;

  private static readonly viewType = 'JsonTracer';

  private readonly _panel: vscode.WebviewPanel;
	private readonly _extensionUri: vscode.Uri;
	private _disposables: vscode.Disposable[] = [];

  public static createOrShow(extensionUri: vscode.Uri) {
    const column = vscode.window.activeTextEditor
			? vscode.window.activeTextEditor.viewColumn
			: undefined;

    // If we already have a panel, show it.
		if (JsonTracer.currentPanel) {
			JsonTracer.currentPanel._panel.reveal(column);
			return;
		}

    // Otherwise, create a new panel.
		const panel = vscode.window.createWebviewPanel(
			JsonTracer.viewType,
			'JsonTracer',
			column || vscode.ViewColumn.One,
			getWebviewOptions(extensionUri),
		);

    JsonTracer.currentPanel = new JsonTracer(panel, extensionUri);
  }

  public static revive(panel: vscode.WebviewPanel, extensionUri: vscode.Uri) {
		JsonTracer.currentPanel = new JsonTracer(panel, extensionUri);
	}

  private constructor(panel: vscode.WebviewPanel, extensionUri: vscode.Uri) {
    this._panel = panel;
		this._extensionUri = extensionUri;

    // Set the webview's initial html content
		this._update();
    
    // Listen for when the panel is disposed
		// This happens when the user closes the panel or when the panel is closed programmatically
		this._panel.onDidDispose(() => this.dispose(), null, this._disposables);

    // Update the content based on view changes
		this._panel.onDidChangeViewState(
			e => {
				if (this._panel.visible) {
					this._update();
				}
			},
			null,
			this._disposables
		);

		// Handle messages from the webview
		this._panel.webview.onDidReceiveMessage(
			message => {
				switch (message.command) {
					case 'alert':
						vscode.window.showErrorMessage(message.text);
						return;
				}
			},
			null,
			this._disposables
		);
  }

  public doRefactor() {
		// Send a message to the webview webview.
		// You can send any JSON serializable data.
		this._panel.webview.postMessage({ command: 'refactor' });
	}

  public dispose() {
		JsonTracer.currentPanel = undefined;

		// Clean up our resources
		this._panel.dispose();

		while (this._disposables.length) {
			const x = this._disposables.pop();
			if (x) {
				x.dispose();
			}
		}
	}

  private _update() {
		const webview = this._panel.webview;
		this._panel.title = 'json tracer';
		this._panel.webview.html = this._getHtmlForWebview(webview);
		return;
	}

  private _getHtmlForWebview(webview: vscode.Webview) {
    const scriptPathOnDisk = vscode.Uri.joinPath(this._extensionUri,'media/JsonTracer','index.js');
    const scriptUri = scriptPathOnDisk.with({scheme: 'vscode-resource'});
    const stylePathOnDisk = vscode.Uri.joinPath(this._extensionUri,'media/JsonTracer','style.css');
    const styleUri = stylePathOnDisk.with({scheme: 'vscode-resource'});

    // Use a nonce to whitelist which scripts can be run
    const nonce = getNonce();

		// import html
		const html = require('../media/JsonTracer/html');
    return html(styleUri, webview, scriptUri, nonce);
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

function getWebviewOptions(extensionUri: vscode.Uri): vscode.WebviewOptions {
	return {
		// Enable javascript in the webview
		enableScripts: true,

		// And restrict the webview to only loading content from our extension's `'media/JsonTracer` directories.
		localResourceRoots: [vscode.Uri.joinPath(extensionUri, 'media/JsonTracer')]
	};
}