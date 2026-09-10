import { parse } from 'csv-parse/sync';
import fs from 'fs';
import path from 'path';

 
/**
 * readCsv — reads a CSV file relative to src/ and parses it into an
 * array of typed row objects. Keeps CSV-parsing logic out of spec
 * files entirely; a test just calls readCsv<RowType>('data/x.csv')
 * and gets back ready-to-use objects.
 *
 * `columns: true` uses the CSV's header row as object keys, so
 * `firstName,lastName` becomes { firstName: '...', lastName: '...' }
 * automatically — no manual column-index mapping.
 */ 

export function readCsv<T>(relativePath: string): T[] {
  const filePath = path.resolve(__dirname, '..', relativePath);
  const content = fs.readFileSync(filePath, 'utf-8');
  return parse(content, {
    columns: true,
    skip_empty_lines: true,
  }) as T[];
}