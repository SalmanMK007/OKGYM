import React from 'react'
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogTitle from "@mui/material/DialogTitle";
import ArtisButton from '../buttons/button';

const FameModal = ({ name, isVisible, setIsVisible, handleConfirm }) => {
    return (
        <div>
            <Dialog
                open={isVisible}
                onClose={() => setIsVisible(false)}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title" sx={{ textAlign: "center" }}>
                    Delete your creative
                    community connection to {name}
                </DialogTitle>
                <DialogActions>
                    <ArtisButton
                        name="Cancel"
                        onClick={() => setIsVisible(false)}
                        sx={{
                            fontSize: "1.5rem",
                        }}
                    />
                     <ArtisButton
                        name="Yes, Delete"
                        onClick={handleConfirm}
                        sx={{
                            fontSize: "1.5rem",
                        }}
                    />
                </DialogActions>
            </Dialog>
        </div>
    )
}

export default FameModal
