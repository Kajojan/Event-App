import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom/extend-expect";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "../Header";
import { Provider } from "react-redux";
import { createStore } from "redux";

jest.mock("@auth0/auth0-react", () => ({
  useAuth0: () => ({
    user: { email: "test@example.com", name: "Test User" },
  }),
}));

jest.mock("react-redux", () => ({
  ...jest.requireActual("react-redux"),
  useDispatch: jest.fn().mockReturnValue(jest.fn()),
}));

jest.mock("../../../services/apiData", () => ({
  getEvent: (id, user) => {
    return Promise.resolve({
      data: {
        event: [
          {
            _fields: [
              {
                properties: {
                  eventName: "Test Event",
                  eventImage: "test.jpg",
                  eventDate: "2024-06-01",
                  eventTime: "10:00",
                  address: "Test Address",
                  eventDescription: "Test Description",
                  seat: 100,
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
  qrcode: () => {
    return Promise.resolve({
      data: {
        qrCodeBase64: "",
      },
    });
  },
}));
const reducer = (state = {}, action) => {
  switch (action.type) {
    default:
      return state;
  }
};
const store = createStore(reducer, {
  socket: {
    isNotification: true,
    socket: null,
  },
});

describe("Header component", () => {
  it("renders all elements correctly", () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <Header />
        </BrowserRouter>
      </Provider>
    );

    // Sprawdzenie logo
    expect(screen.getByText("Event")).toBeInTheDocument();
    expect(screen.getByText("App")).toBeInTheDocument();

    // Sprawdzenie przycisku menu
    expect(screen.getByTestId("button-id")).toBeInTheDocument();

    expect(screen.queryByText(/główna/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/wydarzenia/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/wyszukaj/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/powiadomienia/i)).not.toBeInTheDocument();

    expect(screen.queryByText(/zaloguj się/i)).not.toBeInTheDocument();

    expect(screen.queryByTestId("dot-icon")).not.toBeInTheDocument();

    fireEvent.click(screen.getByTestId("button-id"));
    expect(screen.getByText("Głowna")).toBeInTheDocument();
    expect(screen.getByText(/wydarzenia/i)).toBeInTheDocument();
    expect(screen.getByText(/wyszukaj/i)).toBeInTheDocument();
    expect(screen.getByText(/powiadomienia/i)).toBeInTheDocument();
    expect(screen.getByText(/zaloguj się/i)).toBeInTheDocument();
  });
});
