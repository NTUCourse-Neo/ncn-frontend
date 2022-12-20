import {
  Modal,
  useDisclosure,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Box,
  Center,
  Flex,
  OrderedList,
  ListItem,
} from "@chakra-ui/react";
import { customScrollBarCss } from "styles/customScrollBar";
import { InfoOutlineIcon } from "@chakra-ui/icons";
import React from "react";

function UnorderedList(props: React.PropsWithChildren) {
  return (
    <ul
      style={{
        listStyle: "none",
        padding: "4px",
      }}
    >
      {props.children}
    </ul>
  );
}

function UnorderedListItem(props: React.PropsWithChildren) {
  return (
    <ListItem>
      <Flex>
        <Flex fontSize={"14px"} lineHeight="1.4">
          {"•"}
        </Flex>
        <Flex>{props.children}</Flex>
      </Flex>
    </ListItem>
  );
}

export default function InfoModal() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <>
      <Center onClick={onOpen}>
        <InfoOutlineIcon
          boxSize={"15px"}
          color={"#6F6F6F"}
          sx={{
            cursor: "pointer",
          }}
        />
      </Center>
      <Modal size="xl" isCentered isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent maxW="850px" overflowY="hidden" minH="65vh">
          <ModalHeader
            borderRadius="4px"
            sx={{
              shadow: "0px 32px 64px -12px rgba(85, 105, 135, 0.08)",
              color: "#2d2d2d",
              fontWeight: 400,
              fontSize: "16px",
              lineHeight: 1.4,
            }}
          >
            {"預選課表說明"}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody px={0}>
            <Box
              p={14}
              maxH="70vh"
              overflowY="scroll"
              sx={{
                fontSize: "14px",
                lineHeight: 1.4,
                letterSpacing: "-0.078px",
                color: "#2d2d2d",
              }}
              __css={customScrollBarCss}
            >
              <Flex>預選課表提供兩個功能：查看課表、排志願序。</Flex>
              <Flex color="transparent">{"---"}</Flex>
              <Box>
                共分成三個主要頁面：
                <OrderedList p={2} spacing={2}>
                  <ListItem>
                    首選課表：
                    <Box p={1}>
                      呈現該時段，志願序排序最前的課程。
                      <UnorderedList>
                        <UnorderedListItem>
                          課程卡片會顯示與該門課衝堂的課程數量。
                        </UnorderedListItem>
                        <UnorderedListItem>
                          若課程卡片上方有藍色橫條代表該堂課為必帶課程。{" "}
                        </UnorderedListItem>
                      </UnorderedList>
                    </Box>
                  </ListItem>
                  <ListItem>
                    <Box>
                      志願序排序
                      <ol
                        type="a"
                        style={{
                          paddingLeft: "16px",
                        }}
                      >
                        <ListItem>
                          <Box>
                            <Flex>志願序排序－全部排序：</Flex>
                            <Flex>
                              以清單式呈現四個領域（一般科目、國文、英外文、微積分）的整體志願序，在此操作整體課程志願序排序。
                            </Flex>
                            <UnorderedList>
                              <UnorderedListItem>
                                可藉由拖拉或手動輸入來更改志願序。
                              </UnorderedListItem>
                              <UnorderedListItem>
                                志願序若有變更，需點擊[儲存按鈕]儲存此變更；若跳出此頁面，且未點擊[儲存按鈕]，最後一次變更紀錄將被清除。
                              </UnorderedListItem>
                              <UnorderedListItem>
                                點擊[還原此次變更按鈕]將回到上一次儲存記錄
                              </UnorderedListItem>
                            </UnorderedList>
                          </Box>
                        </ListItem>
                        <ListItem>
                          <Box>
                            <Flex>志願序排序－節次排序：</Flex>
                            <Flex>
                              以課表形式呈現，並以節次為單位，呈現已加入的課程與衝堂數量。
                            </Flex>
                            <UnorderedList>
                              <UnorderedListItem>
                                此頁面針對衝堂的課程排列志願序，各節次的課程志願序互不影響。
                              </UnorderedListItem>
                              <UnorderedListItem>
                                志願序若有變更，需點擊[儲存按鈕]儲存此變更；若跳出此頁面，且未點擊[儲存按鈕]，最後一次變更紀錄將被清除。
                              </UnorderedListItem>
                            </UnorderedList>
                          </Box>
                        </ListItem>
                      </ol>
                    </Box>
                  </ListItem>
                </OrderedList>
              </Box>
            </Box>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}
