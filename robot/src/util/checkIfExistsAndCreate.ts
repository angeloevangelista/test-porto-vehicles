import fs from "fs";

export function checkIfExistsAndCreate(path: string, defaultValue: Object) {
  try {
    if (!fs.existsSync(path))
      throw new Error();
  } catch (err) {
    fs.appendFileSync(path, JSON.stringify(defaultValue, null, 2));
  }
}
