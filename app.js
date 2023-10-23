const fs = require("fs");
const path = require("path");
const os = require("os");
const csv = require("csv-writer").createObjectCsvWriter;

// Check if a file path is provided as a command-line argument
if (process.argv.length < 3) {
  console.error('Please provide the path to a "package-lock.json" file.');
  process.exit(1); // Exit with an error code
}

// Get the file path from the command-line arguments
const filePath = process.argv[2];

// Check if the file exists
if (!fs.existsSync(filePath)) {
  console.error(`The file "${filePath}" does not exist.`);
  process.exit(1); // Exit with an error code
}

// Read the content of the "package-lock.json" file
fs.readFile(filePath, "utf8", (err, data) => {
  if (err) {
    console.error(`Error reading the file: ${err}`);
    process.exit(1); // Exit with an error code
  }

  try {
    const packageLockData = JSON.parse(data);

    // Access the packages section in the "package-lock.json" file
    const packages = packageLockData.packages;

    // Create an array to store package data
    const packageData = [];

    // Determine the service name (package name) based on the first package
    const serviceName = packageLockData.name.includes("/")
      ? packageLockData.name.split("/").pop()
      : packageLockData.name;

    // Iterate through the packages and extract package names and versions
    for (const packageName in packages) {
      if (packages.hasOwnProperty(packageName)) {
        const packagePath = packageName.split("/");
        const packageNameOnly = packagePath[packagePath.length - 1];
        const packageVersion = packages[packageName].version;
        const packageLink = packages[packageName].resolved;
        packageData.push({
          Software: packageNameOnly,
          Link: packageLink,
          "XC Version": packageVersion,
          "UC Version": packageVersion,
          Service: serviceName,
        });
      }
    }

    // Define the path to the CSV file in the user's home directory
    const csvFilePath = path.join(os.tmpdir(), `${serviceName}.csv`);

    // Create a CSV writer and write the package data to the file
    const csvWriter = csv({
      path: csvFilePath,
      header: [
        { id: "Software", title: "Software" },
        { id: "Link", title: "Link" },
        { id: "XC Version", title: "XC Version" },
        { id: "UC Version", title: "UC Version" },
        { id: "Service", title: "Service" },
      ],
    });

    csvWriter
      .writeRecords(packageData)
      .then(() => {
        // Create a folder in the user's home directory
        const folderName = "package-data";
        const folderPath = path.join(os.homedir(), folderName);

        fs.mkdirSync(folderPath, { recursive: true });

        // Move the CSV file to the created folder
        const newCsvFilePath = path.join(folderPath, `${serviceName}.csv`);
        fs.renameSync(csvFilePath, newCsvFilePath);
        console.log(`CSV file written to ${newCsvFilePath}`);
      })
      .catch((writeError) => {
        console.error(`Error writing CSV data: ${writeError}`);
      });
  } catch (parseError) {
    console.error(`Error parsing the JSON data: ${parseError}`);
    process.exit(1); // Exit with an error code
  }
});
