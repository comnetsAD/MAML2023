import axios from "axios";

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
}
