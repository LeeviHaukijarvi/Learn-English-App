import { useState } from "react";
import { useAuth } from "./AuthProvider";
import { Button, Typography } from "@mui/material";
import { Box } from "@mui/material";
import { Container, TextField } from "@mui/material";

const Login = () => {
    const [input, setInput] = useState({
        username: "",
        password: "",
    });

    const auth = useAuth();

    const handleSubmitChange = (e) => {
        e.preventDefault();
        if (input.username !== "" && input.password !== "") {
            auth.loginAction(input);
            return;
        }
        alert("Fields cannot be empty");
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setInput((prev) => ({
            ...prev,
            [name]: value,
        }))
    }

    return (
        <Container>
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <Typography variant="h1" sx={{ m: 4 }}>
                    Login
                </Typography>
                <form onSubmit={handleSubmitChange}>
                    <Box sx={{ mb: 2 }}>
                        <TextField
                            fullWidth
                            label="Email"
                            type="email"
                            id="user-email"
                            name="username"
                            placeholder="example@gmail.com"
                            onChange={handleInputChange}
                            variant="outlined"
                        />
                    </Box>
                    <Box sx={{ mb: 2 }}>
                        <TextField
                            fullWidth
                            label="Password"
                            type="password"
                            id="password"
                            name="password"
                            onChange={handleInputChange}
                            variant="outlined"
                        />
                    </Box>
                    <Button type="submit" fullWidth>
                        Submit
                    </Button>
                </form>
            </Box>
        </Container>
    );
}
export default Login;
