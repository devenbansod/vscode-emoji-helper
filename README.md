# emoji-helper

A Visual Studio Code extension that helps autocomplete emojis and turns text emojis into real emojis!

**Right now, enabled to work with Markdown files only**

## How to install

Easiest route would be through the ways suggested on the [Visual Studio Marketplace](https://marketplace.visualstudio.com/items?itemName=devenbansodbits.emoji-helper).

## How to use

### Autocomplete Emojis

- In a markdown document, if you want to type an emoji, press `Ctrl` + `Space` and you should see a list of emojis that you can use. Selecting anyone from the hover will add it to the document at the current cursor location.

![Demo](https://raw.githubusercontent.com/devenbansod/vscode-emoji-helper/master/demo/autocomplete.gif)

**Other functionalities are duplicated from [vscode-emojifier](https://github.com/devenbansod/vscode-emojifier)**

### Convert in selected text

- Select the text which you want to turn to emojis
- Right click and select 'Convert to Emoji'
- If the selected text consists of any emoji patterns, they will be replaced with their equivalent emojis.

![Demo](https://raw.githubusercontent.com/devenbansod/vscode-emoji-helper/master/demo/changeSelection.gif)


### Convert across the document

- Right click and select 'Convert Emojis across document'
- If the text in the document consists of any emoji patterns, they will be replaced with their equivalent emojis.

![Demo](https://raw.githubusercontent.com/devenbansod/vscode-emoji-helper/master/demo/changeAcrossDocument.gif)

### Add ignore patterns

- If you want to specifically ignore some patterns (for ex. ':/' *without quotes*), select one such pattern
- Right click and select 'Ignore pattern for Emojis'
- This will disable this pattern to be matched for emojis for this VS Code session

![Demo](https://raw.githubusercontent.com/devenbansod/vscode-emoji-helper/master/demo/addIgnorePattern.gif)


