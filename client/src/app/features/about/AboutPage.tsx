import { Alert, AlertTitle, Button, ButtonGroup, Container, List, ListItem, ListItemText, Typography } from "@mui/material";
import agent from "../../api/agent";
import { useState } from "react";

export default function AboutPage() {
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  // Function to call the API for validation errors
  const getValidationError = () => {
    agent.TestError.getValidationError()
      .then(() => console.log("should not see this"))
      .catch((error) => {
                setValidationErrors(error);
      });
  };

  return (
    <Container>
      <Typography variant="h2">Errors for testing purposes</Typography>

      <ButtonGroup fullWidth>
        <Button variant="contained" onClick={() => agent.TestError.getError400Error()}>
          Error 400
        </Button>
        <Button variant="contained" onClick={() => agent.TestError.getError401Error()}>
          Error 401
        </Button>
        <Button variant="contained" onClick={() => agent.TestError.getError404Error()}>
          Error 404
        </Button>
        <Button variant="contained" onClick={() => agent.TestError.getError500Error()}>
          Error 500
        </Button>
        <Button variant="contained" onClick={getValidationError}>
          Error Validation
        </Button>
      </ButtonGroup>

      {validationErrors.length > 0 && (
        <Alert severity="error">
          <AlertTitle>Validation Errors</AlertTitle>
          <List>
            {validationErrors.map((error, index) => (
              <ListItem key={index}>
                <ListItemText>{error}</ListItemText>
              </ListItem>
            ))}
          </List>
        </Alert>
      )}
    </Container>
  );
}
