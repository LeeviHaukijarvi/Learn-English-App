import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Typography } from "@mui/material";
import { Box } from "@mui/material";
import { Container, TextField } from "@mui/material";

const Register = () => {
    const [input, setInput] = useState({
        username: "",
        password: "",
    });

    const navigate = useNavigate();
    async function registerUser() {
        try {
            const response = await fetch("/api/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(input),
            });
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.error);
            }
            alert(data.message);
            navigate("/login");
        } catch (error) {
            alert(error.message);
            console.error(error);
        }
    }

    const handleSubmitChange = (e) => {
        e.preventDefault();
        if (input.username !== "" && input.password !== "") {
            registerUser();
            return;
        }
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
                    Register
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

export default Register;
