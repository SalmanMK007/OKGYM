import { Box } from "@mui/system"
import { Button, Typography, Tooltip, IconButton, Stack } from "@mui/material";
import { Search } from "@mui/icons-material";
const ListHeader = (props) => (
    <Box
        sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            alignItems: 'center',
            bgcolor: 'background.paper',
            fontWeight: 'bold',
        }}
    >
        <Tooltip title="Register new original work">
            <Button 
                variant="contained"
                sx={{
                    mb: 3,
                    backgroundColor: "#008080",
                    border: "none",
                    borderRadius: "5px",
                    "&:hover": {
                        backgroundColor: "#008080"
                    }
                }}
            >
                <Typography sx={{fontSize: "1.5em", color: "white"}}>+ Add Original</Typography>
            </Button>
        </Tooltip>
        
        <Stack
            direction="row"
            flexShrink={0}
            sx={{
                my: 1
            }}
        >
            <IconButton>
                <Search></Search>
            </IconButton>
        </Stack>

    </Box>
)

export default ListHeader;
