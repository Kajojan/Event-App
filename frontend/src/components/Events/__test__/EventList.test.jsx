import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import EventList from "../EventList";
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

describe('EventList component', () => {
    it('renders without crashing', () => {
        render(<EventList events={[]} name="Test Events" />);
    });

    it('displays the name correctly', () => {
        render(<EventList events={[]} name="Test Events" />);
        expect(screen.getByText('Test Events')).toBeInTheDocument();
    });

    it('displays sorting buttons correctly', () => {
        render(<EventList events={[]} name="Test Events" />);
        expect(screen.getByText('Sortuj po nazwie (desc)')).toBeInTheDocument();
        expect(screen.getByText('Sortuj po dacie (desc)')).toBeInTheDocument();
    });

    it('displays layout buttons correctly', () => {
        render(<EventList events={[]} name="Test Events" />);
        expect(screen.getByText('List')).toBeInTheDocument();
        expect(screen.getByText('2 kolumny')).toBeInTheDocument();
        expect(screen.getByText('3 kolumny')).toBeInTheDocument();
    });
    it('changes sorting when clicking sorting buttons', () => {
        render(<EventList events={[]} name="Test Events" />);
        const sortByNameButton = screen.getByText('Sortuj po nazwie (desc)');
        fireEvent.click(sortByNameButton);

        expect(sortByNameButton).toHaveTextContent('Sortuj po nazwie (asc)');

        const sortByDateButton = screen.getByText('Sortuj po dacie (desc)');
        fireEvent.click(sortByDateButton);
        expect(sortByDateButton).toHaveTextContent('Sortuj po dacie (asc)');
    });
});