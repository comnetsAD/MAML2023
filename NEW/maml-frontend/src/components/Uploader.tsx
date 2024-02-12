import { Alert, AlertIcon, Spinner, useDisclosure } from "@chakra-ui/react";
import { faCloudArrowUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
import { CSSProperties, useState, useRef } from "react";
import styles from "@/styles/components/Uploader.module.css";
import { API } from "../utils/requests";
import { IUploadedImage } from "../utils/types";
import { useEffect } from "react";
import TokenManager from "@/utils/store/UserManager";

interface Props {
  style?: CSSProperties;
  onChange?: Function;
  initialImage?: IUploadedImage | null;
  carousel?: boolean;
}

export default function Uploader(props: Props) {
  const fileRef = useRef<HTMLInputElement>(null);

  const [uploadedImages, setUploadedImages] = useState<IUploadedImage[]>([]);
  const [uploading, setUploading] = useState<boolean>(false);

  useEffect(() => {
    if (props.initialImage) {
      setUploadedImages([props.initialImage]);

      if (props.onChange) {
        props.onChange({
          source: props.initialImage.source,
          thumbnail: props.initialImage.thumbnail,
        });
      }
    }
  }, []);

  const [alertMessage, setAlertMessage] = useState<string>("");
  const {
    isOpen: isAlertOpen,
    onOpen: onAlertOpen,
    onClose: onAlertClose,
  } = useDisclosure();

  const handleClick = async (e: any) => {
    if (!uploading) {
      if (fileRef.current) {
        fileRef.current.click();
      }
    }
  };

  const handleFileChange = async (e: any) => {
    setUploading(true);
    const target = (e.target as HTMLInputElement & EventTarget) || null;
    if (target && target.files) {
      const file = target.files[0];
      onAlertClose();

      const token = TokenManager.getToken();

      API.uploadImage(token, file)
        .then(async (res) => {
          if (res.success) {
            setUploadedImages([
              ...uploadedImages,
              {
                source: res.imageUrl,
                thumbnail: res.thumbnailUrl,
              },
            ]);

            if (props.onChange) {
              props.onChange({
                source: res.imageUrl,
                thumbnail: res.thumbnailUrl,
              });
            }

            setUploading(false);
          } else {
            setAlertMessage(res.message);
            onAlertOpen();
          }
        })
        .catch((err) => {
          setAlertMessage(err.message);
          onAlertOpen();
        });
    } else {
      setAlertMessage("File not found");
      onAlertOpen();
    }
  };

  return (
    <>
      <div
        className={styles.container}
        style={props.style || {}}
        onClick={handleClick}
      >
        <input
          ref={fileRef}
          type="file"
          style={{ display: "none" }}
          onChangeCapture={handleFileChange}
        />

        {uploading ? (
          <Spinner style={{ marginBottom: "1rem" }} />
        ) : (
          <FontAwesomeIcon icon={faCloudArrowUp} width={"50px"} />
        )}
        {uploading
          ? "Uploading"
          : uploadedImages.length > 0
          ? props.carousel
            ? "Click to Add Image"
            : "Click to Change Image"
          : "Click to Upload Image"}
      </div>
      {isAlertOpen ? (
        <Alert
          status="error"
          variant="left-accent"
          style={{ margin: "2rem 0 2rem 0" }}
        >
          <AlertIcon />
          {alertMessage}
        </Alert>
      ) : (
        <></>
      )}
      {uploadedImages.length > 0 ? (
        uploadedImages.map((image: IUploadedImage, index: number) => {
          return (
            <img
              key={index}
              src={uploadedImages[index].thumbnail}
              alt={"Your Image"}
              style={{
                display: "inline-block",
                border: "solid 1px #ccc",
                borderRadius: "5px",
                objectFit: "cover",
                margin: "1rem .5rem 1rem 0",
                width: "80px",
                height: "80px",
              }}
            />
          );
        })
      ) : (
        <div style={{ marginBottom: "1rem" }}></div>
      )}
    </>
  );
}
