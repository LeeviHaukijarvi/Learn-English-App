import { useState } from "react";
import { useNavigate } from "react-router-dom";

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
        <div>
            <h1>Register</h1>
            <form onSubmit={handleSubmitChange}>
                <div className="form_control">
                    <label htmlFor="user-email">Email:</label>
                    <input
                        type="email"
                        id="user-email"
                        name="username"
                        placeholder="example@yahoo.com"
                        onChange={handleInputChange}
                    />
                </div>
                <div className="form_control">
                    <label htmlFor="password">Password:</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        onChange={handleInputChange}
                    />
                </div>
                <button className="btn-submit">Submit</button>
            </form>
        </div>
    );
};

export default Register;
