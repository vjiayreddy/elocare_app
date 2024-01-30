import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  FormLabel,
  IconButton,
  Typography,
  styled,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import FormTextInputField from "@/components/common/form-fields/form-text-input/FormTextInput";
import { useForm } from "react-hook-form";
import { useUpdatePatientVitalActivityMutation } from "@/redux/api/clinicialApi";
import LoadingButtonComponent from "@/components/common/buttons/loading-button/LoadingButton";
import { toast } from "react-toastify";
import _ from "lodash";

const StyledVitalDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiButtonBase-root": {
    borderRadius: 5,
  },
  "& .MuiTypography-subtitle1": {
    fontSize: 22,
    [theme.breakpoints.only("xs")]: {
      fontSize: 20,
    },
  },
  "& .__close_icon": {
    position: "absolute",
    top: 10,
    right: 10,
  },
}));

interface ConformationDialogProps {
  open: boolean;
  handleOnClose: () => void;
  vitalData: any;
  id:string;
}

const VitalWeightForm = ({
  id,
  open,
  vitalData,
  handleOnClose,
}: ConformationDialogProps) => {
  const { control, handleSubmit, reset } = useForm();
  const [updatePatientVitalActivity, { isLoading }] =
    useUpdatePatientVitalActivityMutation();

  // handle on submit
  const onSubmit = (data: any) => {
    if (!isLoading) {
      updatePatientVitalActivity({
        _id: id as string,
        payload: {
          weight: {
            value: data?.weight,
            unit: "lbs",
          },
        },
      })
        .then((response) => {
          handleOnClose();
        })
        .catch((error: any) => {
          toast.error(error?.message);
        });
    }
  };

  useEffect(() => {
    if (!_.isEmpty(vitalData)) {
      const _lastItem = vitalData[vitalData?.length - 1];
      reset({
        weight: _lastItem?.value,
      });
    }
  }, [vitalData]);

  return (
    <StyledVitalDialog open={open} maxWidth="xs">
      <Box
        sx={{
          backgroundSize: "contain",
          backgroundPosition: "top center",
          backgroundRepeat: "no-repeat",
          backgroundImage: `url(/images/pattern.svg)`,
          position: "relative",
        }}
      >
        <DialogTitle id="alert-dialog-title">
          <Grid container>
            <Grid item xs>
              <Box mb={2} sx={{ textAlign: "center" }}>
                <img width={60} alt="weight-icon" src="/vitals/v2/weight.svg" />
                <Typography variant="h6">Weight</Typography>
              </Box>
            </Grid>
          </Grid>
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={1}>
            <Grid item xs={12}>
              <FormLabel>Enter the patient’s weight (lbs)</FormLabel>
            </Grid>
            <Grid item xs={12}>
              <FormTextInputField
                control={control}
                name="weight"
                label=""
                defaultValue=""
                rules={{
                  required: "Please fill out this field",
                }}
                textFieldProps={{
                  fullWidth: true,
                  type: "number",
                  InputProps: {
                    endAdornment: <span>lbs</span>,
                  },
                }}
              />
            </Grid>
          </Grid>

          <Grid mt={2} container spacing={1}>
            <Grid item xs={6}>
              <Button
                onClick={handleOnClose}
                variant="outlined"
                color="inherit"
              >
                No
              </Button>
            </Grid>
            <Grid item xs={6}>
              <LoadingButtonComponent
                showLoading={isLoading}
                onClick={handleSubmit(onSubmit)}
                variant="contained"
              >
                Yes
              </LoadingButtonComponent>
            </Grid>
          </Grid>
        </DialogContent>

        <Box component="div" className="__close_icon">
          <IconButton onClick={handleOnClose}>
            <img alt="weight-icon" src="/icons/close.svg" />
          </IconButton>
        </Box>
      </Box>
    </StyledVitalDialog>
  );
};

export default VitalWeightForm;
