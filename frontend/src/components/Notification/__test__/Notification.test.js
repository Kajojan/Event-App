// import { render, screen } from '@testing-library/react'
// import '@testing-library/jest-dom/extend-expect'
// import { MemoryRouter } from 'react-router-dom'
// import Notification from '../Notification'
// import { useDispatch, useSelector } from 'react-redux'
// import { IntNotification } from '../../../store/slices/socketSlice'

// jest.mock('react-redux')
// jest.mock('@auth0/auth0-react', () => ({
//   useAuth0: () => ({
//     user: { email: 'test@example.com', name: 'Test User' },
//   }),
// }))

// describe('Notification component', () => {
//   it('dispatches IntNotification action on mount with no notifications', () => {
//     const mockDispatch = jest.fn()
//     useDispatch.mockReturnValue(mockDispatch)
//     useSelector.mockImplementation((selectorFn) =>
//       selectorFn({
//         socket: {
//           notification: [],
//         },
//       })
//     )

//     render(
//       <MemoryRouter>
//         <Notification />
//       </MemoryRouter>
//     )

//     expect(mockDispatch).toHaveBeenCalledWith(IntNotification(0))
//     expect(screen.getByText('Tu będą powiadomienia o nadchodzących wydarzeniach')).toBeInTheDocument()
//   })

//   it('dispatches IntNotification action on mount', () => {
//     const mockDispatch = jest.fn()
//     useDispatch.mockReturnValue(mockDispatch)
//     useSelector.mockImplementation((selectorFn) =>
//       selectorFn({
//         socket: {
//           notification: [
//             { identity: { low: 1 }, properties: { eventName: 'Test Event' } },
//             { identity: { low: 2 }, properties: { eventName: 'Another Event' } },
//           ],
//         },
//       })
//     )

//     render(
//       <MemoryRouter>
//         <Notification />
//       </MemoryRouter>
//     )

//     expect(mockDispatch).toHaveBeenCalledWith(IntNotification(0))
//     expect(
//       screen.getByText('Wydarzenie Test Event, w którym bierzesz udział, odbędzie się za 24h')
//     ).toBeInTheDocument()
//     expect(
//       screen.getByText('Wydarzenie Another Event, w którym bierzesz udział, odbędzie się za 24h')
//     ).toBeInTheDocument()
//   })
// })
import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import { MemoryRouter } from 'react-router-dom'
import Notification from '../Notification'
import { useDispatch, useSelector } from 'react-redux'
import { IntNotification, DelRevie } from '../../../store/slices/socketSlice'
import { useAuth0 } from '@auth0/auth0-react'

jest.mock('react-redux')
jest.mock('@auth0/auth0-react', () => ({
  useAuth0: () => ({
    user: { email: 'test@example.com', name: 'Test User' },
  }),
}))

describe('Notification component', () => {
  let mockDispatch

  const mockUseSelector = (notificationsMock = [], reviesMock = []) => {
    useSelector.mockImplementation((selectorFn) => {
      return selectorFn({
        socket: {
          notification: notificationsMock,
          revies: reviesMock,
        },
      })
    })
  }

  beforeEach(() => {
    mockDispatch = jest.fn()
    useDispatch.mockReturnValue(mockDispatch)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('dispatches IntNotification with 0 when there are no notifications', () => {
    mockUseSelector([], []) // Brak powiadomień i recenzji

    render(
      <MemoryRouter>
        <Notification />
      </MemoryRouter>
    )

    expect(mockDispatch).toHaveBeenCalledWith(IntNotification(0))
    expect(screen.getByText('Tu będą powiadomienia o nadchodzących wydarzeniach')).toBeInTheDocument()
  })

  it('renders notifications correctly when there are notifications', () => {
    const notificationsMock = [
      { identity: { low: 1 }, properties: { eventName: 'Test Event' } },
      { identity: { low: 2 }, properties: { eventName: 'Another Event' } },
    ]

    mockUseSelector(notificationsMock, []) // Przekazujemy powiadomienia, ale brak recenzji

    render(
      <MemoryRouter>
        <Notification />
      </MemoryRouter>
    )

    expect(mockDispatch).toHaveBeenCalledWith(IntNotification(0))
    expect(screen.getByText('Wydarzenie Test Event, w którym bierzesz udział, odbędzie się za 24h')).toBeInTheDocument()
    expect(screen.getByText('Wydarzenie Another Event, w którym bierzesz udział, odbędzie się za 24h')).toBeInTheDocument()

    const notifications = screen.getAllByText(/Wydarzenie .* w którym bierzesz udział, odbędzie się za 24h/)
    expect(notifications.length).toBe(2)
  })

  it('opens the rating popup when a review is clicked', async () => {
    const reviesMock = [
      { identity: { low: 1 }, properties: { eventName: 'Test Event' } },
    ]

    useSelector.mockImplementation((selectorFn) =>
      selectorFn({
        socket: {
          revie: reviesMock, // Mockowanie recenzji
        },
      })
    )

    render(
      <MemoryRouter>
        <Notification />
      </MemoryRouter>
    )

    // Użycie findByText z opóźnieniem w przypadku asynchronicznych renderów
    const reviewItem = await screen.findByTestId('review-item')


    fireEvent.click(reviewItem)

    expect(screen.getByText('Wyślij ocenę')).toBeInTheDocument() // Sprawdzamy, czy popup jest otwarty
  })

  it('displays message when there are no reviews', () => {
    mockUseSelector([], [])

    render(
      <MemoryRouter>
        <Notification />
      </MemoryRouter>
    )

    expect(screen.getByText('Tu będą powiadomienia o ocenie poprzednich wydarzeniach')).toBeInTheDocument()
  })

  it('displays message when there are no notifications', () => {
    mockUseSelector([], []) // Brak powiadomień i recenzji

    render(
      <MemoryRouter>
        <Notification />
      </MemoryRouter>
    )

    expect(screen.getByText('Tu będą powiadomienia o nadchodzących wydarzeniach')).toBeInTheDocument()
  })
})
