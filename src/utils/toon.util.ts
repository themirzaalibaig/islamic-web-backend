/**
 * TOON (Token-Oriented Object Notation) Utility
 * Converts JSON to TOON format for token optimization
 * Reference: https://toonformat.dev/
 */

/**
 * Serialize data to JSON first, then convert to TOON format
 * @param data - Any data structure to convert
 * @returns TOON formatted string
 */
export function toToon(data: any): string {
  // First serialize to JSON to ensure proper structure
  const jsonString = JSON.stringify(data);
  const jsonData = JSON.parse(jsonString);

  // Convert to TOON format
  return convertToToon(jsonData, 0);
}

/**
 * Internal function to convert JSON object to TOON format
 */
function convertToToon(value: any, indent: number = 0): string {
  const indentStr = '  '.repeat(indent);

  if (value === null) {
    return 'null';
  }

  if (value === undefined) {
    return 'undefined';
  }

  if (typeof value === 'string') {
    // Only quote if necessary (contains spaces, special chars, or is empty)
    if (value === '' || /[\s{}\[\]:,=]/.test(value) || value.match(/^\d/)) {
      return JSON.stringify(value);
    }
    return value;
  }

  if (typeof value === 'number' || typeof value === 'boolean') {
    return String(value);
  }

  if (Array.isArray(value)) {
    if (value.length === 0) {
      return '[]';
    }

    // Check if array contains uniform objects (tabular format)
    if (isUniformObjectArray(value)) {
      return formatTabularArray(value, indent);
    }

    // Regular array format
    const items = value.map((item) => {
      const itemStr = convertToToon(item, indent + 1);
      return `${indentStr}  ${itemStr}`;
    });

    return `[\n${items.join('\n')}\n${indentStr}]`;
  }

  if (typeof value === 'object') {
    const entries = Object.entries(value);
    if (entries.length === 0) {
      return '{}';
    }

    const lines = entries.map(([key, val]) => {
      const keyStr = needsQuoting(key) ? JSON.stringify(key) : key;
      const valStr = convertToToon(val, indent + 1);

      // For nested objects/arrays, put value on new line
      if (typeof val === 'object' && val !== null) {
        return `${indentStr}${keyStr}:\n${valStr}`;
      }

      return `${indentStr}${keyStr}: ${valStr}`;
    });

    return lines.join('\n');
  }

  return String(value);
}

/**
 * Check if array contains uniform objects (same keys)
 */
function isUniformObjectArray(arr: any[]): boolean {
  if (arr.length === 0 || typeof arr[0] !== 'object' || arr[0] === null || Array.isArray(arr[0])) {
    return false;
  }

  const firstKeys = Object.keys(arr[0]).sort();
  return arr.every((item) => {
    if (typeof item !== 'object' || item === null || Array.isArray(item)) {
      return false;
    }
    const itemKeys = Object.keys(item).sort();
    return JSON.stringify(firstKeys) === JSON.stringify(itemKeys);
  });
}

/**
 * Format uniform object array as tabular TOON format
 */
function formatTabularArray(arr: any[], indent: number): string {
  if (arr.length === 0) {
    return '[]';
  }

  const indentStr = '  '.repeat(indent);
  const fields = Object.keys(arr[0]);
  //   const fieldCount = fields.length;

  // Header: {fields} [N]
  const header = `${indentStr}{${fields.join(' ')}} [${arr.length}]`;

  // Rows: values separated by spaces
  const rows = arr.map((item) => {
    const values = fields.map((field) => {
      const val = item[field];
      if (val === null || val === undefined) {
        return '-';
      }
      if (typeof val === 'string') {
        // Escape spaces and special chars
        return needsQuoting(val) ? JSON.stringify(val) : val;
      }
      return String(val);
    });
    return `${indentStr}  ${values.join(' ')}`;
  });

  return `${header}\n${rows.join('\n')}`;
}

/**
 * Check if a string needs quoting in TOON format
 */
function needsQuoting(str: string): boolean {
  return (
    str === '' ||
    /[\s{}\[\]:,=]/.test(str) ||
    /^\d/.test(str) ||
    str === 'null' ||
    str === 'true' ||
    str === 'false' ||
    str === 'undefined'
  );
}

/**
 * Convert TOON back to JSON (for parsing responses if needed)
 * Note: This is a basic implementation. Full TOON parser would be more complex.
 */
export function fromToon(toonString: string): any {
  // For now, return the string as-is since we're primarily using TOON for output
  // A full TOON parser would be needed for round-trip conversion
  try {
    // Try to parse as JSON first (fallback)
    return JSON.parse(toonString);
  } catch {
    // If not valid JSON, return as string
    return toonString;
  }
}
