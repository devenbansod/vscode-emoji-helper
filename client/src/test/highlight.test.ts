/* --------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */

import * as vscode from 'vscode';
import * as assert from 'assert';
import { getDocUri, activate } from './helper';

suite('Should do the highlighting', () => {
	const docUri = getDocUri('highlight.md');

	test('Highlights all instances of the selected word', async () => {
		await testHighlight(docUri, [
			{ range: toRange(0, 0, 0, 3) },
			{ range: toRange(0, 14, 0, 17) },
			{ range: toRange(1, 16, 1, 19) }
		]);
	});
});

function toRange(sLine: number, sChar: number, eLine: number, eChar: number) {
	const start = new vscode.Position(sLine, sChar);
	const end = new vscode.Position(eLine, eChar);
	return new vscode.Range(start, end);
}

async function testHighlight(docUri: vscode.Uri, expectedHighlights: vscode.DocumentHighlight[]) {
	await activate(docUri);

	const actualSelections = (await vscode.commands.executeCommand(
		'vscode.executeDocumentHighlights',
		docUri,
		new vscode.Position(0, 0)
	  )) as vscode.DocumentHighlight[];

	assert.equal(actualSelections.length, expectedHighlights.length);

	expectedHighlights.forEach((expectedHighlight, i) => {
		const actualSelection = actualSelections[i];
		assert.deepEqual(actualSelection.range, expectedHighlight.range);
	});
}