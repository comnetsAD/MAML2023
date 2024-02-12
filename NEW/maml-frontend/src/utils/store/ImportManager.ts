class ImportManager {
  static async chooseFile(): Promise<string | null> {
    try {
      const fileInput = document.createElement("input");
      fileInput.type = "file";

      return new Promise((resolve, reject) => {
        fileInput.addEventListener("change", (event) => {
          const fileList = (event.target as HTMLInputElement).files;
          if (!fileList || fileList.length === 0) {
            reject(new Error("No file selected"));
            return;
          }

          const file = fileList[0];
          const reader = new FileReader();
          reader.onload = () => {
            try {
              const data = reader.result as string;
              resolve(data);
            } catch (error) {
              reject(error);
            }
          };
          reader.onerror = () => {
            reject(new Error("Error reading the file"));
          };
          reader.readAsText(file);
        });

        fileInput.click();
      });
    } catch (error) {
      console.error("Error importing data:", error);
      return null;
    }
  }

  static importData(data: string, callback: Function): void {
    if (data) {
      const lines = data.split("\n");
      const importedData = [];
      for (let line of lines) {
        try {
          importedData.push(JSON.parse(line));
        } catch (e) {
          console.log("Invalid JSON");
          break;
        }
      }
      callback(importedData);
    }
  }
}

export default ImportManager;
