import fs from 'fs/promises';

export const parseJSON = async <T>(filePath: string): Promise<T[]> => {
  try {
    const data = await fs.readFile(filePath, 'utf-8');
    const parsed = JSON.parse(data);
    if (Array.isArray(parsed)) return parsed;
    if (parsed && Array.isArray(parsed.employees)) return parsed.employees;
    if (parsed && Array.isArray(parsed.data)) return parsed.data;
    return [parsed] as any;
  } catch (error) {
    throw new Error('Failed to parse JSON file');
  }
};
