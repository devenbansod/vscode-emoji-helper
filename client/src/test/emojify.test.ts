import * as assert from 'assert';
import { commands, window, Selection } from 'vscode';
import { getDocUri, activate, doc } from './helper';

export function getText(): string {
  return window.activeTextEditor.document.getText();
}

suite('Should emoify text emojis', () => {
	test('Emojifies selected text', async () => {
    const docUri = getDocUri('emojis-selectedtext.md');
    await activate(docUri);

    const editor = window.activeTextEditor;
    editor.selection = new Selection(
      doc.positionAt(13),
      doc.positionAt(19)
    );

    await commands.executeCommand('emoji-helper.convertSelectionToEmoji');
    assert.equal(await getText(), 'Hello world! 😃 😁');
  });

  test('Emojifies text emoji in the previous word', async () => {
    const docUri = getDocUri('emojis-previousword.md');
    await activate(docUri);

    const editor = window.activeTextEditor;
    editor.selection = new Selection(
      doc.positionAt(20),
      doc.positionAt(20)
    );
    await commands.executeCommand('emoji-helper.convertLastWordToEmoji');
    assert.equal(await getText(), 'Hello :-) world! 😁');
  });

  test('Emojifies all text emojis across the document', async () => {
    const docUri = getDocUri('emojis-document.md');
    await activate(docUri);

    await commands.executeCommand('emoji-helper.convertEmojisAcrossDocument');
    assert.equal(await getText(), 'Hello 😃 world! 😁');
  });
});
