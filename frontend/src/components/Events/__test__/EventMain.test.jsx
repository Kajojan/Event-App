import { render, screen } from '@testing-library/react'
import EventMain from '../EventMain'
import '@testing-library/jest-dom/extend-expect'
import { BrowserRouter } from 'react-router-dom'
// jest.mock("react-router-dom", () => ({
//     ...jest.requireActual("react-router-dom"),
//     useParams: () => ({ id: "123" }),
//     useNavigate: jest.fn(),
//     navigate: jest.fn()
// }));

jest.mock('@auth0/auth0-react', () => ({
  useAuth0: () => ({
    user: { email: 'test@example.com', name: 'Test User' },
  }),
}))

jest.mock('../../../services/apiData', () => ({
  getEvent: (_id, _user) => {
    return Promise.resolve({
      data: {
        event: [
          {
            _fields: [
              {
                properties: {
                  eventName: 'Test Event',
                  eventImage: 'test.jpg',
                  eventDate: '2024-06-01',
                  eventTime: '10:00',
                  address: 'Test Address',
                  eventDescription: 'Test Description',
                  seat: 100,
                },
              },
              { properties: { nickname: 'Test Organizer', email: 'organizer@example.com' } },
              null,
              true,
              { properties: { seat: 1 } },
            ],
          },
        ],
      },
    })
  },
  qrcode: () => {
    return Promise.resolve({
      data: {
        qrCodeBase64: '',
      },
    })
  },
}))

describe('EventMain component', () => {
  // eslint-disable-next-line jest/expect-expect
  it('renders without crashing', () => {
    render(<EventMain />, { wrapper: BrowserRouter })
  })

  it('displays the title correctly', () => {
    render(<EventMain />, { wrapper: BrowserRouter })
    expect(screen.getByText('Wydarzenia')).toBeInTheDocument()
  })

  it('displays navigation links correctly', () => {
    render(<EventMain />, { wrapper: BrowserRouter })
    expect(screen.getByText('Utwórz nowe')).toBeInTheDocument()
    expect(screen.getByText('Twoje wydarzenia')).toBeInTheDocument()
    expect(screen.getByText('Popularne')).toBeInTheDocument()
    expect(screen.getByText('Rekomendowane')).toBeInTheDocument()
    expect(screen.getByText('Nadchodzące')).toBeInTheDocument()
  })


})
