import {
  Button,
  FormControl,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/react";

import { useRef, useState } from "react";
import { SketchPicker } from "react-color";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  callback: (videoURL: string, autoplay: boolean) => void;
}

export default function VideoURLModal(props: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [autoplay, setAutoplay] = useState<boolean>(false);

  return (
    <Modal onClose={props.onClose} isOpen={props.isOpen} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Enter Video URL</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormControl>
            <input
              type="text"
              ref={inputRef}
              style={{ border: "solid 1px #ccc" }}
            />
            <br />
            <br />
            <input
              type="checkbox"
              checked={autoplay}
              onChange={() => setAutoplay(!autoplay)}
              style={{ marginRight: "1rem" }}
            />
            Autoplay
          </FormControl>
        </ModalBody>
        <ModalFooter>
          <Button
            color="white"
            _hover={{ bg: "secondary" }}
            bg={"primary"}
            onClick={() => {
              props.callback(inputRef.current?.value || "", autoplay);
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
