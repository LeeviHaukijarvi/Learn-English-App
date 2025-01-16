import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Typography } from "@mui/material";
import { Box } from "@mui/material";
import { Container, TextField } from "@mui/material";

/**
 * Register component handles user registration.
 *
 * This component provides a form for users to input their username and password,
 * and submit the data to the server for registration.
 *
 * @component
 * @returns {JSX.Element} The rendered Register component.
 */
const Register = () => {
    const [input, setInput] = useState({
        username: "",
        password: "",
    });

    const navigate = useNavigate();

    /**
     * Registers a new user by sending a POST request to the /api/register endpoint.
     *
     * @async
     * @function registerUser
     */
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

    /**
     * Handles the form submission event.
     * Checks if the username and password inputs are not empty.
     * If both inputs are filled, it calls the registerUser function.
     *
     * @param {Event} e - The form submission event.
     */
    const handleSubmitChange = (e) => {
        e.preventDefault();
        if (input.username !== "" && input.password !== "") {
            registerUser();
            return;
        }
    };

    /**
     * Handles the change event for input fields and updates the state.
     *
     * @param {Object} e - The event object.
     */
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
                    <Button type="submit" fullWidth sx={{ color: "white" }}>
                        Register
                    </Button>
                </form>
            </Box>
        </Container>
    );
}

export default Register;
