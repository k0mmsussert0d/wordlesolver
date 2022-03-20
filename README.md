<h1 style="text-align: center;">
wordlesolver
</h1>

*CLI tool for solving wordle riddles*

![Demo animation](./demo.svg)

## Usage
1. Install the module – `npm install -g wordlesolver`
2. Run it providing path to the dictionary file as an argument – `wordlesolver /path/to/wordlist.txt`

**This tool comes without a dictionary file used as a source of possible solutions. It must be prepared first.**

## Preparing a dictionary file
1. Clone the repository – `git clone https://github.com/k0mmsussert0d/wordlesolver`
2. Get the dictionary file (e.g. from [here](https://github.com/dwyl/english-words), [here](https://github.com/jeremy-rifkin/Wordlist) or [here](http://www-personal.umich.edu/~jlawler/wordlist.html)). File **must** contain **1** word per line. Save it in the project directory under the name of choice, e.g. `wordlist_raw`.
3. If the dictionary consists of words of all lengths run `prepare_dictionary.sh wordlist_raw wordlist` to copy only five-characters long words to `wordlist` file.
4. Run the module providing path to the file with only 5-chars long word – `wordlesolver wordlist`
