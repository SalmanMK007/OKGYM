import * as React from 'react';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import useMediaQuery from '@mui/material/useMediaQuery';
import { Link } from 'react-router-dom';
import utils from '../../utils';

export default function WorksIconView(props) {
    const works = props.works;
    const isMobile = useMediaQuery('(max-width:600px)', { noSsr: true });
    return (
        <ImageList gap={2} sx={{ mb: 5 }} cols={isMobile ? 1 : 5}>
            {works.map((item) => (
                <Link 
                    style={{ 
                        textDecoration: "none",
                        color: "inherit"
                    }}
                    key={item.artis_code}
                    to={{ pathname: `/works/edit/${item.artis_code}`, work: item, profile: props.profile }}
                    >
                    <ImageListItem
                        key={item?.work_image?.image}>
                        <img
                            src={utils.getImage(item.work_image, item.work_type)}
                            alt={item?.title}
                            loading="lazy"
                        />
                    </ImageListItem>
                </Link>
            ))}
        </ImageList>
    );
}