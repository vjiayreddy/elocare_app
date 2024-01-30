import React, { Fragment, useEffect, useState } from "react";
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
import FormAutoCompleteInputFiled from "@/components/common/form-fields/form-auto-complete/FormAutoComplete";
import { SYMPTOMS } from "@/utils/constants";
import { useUpdatePatientVitalActivityMutation } from "@/redux/api/clinicialApi";
import { toast } from "react-toastify";
import _ from "lodash";
import LoadingButtonComponent from "@/components/common/buttons/loading-button/LoadingButton";

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

interface VitalSymptomFormProps {
  open: boolean;
  handleOnClose: () => void;
  vitalData: any;
  id: string;
}

const VitalSymptomForm = ({
  open,
  handleOnClose,
  vitalData,
  id,
}: VitalSymptomFormProps) => {
  const { control, handleSubmit, reset } = useForm();
  const [showNotes, setShowNotes] = useState<boolean>(false);
  const [updatePatientVitalActivity, { isLoading }] =
    useUpdatePatientVitalActivityMutation();

  useEffect(() => {
    if (!_.isEmpty(vitalData)) {
      const _lastItem = vitalData[vitalData?.length - 1];
      const _find = _.find(_lastItem?.value, (item) => item === "Other");
      reset({
        symptoms: _lastItem?.value?.map((v: string) => {
          return {
            label: v,
          };
        }),
        note: _lastItem?.note,
      });
      if(_find){
        setShowNotes(true)
      }
    }
  }, [vitalData]);

  const onSubmit = (data: any) => {
    if (!isLoading) {
      updatePatientVitalActivity({
        _id: id as string,
        payload: {
          symptoms: {
            value: data?.symptoms?.map((v: any) => v?.label),
            note: data?.note,
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
                <img
                  width={60}
                  alt="blood-preasure-icon"
                  src="/vitals/v2/sympotms.svg"
                />
                <Typography variant="h6">Symptoms</Typography>
              </Box>
            </Grid>
          </Grid>
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={1}>
            <Grid item xs={12}>
              <FormLabel>Choose the patient’s symptoms</FormLabel>
            </Grid>
            <Grid item xs={12}>
              <FormAutoCompleteInputFiled
                options={SYMPTOMS || []}
                rules={{
                  required: "Select atleast one",
                }}
                isEqualValue="label"
                id="symptoms-input"
                targetValue="label"
                optionTargetValue=""
                control={control}
                name="symptoms"
                multiple={true}
                defaultValues={[]}
                onChange={(data) => {
                  const _find = _.find(data, (item) => item?.label === "Other");
                  if (_find) {
                    setShowNotes(true);
                  }
                }}
              />
            </Grid>
            {showNotes && (
              <Fragment>
                <Grid item xs={12}>
                  <FormLabel>Enter patient’s symptoms</FormLabel>
                </Grid>
                <Grid item xs={12}>
                  <FormTextInputField
                    control={control}
                    name="note"
                    label=""
                    defaultValue=""
                    rules={{
                      required: true,
                    }}
                    textFieldProps={{
                      fullWidth: true,
                      multiline: true,
                      type: "text",
                      rows: 2,
                    }}
                  />
                </Grid>
              </Fragment>
            )}
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
            <img alt="close-icon" src="/icons/close.svg" />
          </IconButton>
        </Box>
      </Box>
    </StyledVitalDialog>
  );
};

export default VitalSymptomForm;
