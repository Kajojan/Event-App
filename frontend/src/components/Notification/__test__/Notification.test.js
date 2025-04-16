import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import { MemoryRouter } from 'react-router-dom'
import Notification from '../Notification'
import { useDispatch, useSelector } from 'react-redux'
import { IntNotification } from '../../../store/slices/socketSlice'

jest.mock('react-redux')
jest.mock('@auth0/auth0-react', () => ({
  useAuth0: () => ({
    user: { email: 'test@example.com', name: 'Test User' },
  }),
}))

describe('Notification component', () => {
  it('dispatches IntNotification action on mount with no notifications', () => {
    const mockDispatch = jest.fn()
    useDispatch.mockReturnValue(mockDispatch)
    useSelector.mockImplementation((selectorFn) =>
      selectorFn({
        socket: {
          notification: [],
        },
      })
    )

    render(
      <MemoryRouter>
        <Notification />
      </MemoryRouter>
    )

    expect(mockDispatch).toHaveBeenCalledWith(IntNotification(0))
    expect(screen.getByText('Tu będą powiadomienia o nadchodzących wydarzeniach')).toBeInTheDocument()
  })

  it('dispatches IntNotification action on mount', () => {
    const mockDispatch = jest.fn()
    useDispatch.mockReturnValue(mockDispatch)
    useSelector.mockImplementation((selectorFn) =>
      selectorFn({
        socket: {
          notification: [
            { identity: { low: 1 }, properties: { eventName: 'Test Event' } },
            { identity: { low: 2 }, properties: { eventName: 'Another Event' } },
          ],
        },
      })
    )

    render(
      <MemoryRouter>
        <Notification />
      </MemoryRouter>
    )

    expect(mockDispatch).toHaveBeenCalledWith(IntNotification(0))
    expect(
      screen.getByText('Wydarzenie Test Event, w którym bierzesz udział, odbędzie się za 24h')
    ).toBeInTheDocument()
    expect(
      screen.getByText('Wydarzenie Another Event, w którym bierzesz udział, odbędzie się za 24h')
    ).toBeInTheDocument()
  })
})
