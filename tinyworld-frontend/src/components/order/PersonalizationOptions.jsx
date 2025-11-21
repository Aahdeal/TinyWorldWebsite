import React from 'react';
import { FormControl, FormLabel, RadioGroup, FormControlLabel, Radio, TextField, Box } from '@mui/material';
import { PERSONALIZATION_TYPES } from '../../utils/constants';

const PersonalizationOptions = ({ value, personalizationValue, onChange }) => {
  return (
    <Box>
      <FormControl component="fieldset">
        <FormLabel component="legend">Personalization</FormLabel>
        <RadioGroup
          row
          value={value}
          onChange={(e) => onChange(e.target.value, personalizationValue)}
        >
          {PERSONALIZATION_TYPES.map((type) => (
            <FormControlLabel
              key={type.value}
              value={type.value}
              control={<Radio />}
              label={`${type.label}${type.price > 0 ? ` (+R${type.price})` : ''}`}
            />
          ))}
        </RadioGroup>
      </FormControl>

      {(value === 'NAME' || value === 'INITIAL') && (
        <TextField
          fullWidth
          label={value === 'NAME' ? 'Enter Name' : 'Enter Initial'}
          value={personalizationValue}
          onChange={(e) => onChange(value, e.target.value)}
          required
          sx={{ mt: 2 }}
        />
      )}
    </Box>
  );
};

export default PersonalizationOptions;

