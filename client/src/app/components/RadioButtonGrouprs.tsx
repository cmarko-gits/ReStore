import { FormControl, FormControlLabel, FormLabel, Radio, RadioGroup } from "@mui/material";

interface Props {
    options : any[];
    onChange : (event : any) => void;
    selectedValue : string
}

export default  function RadioButtonGroups({options , onChange , selectedValue} : Props){
    return(
        <FormControl component="fieldset" sx={{ mb: 3 }}>
        <FormLabel>Sort By</FormLabel>
        <RadioGroup onChange={onChange} value={selectedValue}>
            {options.map(({ value, label }) => (
                <FormControlLabel
                    key={value}
                    value={value}
                    control={<Radio />}
                    label={label}
                />
            ))}
        </RadioGroup>
    </FormControl>
    )
}