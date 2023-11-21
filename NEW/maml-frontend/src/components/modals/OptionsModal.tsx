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

import { useEffect, useRef, useState } from "react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  callback: (elementID: string, link: string) => void;
  elementID: string;
  link: string;
}

export default function OptionsModal(props: Props) {
  const [elementID, setElementID] = useState<string>("");
  const [link, setLink] = useState<string>("");

  useEffect(() => {
    setElementID(props.elementID);
  }, [props.elementID]);

  useEffect(() => {
    setLink(props.link);
  }, [props.link]);

  return (
    <Modal onClose={props.onClose} isOpen={props.isOpen} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Add Properties</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormControl>
            <input
              type="text"
              placeholder="Element ID"
              value={elementID}
              onChange={(e) => setElementID(e.target.value)}
              style={{ border: "solid 1px #ccc" }}
            />
            <br /> <br />
            <input
              type="text"
              placeholder="Redirect Link"
              value={link}
              onChange={(e) => setLink(e.target.value)}
              style={{ border: "solid 1px #ccc" }}
            />
          </FormControl>
        </ModalBody>
        <ModalFooter>
          <Button
            color="white"
            _hover={{ bg: "secondary" }}
            bg={"primary"}
            onClick={() => {
              props.callback(elementID, link);
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
