import {
  createConnection,
  TextDocuments,
  ProposedFeatures,
  InitializeParams,
  CompletionItem,
  CompletionItemKind,
  TextDocumentPositionParams,
  TextDocumentSyncKind,
  InitializeResult,
  DocumentHighlightParams,
  DocumentHighlight,
  Range,
  Position,
  Command,
} from 'vscode-languageserver';

import {
  TextDocument
} from 'vscode-languageserver-textdocument';

import * as emojer from './emojer';

let connection = createConnection(ProposedFeatures.all);
let documents: TextDocuments<TextDocument> = new TextDocuments(TextDocument);

connection.onInitialize((params: InitializeParams) => {
  const result: InitializeResult = {
    capabilities: {
      textDocumentSync: TextDocumentSyncKind.Incremental,
      completionProvider: {
        resolveProvider: true,
      },
      documentHighlightProvider: true
    }
  };
  return result;
});

connection.onCompletion(
  (params: TextDocumentPositionParams): CompletionItem[] => {
    const document: TextDocument | undefined = documents.get(params.textDocument.uri);
    if (!document) {
      return [];
    }

    return emojer.getEmojiMappings()
      .map((emojiMapping, idx) => {
        return {
          sortText: idx.toString(),
          label: emojiMapping[0],
          command: Command.create('emojify', 'emoji-helper.convertLastWordToEmoji'),
          kind: CompletionItemKind.Constant,
          data: emojiMapping
        }
      });
  }
);

connection.onCompletionResolve(
  (item: CompletionItem): CompletionItem => {
    item.detail = item.data[0];
    item.documentation = item.data[1];

    return item;
  }
);

connection.onDocumentHighlight((params: DocumentHighlightParams): DocumentHighlight[] => {
  const document: TextDocument | undefined = documents.get(params.textDocument.uri);
  if (!document) {
    return [];
  }

  const queryStr = _getCurrentWord(document, document.offsetAt(params.position));

  let regex = new RegExp(`\\b${queryStr}\\b`, 'g'), result, indices = [];
  while ((result = regex.exec(document.getText()))) {
    indices.push(result.index);
  }

  return indices.map((index) => {
    const startPos = document.positionAt(index),
      endPos = document.positionAt(index + queryStr.length);

    return DocumentHighlight.create(
      Range.create(
        Position.create(startPos.line, startPos.character),
        Position.create(endPos.line, endPos.character)
      )
    );
  });
});

const _getCurrentWord = (document: TextDocument, offset: number) => {
  const spaces: string = ' \t\n\r"{[()]}:,;-=><.';

  let i = offset - 1;
  let text = document.getText();
  while (i >= 0 && spaces.indexOf(text.charAt(i)) === -1) {
    i--;
  }

  let j = offset;
  while (j < text.length && spaces.indexOf(text.charAt(j)) === -1) {
    j++;
  }
  return text.substring(i + 1, j).trim();
};

documents.listen(connection);
connection.listen();
