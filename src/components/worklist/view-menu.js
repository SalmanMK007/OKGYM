import { Menu, MenuItem } from '@mui/material';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import AppsIcon from '@mui/icons-material/Apps';

export default function ViewMenu (props) {
    return (
        <Menu
            anchorEl={props.anchorEl}
            anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
            }}
            id={props.menuId}
            keepMounted
            transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
            }}
            open={props.isMenuOpen}
            onClose={() => props.handleMenuClose('backdrop')}
        >
            <MenuItem onClick={() => props.handleMenuClose('list')}>
                <FormatListBulletedIcon />
                List
            </MenuItem>
            <MenuItem onClick={() => props.handleMenuClose('icon')}>
                <AppsIcon />
                Icon
            </MenuItem>
        </Menu>
    )
};
