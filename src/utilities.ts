import { ITreeNode } from "./types";
import { MOCK_FILE_SYSTEM } from "./data/mockData";

export async function getFolders(): Promise<Awaited<ITreeNode[]>> {
  return Promise.resolve(MOCK_FILE_SYSTEM);
}
