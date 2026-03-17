/**
 * Generic row transformers between snake_case (DB) and camelCase (TypeScript).
 */

export function snakeToCamel(str: string): string {
  return str.replace(/_([a-z])/g, (_, c) => c.toUpperCase());
}

export function camelToSnake(str: string): string {
  return str.replace(/[A-Z]/g, (c) => `_${c.toLowerCase()}`);
}

/** Convert a DB row (snake_case keys) to a camelCase object. */
// eslint-disable-next-line @typescript-eslint/no-unnecessary-type-constraint
export function rowToCamel<T>(row: Record<string, unknown>): T {
  const result: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(row)) {
    result[snakeToCamel(key)] = value;
  }
  return result as T;
}

/** Convert a camelCase object to snake_case keys for DB insertion. */
export function camelToRow(obj: Record<string, unknown>): Record<string, unknown> {
  const result: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(obj)) {
    if (value !== undefined) {
      result[camelToSnake(key)] = value;
    }
  }
  return result;
}

/** Convert an array of DB rows to camelCase objects. */
export function rowsToCamel<T>(rows: Record<string, unknown>[]): T[] {
  return rows.map((row) => rowToCamel<T>(row));
}
