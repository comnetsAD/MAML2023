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
  callback: (url: string) => void;
}

export default function SaveURLModal(props: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [saving, setSaving] = useState(false);

  return (
    <Modal onClose={props.onClose} isOpen={props.isOpen} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Enter assigned URL of the Page</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <span>
            Please make sure you add the full correct URL assigned to you.
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
            isLoading={saving}
            loadingText="Saving"
            color="white"
            _hover={{ bg: "secondary" }}
            bg={"primary"}
            onClick={() => {
              if (inputRef.current?.value === "") {
                alert("Please enter a URL");
                return;
              }

              setSaving(true);
              props.callback(inputRef.current?.value || "");
            }}
          >
            Save
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
