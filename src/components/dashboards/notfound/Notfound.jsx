
import { useNavigate } from "react-router-dom";
import { Box, Button, Typography, Container } from "@mui/material";
import "./notfound.css"; // Import external CSS

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <Container>
      <Box className="not-found-container">
        <Typography className="not-found-title">404</Typography>
        <Typography className="not-found-subtitle">...Page Not Found</Typography>
        <Typography className="not-found-text">
          The page you are looking for does not exist or has been moved.
        </Typography>
        <Button className="not-found-button" onClick={() => navigate("/")}>
          Go Home
        </Button>
      </Box>
    </Container>
  );
};

export default NotFound;
