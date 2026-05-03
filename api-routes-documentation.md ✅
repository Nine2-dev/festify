// =====================================================
// FESTIFY API Routes
// Backend API structure for Spring Boot / Node.js
// =====================================================

// =====================================================
// AUTHENTICATION ENDPOINTS
// =====================================================

/**
 * POST /api/auth/register
 * Register a new user
 * 
 * @request {
 *   email: string,
 *   password: string,
 *   fullName: string,
 *   phoneNumber?: string,
 *   department?: string,
 *   yearOfStudy?: number
 * }
 * 
 * @response {
 *   id: number,
 *   email: string,
 *   fullName: string,
 *   role: 'USER' | 'ADMIN',
 *   token: string
 * }
 * 
 * @errors
 * - 400: Email already exists
 * - 400: Invalid input format
 */
POST /api/auth/register

/**
 * POST /api/auth/login
 * Login user and get JWT token
 * 
 * @request {
 *   email: string,
 *   password: string
 * }
 * 
 * @response {
 *   id: number,
 *   email: string,
 *   fullName: string,
 *   role: 'USER' | 'ADMIN',
 *   token: string,
 *   expiresIn: number
 * }
 * 
 * @errors
 * - 401: Invalid credentials
 * - 404: User not found
 */
POST /api/auth/login

/**
 * POST /api/auth/logout
 * Logout user (invalidate token)
 * 
 * @auth Required: Bearer token
 * 
 * @response {
 *   message: string
 * }
 */
POST /api/auth/logout

/**
 * POST /api/auth/refresh
 * Refresh JWT token
 * 
 * @auth Required: Bearer token (refresh)
 * 
 * @response {
 *   token: string,
 *   expiresIn: number
 * }
 */
POST /api/auth/refresh

// =====================================================
// USER ENDPOINTS
// =====================================================

/**
 * GET /api/users/profile
 * Get current user profile
 * 
 * @auth Required: Bearer token
 * 
 * @response {
 *   id: number,
 *   email: string,
 *   fullName: string,
 *   phoneNumber: string,
 *   role: 'USER' | 'ADMIN',
 *   department: string,
 *   yearOfStudy: number,
 *   isVerified: boolean,
 *   createdAt: string,
 *   updatedAt: string
 * }
 */
GET /api/users/profile

/**
 * PUT /api/users/profile
 * Update user profile
 * 
 * @auth Required: Bearer token
 * 
 * @request {
 *   fullName?: string,
 *   phoneNumber?: string,
 *   department?: string,
 *   yearOfStudy?: number
 * }
 * 
 * @response User object
 */
PUT /api/users/profile

/**
 * PUT /api/users/change-password
 * Change user password
 * 
 * @auth Required: Bearer token
 * 
 * @request {
 *   currentPassword: string,
 *   newPassword: string
 * }
 * 
 * @response {
 *   message: string
 * }
 * 
 * @errors
 * - 400: Current password incorrect
 * - 400: Password validation failed
 */
PUT /api/users/change-password

/**
 * GET /api/users
 * Get all users (ADMIN only)
 * 
 * @auth Required: Bearer token (admin)
 * 
 * @query {
 *   page?: number,
 *   limit?: number,
 *   role?: 'USER' | 'ADMIN',
 *   search?: string
 * }
 * 
 * @response {
 *   data: User[],
 *   total: number,
 *   page: number,
 *   limit: number
 * }
 */
GET /api/users

/**
 * GET /api/users/:id
 * Get user by ID (ADMIN only)
 * 
 * @auth Required: Bearer token (admin)
 * 
 * @response User object
 */
GET /api/users/:id

/**
 * DELETE /api/users/:id
 * Delete user (ADMIN only)
 * 
 * @auth Required: Bearer token (admin)
 * 
 * @response {
 *   message: string
 * }
 */
DELETE /api/users/:id

// =====================================================
// EVENT ENDPOINTS
// =====================================================

