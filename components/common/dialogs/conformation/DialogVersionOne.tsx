import React from "react";
import Dialog, { DialogProps } from "@mui/material/Dialog";
import { SxProps, styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import { AiOutlineClose } from "react-icons/ai";

const StyledDialogModelConetent = styled(Box)(() => ({
  minHeight: "100vh",
  position: "relative",
  display: "flex",
  flexDirection: "column",
  "& .__close_icon_wrapper": {
    position: "absolute",
    top: 10,
    right: 10,
  },
}));

interface DialogVersionOneComponentProps extends DialogProps {
  children: React.ReactNode;
  showCloseButton?: boolean;
  closeBtnSxProps?: SxProps;
  onClickCloseButton?: () => void;
}

const DialogVersionOneComponent = ({
  children,
  showCloseButton,
  onClickCloseButton,
  closeBtnSxProps,
  ...props
}: DialogVersionOneComponentProps) => {
  return (
    <Dialog {...props}>
      <StyledDialogModelConetent>
        {showCloseButton && (
          <Box
            sx={closeBtnSxProps}
            component="div"
            className="__close_icon_wrapper"
          >
            <IconButton
              onClick={onClickCloseButton}
              sx={{ padding: 0 }}
              size="medium"
            >
              <AiOutlineClose />
            </IconButton>
          </Box>
        )}

        {children}
      </StyledDialogModelConetent>
    </Dialog>
  );
};

export default DialogVersionOneComponent;
