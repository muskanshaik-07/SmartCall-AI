import { useEffect, useState } from 'react'
import './App.css'

type Contact = {
  id: number
  name: string
  phone: string
  email: string
  organization: string
  academicYear: string
  semester: string
  dataStatus: string
}

type Page = 'Dashboard' | 'Data Management' | 'Campaigns' | 'Analytics'

function App() {
  const [loggedIn, setLoggedIn] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const [page, setPage] = useState<Page>('Dashboard')

  const [contacts, setContacts] = useState<Contact[]>([])
  const [search, setSearch] = useState('')
  const [editingContact, setEditingContact] = useState<Contact | null>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  const loadContacts = async () => {
    try {
      const response = await fetch('https://smartcall-backend-a50w.onrender.com')

      if (!response.ok) {
        throw new Error('Failed to load contacts')
      }

      const data = await response.json()
      setContacts(data)
    } catch (error) {
      console.error('Error loading contacts:', error)
    }
  }

  useEffect(() => {
    if (loggedIn) {
      loadContacts()
    }
  }, [loggedIn])

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault()

    try {
      const response = await fetch('https://smartcall-backend-a50w.onrender.com', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
        }),
      })

      if (!response.ok) {
        alert('Invalid email or password')
        return
      }

      setLoggedIn(true)
    } catch (error) {
      console.error(error)
      alert('Cannot connect to backend. Make sure NestJS is running.')
    }
  }

  const handleLogout = () => {
    setLoggedIn(false)
    setEmail('')
    setPassword('')
    setPage('Dashboard')
  }

  const handleUpload = async () => {
    if (!selectedFile) {
      alert('Please select a file first.')
      return
    }

    const formData = new FormData()
    formData.append('file', selectedFile)

    try {
      const response = await fetch(
        'https://smartcall-backend-a50w.onrender.com',
        {
          method: 'POST',
          body: formData,
        },
      )

      if (!response.ok) {
        throw new Error('Upload failed')
      }

      alert('File uploaded successfully!')
      setSelectedFile(null)
      await loadContacts()
    } catch (error) {
      console.error(error)
      alert('Upload failed. Please check the backend.')
    }
  }

  const filteredContacts = contacts.filter((contact) => {
    const searchText = search.toLowerCase()

    return (
      contact.name?.toLowerCase().includes(searchText) ||
      contact.phone?.toLowerCase().includes(searchText) ||
      contact.email?.toLowerCase().includes(searchText) ||
      contact.organization?.toLowerCase().includes(searchText) ||
      contact.academicYear?.toLowerCase().includes(searchText) ||
      contact.semester?.toLowerCase().includes(searchText)
    )
  })

  if (!loggedIn) {
    return (
      <div className="login-page">
        <div className="login-card">
          <div className="logo-circle">☎</div>

          <h1>SmartCall AI</h1>

          <p className="login-subtitle">
            Intelligent calling & follow-up platform
          </p>

          <form className="login-form" onSubmit={handleLogin}>
            <label>Email</label>

            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />

            <label>Password</label>

            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />

            <button className="login-button" type="submit">
              Login
            </button>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className="app-layout">
      {/* SIDEBAR */}
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-icon">☎</div>

          <div>
            <h2>SmartCall AI</h2>
            <span>Admin Panel</span>
          </div>
        </div>

        <nav className="sidebar-nav">
          <button
            className={
              page === 'Dashboard'
                ? 'nav-button active'
                : 'nav-button'
            }
            onClick={() => setPage('Dashboard')}
          >
            <span>⌂</span>
            Dashboard
          </button>

          <button
            className={
              page === 'Data Management'
                ? 'nav-button active'
                : 'nav-button'
            }
            onClick={() => setPage('Data Management')}
          >
            <span>▣</span>
            Data Management
          </button>

          <button
            className={
              page === 'Campaigns'
                ? 'nav-button active'
                : 'nav-button'
            }
            onClick={() => setPage('Campaigns')}
          >
            <span>◈</span>
            Campaigns
          </button>

          <button
            className={
              page === 'Analytics'
                ? 'nav-button active'
                : 'nav-button'
            }
            onClick={() => setPage('Analytics')}
          >
            <span>◈</span>
            Analytics
          </button>
        </nav>

        <button className="logout-button" onClick={handleLogout}>
          <span>↪</span>
          Logout
        </button>
      </aside>

      {/* MAIN CONTENT */}
      <main className="main-content">
        {/* TOP BAR */}
        <header className="topbar">
          <div>
            <span className="topbar-label">SMARTCALL AI</span>
          </div>

          <div className="admin-profile">
            <div className="profile-avatar">A</div>

            <div>
              <strong>Admin</strong>
              <small>Administrator</small>
            </div>
          </div>
        </header>

        {/* DASHBOARD */}
        {page === 'Dashboard' && (
          <section className="page-section">
            <div className="welcome-box">
              <div>
                <span className="section-label">ADMIN DASHBOARD</span>

                <h1>Welcome back 👋</h1>

                <p>
                  Manage contacts, campaigns, calling activity and
                  follow-ups from one place.
                </p>
              </div>

              <div className="welcome-icon">☎</div>
            </div>

            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-icon">👥</div>

                <div>
                  <span>Total Contacts</span>
                  <strong>{contacts.length}</strong>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon">📋</div>

                <div>
                  <span>Campaigns</span>
                  <strong>0</strong>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon">☎</div>

                <div>
                  <span>Total Calls</span>
                  <strong>0</strong>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon">⏰</div>

                <div>
                  <span>Follow-ups</span>
                  <strong>0</strong>
                </div>
              </div>
            </div>

            <div className="content-card">
              <div className="card-header">
                <div>
                  <h2>Quick Overview</h2>

                  <p>
                    Use the sidebar to manage your SmartCall AI
                    platform.
                  </p>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* DATA MANAGEMENT */}
        {page === 'Data Management' && (
          <section className="page-section">
            <div className="welcome-box">
              <div>
                <span className="section-label">DATA MANAGEMENT</span>

                <h1>Manage Your Data</h1>

                <p>
                  Upload, search and manage your ongoing contact data.
                </p>
              </div>

              <div className="welcome-icon">▣</div>
            </div>

            {/* UPLOAD */}
            <div className="content-card">
              <div className="card-header">
                <div>
                  <h2>Upload New Data</h2>

                  <p>
                    Upload your contact file to add new data.
                  </p>
                </div>
              </div>

              <div className="upload-area">
                <div className="upload-icon">↑</div>

                <h3>Select Contact File</h3>

                <p>
                  Choose a CSV or Excel file containing your contacts.
                </p>

                <input
                  type="file"
                  accept=".csv,.xlsx,.xls"
                  onChange={(event) => {
                    const file = event.target.files?.[0] || null
                    setSelectedFile(file)
                  }}
                />

                {selectedFile && (
                  <div className="selected-file">
                    Selected: {selectedFile.name}
                  </div>
                )}

                <button
                  className="primary-button"
                  onClick={handleUpload}
                >
                  Upload Data
                </button>
              </div>
            </div>

            {/* CURRENT DATA */}
            <div className="content-card">
              <div className="card-header">
                <div>
                  <h2>Current Data</h2>

                  <p>
                    {contacts.length} contact
                    {contacts.length === 1 ? '' : 's'} available
                  </p>
                </div>

                <button
                  className="secondary-button"
                  onClick={loadContacts}
                >
                  Refresh
                </button>
              </div>

              <div className="search-row">
                <input
                  className="search-input"
                  type="text"
                  placeholder="Search name, phone, email, organization..."
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                />
              </div>

              {editingContact && (
                <div className="edit-box">
                  <div className="edit-header">
                    <h3>Edit Contact</h3>

                    <button
                      className="secondary-button"
                      onClick={() => setEditingContact(null)}
                    >
                      Cancel
                    </button>
                  </div>

                  <div className="edit-fields">
                    <input
                      value={editingContact.name}
                      onChange={(event) =>
                        setEditingContact({
                          ...editingContact,
                          name: event.target.value,
                        })
                      }
                      placeholder="Name"
                    />

                    <input
                      value={editingContact.phone}
                      onChange={(event) =>
                        setEditingContact({
                          ...editingContact,
                          phone: event.target.value,
                        })
                      }
                      placeholder="Phone"
                    />

                    <input
                      value={editingContact.email}
                      onChange={(event) =>
                        setEditingContact({
                          ...editingContact,
                          email: event.target.value,
                        })
                      }
                      placeholder="Email"
                    />

                    <input
                      value={editingContact.organization}
                      onChange={(event) =>
                        setEditingContact({
                          ...editingContact,
                          organization: event.target.value,
                        })
                      }
                      placeholder="Organization"
                    />
                  </div>

                  <button
                    className="primary-button"
                    onClick={() => {
                      alert(
                        'Save Changes clicked. Backend update will be connected next.',
                      )
                    }}
                  >
                    Save Changes
                  </button>
                </div>
              )}

              <div className="table-wrapper">
                <table className="contacts-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Name</th>
                      <th>Phone</th>
                      <th>Email</th>
                      <th>Organization</th>
                      <th>Academic Year</th>
                      <th>Semester</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredContacts.length > 0 ? (
                      filteredContacts.map((contact) => (
                        <tr key={contact.id}>
                          <td>{contact.id}</td>

                          <td>{contact.name}</td>

                          <td>{contact.phone}</td>

                          <td>{contact.email}</td>

                          <td>{contact.organization}</td>

                          <td>{contact.academicYear}</td>

                          <td>{contact.semester}</td>

                          <td>
                            <span className="status-badge">
                              {contact.dataStatus || 'Current'}
                            </span>
                          </td>

                          <td>
                            <button
                              className="edit-button"
                              onClick={() =>
                                setEditingContact(contact)
                              }
                            >
                              Edit
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={9}>
                          <div className="empty-state">
                            No contacts found.
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        )}

        {/* CAMPAIGNS */}
        {page === 'Campaigns' && (
          <section className="page-section">
            <div className="welcome-box">
              <div>
                <span className="section-label">CAMPAIGNS</span>

                <h1>Campaign Management</h1>

                <p>
                  Create and manage calling campaigns for your
                  organization.
                </p>
              </div>

              <div className="welcome-icon">◈</div>
            </div>

            <div className="content-card">
              <div className="card-header">
                <div>
                  <h2>Campaigns</h2>

                  <p>
                    Campaign creation and calling queue management
                    will appear here.
                  </p>
                </div>

                <button className="primary-button">
                  + New Campaign
                </button>
              </div>

              <div className="empty-state">
                No campaigns created yet.
              </div>
            </div>
          </section>
        )}

        {/* ANALYTICS */}
        {page === 'Analytics' && (
          <section className="page-section">
            <div className="welcome-box">
              <div>
                <span className="section-label">ANALYTICS</span>

                <h1>Analytics & Reports</h1>

                <p>
                  Monitor calling activity, outcomes and follow-ups.
                </p>
              </div>

              <div className="welcome-icon">◈</div>
            </div>

            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-icon">☎</div>

                <div>
                  <span>Total Calls</span>
                  <strong>0</strong>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon">✓</div>

                <div>
                  <span>Completed</span>
                  <strong>0</strong>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon">⏰</div>

                <div>
                  <span>Pending</span>
                  <strong>0</strong>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon">↻</div>

                <div>
                  <span>Follow-ups</span>
                  <strong>0</strong>
                </div>
              </div>
            </div>

            <div className="content-card">
              <div className="card-header">
                <div>
                  <h2>Reports</h2>

                  <p>
                    Detailed analytics will be connected to the
                    calling system next.
                  </p>
                </div>
              </div>

              <div className="empty-state">
                No calling data available yet.
              </div>
            </div>
          </section>
        )}
      </main>
    </div>
  )
}

export default App