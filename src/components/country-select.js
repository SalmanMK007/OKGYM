import { MenuItem, Select } from '@mui/material';
import { useMemo } from 'react';
import countryList from 'react-select-country-list';

export default function CountrySelect(props) {
    const { value, onChange, name } = props;
    const options = useMemo(() => countryList().getData(), []);

    return (
        <Select
            onChange={onChange}
            value={value}
            label={countryList().getLabel(value)}
            name={name}
            variant="standard"
            sx={{
                fontSize: "1.3rem",
                width: "50%",
            }}
            style={{ textTransform: "none",}}
        >
            {options.map(({ value, label }) => (
                <MenuItem key={value} value={value}>{label}</MenuItem>
            ))}
        </Select>
    );
}
