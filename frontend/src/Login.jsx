import { useState } from "react";
import { useAuth } from "./AuthProvider";
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
        <div>
            <h1>Login</h1>
            <form onSubmit={handleSubmitChange}>
                <div className="form_control">
                    <label htmlFor="user-email">Email:</label>
                    <input
                        type="email"
                        id="user-email"
                        name="username"
                        placeholder="example@yahoo.com"
                        aria-describedby="user-email"
                        aria-invalid="false"
                        onChange={handleInputChange}
                    />
                </div>
                <div className="form_control">
                    <label htmlFor="password">Password:</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        aria-describedby="user-password"
                        aria-invalid="false"
                        onChange={handleInputChange}
                    />
                </div>
                <button className="btn-submit">Submit</button>
            </form>
        </div>
    );
};

export default Login;
