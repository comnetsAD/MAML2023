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

import { LegacyRef, useRef, useState } from "react";
import { SketchPicker } from "react-color";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  callback: (formID: string, method: string, action: string) => void;
}

export default function FormModal(props: Props) {
  const idRef = useRef<HTMLInputElement>(null);
  const actionRef = useRef<HTMLInputElement>(null);
  const methodRef = useRef<HTMLInputElement>(null);

  return (
    <Modal onClose={props.onClose} isOpen={props.isOpen} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Enter Form ID</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormControl>
            <FormLabel>Form ID</FormLabel>
            <input
              type="text"
              ref={idRef}
              style={{ border: "solid 1px #ccc" }}
            />
          </FormControl>
          <FormControl mt={"1rem"}>
            <FormLabel>Method</FormLabel>
            <select
              ref={methodRef as unknown as LegacyRef<HTMLSelectElement>}
              style={{ border: "solid 1px #ccc" }}
            >
              <option value="POST" disabled>
                Select Method
              </option>
              <option value="GET">GET</option>
              <option value="POST">POST</option>
            </select>
          </FormControl>
          <FormControl mt={"1rem"}>
            <FormLabel>Action</FormLabel>
            <input
              type="text"
              ref={actionRef}
              style={{ border: "solid 1px #ccc" }}
              placeholder="URL"
            />
          </FormControl>
        </ModalBody>
        <ModalFooter>
          <Button
            color="white"
            _hover={{ bg: "secondary" }}
            bg={"primary"}
            onClick={() => {
              props.callback(
                idRef.current?.value || "",
                methodRef.current?.value || "",
                actionRef.current?.value || "",
              );
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
