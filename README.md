<h1 style="text-align: center;">
wordlesolver
</h1>

*CLI tool for solving wordle riddles*

<img src="https://github.com/k0mmsussert0d/wordlesolver/raw/main/demo.gif" width=530 height=250 alt="Demo" />

## Usage
This tool comes without a dictionary file used as a source of possible solutions. It must be prepared first.

1. Clone the repository – `git clone https://github.com/k0mmsussert0d/wordlesolver`
2. Get the dictionary file (e.g. from [here](https://github.com/dwyl/english-words)). File must have **1** word per line. Save it as `wordlist` in the project directory.
3. *(Optional)* If the dictionary consists of words of all lengths, rename it to `wordlist_raw` and run `prepare_dictionary.sh` to copy only five-characters long words to `wordlist`.
4. Install the dependencies – `npm i`
5. Run the app – `node index.js`
6. *(Optional)* To use the app from any directory install it with `npm i -g`
