class IDManager {
  static resetIDs() {
    sessionStorage.removeItem("ids");
  }
  
  static setIDs(ids: Record<string, string>) {
    sessionStorage.setItem("ids", JSON.stringify(ids));
  }

  static getIDs(): Record<string, string> {
    return JSON.parse(sessionStorage.getItem("ids") || "{}");
  }

  static addID(key: string, id: string) {
    if (!key || !id) return;
    const ids = IDManager.getIDs();
    if (!ids[key]) {
      ids[key] = id;
      IDManager.setIDs(ids);
    }
  }

  static removeID(key: string) {
    const ids = IDManager.getIDs();
    if (ids[key]) {
      delete ids[key];
      IDManager.setIDs(ids);
    }
  }
}

export default IDManager;
