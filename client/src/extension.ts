import {
  commands,
  ExtensionContext,
  Range,
  window,
  Position,
} from 'vscode';

import {
  LanguageClient,
  LanguageClientOptions,
  ServerOptions,
  TransportKind
} from 'vscode-languageclient';

import * as path from 'path';
import * as emojer from './emojer';

const convertSelectionToEmoji = async () => {
  const editor = window.activeTextEditor;
  if (!editor) {
    return; // No open text editor
  }

  const selection = editor.selection;
  const text = editor.document.getText(selection);
  if (!text || text.length <= 0) {
    return; // no text selected
  }

  const newText = emojer.parse(text);
  await editor.edit((builder) => {
    builder.replace(selection, newText);
  });
};

const convertEmojisAcrossDocument = async () => {
  const editor = window.activeTextEditor;
  if (!editor) {
    return; // No open text editor
  }

  const document = editor.document;
  const fullText = document.getText();
  if (!fullText || fullText.length <= 0) {
    return; // no text found
  }

  const newText = emojer.parse(fullText);
  const all = new Range(
    document.positionAt(0),
    document.positionAt(document.getText().length)
  );
  await editor.edit(editBuilder =>
    editBuilder.replace(all, newText)
  );
};

const addPatternToIgnore = () => {
  const editor = window.activeTextEditor;
  if (!editor) {
    return; // No open text editor
  }

  const selection = editor.selection;
  const text = editor.document.getText(selection);
  if (!text || text.length <= 0) {
    return; // no text selected
  }

  emojer.disableEmojis([text]);
};

const convertLastWordToEmoji = async () => {
  const editor = window.activeTextEditor;
  if (!editor) {
    return; // No open text editor
  }

  const document = editor.document;
  const spaces: string = ' \t\n\r';

  if (editor.selection.isEmpty) {
    const cursorPosition = editor.selection.active;
    const { text } = document.lineAt(cursorPosition.line);

    let startOfWord = text.length - 1;
    while (startOfWord > 0 && spaces.indexOf(text.charAt(startOfWord)) === -1) {
      startOfWord--;
    }
    const range = new Range(new Position(cursorPosition.line, startOfWord), cursorPosition);
    const newText = emojer.parse(text.substring(startOfWord));

    await editor.edit((builder) => {
      builder.replace(range, newText);
    });
  }
}

let client: LanguageClient;

export function activate(context: ExtensionContext) {
  let serverModule = context.asAbsolutePath(
    path.join('server', 'out', 'server.js')
  );

  let debugOptions = { execArgv: ['--nolazy', '--inspect=6009'] };
  let serverOptions: ServerOptions = {
    run: { module: serverModule, transport: TransportKind.ipc },
    debug: {
      module: serverModule,
      transport: TransportKind.ipc,
      options: debugOptions
    }
  };

  let clientOptions: LanguageClientOptions = {
    documentSelector: [{ scheme: 'file', language: 'markdown' }],
  };

  client = new LanguageClient(
    'devenbansodbits.emoji-helper',
    'Language Server - emoji-helper',
    serverOptions,
    clientOptions
  );
  client.start();

  context.subscriptions.push(
    commands.registerCommand(
      'emoji-helper.convertSelectionToEmoji', convertSelectionToEmoji
    )
  );
  context.subscriptions.push(
    commands.registerCommand(
      'emoji-helper.convertEmojisAcrossDocument', convertEmojisAcrossDocument
    )
  );
  context.subscriptions.push(
    commands.registerCommand(
      'emoji-helper.addPatternToIgnore', addPatternToIgnore
    )
  );
  context.subscriptions.push(
    commands.registerCommand(
      'emoji-helper.convertLastWordToEmoji', convertLastWordToEmoji
    )
  );
}

export function deactivate(): Thenable<void> | undefined {
  if (!client) {
    return undefined;
  }
  return client.stop();
}
