import fs from 'fs';
import path from 'path';
import personalData from '../../data/personal.json';

let currentPersonalData = { ...personalData };

export const fetchPersonalProfile = async () => {
  return currentPersonalData;
};

export const updatePersonalProfileService = async (updateData: Partial<typeof personalData>) => {
  currentPersonalData = { ...currentPersonalData, ...updateData };
  try {
    const filePath = path.join(__dirname, '../../data/personal.json');
    fs.writeFileSync(filePath, JSON.stringify(currentPersonalData, null, 2), 'utf-8');
  } catch (err) {
    console.warn('Failed to write to personal.json disk:', err);
  }
  return currentPersonalData;
};