/**
 * GET /api/events
 * Get all events with optional filtering
 * 
 * @query {
 *   page?: number,
 *   limit?: number,
 *   status?: string,
 *   eventType?: string,
 *   startDate?: string (ISO format),
 *   endDate?: string (ISO format),
 *   search?: string
 * }
 * 
 * @response {
 *   data: Event[],
 *   total: number,
 *   page: number,
 *   limit: number
 * }
 */
GET /api/events

/**
 * GET /api/events/:id
 * Get event details with price tiers
 * 
 * @response {
 *   id: number,
 *   eventName: string,
 *   description: string,
 *   eventType: string,
 *   venue: Venue,
 *   eventDate: string,
 *   status: string,
 *   priceTiers: PriceTier[],
 *   bookings: {
 *     total: number,
 *     confirmed: number,
 *     revenue: number
 *   }
 * }
 */
GET /api/events/:id

/**
 * POST /api/events
 * Create new event (ADMIN only)
 * 
 * @auth Required: Bearer token (admin)
 * 
 * @request {
 *   eventName: string,
 *   description: string,
 *   eventType: string,
 *   venueId: number,
 *   eventDate: string,
 *   durationMinutes?: number,
 *   organizerName: string,
 *   maxCapacity: number,
 *   bookingOpensAt?: string,
 *   bookingClosesAt?: string
 * }
 * 
 * @response Event object
 * 
 * @errors
 * - 400: Venue not available at this time
 * - 400: Invalid event date
 */
POST /api/events

/**
 * PUT /api/events/:id
 * Update event (ADMIN only)
 * 
 * @auth Required: Bearer token (admin)
 * 
 * @request Event fields to update
 * 
 * @response Event object
 */
PUT /api/events/:id

/**
 * PATCH /api/events/:id/status
 * Update event status (ADMIN only)
 * 
 * @auth Required: Bearer token (admin)
 * 
 * @request {
 *   status: string
 * }
 * 
 * @response Event object
 */
PATCH /api/events/:id/status

/**
 * DELETE /api/events/:id
 * Delete event (ADMIN only)
 * 
 * @auth Required: Bearer token (admin)
 * 
 * @response {
 *   message: string
 * }
 */
DELETE /api/events/:id

/**
 * GET /api/events/trending
 * Get trending/popular events
 * 
 * @query {
 *   limit?: number
 * }
 * 
 * @response Event[]
 */
GET /api/events/trending

// =====================================================
// VENUE ENDPOINTS
// =====================================================

/**
 * GET /api/venues
 * Get all venues
 * 
 * @query {
 *   page?: number,
 *   limit?: number
 * }
 * 
 * @response {
 *   data: Venue[],
 *   total: number
 * }
 */
GET /api/venues

/**
 * GET /api/venues/:id
 * Get venue details
 * 
 * @response {
 *   id: number,
 *   venueName: string,
 *   address: string,
 *   totalCapacity: number,
 *   facilities: string,
 *   events: number,
 *   upcomingEvents: Event[]
 * }
 */
GET /api/venues/:id

/**
 * POST /api/venues
 * Create new venue (ADMIN only)
 * 
 * @auth Required: Bearer token (admin)
 * 
 * @request {
 *   venueName: string,
 *   address: string,
 *   totalCapacity: number,
 *   hasNumberedSeats?: boolean,
 *   facilities?: string
 * }
 * 
 * @response Venue object
 */
POST /api/venues

/**
 * PUT /api/venues/:id
 * Update venue (ADMIN only)
 * 
 * @auth Required: Bearer token (admin)
 * 
 * @request Venue fields to update
 * 
 * @response Venue object
 */
PUT /api/venues/:id

/**
 * DELETE /api/venues/:id
 * Delete venue (ADMIN only, if no events linked)
 * 
 * @auth Required: Bearer token (admin)
 * 
 * @response {
 *   message: string
 * }
 */
DELETE /api/venues/:id

// =====================================================
// PRICE TIER ENDPOINTS
// =====================================================

/**
 * GET /api/events/:eventId/price-tiers
 * Get price tiers for an event
 * 
 * @response PriceTier[]
 */
