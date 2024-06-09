import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Event from "../Event";
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
    const item = {
        _fields: [
            {
                properties: {
                    eventName: 'Test Event',
                    eventImage: 'test.jpg',
                    eventDate: '2024-06-01',
                    eventTime: '10:00',
                    address: 'Test Address',
                },
            },
            { properties: { nickname: 'Test Organizer' } },
            null,
        ],
    };
    it('renders event details correctly', () => {
        render(<Event item={item} />);

        expect(screen.getByText('Test Event')).toBeInTheDocument();
        expect(screen.getByText('Organizator: Test Organizer')).toBeInTheDocument();
        expect(screen.getByText('Date: 2024-06-01, 10:00')).toBeInTheDocument();
        expect(screen.getByText('Miejsce: Test Address')).toBeInTheDocument();
    });

    it('calls onClick handler when clicked', () => {
        const onClick = jest.fn();
        const { container } = render(<Event item={item} onClick={onClick} />);

        fireEvent.click(container.firstChild);
        expect(onClick).toHaveBeenCalled();
    });

    it('renders with custom class name', () => {
        const { container } = render(<Event item={item} className="custom-class" />);

        expect(container.firstChild).toHaveClass('custom-class');
    });

    it('renders without crashing if eventImage is missing', () => {
        const itemWithoutImage = {
            _fields: [
                {
                    properties: {
                        eventName: 'Test Event',
                        eventDate: '2024-06-01',
                        eventTime: '10:00',
                        address: 'Test Address',
                    },
                },
                { properties: { nickname: 'Test Organizer' } },
                null,
            ],
        };

        render(<Event item={itemWithoutImage} />);

        expect(screen.queryByText('Test Event')).not.toBeInTheDocument();
        expect(screen.queryByText('Organizator: Test Organizer')).not.toBeInTheDocument();
        expect(screen.queryByText('Date: 2024-06-01, 10:00')).not.toBeInTheDocument();
        expect(screen.queryByText('Miejsce: Test Address')).not.toBeInTheDocument();
    });
});
