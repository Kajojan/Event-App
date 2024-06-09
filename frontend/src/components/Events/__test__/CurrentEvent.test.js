import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import CurrentEvent from "../CurrentEvent";
import "@testing-library/jest-dom/extend-expect";

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useParams: () => ({ id: "123" }),
  useNavigate: jest.fn(),
}));

jest.mock("@auth0/auth0-react", () => ({
  useAuth0: () => ({
    user: { email: "test@example.com", name: "Test User" },
  }),
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

describe("CurrentEvent", () => {
  it("renders event details correctly", async () => {
    render(<CurrentEvent />);

    expect(await screen.findByText("Test Event")).toBeInTheDocument();
    expect(screen.getByText("Test Organizer")).toBeInTheDocument();
    expect(screen.getByText("2024-06-01 10:00")).toBeInTheDocument();
    expect(screen.getByText("Test Address")).toBeInTheDocument();
    expect(screen.getByText("Test Description")).toBeInTheDocument();
    expect(screen.getByText("1")).toBeInTheDocument();
    expect(screen.getByText("Pobierz Bilet")).toBeInTheDocument();
    const downloadButton = screen.getByText("Pobierz Bilet");
    if (downloadButton) {
      fireEvent.click(downloadButton);
    }
    expect(screen.queryByText("Usuń")).not.toBeInTheDocument();
    expect(screen.queryByText("Edytuj")).not.toBeInTheDocument();
  });
});
