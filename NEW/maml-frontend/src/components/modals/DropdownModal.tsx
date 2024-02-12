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
  callback: (options: string[]) => void;
}

export default function DropdownModal(props: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [options, setOptions] = useState<string[]>([]);

  useEffect(() => {
    setOptions([]);
  }, [props.callback]);

  return (
    <Modal onClose={props.onClose} isOpen={props.isOpen} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Add Dropdown Items</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormControl>
            <FormLabel>Resulting Dropdown</FormLabel>
            <select style={{ border: "solid 1px #ccc", minWidth: "200px" }}>
              {options.map((option) => {
                return (
                  <option key={option} value={option}>
                    {option}
                  </option>
                );
              })}
            </select>
          </FormControl>

          <FormControl style={{ marginTop: "2rem" }}>
            <FormLabel>Add Items</FormLabel>
            <input
              type="text"
              ref={inputRef}
              style={{ border: "solid 1px #ccc" }}
            />
            <Button
              size={"sm"}
              marginLeft={"1rem"}
              onClick={() => {
                setOptions([...options, inputRef.current?.value || "empty"]);
              }}
            >
              Add
            </Button>
          </FormControl>
        </ModalBody>
        <ModalFooter>
          <Button
            color="white"
            _hover={{ bg: "secondary" }}
            bg={"primary"}
            onClick={() => {
              props.callback(options);
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
