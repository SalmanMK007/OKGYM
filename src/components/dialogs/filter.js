import { 
    Dialog, DialogContent, DialogActions,
    DialogTitle, Typography,
} from '@mui/material';
import { useState } from 'react';

import ArtisButton from '../buttons/button';
import ArtisInput from '../inputs/textfield';
import TagsField from '../inputs/chips-new';
import DateInput from '../inputs/date-picker';

export default function QueryFormDialog(props){
    const {
        open, handleClose, handleSubmit, 
        queryForm, suggestedTags, setIsQueryActive
    } = props;

    const [search, setSearch] = useState(queryForm?.search || "");
    const [from, setFrom] = useState(queryForm?.from || "");
    const [to, setTo] = useState(queryForm?.to || "");
    const [tags, setTags] = useState(queryForm?.tags || []);

    const _handleSubmit = () => {
        setIsQueryActive(true);
        handleSubmit({search, from, to, tags});
    }

    // set all state values to default (use values from useState)
    const _hanleClear = () => {
        handleSubmit({
            search: "",
            from: "",
            to: "",
            tags: [],
        });
        setSearch("");
        setFrom("");
        setTo("");
        setTags([]);
        setIsQueryActive(false);
    }

    return (
        <div>
            <Dialog
                open={open}
                onClose={handleClose}
                fullWidth
            >
                <DialogTitle 
                    id="alert-dialog-title" 
                    sx={{
                        textAlign: "center", 
                        fontSize: "2.5rem",
                        
                }}>
                    Search
                </DialogTitle>
                <DialogContent>
                    <Typography 
                        sx={{
                            textAlign: "center",
                            fontSize: "1.2rem",
                           
                        }}
                    >
                        by words, date ranges, tags
                    </Typography>
                    <ArtisInput
                        value={search}
                        label="words"
                        id="search"
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    <DateInput
                        label="From"
                        value={from} 
                        handleChange={(date) => setFrom(new Date(date).toISOString().slice(0, 10))}
                    />
                    <DateInput
                        label="To"
                        value={to} 
                        handleChange={(date) => setTo(new Date(date).toISOString().slice(0, 10))}
                    />
                    <TagsField 
                        chips={tags}
                        options={suggestedTags}
                        setChips={setTags}
                        name="Tags"
                        placeholder="Enter filter tags"
                        sx={{
                            fontSize: "1.3rem",
                        }}
                    />
                </DialogContent>
                <DialogActions>
                     <ArtisButton
                        name="Cancel" 
                        id="clear"
                        sx={{
                            fontSize: "1.5rem"
                        }}
                     
                        onClick={_hanleClear}
                    />
                    <ArtisButton
                        name="Start" 
                        id="filter"
                        sx={{
                            fontSize: "1.5rem",
                        }}
                        onClick={_handleSubmit}
                    />
                   
                </DialogActions>
            </Dialog>
        </div>
    );
}
