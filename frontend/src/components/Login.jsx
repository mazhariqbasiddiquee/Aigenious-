import React, { useState, } from "react";
import { useNavigate } from "react-router-dom";

function LoginForm() {
  const navigate=useNavigate()
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Send the login data as a POST request
      const response = await fetch(
        "https://olive-vulture-shoe.cyclic.app/user/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      if (response.ok) {
        // Assuming the response contains a token, extract it
        const data = await response.json();
        console.log(data)
        const { token } = data;

        // Save the token to localStorage
        localStorage.setItem("token", token);
        localStorage.setItem("name",data.user.name)

        // Redirect or perform any necessary actions after successful login
        console.log("Login successful! Token saved to localStorage.");
        navigate("/interview")
        
      } else {
        // Handle login error, e.g., display an error message
        console.error("Login failed.");
      }
    } catch (error) {
      console.error("An error occurred:", error);
    }
  };

  return (
    <div className="bg-gradient-to-r from-blue-500 via-blue-400 to-blue-300 min-h-screen flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h1 className="text-3xl font-semibold text-center text-gray-800 mb-4">
          Login
        </h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              className="border border-gray-400 rounded w-full py-2 px-3 focus:outline-none focus:ring focus:border-blue-400"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="block text-gray-700">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              className="border border-gray-400 rounded w-full py-2 px-3 focus:outline-none focus:ring focus:border-blue-400"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-full focus:outline-none focus:ring focus:border-blue-400 transition duration-300 w-full"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}

export default LoginForm;
