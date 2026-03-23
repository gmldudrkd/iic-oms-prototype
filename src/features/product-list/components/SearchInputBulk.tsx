import SearchIcon from "@mui/icons-material/Search";
import {
  CircularProgress,
  FormControl,
  IconButton,
  InputAdornment,
  TextField,
} from "@mui/material";
import { Controller, useFormContext } from "react-hook-form";

interface SearchInputBulkProps {
  mutate: (searchValue: string) => void;
  isPending: boolean;
}

export default function SearchInputBulk({
  mutate,
  isPending,
}: SearchInputBulkProps) {
  const { control } = useFormContext();

  return (
    <FormControl>
      <Controller
        control={control}
        name="searchBulk"
        render={({ field }) => {
          return (
            <TextField
              fullWidth
              multiline
              minRows={3}
              maxRows={5}
              placeholder="SAP Code"
              value={field.value}
              onChange={field.onChange}
              slotProps={{
                input: {
                  endAdornment: (
                    <InputAdornment position="start">
                      <IconButton onClick={() => mutate(field.value)}>
                        {isPending ? (
                          <CircularProgress size={20} />
                        ) : (
                          <SearchIcon />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                },
              }}
            />
          );
        }}
      />
    </FormControl>
  );
}
