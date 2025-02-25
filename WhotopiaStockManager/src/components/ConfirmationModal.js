import React from "react";

import {
  Box,
  Button,
  ButtonStrip,
  Modal,
  ModalActions,
  ModalContent,
  ModalTitle,
} from "@dhis2/ui";

export function ConfirmationModal(props) {
  return (
    <div>
      <Modal fluid>
        <ModalTitle>{props.title}</ModalTitle>
        <ModalContent>
          <Box height="50px" width="500px">
            <p>{props.message}</p>
          </Box>
        </ModalContent>
        <ModalActions>
          <ButtonStrip end>
            <Button
              Primary
              onClick={() => {
                props.setShowModal(false);
                props.sendOrder(props.setOrderComplete);
              }}
            >
              Confirm
            </Button>
            <Button basic onClick={() => props.setShowModal(false)}>
              Close
            </Button>
          </ButtonStrip>
        </ModalActions>
      </Modal>
    </div>
  );
}
