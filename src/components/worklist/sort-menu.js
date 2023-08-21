import { Divider, Menu, MenuItem } from '@mui/material';

export const SortMenu = (props) => (
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
        <MenuItem onClick={() => props.handleMenuClose('registered_date,asc')}>
            Date +
        </MenuItem>
        <MenuItem onClick={() => props.handleMenuClose('registered_date,desc')}>
            Date -
        </MenuItem>
        <Divider />
        <MenuItem onClick={() => props.handleMenuClose('title,asc')}>
            A - Z
        </MenuItem>
        <MenuItem onClick={() => props.handleMenuClose('title,desc')}>
            Z - A
        </MenuItem>
    </Menu>
);

export default SortMenu;