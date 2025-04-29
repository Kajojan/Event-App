import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import Profile from '../Profile'
import { useDispatch, useSelector } from 'react-redux'

jest.mock('react-redux')
jest.mock('@auth0/auth0-react', () => ({
  useAuth0: () => ({
    user: { email: 'test@example.com', name: 'Test User' },
    loginWithRedirect: jest.fn(),
    isAuthenticated: true,
    logout: jest.fn(),
  }),
}))
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => ({ id: '123' }),
  useNavigate: jest.fn(),
}))

jest.mock('../../../services/apiData', () => ({
  getOnlyPersonData: () => {
    return Promise.resolve({
      data: {
        user: {
          properties: {
            name: 'John Doe',
            nickname: 'johnny',
            email: 'john@example.com',
            picture: 'https://example.com/profile.jpg',
          },
        },
      },
    })
  },
  getStatsUser: () => {
    return Promise.resolve({
      data: {
        values: [{ low: 1 }, { low: 2 }],
        avg: 4.5,
        number: 10,
      }
    })
  },
}))

describe('Profile component', () => {
  it('Profile', async () => {
    const mockDispatch = jest.fn()
    useDispatch.mockReturnValue(mockDispatch)
    useSelector.mockImplementation((selectorFn) =>
      selectorFn({
        socket: {
          notification: [],
        },
      })
    )

    render(<Profile />)
    expect(screen.getByText('Test User')).toBeInTheDocument()
    expect(screen.getByText('test@example.com')).toBeInTheDocument()

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument()
      expect(screen.getByText('johnny')).toBeInTheDocument()
      expect(screen.getByText('john@example.com')).toBeInTheDocument()
    })

    fireEvent.click(screen.getByText('Zobacz Statystyki'))

    await waitFor(() => {
      expect(screen.getByText('Wziałeś udział w wydarzeniach')).toBeInTheDocument()
      expect(screen.getByText('2')).toBeInTheDocument()
      expect(screen.getByText('Stworzyłeś wydarzeń')).toBeInTheDocument()
      expect(screen.getByText('1')).toBeInTheDocument()
      expect(screen.getByText('Ilość osób oceniających')).toBeInTheDocument()
      expect(screen.getByText('10')).toBeInTheDocument()
    })
  })
})
