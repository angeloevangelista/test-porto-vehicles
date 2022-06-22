const fs = require("fs");
const path = require("path");

const validatedVehiclesPath = path.resolve(__dirname, "..", "..", "files", "validated-vehicles.json");
const exportedVehiclesPath = path.resolve(__dirname, "..", "..", "files", "vehicles.txt");
const insertVehiclesPath = path.resolve(__dirname, "..", "..", "files", "insert-vehicles.sql");

fs.promises.readFile(validatedVehiclesPath).then(buffer => {
  const validatedVehicles = JSON.parse(buffer.toString());

  const vehiclesToExport = validatedVehicles
    .map(p => `${p.placa} - ${p.modelo}`)
    .reduce((acc, next) => ([...acc, ...[acc.includes(next) ? [] : next]]), [])
    .join('\n');

  const vehiclesToExportInsert =
    'INSERT INTO vehicles (placa, modelo, usado) VALUES' +
    validatedVehicles
      .map(p => `('${p.placa}', '${p.modelo}', false)`)
      .reduce((acc, next) => ([...acc, ...[acc.includes(next) ? [] : next]]), [])
      .join(',\n');

  try {
    if (fs.existsSync(exportedVehiclesPath))
      fs.unlink(exportedVehiclesPath)
  } catch (err) {
    fs.appendFileSync(exportedVehiclesPath, "[]");
  }

  fs.writeFileSync(
    exportedVehiclesPath,
    vehiclesToExport
  );

  try {
    if (fs.existsSync(insertVehiclesPath))
      fs.unlink(insertVehiclesPath)
  } catch (err) {
    fs.appendFileSync(insertVehiclesPath, "");
  }

  fs.writeFileSync(
    insertVehiclesPath,
    vehiclesToExportInsert
  );

  console.log("😃 Done!");
})
