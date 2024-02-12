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

import { useRef, useState } from "react";
import { SketchPicker } from "react-color";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  callback: (value: string, color: string) => void;
}

export default function ShapeSelectorModal(props: Props) {
  const shapeRef = useRef<HTMLSelectElement>(null);
  const [color, setColor] = useState<string>("#000");

  return (
    <Modal onClose={props.onClose} isOpen={props.isOpen} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Select Shape Properties</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormControl>
            <FormLabel>Shape</FormLabel>
            <select
              ref={shapeRef}
              style={{
                border: "solid 1px #ccc",
              }}
            >
              <option value="ellipse">Ellipse</option>
              <option value="rect">Rectangle</option>
            </select>
          </FormControl>

          <FormControl style={{ marginTop: "2rem" }}>
            <FormLabel>Color</FormLabel>
            <SketchPicker
              color={color}
              onChange={(color: { hex: string }) => setColor(color.hex)}
            />
          </FormControl>
        </ModalBody>
        <ModalFooter>
          <Button
            color="white"
            _hover={{ bg: "secondary" }}
            bg={"primary"}
            onClick={() => {
              props.callback(shapeRef.current?.value || "rect", color);
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
