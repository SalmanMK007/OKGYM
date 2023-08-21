import { CircularProgress, Container } from '@mui/material';

export default function Loading(props) {
    return (
        <Container style={{textAlign: 'center'}}>
              <br/>
              <br/>
              
             
              {/* <img alt="Artis.app Logo" src="images/Artis.png" height="416" width= "300" /> */}
            
              <br />
              <br />
              <br />
              <div>
                <CircularProgress thickness={1.8} size="3.5rem" color="success"/>
              </div>
          </Container>
    );
}

