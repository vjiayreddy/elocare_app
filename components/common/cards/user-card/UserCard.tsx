import React from "react";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import {
  CardContent,
  Typography,
  styled,
  Grid,
  Button,
  Badge,
} from "@mui/material";
import { APP_COLORS } from "@/theme/colors/colors";
import Avatar from "@mui/material/Avatar";
import moment from "moment";

interface UserCardComponentProps {
  updatedAt: string;
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  onSelect: (id: string) => void;
}

const StyledCard = styled(Card)(({ theme }) => ({
  width: "100%",
  padding: 0,
  height: "100%",
  "& .MuiCardHeader-root": {
    padding: 8,
    backgroundColor: APP_COLORS.DISABLED_BTN_COLOR,
    "& .MuiTypography-body1": {
      fontWeight: 600,
    },
    "& .MuiTypography-body2": {
      fontSize: 14,
    },
  },
  "& .MuiCardContent-root": {
    padding: 8,
  },
}));

const UserCardComponent = ({
  updatedAt,
  _id,
  firstName,
  lastName,
  onSelect,
  email,
}: UserCardComponentProps) => {
  return (
    <StyledCard>
      <CardHeader
        title={
          <Typography textAlign="center" variant="body1">
            {firstName} {lastName}
          </Typography>
        }
        subheader={
          <Typography textAlign="center" variant="body2">
            {email}
          </Typography>
        }
      />
      <CardContent>
        <Grid container alignItems="center">
          <Grid
            container
            item
            xs={6}
            direction="column"
            alignItems="center"
            justifyContent="center"
          >
            <Grid item>
              <Badge
                overlap="circular"
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                badgeContent={
                  <img alt="verified" src="/icons/verifiedtick.svg" />
                }
              >
                <Avatar
                  alt="Remy Sharp"
                  src="/static/images/avatar/1.jpg"
                  sx={{ width: 56, height: 56 }}
                />
              </Badge>
            </Grid>
          </Grid>
          <Grid
            container
            item
            xs={6}
            direction="column"
            alignItems="center"
            justifyContent="center"
            rowSpacing={1}
          >
            <Grid item>
              <Typography textAlign="center" variant="body2">
                Last Updated
              </Typography>
              <Typography
                sx={{ display: "block", fontWeight: 600 }}
                textAlign="center"
                variant="caption"
              >
                {moment(new Date(updatedAt)).format('MM/DD/YYYY')}
              </Typography>
            </Grid>
            <Grid item>
              <Button size="small" onClick={() => {
                onSelect(_id);
              }}>Select</Button>
            </Grid>
          </Grid>
        </Grid>
      </CardContent>
    </StyledCard>
  );
};

export default UserCardComponent;
