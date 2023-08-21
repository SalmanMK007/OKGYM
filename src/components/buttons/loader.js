import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";

export default function Loader(props) {
    const isLoading = props.isLoading || false;
    return (
        <Box textAlign="center" {...props?.sx && {}}>
            {
                isLoading && (
                    <CircularProgress {...props?.progressProps && {}} />
                )
            }
        </Box>
    );
}