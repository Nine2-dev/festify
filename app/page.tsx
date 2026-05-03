'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { LogOut, Plus, Trash2, Edit, ShoppingCart, Calendar, Users, TrendingUp, Menu, X } from 'lucide-react';

interface User {
  id: number;
  email: string;
  fullName: string;
  role: 'USER' | 'ADMIN';
  department?: string;
  yearOfStudy?: number;
}

interface Venue {
  id: number;
  venueName: string;
  address: string;
  totalCapacity: number;
  facilities: string;
}

interface PriceTier {
  id: number;
  eventId: number;
  tierName: string;
  price: number;
  totalSeats: number;
  availableSeats: number;
}

interface Event {
  id: number;
  eventName: string;
  description: string;
  eventType: string;
  venueId: number;
  eventDate: string;
  status: string;
  bannerImageUrl?: string;
  organizerName: string;
  maxCapacity: number;
  priceTiers: PriceTier[];
}

interface Booking {
  id: number;
  bookingReference: string;
  userId: number;
  eventId: number;
  priceTierId: number;
  numTickets: number;
  totalAmount: number;
  bookingStatus: string;
  bookedAt: string;
}

interface DashboardStats {
  totalEvents: number;
  totalBookings: number;
  totalRevenue: number;
  activeUsers: number;
}

