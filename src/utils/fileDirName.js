import { dirname } from "path";
import { fileURLToPath } from "url";

export default function fileDirName(meta) {
  const __fileName = fileURLToPath(meta.url);
  const __dirname = dirname(__fileName);
  return { __dirname, __fileName };
}
