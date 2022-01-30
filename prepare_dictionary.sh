#!/bin/bash

set -eax

DICT_FILE="./wordlist_raw"
OUT_FILE="./wordlist"
awk 'length($0) == 5 { print $0 }' "$DICT_FILE" > "$OUT_FILE"