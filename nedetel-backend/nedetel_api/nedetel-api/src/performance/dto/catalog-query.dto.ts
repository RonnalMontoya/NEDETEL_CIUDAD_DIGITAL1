export type IncludeOption = 'category' | 'items' | 'items.product';

export type CatalogQuery = {
  limit?: string;
  offset?: string;
  include?: string;
};

export function parsePagination(query: CatalogQuery): {
  limit: number;
  offset: number;
} {
  const parsedLimit = Number(query.limit ?? 10);
  const parsedOffset = Number(query.offset ?? 0);

  if (!Number.isInteger(parsedLimit) || parsedLimit < 1 || parsedLimit > 100) {
    throw new Error('limit debe ser un entero entre 1 y 100');
  }

  if (!Number.isInteger(parsedOffset) || parsedOffset < 0) {
    throw new Error('offset debe ser un entero mayor o igual a 0');
  }

  return { limit: parsedLimit, offset: parsedOffset };
}

export function parseInclude(raw?: string): Set<IncludeOption> {
  if (!raw) {
    return new Set();
  }

  const values = raw
    .split(',')
    .map(value => value.trim())
    .filter(Boolean);

  const allowed: IncludeOption[] = ['category', 'items', 'items.product'];
  const output = new Set<IncludeOption>();

  for (const value of values) {
    if (!allowed.includes(value as IncludeOption)) {
      throw new Error(`include invalido: ${value}`);
    }
    output.add(value as IncludeOption);
  }

  return output;
}
