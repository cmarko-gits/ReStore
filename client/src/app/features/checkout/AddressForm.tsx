import { Typography, Grid } from "@mui/material";
import { useFormContext } from "react-hook-form";
import AppTextInput from "../../components/AppTextInput";
import AppCheckBox from "../../components/AppCheckBox";

export default function AddressForm() {
  const { control , formState } = useFormContext();

  return (
    <>
      <Typography variant="h6" gutterBottom>
        Shipping address
      </Typography>
      <Grid container spacing={3}>
        {/* Checkbox is below all the fields, on the left */}
       
        {/* Address fields */}
        <Grid item xs={12}>
          <AppTextInput control={control} name="fullName" label="Full Name" />
        </Grid>
        <Grid item xs={12}>
          <AppTextInput control={control} name="address1" label="Address 1" />
        </Grid>
        <Grid item xs={12}>
          <AppTextInput control={control} name="address2" label="Address 2" />
        </Grid>

        {/* City before Country */}
   
        {/* State and Zip */}
        <Grid item xs={12} sm={6}>
          <AppTextInput control={control} name="state" label="State" />
        </Grid>
        <Grid item xs={12} sm={6}>
          <AppTextInput control={control} name="zip" label="Zip" />
        </Grid>
        <Grid item xs={12} sm={6}>
          <AppTextInput control={control} name="city" label="City" />
        </Grid>

        {/* Country moved to the end */}
        <Grid item xs={12} sm={6}>
          <AppTextInput control={control} name="country" label="Country" />
        </Grid>

         <Grid item xs={4}>
          <AppCheckBox 
              name="saveAddress"
               label="Save this as the default address"
                control={control} 
                disabled={!formState.isDirty} />
        </Grid>


      </Grid>
    </>
  );
}
