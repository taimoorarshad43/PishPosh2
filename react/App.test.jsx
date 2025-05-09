import React from "react";
import { render, screen } from "@testing-library/react";
import '@testing-library/jest-dom';
import App from "./src/App";

test('renders without crashing', () => {
  render(<App />);
//   expect(screen.getByText(/vite/i)).toBeInTheDocument(); // adjust based on your App's content
});
