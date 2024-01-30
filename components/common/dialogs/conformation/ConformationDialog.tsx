import React from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography,
  styled,
} from "@mui/material";
import Grid from "@mui/material/Grid";

const StyledConformationDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiButtonBase-root": {
    borderRadius: 5,
  },
  "& .MuiTypography-subtitle1": {
    fontSize: 22,
    [theme.breakpoints.only("xs")]: {
      fontSize: 20,
    },
  },
}));

interface ConformationDialogProps {
  open:boolean;
  handleOnClickNext: () => void;
  handleOnCancel: () => void;
  handleOnClose: () => void;
}

const ConformationDialog = ({
  open,
  handleOnCancel,
  handleOnClickNext,
  handleOnClose,
}: ConformationDialogProps) => {
  return (
    <StyledConformationDialog open={open} maxWidth="xs">
      <DialogTitle id="alert-dialog-title">
        <Grid container>
          <Grid item xs>
            <img alt="close-icon" src="/icons/circie_check.svg" />
          </Grid>
          <Grid item>
            <IconButton onClick={handleOnClose} >
              <img alt="close-icon" src="/icons/close.svg" />
            </IconButton>
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="subtitle1">
            Are you ready to start today’s visit?
          </Typography>
        </Grid>
      </DialogTitle>
      <DialogContent>
        If the patient has arrived at the clinic and you are ready to start for
        today’s visit, click “Yes”.
      </DialogContent>
      <DialogActions>
        <Grid container spacing={1}>
          <Grid item xs={6}>
            <Button onClick={handleOnCancel} variant="outlined" color="inherit">
              No
            </Button>
          </Grid>
          <Grid item xs={6}>
            <Button onClick={handleOnClickNext} variant="contained">Yes</Button>
          </Grid>
        </Grid>
      </DialogActions>
    </StyledConformationDialog>
  );
};

export default ConformationDialog;
