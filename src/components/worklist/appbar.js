import * as React from 'react';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import SearchIcon from '@mui/icons-material/Search';
import ViewMenu from './view-menu';
import SortMenu from './sort-menu';

export default function ListHeader(props) {
    const [view, setView] = React.useState(null);
    const [sort, setSort] = React.useState(null);

    const handleViewMenuClose = (type) => {
        setView(null);
        if (type !== 'backdrop') props.setViewValue(type);
    };

    const handleSortMenuClose = (args) => {
        setSort(null);
        // if the user is backdropping the menu, we want to change the sort value
        if (args !== 'backdrop') props.setSortValue(args);
    };
    
    return (
    <Grid
      container
      spacing={1}
      justifyContent="center"
      alignItems="center"
      sx={{ 
        flexGrow: 1,
        display: "flex",
      }}
      columns={2}
      direction="column"
      className="list-header"
    >
      <Grid
        item
        xs={1}
        maxWidth="sm"
        ml={2}
        alignSelf="flex-start"
        sx={{
            boxShadow: 0,
        }}
      >
        <Typography fontSize="1.3rem" color="gray">
          {
            props.queryForm?.search?.length > 20
            ? props.queryForm?.search?.substring(0, 20) + "..."
            : props.queryForm?.search
          }
        </Typography>
      </Grid>
      <Grid
        item
        xs={1}
        alignSelf="flex-end"
      >
          <IconButton 
            edge="end"
            color="inherit"
            onClick={props.handleQueryForm}
          >
            <SearchIcon color={ props.isQueryActive ? "primary" : "black" } />
          </IconButton>
          <Button
            aria-label="account of current user"
            aria-haspopup="true"
            onClick={(event) => {
              setView(event.currentTarget);
            }}
            color="inherit"
          >
            <Typography 
              color="#039be5"
              sx={{textTransform: "capitalize"}}
              fontFamily="Bellefair, serif"
            >
              View
            </Typography>
          </Button>
          <Button
            aria-label="account of current user"
            aria-haspopup="true"
            onClick={(event) => {
                setSort(event.currentTarget);
              }}
            color="inherit"
          >
            <Typography 
              color="#039be5"
              sx={{textTransform: "capitalize"}}
              fontFamily="Bellefair, serif"
            >
              Sort
            </Typography>
          </Button>
          <ViewMenu 
            isMenuOpen={Boolean(view)} 
            handleMenuClose={handleViewMenuClose}
            menuId={"view-menu"}
            anchorEl={view}
          />
          <SortMenu
            isMenuOpen={Boolean(sort)}
            handleMenuClose={handleSortMenuClose}
            menuId={"sort-menu"}
            anchorEl={sort}
          />
      </Grid>
    </Grid>
  );
}
