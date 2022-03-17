#!/usr/bin/env node

import * as fs from 'fs';
import * as readline from 'node:readline';
import * as events from 'events';
import inquirer from 'inquirer';
import chalk from 'chalk';
import boxen from 'boxen';
import { program } from 'commander';

async function wordsFromFile(path, predicate) {
    const res = [];
    const rl = readline.createInterface({
        input: fs.createReadStream(path),
        crlfDelay: Infinity,
    });

    rl.on('line', line => {
        if (predicate(line)) {
            res.push(line);
        }
    });

    await events.once(rl, 'close');
    return res;
}

function printWord(input, word, mask) {
    const yellows = word.split('').filter((_, idx) => mask[idx] === 'y').map(ch => ch.toUpperCase());
    return input.toUpperCase().split('').map((ch, idx) => {
        if (mask[idx] === 'g') {
            if (input[idx] !== word[idx]) {
                return chalk.bgRed(ch);
            } else {
                return chalk.bgGreen(ch);
            }
        } else if (yellows.includes(ch)) {
            return chalk.bgYellowBright(ch);
        } else {
            return ch;
        }
    }).join('');
}


function printMask(mask) {
    const c = chalk.black;
    return mask.split('').map(ch => {
        switch (ch.toLowerCase()) {
            case 'n':
                return c.bgGray('N');
            case 'g':
                return c.bgGreen('G');
            case 'y':
                return c.bgYellowBright('Y');
            default:
                return c.bgRed(ch.toUpperCase());
        }
    }).join('');
}

const MASK_QUERY = {
    type: 'input',
    name: 'mask',
    message: `Enter the mask (${chalk.green('G')} for ${chalk.green('green')}, ${chalk.yellowBright('Y')} for ${chalk.yellowBright('yellow')}, ${chalk.gray('N')} for ${chalk.gray('gray')})`,
    validate: i => /^[GNY]{5}$/i.test(i) || 'Illegal characters in the mask or length. Provide five characters: [G,N,Y].',
    transformer: printMask,
    filter: i => i.toLowerCase(),
};

function ask(word, mask) {
    return inquirer.prompt([
        {
            type: 'input',
            name: 'word',
            message: 'Enter first word',
            validate: i => i.length === 5 || 'Word must be 5 characters long',
            transformer: i => printWord(i, word, mask),
            filter: i => i.toLowerCase(),
        },
        MASK_QUERY,
    ]);
}

function askWithList(options) {
    return inquirer.prompt([
        {
            type: 'list',
            name: 'word',
            message: `Choose the next word (found: ${options.length})`,
            choices: options,
            filter: i => i.toLowerCase(),
        },
        MASK_QUERY,
    ]);
}

function convertToPredicate(word, mask, prev) {
    const GREEN = (idx, ch) => w => w.charAt(idx) === ch;
    const YELLOW = (idx, ch) => w => w.includes(ch) && w.charAt(idx) !== ch;
    const GRAY = ch => w => !w.includes(ch);
    const res = prev ? [prev] : [];
    for (let i = 0; i < 5; i++) {
        switch (mask.charAt(i)) {
            case 'n':
                res.push(GRAY(word[i]));
                break;
            case 'g':
                res.push(GREEN(i, word[i]));
                break;
            case 'y':
                res.push(YELLOW(i, word[i]));
                break;
        }
    }

    return input => res.every(f => f(input));
}

async function main() {
    let path;
    program
        .argument('<path_to_dictionary>', 'p')
        .action(pathToDictionary => {
            path = pathToDictionary;
        });
    program.parse();

    let { word, mask } = await ask('_____', 'NNNNN');
    let pred = convertToPredicate(word, mask);
    let matches = await wordsFromFile(path, pred);

    while (matches.length > 1) {
        ({ word, mask } = await askWithList(matches.map(m => {
            return {
                name: printWord(m, word, mask),
                value: m,
            };
        })));
        pred = convertToPredicate(word, mask, pred);
        matches = matches.filter(pred);
    }

    if (matches.length === 1) {
        console.log(boxen(chalk.bgGreen.black(matches[0].toUpperCase()), { padding: 1, title: chalk.green('Found match 🎉') }));
    } else {
        console.error(boxen(chalk.bgRed.black('Match not found 😢'), { padding: 1 }));
    }
}

await main();
