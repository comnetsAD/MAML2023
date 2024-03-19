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

          // extension should be .maml
          if (fileList[0].name.split(".").pop() !== "maml") {
            reject(new Error("Invalid file type"));
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

  static importDataFromFile(data: string, callback: Function): void {
    if (data) {
      const received = data.split("\n");

      const importedData = [];
      for (let line of received) {
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

  static importDataFromURL(data: string, duration: string, callback: Function): void {
    if (data) {
      const received = data.split("\n");
      const lines = received.slice(0, -2);

      sessionStorage.setItem(
        "translateDuration",
        received[received.length - 1],
      );

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
