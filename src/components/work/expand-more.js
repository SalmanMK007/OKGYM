import { ButtonBase, Typography } from "@mui/material";

export default function ExpandButton(props) {
    const { children, id, title, textColor } = props;
    return (
        <ButtonBase
            id={id}
            centerRipple
            sx={{
                alignItems: "flex-start",
                alignSelf: "flex-start",
                textAlign: 'initial'
            }}
        >
            <Typography
                component="div"
                display="inline-grid"
                sx={{
                    m: 1,
                }}
            >
                {children}
            </Typography>
            <Typography
                component="div"
                display="inline-grid"
                sx={{
                    fontFamily: "'Montserrat', sans-serif",
                    fontSize: "15px",
                    p: 1,
                    color: textColor
                }}
            >
                {title}
            </Typography>
        </ButtonBase>
    );
}