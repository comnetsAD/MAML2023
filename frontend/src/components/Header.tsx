import Head from "next/head";
import {
  Avatar,
  Button,
  Flex,
  Switch,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import {
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuItemOption,
  MenuGroup,
  MenuOptionGroup,
  MenuDivider,
} from "@chakra-ui/react";
import { FaRegUserCircle } from "react-icons/fa";
import { IoIosSave, IoMdDownload } from "react-icons/io";
import { FaRegEye } from "react-icons/fa";

import GridLayout from "react-grid-layout";
import {
  ExportToMAML,
  downloadMAMLFile,
  generateMAMLString,
} from "@/utils/exportToMAML";
import TokenManager from "@/utils/store/UserManager";
import { useEffect, useState } from "react";
import ImportManager from "@/utils/store/ImportManager";
import SaveURLModal from "./modals/SaveURLModal";
import LoginModal from "./modals/LoginModal";
import ImportFromURLModal from "./modals/ImportFromURLModal";
import { API } from "@/utils/requests";
import { ChevronDownIcon } from "@chakra-ui/icons";
import { useRouter } from "next/router";

interface Props {
  showOptions: boolean;
  setShowOptions: Function;
  data: {
    layout: GridLayout.Layout[];
    props: any[];
  };
  mamlCode: string;
  handleImport: Function;
}

export default function Header(props: Props) {
  const [loggedIn, setLoggedIn] = useState(false);
  const [isImportLoading, setIsImportLoading] = useState(false);
  const router = useRouter();

  const [urlForPreview, setUrlForPreview] = useState("");

  const [saving, setSaving] = useState(false);

  const {
    isOpen: isLoginOpen,
    onOpen: onLoginOpen,
    onClose: onLoginClose,
  } = useDisclosure();

  const {
    isOpen: isSaveURLModalOpen,
    onOpen: onSaveURLModalOpen,
    onClose: onSaveURLModalClose,
  } = useDisclosure();

  const {
    isOpen: isImportURLOpen,
    onOpen: onImportURLOpen,
    onClose: onImportURLClose,
  } = useDisclosure();

  useEffect(() => {
    setLoggedIn(TokenManager.isLoggedIn());

    if (window && !TokenManager.isLoggedIn()) {
      onLoginOpen();
    }
  }, []);

  const saveToCloud = (url: string) => {
    setSaving(true);
    ExportToMAML(JSON.parse(JSON.stringify(props.data)), props.mamlCode, url)
      .then((res) => {
        if (res.success) {
          setUrlForPreview(url);
          API.getHTML(TokenManager.getToken(), url)
            .then((res) => {
              if (res.success) {
                // open to new tab
                window.open(
                  `/preview?htmlContent=${encodeURIComponent(res.html)}`,
                  "_blank",
                );
              }

              setSaving(false);
            })
            .catch((err) => {
              alert(err.response?.data?.message);
              setSaving(false);
            });
          onSaveURLModalClose();
        }
      })
      .catch((err) => {
        alert(err.response.data.message);
        setSaving(false);
        onSaveURLModalClose();
      });
  };

  return (
    <>
      <Head>
        <title>MAML Editor</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Flex
        p={".7rem 1rem"}
        direction="row"
        alignItems="center"
        justify="space-between"
        borderBottom="solid 2px #E9E9E9"
      >
        <Flex direction="row" alignItems="center" gap={"2rem"}>
          <img
            src="/maml-logo.svg"
            alt="MAML Logo"
            style={{ height: "40px", width: "auto" }}
          />
          {/* <HStack spacing="30px" paddingLeft={"2rem"}>
            <span>File</span>
            <span>View</span>
            <span>Help</span>
          </HStack> */}
          <div>
            <span style={{ marginRight: ".8rem" }}>Show Options</span>
            <Switch
              isChecked={props.showOptions}
              onChange={() => {
                props.setShowOptions(!props.showOptions);
              }}
              style={{ marginRight: "1rem" }}
            />

            <Menu>
              <MenuButton
                as={Button}
                rightIcon={<ChevronDownIcon />}
                size={"sm"}
              >
                Import
              </MenuButton>
              <MenuList zIndex={9999}>
                <MenuItem
                  onClick={() => {
                    ImportManager.chooseFile()
                      .then((data) => {
                        if (data)
                          ImportManager.importDataFromFile(
                            data,
                            props.handleImport,
                          );
                      })
                      .catch((err) => {
                        alert(err);
                      });
                  }}
                >
                  Import from File
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    onImportURLOpen();
                  }}
                >
                  Import from URL
                </MenuItem>
              </MenuList>
            </Menu>

            <ImportFromURLModal
              isLoading={isImportLoading}
              isOpen={isImportURLOpen}
              onClose={onImportURLClose}
              callback={(url: string) => {
                setIsImportLoading(true);
                API.getMAML(TokenManager.getToken(), url)
                  .then((res) => {
                    const data = res.data.split("\n");
                    const duration = data[1];

                    const fileURL =
                      process.env.NEXT_PUBLIC_API_URL +
                      "/public/output/" +
                      data[0];

                    API.downloadContent(fileURL).then((mamlData) => {
                      ImportManager.importDataFromURL(
                        mamlData.data,
                        duration,
                        props.handleImport,
                      );
                    });

                    setIsImportLoading(false);
                    onImportURLClose();
                    setUrlForPreview(url);
                  })
                  .catch((err) => {
                    alert(err.response.data.message);
                    setIsImportLoading(false);
                  });
              }}
            />
          </div>
        </Flex>

        <Flex gap={"1rem"}>
          <Button
            size={"sm"}
            padding={"0 1.2rem"}
            marginLeft={".5rem"}
            bg={"primary"}
            color={"white"}
            _hover={{ bg: "secondary" }}
            borderRadius={"30px"}
            leftIcon={<IoMdDownload width={"14px"} />}
            onClick={() => {
              downloadMAMLFile(
                generateMAMLString(
                  JSON.parse(JSON.stringify(props.data)),
                  props.mamlCode,
                ),
              );
            }}
          >
            Download Progress
          </Button>

          <Button
            isLoading={saving}
            loadingText="Saving"
            size={"sm"}
            padding={"0 1.2rem"}
            bg={"primary"}
            color={"white"}
            _hover={{ bg: "secondary" }}
            borderRadius={"30px"}
            leftIcon={<IoIosSave width={"14px"} />}
            onClick={() => {
              if (!urlForPreview) {
                onSaveURLModalOpen();
              } else {
                saveToCloud(urlForPreview);
              }
            }}
          >
            Save & Preview
          </Button>

          <SaveURLModal
            isOpen={isSaveURLModalOpen}
            onClose={onSaveURLModalClose}
            callback={(url: string) => {
              saveToCloud(url);
            }}
          />
          {loggedIn && (
            <Flex direction="row" alignItems="center">
              <Avatar
                size={"sm"}
                name={TokenManager.getEmail()}
                fontWeight={"bold"}
                backgroundColor={"#57068c"}
                marginRight={".5rem"}
              ></Avatar>
              <Text fontSize={"14px"}>{TokenManager.getEmail()}</Text>
            </Flex>
          )}

          {!loggedIn && (
            <Button
              size={"sm"}
              padding={"0 1.2rem"}
              color={"black"}
              leftIcon={<FaRegUserCircle />}
              onClick={() => {
                onLoginOpen();
              }}
            >
              Login
            </Button>
          )}
        </Flex>
      </Flex>

      <LoginModal
        isOpen={isLoginOpen}
        onClose={() => {
          router.reload();
        }}
        setLoggedIn={setLoggedIn}
      />
    </>
  );
}
