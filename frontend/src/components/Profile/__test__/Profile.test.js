import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom/extend-expect";
import { MemoryRouter } from "react-router-dom";
import Profile from "../Profile";
import { useDispatch, useSelector } from "react-redux";
import { IntNotification } from "../../../store/slices/socketSlice";

jest.mock("react-redux");
jest.mock("@auth0/auth0-react", () => ({
  useAuth0: () => ({
    user: { email: "test@example.com", name: "Test User" },
    loginWithRedirect: jest.fn(),
    isAuthenticated: true,
    logout: jest.fn(),
  }),
}));
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useParams: () => ({ id: "123" }),
  useNavigate: jest.fn(),
}));

jest.mock("../../../services/apiData", () => ({
  getOnlyPersonData: (id, user) => {
    return Promise.resolve({
      data: {
        user: [
          {
            _fields: [
              {
                properties: {
                  name: "John Doe",
                  nickname: "johnny",
                  email: "john@example.com",
                  picture: "https://example.com/profile.jpg",
                },
              },
              { properties: { nickname: "Test Organizer", email: "organizer@example.com" } },
              null,
              true,
              { properties: { seat: 1 } },
            ],
          },
        ],
      },
    });
  },
  getStatsUser: () => {
    return Promise.resolve({
      data: {
        values: [{ low: 1 }, { low: 2 }],
      },
    });
  },
}));

describe("Profile component", () => {
  it("Profile", async () => {
    const mockDispatch = jest.fn();
    useDispatch.mockReturnValue(mockDispatch);
    useSelector.mockImplementation((selectorFn) =>
      selectorFn({
        socket: {
          notification: [],
        },
      })
    );

    render(<Profile />);
    expect(screen.getByText("Test User")).toBeInTheDocument();
    expect(screen.getByText("test@example.com")).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText("John Doe")).toBeInTheDocument();
      // eslint-disable-next-line testing-library/no-wait-for-multiple-assertions
      expect(screen.getByText("johnny")).toBeInTheDocument();
      // eslint-disable-next-line testing-library/no-wait-for-multiple-assertions
      expect(screen.getByText("john@example.com")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText("Zobacz Statystyki"));
    await waitFor(() => {
      expect(screen.getByText(/Wziałeś udział w 2 wydarzeniach/)).toBeInTheDocument();
      // eslint-disable-next-line testing-library/no-wait-for-multiple-assertions
      expect(screen.getByText(/Stworzyłeś 1 wydarzeniach/)).toBeInTheDocument();
    });
  });
});
