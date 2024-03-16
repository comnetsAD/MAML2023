import axios from "axios";
axios.defaults.timeout = 300000;

export class API {
  public static uploadImage = async (token: string, file: File) => {
    const formData = new FormData();
    formData.append("file", file);

    return await axios({
      method: "POST",
      url: `${process.env.NEXT_PUBLIC_API_URL}/upload/image`,
      data: formData,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }).then((res) => res.data);
  };

  public static login = async (token: string) => {
    return await axios({
      method: "POST",
      url: `${process.env.NEXT_PUBLIC_API_URL}/users/login`,
      data: {
        credential: token,
      },
    }).then((res) => res.data);
  };

  public static saveMAML = async (
    token: string,
    url: string,
    mamlFile: File,
    translateDuration: number,
  ) => {
    const formData = new FormData();
    formData.append('url', url);
    formData.append('mamlFileContent', mamlFile);
    formData.append('translateDuration', translateDuration.toString());

    return await axios({
      method: "POST",
      url: `${process.env.NEXT_PUBLIC_API_URL}/pages/save`,
      data: formData,
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      },
    }).then((res) => res.data);
  };

  public static getMAML = async (token: string, url: string) => {
    return await axios({
      method: "POST",
      url: `${process.env.NEXT_PUBLIC_API_URL}/system/getMAML`,
      data: {
        url,
      },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }).then((res) => res.data);
  };

  public static getHTML = async (token: string, url: string) => {
    return await axios({
      method: "POST",
      url: `${process.env.NEXT_PUBLIC_API_URL}/system/getHTML`,
      data: {
        url,
      },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }).then((res) => res.data);
  };

  public static test = async () => {
    return await axios({
      method: "GET",
      url: `http://20.46.146.110:3000`,
    }).then((res) => res.data);
  }
}
