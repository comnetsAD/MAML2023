import { API } from "@/utils/requests";
import TokenManager from "@/utils/store/UserManager";
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
import { GoogleLogin } from "@react-oauth/google";
import { useRouter } from "next/router";

import { useRef, useState } from "react";
import { SketchPicker } from "react-color";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  setLoggedIn: Function;
}

export default function VideoURLModal(props: Props) {
  const router = useRouter();

  return (
    <Modal isOpen={props.isOpen} onClose={props.onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Login or Signup with Google</ModalHeader>
        <ModalBody style={{ marginBottom: "2rem" }}>
          <p style={{ paddingBottom: "2rem" }}>
            You will need to sign in with Google to submit your work for
            evaluation.
          </p>
          <GoogleLogin
            onSuccess={(data: any) => {
              const credential = data.credential;
              API.login(credential)
                .then((res) => {
                  if (res.success) {
                    if (typeof window !== "undefined") {
                      TokenManager.setToken(res.jwt, res.email);
                    }
                    props.setLoggedIn(true);
                    props.onClose();
                    router.push("/", undefined, { shallow: true });
                  }
                })
                .catch((err) => {
                  alert(err.response.data.message);
                });
            }}
          />
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
