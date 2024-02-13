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
  callback: (start: number, end: number) => void;
}

interface Boundaries {
  start: number;
  end: number;
}

export default function TimerModal(props: Props) {
  const [startRef, endRef] = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ];
  const [boundaries, setBoundaries] = useState<Boundaries>({
    start: 0,
    end: 0,
  });

  return (
    <Modal onClose={props.onClose} isOpen={props.isOpen} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Set Properties</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormControl>
            <input
              type="number"
              ref={startRef}
              placeholder="Start eg: 0"
              style={{ border: "solid 1px #ccc" }}
            />
            <br />
            <br />
            <input
              type="number"
              ref={endRef}
              placeholder="End eg: 20"
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
              props.callback(
                parseInt(startRef.current?.value || "0"),
                parseInt(endRef.current?.value || "0"),
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