GET /api/events/:eventId/price-tiers

/**
 * POST /api/price-tiers
 * Create price tier (ADMIN only)
 * 
 * @auth Required: Bearer token (admin)
 * 
 * @request {
 *   eventId: number,
 *   tierName: string,
 *   price: number,
 *   totalSeats: number,
 *   seatRangeStart?: string,
 *   seatRangeEnd?: string,
 *   validUntil?: string
 * }
 * 
 * @response PriceTier object
 */
POST /api/price-tiers

/**
 * PUT /api/price-tiers/:id
 * Update price tier (ADMIN only)
 * 
 * @auth Required: Bearer token (admin)
 * 
 * @request Price tier fields to update
 * 
 * @response PriceTier object
 */
PUT /api/price-tiers/:id

/**
 * DELETE /api/price-tiers/:id
 * Delete price tier (ADMIN only)
 * 
 * @auth Required: Bearer token (admin)
 * 
 * @response {
 *   message: string
 * }
 */
DELETE /api/price-tiers/:id

// =====================================================
// BOOKING ENDPOINTS
// =====================================================

/**
 * GET /api/bookings
 * Get user's bookings
 * 
 * @auth Required: Bearer token
 * 
 * @query {
 *   page?: number,
 *   limit?: number,
 *   status?: string
 * }
 * 
 * @response {
 *   data: Booking[],
 *   total: number
 * }
 */
GET /api/bookings

/**
 * GET /api/bookings/:id
 * Get booking details
 * 
 * @auth Required: Bearer token
 * 
 * @response {
 *   id: number,
 *   bookingReference: string,
 *   event: Event,
 *   priceTier: PriceTier,
 *   numTickets: number,
 *   totalAmount: number,
 *   bookingStatus: string,
 *   paymentStatus: string,
 *   qrCodeData: string,
 *   seatReservations: SeatReservation[],
 *   bookedAt: string,
 *   confirmedAt: string
 * }
 */
GET /api/bookings/:id

/**
 * POST /api/bookings
 * Create new booking
 * 
 * @auth Required: Bearer token
 * 
 * @request {
 *   eventId: number,
 *   priceTierId: number,
 *   numTickets: number,
 *   seatNumbers?: string[] (optional, for seat selection)
 * }
 * 
 * @response {
 *   id: number,
 *   bookingReference: string,
 *   totalAmount: number,
 *   bookingStatus: string,
 *   expiresAt: string (payment expires)
 * }
 * 
 * @errors
 * - 400: Insufficient seats available
 * - 400: Booking window closed
 * - 409: Seat already reserved
 */
POST /api/bookings

/**
 * POST /api/bookings/:id/confirm-payment
 * Confirm booking payment
 * 
 * @auth Required: Bearer token
 * 
 * @request {
 *   paymentMethod: 'UPI' | 'CARD' | 'NETBANKING' | 'WALLET',
 *   transactionId: string
 * }
 * 
 * @response {
 *   bookingReference: string,
 *   bookingStatus: string,
 *   qrCodeData: string
 * }
 * 
 * @errors
 * - 400: Payment already processed
 * - 402: Payment failed
 */
POST /api/bookings/:id/confirm-payment

/**
 * POST /api/bookings/:id/cancel
 * Cancel booking
 * 
 * @auth Required: Bearer token
 * 
 * @request {
 *   reason?: string
 * }
 * 
 * @response {
 *   bookingReference: string,
 *   refundAmount: number,
 *   message: string
 * }
 * 
 * @errors
 * - 400: Cannot cancel confirmed booking
 */
POST /api/bookings/:id/cancel

/**
 * GET /api/bookings/:bookingRef/details
 * Get booking by reference number
 * 
 * @response Booking object (public fields only)
 */
GET /api/bookings/:bookingRef/details

