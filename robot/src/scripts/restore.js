const fs = require("fs");
const path = require("path");

const serializedVehiclesPath = path.resolve(__dirname, "..", "..", "files", "validated-vehicles.json");
const exportedVehiclesPath = path.resolve(__dirname, "..", "..", "files", "vehicles.txt");

try {
  if (!fs.existsSync(exportedVehiclesPath))
    throw new Error("");
} catch (err) {
  console.log(`❌ Você precisa ter o arquivo "${exportedVehiclesPath}" pra importar :/`)

  return;
}

fs.promises.readFile(exportedVehiclesPath).then(buffer => {
  const formattedExportedVehicles = buffer.toString();

  const exportedVehicles = formattedExportedVehicles
    .split('\n').map(p => {
      const [placa, modelo] = p.split(' - ');

      return {
        placa,
        modelo
      };
    });

  try {
    if (!fs.existsSync(serializedVehiclesPath))
      throw new Error("");
  } catch (err) {
    fs.appendFileSync(serializedVehiclesPath, "[]");
  }

  const inTimeSavedVehicles = JSON.parse(
    String(fs.readFileSync(serializedVehiclesPath))
  );

  const newSavedVehiclesSinceLastRestore = inTimeSavedVehicles.filter(
    vehicleFromJson => !exportedVehicles.some(
      exportedVehicle => exportedVehicle.placa === vehicleFromJson.placa
    )
  );

  exportedVehicles.push(...newSavedVehiclesSinceLastRestore);

  fs.writeFileSync(
    serializedVehiclesPath,
    JSON.stringify(exportedVehicles, null, 2),
  );

  console.log("😃 Done!");
})
