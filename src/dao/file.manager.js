import fileDirName from "../utils/fileDirName.js";
import * as fs from "fs";
const { __dirName } = new fileDirName(import.meta);

export class FileManager {
  constructor(path) {
    this.path = __dirName + path;
  }

  async getAll() {
    try {
      const entidades = await FileSystem.promises.readFile(this.path);
      return JSON.parse(entidades);
    } catch (e) {
      return [];
    }
  }

  async create(entity) {
    const allEntities = await this.getAll();
    const stringified = JSON.stringify([...allEntities, entity], null, 2)
    await fs.promises.writeFile(this.path, stringified);
    return entity;
  }
}
