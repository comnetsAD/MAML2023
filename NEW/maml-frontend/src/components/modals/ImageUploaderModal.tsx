import {
  Button,
  FormControl,
  FormLabel,
  InputGroup,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/react";
import Uploader from "../Uploader";
import { IUploadedImage } from "@/utils/types";
import { useState } from "react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  callback: (images: IUploadedImage[]) => void;
  carousel?: boolean;
}

export default function ImageUploaderModal(props: Props) {
  const [images, setImages] = useState<IUploadedImage[]>([]);

  const imagesHandler = (image: IUploadedImage) => {
    if (!props.carousel) setImages([image]);
    else setImages([...images, image]);
  };

  return (
    <Modal onClose={props.onClose} isOpen={props.isOpen} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Upload Image{props.carousel ? "s" : ""}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Uploader onChange={imagesHandler} carousel={props.carousel} />
        </ModalBody>
        <ModalFooter>
          <Button
            color="white"
            _hover={{ bg: "secondary" }}
            bg={"primary"}
            onClick={() => {
              if (props.carousel) {
                props.callback(images);
              } else {
                props.callback([images[0]]);
              }
              props.onClose();
            }}
          >
            Done
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