/**
 * GET /api/admin/bookings
 * Get all bookings (ADMIN only)
 * 
 * @auth Required: Bearer token (admin)
 * 
 * @query {
 *   page?: number,
 *   limit?: number,
 *   eventId?: number,
 *   userId?: number,
 *   status?: string,
 *   dateFrom?: string,
 *   dateTo?: string
 * }
 * 
 * @response {
 *   data: Booking[],
 *   total: number
 * }
 */
GET /api/admin/bookings

// =====================================================
// SEAT RESERVATION ENDPOINTS
// =====================================================

/**
 * GET /api/events/:eventId/seats
 * Get available seats for an event
 * 
 * @query {
 *   priceTierId?: number
 * }
 * 
 * @response {
 *   layout: SeatLayout,
 *   reserved: string[],
 *   available: string[]
 * }
 */
GET /api/events/:eventId/seats

/**
 * POST /api/bookings/:bookingId/seats
 * Reserve specific seats for booking
 * 
 * @auth Required: Bearer token
 * 
 * @request {
 *   seatNumbers: string[]
 * }
 * 
 * @response {
 *   reservedSeats: SeatReservation[],
 *   message: string
 * }
 * 
 * @errors
 * - 409: Some seats already reserved
 * - 400: Invalid seat numbers
 */
POST /api/bookings/:bookingId/seats

/**
 * GET /api/bookings/:bookingId/seats
 * Get reserved seats for booking
 * 
 * @auth Required: Bearer token
 * 
 * @response SeatReservation[]
 */
GET /api/bookings/:bookingId/seats

// =====================================================
// PAYMENT ENDPOINTS
// =====================================================

/**
 * POST /api/payments/initiate
 * Initiate payment for booking
 * 
 * @auth Required: Bearer token
 * 
 * @request {
 *   bookingId: number,
 *   paymentMethod: string
 * }
 * 
 * @response {
 *   paymentId: string,
 *   amount: number,
 *   paymentGatewayUrl?: string,
 *   upiString?: string
 * }
 */
POST /api/payments/initiate

/**
 * POST /api/payments/webhook
 * Payment gateway webhook callback
 * 
 * @request Payment provider specific
 */
POST /api/payments/webhook

/**
 * GET /api/payments/:bookingId/status
 * Check payment status
 * 
 * @auth Required: Bearer token
 * 
 * @response {
 *   paymentStatus: string,
 *   transactionId: string,
 *   amount: number
 * }
 */
GET /api/payments/:bookingId/status

// =====================================================
// WALLET ENDPOINTS
// =====================================================

/**
 * GET /api/wallet
 * Get user wallet details
 * 
 * @auth Required: Bearer token
 * 
 * @response {
 *   balance: number,
 *   currency: string,
 *   lastTransactionAt: string,
 *   transactions: Transaction[]
 * }
 */
GET /api/wallet

/**
 * POST /api/wallet/add-funds
 * Add funds to wallet
 * 
 * @auth Required: Bearer token
 * 
 * @request {
 *   amount: number,
 *   paymentMethod: string
 * }
 * 
 * @response {
 *   balance: number,
 *   transaction: Transaction
 * }
 */
POST /api/wallet/add-funds

/**
 * GET /api/wallet/transactions
 * Get wallet transaction history
 * 
 * @auth Required: Bearer token
 * 
 * @query {
 *   page?: number,
 *   limit?: number,
 *   type?: string
 * }
 * 
 * @response {
 *   data: Transaction[],
 *   total: number
 * }
 */
GET /api/wallet/transactions

// =====================================================
// ANALYTICS ENDPOINTS
// =====================================================

/**
 * GET /api/admin/analytics/dashboard
 * Get dashboard statistics (ADMIN only)
 * 
 * @auth Required: Bearer token (admin)
 * 
 * @response {
 *   totalEvents: number,
 *   totalBookings: number,
 *   totalRevenue: number,
 *   activeUsers: number,
 *   bookingTrend: {date, count}[],
 *   eventPerformance: {eventName, bookings, revenue}[]
 * }
 */
GET /api/admin/analytics/dashboard

