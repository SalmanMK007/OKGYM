import { Menu, MenuItem } from '@mui/material';

export default function WorkListMenu (props) {
    return (
        <Menu
            anchorEl={props.anchorEl}
            anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
                          
            }}
            id={props.menuId}
            keepMounted
            transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            open={props.isMenuOpen}
            onClose={() => props.handleMenuClose('backdrop')}
        >
            <MenuItem onClick={() => props.handleMenuClose('rights')} sx={{ fontFamily: "Bellefair, serif"}}>
                Originals Rights
            </MenuItem>
            <MenuItem onClick={() => props.handleMenuClose('works')} sx={{ fontFamily: "Bellefair, serif"}}>
                Originals Works
            </MenuItem>
        </Menu>
    )
};
