import { read } from 'jimp';
import { resolve } from 'path';

export const hasAllProperties = (data: Record<string, unknown>) => {
  return Object.values(data).every(Boolean);
};

export const scaleImage = async (
  buffer,
  newName,
  scale = 120,
): Promise<string> => {
  const pathResolve = resolve(__dirname, '../../public/avatar', newName);
  // const path = `/public/avatar'/${newName}`;

  const image = await read(buffer);

  await image.scaleToFit(scale, scale).write(pathResolve);

  return `/avatar/${newName}`;
};
