import { randomInt } from "crypto";
import { CHARACTERS } from "../constants/index.js";

export const randomCharacter = (length: number): string => {
  let referenceNumber = "";
  for (let i = 0; i < length; i++) {
    const index = randomInt(0, CHARACTERS.length);
    referenceNumber += CHARACTERS[index];
  }
  return referenceNumber;
};

export const generateReferenceNumber = (): string => {
  return `C4U-${randomCharacter(8)}`;
};
