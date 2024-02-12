import {
  Button,
  FormControl,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/react";

import { useRef, useState } from "react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  callback: (html: string) => void;
  isLoading: boolean;
}

export default function ImportFromURLModal(props: Props) {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <Modal onClose={props.onClose} isOpen={props.isOpen} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Enter URL to Convert and Import</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <span>
            Please make sure you add the full correct URL. After submitting it
            will take a few minutes to convert the page and import.
          </span>
          <FormControl>
            <input
              type="text"
              placeholder="Enter URL"
              ref={inputRef}
              style={{
                border: "solid 1px #ccc",
                width: "100%",
                marginTop: "10px",
                fontSize: "13px",
                padding: "5px",
              }}
            />
          </FormControl>
        </ModalBody>
        <ModalFooter>
          <Button
            color="white"
            _hover={{ bg: "secondary" }}
            bg={"primary"}
            isLoading={props.isLoading || false}
            loadingText="Importing, please wait..."
            onClick={() => {
              if (inputRef.current?.value === "") {
                alert("Please enter a URL");
                return;
              }

              props.callback(inputRef.current?.value || "");
            }}
          >
            Import
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
