#!/bin/bash

set -ea

DICT_FILE="$1"
OUT_FILE="$2"
awk 'length($0) == 5 { print $0 }' "$DICT_FILE" > "$OUT_FILE"

INPUT_WC=$(wc -l "$DICT_FILE")
OUTPUT_WC=$(wc -l "$OUT_FILE")

echo "$INPUT_WC > $OUTPUT_WC"