/**
 * GET /api/admin/analytics/events/:eventId
 * Get event performance metrics (ADMIN only)
 * 
 * @auth Required: Bearer token (admin)
 * 
 * @response {
 *   eventName: string,
 *   totalCapacity: number,
 *   totalBookings: number,
 *   confirmedBookings: number,
 *   revenue: number,
 *   byTier: {tierName, seats, bookings, revenue}[],
 *   byDate: {date, bookings}[]
 * }
 */
GET /api/admin/analytics/events/:eventId

/**
 * GET /api/admin/analytics/revenue
 * Get revenue analytics (ADMIN only)
 * 
 * @auth Required: Bearer token (admin)
 * 
 * @query {
 *   startDate?: string,
 *   endDate?: string,
 *   groupBy?: 'day' | 'week' | 'month'
 * }
 * 
 * @response {
 *   totalRevenue: number,
 *   data: {date, revenue}[],
 *   topEvents: {eventName, revenue}[]
 * }
 */
GET /api/admin/analytics/revenue

// =====================================================
// WAITING LIST ENDPOINTS
// =====================================================

/**
 * GET /api/events/:eventId/waiting-list
 * Get waiting list for event (ADMIN only)
 * 
 * @auth Required: Bearer token (admin)
 * 
 * @response {
 *   data: {userId, userName, joinedAt}[],
 *   total: number
 * }
 */
GET /api/events/:eventId/waiting-list

/**
 * POST /api/events/:eventId/waiting-list/join
 * Join event waiting list
 * 
 * @auth Required: Bearer token
 * 
 * @response {
 *   position: number,
 *   message: string
 * }
 * 
 * @errors
 * - 400: Already in waiting list
 * - 400: Event not fully booked
 */
POST /api/events/:eventId/waiting-list/join

/**
 * POST /api/events/:eventId/waiting-list/leave
 * Leave event waiting list
 * 
 * @auth Required: Bearer token
 * 
 * @response {
 *   message: string
 * }
 */
POST /api/events/:eventId/waiting-list/leave

// =====================================================
// NOTIFICATION ENDPOINTS
// =====================================================

/**
 * GET /api/notifications
 * Get user notifications
 * 
 * @auth Required: Bearer token
 * 
 * @query {
 *   page?: number,
 *   limit?: number,
 *   unreadOnly?: boolean
 * }
 * 
 * @response {
 *   data: Notification[],
 *   total: number,
 *   unread: number
 * }
 */
GET /api/notifications

/**
 * PUT /api/notifications/:id/read
 * Mark notification as read
 * 
 * @auth Required: Bearer token
 * 
 * @response {
 *   message: string
 * }
 */
PUT /api/notifications/:id/read

/**
 * PUT /api/notifications/read-all
 * Mark all notifications as read
 * 
 * @auth Required: Bearer token
 * 
 * @response {
 *   message: string
 * }
 */
PUT /api/notifications/read-all

// =====================================================
// ERROR RESPONSES
// =====================================================

/**
 * Standard error response format:
 * 
 * {
 *   status: number,
 *   error: string,
 *   message: string,
 *   timestamp: string,
 *   path: string,
 *   details?: any
 * }
 * 
 * HTTP Status Codes:
 * - 200: OK
 * - 201: Created
 * - 204: No Content
 * - 400: Bad Request
 * - 401: Unauthorized
 * - 403: Forbidden
 * - 404: Not Found
 * - 409: Conflict
 * - 422: Unprocessable Entity
 * - 500: Internal Server Error
 */

// =====================================================
// AUTHENTICATION SECURITY REQUIREMENTS
// =====================================================

/**
 * JWT Token Structure:
 * 
 * Header: {
 *   "alg": "HS256",
 *   "typ": "JWT"
 * }
 * 
 * Payload: {
 *   "sub": userId,
 *   "email": email,
 *   "role": role,
 *   "iat": issuedAt,
 *   "exp": expiration
 * }
 * 
 * Token refresh: Expires in 24 hours
 * Refresh token: Expires in 7 days
 * 
 * All endpoints require:
 * - Authorization: Bearer {token}
 * - Content-Type: application/json
 */