export default function Festify() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [view, setView] = useState<'login' | 'events' | 'admin' | 'bookings'>('login');
  const [events, setEvents] = useState<Event[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [venues, setVenues] = useState<Venue[]>([]);
  const [dashboardStats, setDashboardStats] = useState<DashboardStats>({
    totalEvents: 0,
    totalBookings: 0,
    totalRevenue: 0,
    activeUsers: 0,
  });
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [bookingQuantity, setBookingQuantity] = useState(1);
  const [selectedTier, setSelectedTier] = useState<PriceTier | null>(null);
  const [showBookingModal, setShowBookingModal] = useState(false);

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);

  // Admin form states
  const [newEvent, setNewEvent] = useState({
    eventName: '',
    description: '',
    eventType: 'MUSIC',
    venueId: 0,
    eventDate: '',
    organizerName: '',
    maxCapacity: 100,
  });

  const [newVenue, setNewVenue] = useState({
    venueName: '',
    address: '',
    totalCapacity: 500,
    facilities: '',
  });

  useEffect(() => {
    // Load mock data
    loadMockData();
  }, []);

  const loadMockData = () => {
    const mockVenues: Venue[] = [
      {
        id: 1,
        venueName: 'Main Auditorium',
        address: 'Campus Central',
        totalCapacity: 1000,
        facilities: 'Stage, Sound System, Projector',
      },
      {
        id: 2,
        venueName: 'Open Ground',
        address: 'Sports Complex',
        totalCapacity: 2000,
        facilities: 'Open Air, Parking',
      },
      {
        id: 3,
        venueName: 'Tech Conference Hall',
        address: 'IT Building',
        totalCapacity: 500,
        facilities: 'WiFi, Projectors, Charging Stations',
      },
    ];

    const mockEvents: Event[] = [
      {
        id: 1,
        eventName: 'College Concert 2026',
        description: 'Annual music festival featuring top artists',
        eventType: 'MUSIC',
        venueId: 1,
        eventDate: '2026-06-15',
        status: 'PUBLISHED',
        organizerName: 'Cultural Committee',
        maxCapacity: 1000,
        bannerImageUrl: 'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=500',
        priceTiers: [
          { id: 1, eventId: 1, tierName: 'Early Bird', price: 299, totalSeats: 200, availableSeats: 50 },
          { id: 2, eventId: 1, tierName: 'Regular', price: 499, totalSeats: 500, availableSeats: 200 },
          { id: 3, eventId: 1, tierName: 'VIP', price: 999, totalSeats: 300, availableSeats: 100 },
        ],
      },
      {
        id: 2,
        eventName: 'Tech Summit 2026',
        description: 'Innovation and technology conference',
        eventType: 'TECH',
        venueId: 3,
        eventDate: '2026-07-20',
        status: 'PUBLISHED',
        organizerName: 'Tech Club',
        maxCapacity: 500,
        bannerImageUrl: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=500',
        priceTiers: [
          { id: 4, eventId: 2, tierName: 'Student', price: 199, totalSeats: 250, availableSeats: 100 },
          { id: 5, eventId: 2, tierName: 'Professional', price: 799, totalSeats: 250, availableSeats: 50 },
        ],
      },
      {
        id: 3,
        eventName: 'Sports Day',
        description: 'Inter-college sports competition',
        eventType: 'SPORTS',
        venueId: 2,
        eventDate: '2026-08-10',
        status: 'ACTIVE',
        organizerName: 'Sports Department',
        maxCapacity: 2000,
        bannerImageUrl: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=500',
        priceTiers: [
          { id: 6, eventId: 3, tierName: 'General', price: 0, totalSeats: 2000, availableSeats: 1500 },
        ],
      },
    ];

    const mockBookings: Booking[] = [
      {
        id: 1,
        bookingReference: 'FEST-2026-0001',
        userId: 1,
        eventId: 1,
        priceTierId: 2,
        numTickets: 2,
        totalAmount: 998,
        bookingStatus: 'CONFIRMED',
        bookedAt: '2026-05-01',
      },
      {
        id: 2,
        bookingReference: 'FEST-2026-0002',
        userId: 1,
        eventId: 2,
        priceTierId: 4,
        numTickets: 1,
        totalAmount: 199,
        bookingStatus: 'CONFIRMED',
        bookedAt: '2026-05-02',
      },
    ];

    setVenues(mockVenues);
    setEvents(mockEvents);
    setBookings(mockBookings);
    setDashboardStats({
      totalEvents: mockEvents.length,
      totalBookings: mockBookings.length,
      totalRevenue: 1197,
      activeUsers: 45,
    });
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const user: User = {
      id: 1,
      email,
      fullName: fullName || email.split('@')[0],
      role: email.includes('admin') ? 'ADMIN' : 'USER',
      department: 'Computer Science',
      yearOfStudy: 2,
    };
    setCurrentUser(user);
    setIsLoggedIn(true);
    setView(user.role === 'ADMIN' ? 'admin' : 'events');
    setEmail('');
    setPassword('');
    setFullName('');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setIsLoggedIn(false);
    setView('login');
    setShowBookingModal(false);
    setSelectedEvent(null);
  };

  const handleBookEvent = (event: Event, tier: PriceTier) => {
    setSelectedEvent(event);
    setSelectedTier(tier);
    setShowBookingModal(true);
  };

  const confirmBooking = () => {
    if (!selectedEvent || !selectedTier || !currentUser) return;

    const bookingRef = `FEST-2026-${String(bookings.length + 1).padStart(4, '0')}`;
    const newBooking: Booking = {
      id: bookings.length + 1,
      bookingReference: bookingRef,
      userId: currentUser.id,
      eventId: selectedEvent.id,
      priceTierId: selectedTier.id,
      numTickets: bookingQuantity,
      totalAmount: selectedTier.price * bookingQuantity,
      bookingStatus: 'CONFIRMED',
      bookedAt: new Date().toISOString().split('T')[0],
    };

    setBookings([...bookings, newBooking]);
    setShowBookingModal(false);
    setBookingQuantity(1);
    alert(`Booking confirmed! Reference: ${bookingRef}`);
  };

  const handleAddEvent = (e: React.FormEvent) => {
    e.preventDefault();
    const event: Event = {
      id: events.length + 1,
      ...newEvent,
      status: 'DRAFT',
      priceTiers: [
        { id: 1, eventId: events.length + 1, tierName: 'Regular', price: 500, totalSeats: 100, availableSeats: 100 },
      ],
    };
    setEvents([...events, event]);
    setNewEvent({
      eventName: '',
      description: '',
      eventType: 'MUSIC',
      venueId: 0,
      eventDate: '',
      organizerName: '',
      maxCapacity: 100,
    });
    alert('Event created successfully!');
  };

  const handleAddVenue = (e: React.FormEvent) => {
    e.preventDefault();
    const venue: Venue = {
      id: venues.length + 1,
      ...newVenue,
    };
    setVenues([...venues, venue]);
    setNewVenue({
      venueName: '',
      address: '',
      totalCapacity: 500,
      facilities: '',
    });
    alert('Venue added successfully!');
  };

  // Login View
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-black flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-white/10 border-white/20 backdrop-blur-xl">
          <CardHeader className="space-y-2 text-center">
            <CardTitle className="text-3xl font-bold text-white">FESTIFY</CardTitle>
            <CardDescription className="text-blue-200">College Festival Booking System</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              {isSignUp && (
                <Input
                  placeholder="Full Name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                />
              )}
              <Input
                type="email"
                placeholder="Email (use admin@fest.com for admin)"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                required
              />
              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                required
              />
              <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                {isSignUp ? 'Sign Up' : 'Login'}
              </Button>
            </form>
            <button
              type="button"
              onClick={() => setIsSignUp(!isSignUp)}
              className="w-full mt-4 text-blue-300 hover:text-blue-200 text-sm"
            >
              {isSignUp ? 'Already have an account? Login' : "Don't have an account? Sign Up"}
            </button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Events Browsing View
  if (view === 'events' && currentUser?.role === 'USER') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-black">
        {/* Header */}
        <header className="bg-black/40 backdrop-blur-xl border-b border-white/10 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-blue-400">FESTIFY</h1>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden text-white"
              >
                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
            <div className="hidden md:flex items-center gap-4">
              <Button variant="outline" onClick={() => setView('bookings')} className="text-white border-white/20">
                <ShoppingCart size={18} className="mr-2" />
                My Bookings
              </Button>
              <Button variant="destructive" onClick={handleLogout}>
                <LogOut size={18} className="mr-2" />
                Logout
              </Button>
            </div>
          </div>
          {mobileMenuOpen && (
            <div className="md:hidden px-4 pb-4 space-y-2">
              <Button variant="outline" onClick={() => setView('bookings')} className="w-full text-white border-white/20">
                <ShoppingCart size={18} className="mr-2" />
                My Bookings
              </Button>
              <Button variant="destructive" onClick={handleLogout} className="w-full">
                <LogOut size={18} className="mr-2" />
                Logout
              </Button>
            </div>
          )}
        </header>

        {/* Events Grid */}
        <main className="max-w-7xl mx-auto px-4 py-12">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-white mb-2">Discover Events</h2>
            <p className="text-white/60">Explore and book tickets for upcoming college festivals</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => (
              <Card key={event.id} className="bg-white/10 border-white/20 backdrop-blur-xl hover:bg-white/20 transition overflow-hidden">
                {event.bannerImageUrl && (
                  <div className="w-full h-48 overflow-hidden">
                    <img src={event.bannerImageUrl} alt={event.eventName} className="w-full h-full object-cover" />
                  </div>
                )}
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-white">{event.eventName}</CardTitle>
                      <CardDescription className="text-blue-200">{event.eventType}</CardDescription>
                    </div>
                    <Badge className="bg-blue-600">{event.status}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-white/80 text-sm">{event.description}</p>
                  <div className="space-y-2 text-sm text-white/70">
                    <div className="flex items-center gap-2">
                      <Calendar size={16} />
                      {new Date(event.eventDate).toLocaleDateString()}
                    </div>
                    <div className="flex items-center gap-2">
                      <Users size={16} />
                      {event.maxCapacity} seats available
                    </div>
                  </div>
                  <div className="space-y-2">
                    <p className="text-white/60 text-xs font-semibold">PRICING TIERS</p>
                    {event.priceTiers.map((tier) => (
                      <div key={tier.id} className="flex items-center justify-between bg-white/10 p-2 rounded">
                        <span className="text-white text-sm">{tier.tierName}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-blue-300 font-semibold">₹{tier.price}</span>
                          <Button
                            size="sm"
                            onClick={() => handleBookEvent(event, tier)}
                            className="bg-blue-600 hover:bg-blue-700 text-white h-7"
                          >
                            Book
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </main>

        {/* Booking Modal */}
        {showBookingModal && selectedEvent && selectedTier && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <Card className="bg-slate-900 border-white/20 w-full max-w-md">
              <CardHeader>
                <CardTitle className="text-white">Confirm Booking</CardTitle>
                <CardDescription className="text-blue-200">{selectedEvent.eventName}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2 text-white">
                  <p><span className="text-white/60">Event:</span> {selectedEvent.eventName}</p>
                  <p><span className="text-white/60">Tier:</span> {selectedTier.tierName}</p>
                  <p><span className="text-white/60">Price:</span> ₹{selectedTier.price}</p>
                  <div className="flex items-center gap-2 py-2">
                    <label className="text-white/60">Quantity:</label>
                    <Input
                      type="number"
                      min="1"
                      value={bookingQuantity}
                      onChange={(e) => setBookingQuantity(parseInt(e.target.value) || 1)}
                      className="w-20 bg-white/10 border-white/20 text-white"
                    />
                  </div>
                  <p className="text-lg font-bold text-blue-300 pt-2">Total: ₹{selectedTier.price * bookingQuantity}</p>
                </div>
                <div className="flex gap-2">
                  <Button onClick={confirmBooking} className="flex-1 bg-blue-600 hover:bg-blue-700">
                    Confirm Booking
                  </Button>
                  <Button onClick={() => setShowBookingModal(false)} variant="outline" className="flex-1 border-white/20">
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    );
  }

  // Bookings View
  if (view === 'bookings' && currentUser?.role === 'USER') {
    const userBookings = bookings.filter((b) => b.userId === currentUser.id);

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-black">
        <header className="bg-black/40 backdrop-blur-xl border-b border-white/10 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
            <h1 className="text-2xl font-bold text-blue-400">FESTIFY</h1>
            <div className="flex items-center gap-4">
              <Button variant="outline" onClick={() => setView('events')} className="text-white border-white/20">
                Browse Events
              </Button>
              <Button variant="destructive" onClick={handleLogout}>
                Logout
              </Button>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 py-12">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-white mb-2">My Bookings</h2>
            <p className="text-white/60">View and manage your event reservations</p>
          </div>

          {userBookings.length === 0 ? (
            <Card className="bg-white/10 border-white/20 backdrop-blur-xl">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <ShoppingCart size={48} className="text-white/40 mb-4" />
                <p className="text-white/60 text-lg">No bookings yet. Start exploring events!</p>
                <Button onClick={() => setView('events')} className="mt-4 bg-blue-600 hover:bg-blue-700">
                  Browse Events
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {userBookings.map((booking) => {
                const event = events.find((e) => e.id === booking.eventId);
                const tier = event?.priceTiers.find((t) => t.id === booking.priceTierId);

                return (
                  <Card key={booking.id} className="bg-white/10 border-white/20 backdrop-blur-xl">
                    <CardContent className="pt-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className="text-white font-semibold text-lg">{event?.eventName}</p>
                          <p className="text-white/60 text-sm mt-1">Booking Reference: {booking.bookingReference}</p>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                            <div>
                              <p className="text-white/60 text-xs">Tier</p>
                              <p className="text-white font-semibold">{tier?.tierName}</p>
                            </div>
                            <div>
                              <p className="text-white/60 text-xs">Tickets</p>
                              <p className="text-white font-semibold">{booking.numTickets}</p>
                            </div>
                            <div>
                              <p className="text-white/60 text-xs">Amount</p>
                              <p className="text-blue-300 font-semibold">₹{booking.totalAmount}</p>
                            </div>
                            <div>
                              <p className="text-white/60 text-xs">Status</p>
                              <Badge className="bg-green-600">{booking.bookingStatus}</Badge>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </main>
      </div>
    );
  }

  // Admin Dashboard
  if (view === 'admin' && currentUser?.role === 'ADMIN') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-black">
        <header className="bg-black/40 backdrop-blur-xl border-b border-white/10 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
            <h1 className="text-2xl font-bold text-blue-400">FESTIFY ADMIN</h1>
            <Button variant="destructive" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 py-12">
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            {[
              { label: 'Total Events', value: dashboardStats.totalEvents, icon: Calendar },
              { label: 'Total Bookings', value: dashboardStats.totalBookings, icon: ShoppingCart },
              { label: 'Revenue', value: `₹${dashboardStats.totalRevenue}`, icon: TrendingUp },
              { label: 'Active Users', value: dashboardStats.activeUsers, icon: Users },
            ].map((stat, idx) => {
              const Icon = stat.icon;
              return (
                <Card key={idx} className="bg-white/10 border-white/20 backdrop-blur-xl">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-white/60 text-sm">{stat.label}</p>
                        <p className="text-white text-2xl font-bold">{stat.value}</p>
                      </div>
                      <Icon size={32} className="text-blue-400" />
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Chart */}
          <Card className="bg-white/10 border-white/20 backdrop-blur-xl mb-8">
            <CardHeader>
              <CardTitle className="text-white">Bookings Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={events.map((e) => ({
                    name: e.eventName.slice(0, 10),
                    bookings: bookings.filter((b) => b.eventId === e.id).length,
                  }))}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis dataKey="name" stroke="#fff" />
                  <YAxis stroke="#fff" />
                  <Tooltip contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', border: 'none' }} />
                  <Legend />
                  <Bar dataKey="bookings" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Add Event Form */}
          <Card className="bg-white/10 border-white/20 backdrop-blur-xl mb-8">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Plus size={20} />
                Create New Event
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAddEvent} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    placeholder="Event Name"
                    value={newEvent.eventName}
                    onChange={(e) => setNewEvent({ ...newEvent, eventName: e.target.value })}
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                    required
                  />
                  <select
                    value={newEvent.eventType}
                    onChange={(e) => setNewEvent({ ...newEvent, eventType: e.target.value })}
                    className="bg-white/10 border border-white/20 text-white rounded px-3 py-2"
                  >
                    <option value="MUSIC">Music</option>
                    <option value="TECH">Tech</option>
                    <option value="SPORTS">Sports</option>
                    <option value="CULTURAL">Cultural</option>
                  </select>
                  <Input
                    placeholder="Organizer Name"
                    value={newEvent.organizerName}
                    onChange={(e) => setNewEvent({ ...newEvent, organizerName: e.target.value })}
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                  />
                  <Input
                    type="date"
                    value={newEvent.eventDate}
                    onChange={(e) => setNewEvent({ ...newEvent, eventDate: e.target.value })}
                    className="bg-white/10 border-white/20 text-white"
                    required
                  />
                  <select
                    value={newEvent.venueId}
                    onChange={(e) => setNewEvent({ ...newEvent, venueId: parseInt(e.target.value) })}
                    className="bg-white/10 border border-white/20 text-white rounded px-3 py-2"
                  >
                    <option value={0}>Select Venue</option>
                    {venues.map((v) => (
                      <option key={v.id} value={v.id}>
                        {v.venueName}
                      </option>
                    ))}
                  </select>
                  <Input
                    type="number"
                    placeholder="Max Capacity"
                    value={newEvent.maxCapacity}
                    onChange={(e) => setNewEvent({ ...newEvent, maxCapacity: parseInt(e.target.value) })}
                    className="bg-white/10 border-white/20 text-white"
                  />
                </div>
                <textarea
                  placeholder="Description"
                  value={newEvent.description}
                  onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                  className="w-full bg-white/10 border border-white/20 text-white rounded px-3 py-2 placeholder:text-white/50"
                  rows={3}
                />
                <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
                  <Plus size={18} className="mr-2" />
                  Create Event
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Add Venue Form */}
          <Card className="bg-white/10 border-white/20 backdrop-blur-xl mb-8">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Plus size={20} />
                Add New Venue
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAddVenue} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    placeholder="Venue Name"
                    value={newVenue.venueName}
                    onChange={(e) => setNewVenue({ ...newVenue, venueName: e.target.value })}
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                    required
                  />
                  <Input
                    type="number"
                    placeholder="Total Capacity"
                    value={newVenue.totalCapacity}
                    onChange={(e) => setNewVenue({ ...newVenue, totalCapacity: parseInt(e.target.value) })}
                    className="bg-white/10 border-white/20 text-white"
                  />
                </div>
                <Input
                  placeholder="Address"
                  value={newVenue.address}
                  onChange={(e) => setNewVenue({ ...newVenue, address: e.target.value })}
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                />
                <textarea
                  placeholder="Facilities (comma-separated)"
                  value={newVenue.facilities}
                  onChange={(e) => setNewVenue({ ...newVenue, facilities: e.target.value })}
                  className="w-full bg-white/10 border border-white/20 text-white rounded px-3 py-2 placeholder:text-white/50"
                  rows={2}
                />
                <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
                  <Plus size={18} className="mr-2" />
                  Add Venue
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Events List */}
          <Card className="bg-white/10 border-white/20 backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="text-white">All Events</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {events.map((event) => (
                  <div key={event.id} className="flex items-center justify-between bg-white/5 p-4 rounded border border-white/10">
                    <div>
                      <p className="text-white font-semibold">{event.eventName}</p>
                      <p className="text-white/60 text-sm">{event.eventType}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge>{event.status}</Badge>
                      <Button variant="outline" size="sm" className="border-white/20">
                        <Edit size={16} />
                      </Button>
                      <Button variant="destructive" size="sm">
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  return null;
}
