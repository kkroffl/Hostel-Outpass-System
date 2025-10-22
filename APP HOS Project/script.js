const mockData = {
    students: [
        {
            id: '1',
            name: 'Rahul Sharma',
            email: 'rahul@student.edu',
            password: 'password',
            rollNumber: 'CS21B001',
            hostelBlock: 'A Block',
            roomNumber: '201',
            phoneNumber: '+91 9876543210'
        },
        {
            id: '2',
            name: 'Priya Kumar',
            email: 'priya@student.edu',
            password: 'password',
            rollNumber: 'CS21B002',
            hostelBlock: 'B Block',
            roomNumber: '305',
            phoneNumber: '+91 9876543211'
        }
    ],
    admins: [
        {
            id: 'admin1',
            name: 'Dr. Rajesh Verma',
            email: 'admin@college.edu',
            password: 'admin123',
            role: 'Hostel Warden',
            block: 'A Block'
        }
    ],
    outpassRequests: [
        {
            id: 'OP001',
            studentId: '1',
            studentName: 'Rahul Sharma',
            rollNumber: 'CS21B001',
            hostelBlock: 'A Block',
            roomNumber: '201',
            reason: 'Family Emergency',
            destination: 'Home - Mumbai',
            fromDate: '2025-08-15',
            toDate: '2025-08-17',
            fromTime: '10:00',
            toTime: '18:00',
            contactNumber: '+91 9876543210',
            status: 'pending',
            requestedAt: new Date().toISOString()
        },
        {
            id: 'OP002',
            studentId: '2',
            studentName: 'Priya Kumar',
            rollNumber: 'CS21B002',
            hostelBlock: 'B Block',
            roomNumber: '305',
            reason: 'Medical Appointment',
            destination: 'City Hospital',
            fromDate: '2025-08-14',
            toDate: '2025-08-14',
            fromTime: '14:00',
            toTime: '17:00',
            contactNumber: '+91 9876543211',
            status: 'approved',
            requestedAt: new Date(Date.now() - 86400000).toISOString(),
            approvedAt: new Date(Date.now() - 79200000).toISOString(),
            approvedBy: 'Dr. Rajesh Verma'
        },
        {
            id: 'OP003',
            studentId: '1',
            studentName: 'Rahul Sharma',
            rollNumber: 'CS21B001',
            hostelBlock: 'A Block',
            roomNumber: '201',
            reason: 'Weekend Home Visit',
            destination: 'Home - Mumbai',
            fromDate: '2025-08-10',
            toDate: '2025-08-11',
            fromTime: '08:00',
            toTime: '20:00',
            contactNumber: '+91 9876543210',
            status: 'rejected',
            requestedAt: new Date(Date.now() - 172800000).toISOString(),
            rejectedAt: new Date(Date.now() - 165600000).toISOString(),
            rejectedBy: 'Dr. Rajesh Verma',
            rejectionReason: 'Insufficient notice period'
        }
    ]
};

// LocalStorage Helper Functions
function initializeData() {
    if (!localStorage.getItem('outpassRequests')) {
        localStorage.setItem('outpassRequests', JSON.stringify(mockData.outpassRequests));
    }
}

function getCurrentUser() {
    const userStr = localStorage.getItem('currentUser');
    return userStr ? JSON.parse(userStr) : null;
}

function setCurrentUser(user) {
    localStorage.setItem('currentUser', JSON.stringify(user));
}

function clearCurrentUser() {
    localStorage.removeItem('currentUser');
}

function getOutpassRequests() {
    const requestsStr = localStorage.getItem('outpassRequests');
    return requestsStr ? JSON.parse(requestsStr) : mockData.outpassRequests;
}

function saveOutpassRequests(requests) {
    localStorage.setItem('outpassRequests', JSON.stringify(requests));
}

// Initialize data on page load
initializeData();

// Navigation Handler
function handleCTA() {
    const currentUser = getCurrentUser();
    if (currentUser) {
        if (currentUser.role === 'student') {
            window.location.href = 'student-dashboard.html';
        } else {
            window.location.href = 'admin-dashboard.html';
        }
    } else {
        window.location.href = 'login.html';
    }
}

// Update Navbar based on login status
function updateNavbar() {
    const navAuth = document.getElementById('navAuth');
    if (!navAuth) return;
    
    const currentUser = getCurrentUser();
    
    if (currentUser) {
        navAuth.innerHTML = `
            <div style=\"display: flex; align-items: center; gap: 1rem;\">
                <span style=\"font-size: 0.875rem; color: #6b7280;\">
                    <strong>${currentUser.name}</strong>
                </span>
                <button class=\"btn btn-outline\" onclick=\"handleLogout()\">Logout</button>
            </div>
        `;
    } else {
        navAuth.innerHTML = `
            <button class=\"btn btn-primary\" onclick=\"location.href='login.html'\">Login</button>
        `;
    }
}

// Logout Handler
function handleLogout() {
    clearCurrentUser();
    window.location.href = 'index.html';
}

// Tab Functionality
function initTabs() {
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const target = button.getAttribute('data-tab');
            
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            
            button.classList.add('active');
            document.getElementById(target).classList.add('active');
        });
    });
}

// Login Handler
function handleLogin(event) {
    event.preventDefault();
    
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    const student = mockData.students.find(s => s.email === email);
    
    if (student) {
        const user = { ...student, role: 'student' };
        setCurrentUser(user);
        showNotification('Login Successful!', 'success');
        setTimeout(() => {
            window.location.href = 'student-dashboard.html';
        }, 1000);
    } else {
        showNotification('Invalid credentials. Try: rahul@student.edu', 'danger');
    }
}

// Register Handler
function handleRegister(event) {
    event.preventDefault();
    
    const formData = {
        id: Date.now().toString(),
        name: document.getElementById('regName').value,
        email: document.getElementById('regEmail').value,
        password: document.getElementById('regPassword').value,
        rollNumber: document.getElementById('regRollNumber').value,
        phoneNumber: document.getElementById('regPhone').value,
        hostelBlock: document.getElementById('regHostelBlock').value,
        roomNumber: document.getElementById('regRoomNumber').value,
        role: 'student'
    };
    
    setCurrentUser(formData);
    showNotification('Registration Successful!', 'success');
    setTimeout(() => {
        window.location.href = 'student-dashboard.html';
    }, 1000);
}

// Admin Login Handler
function handleAdminLogin(event) {
    event.preventDefault();
    
    const email = document.getElementById('adminEmail').value;
    const password = document.getElementById('adminPassword').value;
    
    const admin = mockData.admins.find(a => a.email === email);
    
    if (admin) {
        const user = { ...admin, role: 'admin' };
        setCurrentUser(user);
        showNotification('Login Successful!', 'success');
        setTimeout(() => {
            window.location.href = 'admin-dashboard.html';
        }, 1000);
    } else {
        showNotification('Invalid credentials. Try: admin@college.edu', 'danger');
    }
}

// Contact Form Handler
function handleContactSubmit(event) {
    event.preventDefault();
    showNotification('Message sent successfully! We will get back to you soon.', 'success');
    event.target.reset();
}

// Modal Functions
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('active');
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('active');
    }
}

// Close modal when clicking outside
window.addEventListener('click', (event) => {
    if (event.target.classList.contains('modal')) {
        event.target.classList.remove('active');
    }
});

// Notification Function
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `alert-box alert-${type}`;
    notification.style.position = 'fixed';
    notification.style.top = '20px';
    notification.style.right = '20px';
    notification.style.zIndex = '10000';
    notification.style.minWidth = '300px';
    notification.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transition = 'opacity 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Accordion Functionality
function initAccordion() {
    const accordionHeaders = document.querySelectorAll('.accordion-header');
    
    accordionHeaders.forEach(header => {
        header.addEventListener('click', () => {
            const item = header.parentElement;
            const isActive = item.classList.contains('active');
            
            // Close all accordion items
            document.querySelectorAll('.accordion-item').forEach(i => {
                i.classList.remove('active');
            });
            
            // Open clicked item if it wasn't active
            if (!isActive) {
                item.classList.add('active');
            }
        });
    });
}

// Format Date
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

// Student Dashboard Functions
function initStudentDashboard() {
    const currentUser = getCurrentUser();
    
    if (!currentUser || currentUser.role !== 'student') {
        window.location.href = 'login.html';
        return;
    }
    
    // Update header
    document.getElementById('studentName').textContent = currentUser.name;
    document.getElementById('studentInfo').textContent = 
        `${currentUser.rollNumber} | ${currentUser.hostelBlock} - Room ${currentUser.roomNumber}`;
    
    // Load requests
    loadStudentRequests();
}

function loadStudentRequests() {
    const currentUser = getCurrentUser();
    const allRequests = getOutpassRequests();
    const userRequests = allRequests.filter(r => r.studentId === currentUser.id);
    
    // Update stats
    document.getElementById('totalRequests').textContent = userRequests.length;
    document.getElementById('pendingRequests').textContent = 
        userRequests.filter(r => r.status === 'pending').length;
    document.getElementById('approvedRequests').textContent = 
        userRequests.filter(r => r.status === 'approved').length;
    document.getElementById('rejectedRequests').textContent = 
        userRequests.filter(r => r.status === 'rejected').length;
    
    // Display requests
    displayStudentRequests(userRequests, 'all');
}

function displayStudentRequests(requests, filter) {
    const container = document.getElementById('requestsList');
    if (!container) return;
    
    const filteredRequests = filter === 'all' 
        ? requests 
        : requests.filter(r => r.status === filter);
    
    if (filteredRequests.length === 0) {
        container.innerHTML = '<p style=\"text-align: center; color: #6b7280; padding: 2rem;\">No requests found</p>';
        return;
    }
    
    container.innerHTML = filteredRequests.map(request => `
        <div class=\"request-card\">
            <div class=\"request-header\">
                <div>
                    <div class=\"request-title\">${request.reason}</div>
                    <div class=\"request-id\">Request ID: ${request.id}</div>
                </div>
                <span class=\"badge badge-${request.status}\">${request.status.toUpperCase()}</span>
            </div>
            <div class=\"request-details\">
                <div>
                    <div class=\"request-detail-label\">Destination:</div>
                    <div class=\"request-detail-value\">${request.destination}</div>
                </div>
                <div>
                    <div class=\"request-detail-label\">Duration:</div>
                    <div class=\"request-detail-value\">${request.fromDate} to ${request.toDate}</div>
                </div>
                <div>
                    <div class=\"request-detail-label\">Time:</div>
                    <div class=\"request-detail-value\">${request.fromTime} - ${request.toTime}</div>
                </div>
                <div>
                    <div class=\"request-detail-label\">Requested:</div>
                    <div class=\"request-detail-value\">${formatDate(request.requestedAt)}</div>
                </div>
            </div>
            ${request.status === 'approved' ? `
                <div class=\"alert-box alert-success mt-4\" style=\"margin-top: 1rem;\">
                    <strong>Approved by:</strong> ${request.approvedBy} on ${formatDate(request.approvedAt)}
                </div>
            ` : ''}
            ${request.status === 'rejected' ? `
                <div class=\"alert-box alert-danger mt-4\" style=\"margin-top: 1rem;\">
                    <strong>Rejection Reason:</strong> ${request.rejectionReason}
                </div>
            ` : ''}
        </div>
    `).join('');
}

function filterRequests(filter) {
    const currentUser = getCurrentUser();
    const allRequests = getOutpassRequests();
    const userRequests = allRequests.filter(r => r.studentId === currentUser.id);
    
    // Update active tab
    document.querySelectorAll('.tab-button').forEach(btn => {
        btn.classList.remove('active');
        if (btn.getAttribute('data-filter') === filter) {
            btn.classList.add('active');
        }
    });
    
    displayStudentRequests(userRequests, filter);
}

function handleNewOutpassSubmit(event) {
    event.preventDefault();
    
    const currentUser = getCurrentUser();
    const allRequests = getOutpassRequests();
    
    const newRequest = {
        id: `OP${Date.now()}`,
        studentId: currentUser.id,
        studentName: currentUser.name,
        rollNumber: currentUser.rollNumber,
        hostelBlock: currentUser.hostelBlock,
        roomNumber: currentUser.roomNumber,
        reason: document.getElementById('outpassReason').value,
        destination: document.getElementById('outpassDestination').value,
        fromDate: document.getElementById('outpassFromDate').value,
        toDate: document.getElementById('outpassToDate').value,
        fromTime: document.getElementById('outpassFromTime').value,
        toTime: document.getElementById('outpassToTime').value,
        contactNumber: document.getElementById('outpassContact').value,
        status: 'pending',
        requestedAt: new Date().toISOString()
    };
    
    allRequests.push(newRequest);
    saveOutpassRequests(allRequests);
    
    showNotification('Outpass request submitted successfully!', 'success');
    closeModal('newOutpassModal');
    
    // Reload requests
    loadStudentRequests();
    
    // Reset form
    event.target.reset();
}

// Admin Dashboard Functions
function initAdminDashboard() {
    const currentUser = getCurrentUser();
    
    if (!currentUser || currentUser.role !== 'admin') {
        window.location.href = 'admin-login.html';
        return;
    }
    
    // Update header
    document.getElementById('adminName').textContent = currentUser.name;
    document.getElementById('adminRole').textContent = currentUser.role;
    
    // Load all requests
    loadAdminRequests();
}

function loadAdminRequests() {
    const allRequests = getOutpassRequests();
    
    // Update stats
    document.getElementById('totalRequestsAdmin').textContent = allRequests.length;
    document.getElementById('pendingRequestsAdmin').textContent = 
        allRequests.filter(r => r.status === 'pending').length;
    document.getElementById('approvedRequestsAdmin').textContent = 
        allRequests.filter(r => r.status === 'approved').length;
    document.getElementById('rejectedRequestsAdmin').textContent = 
        allRequests.filter(r => r.status === 'rejected').length;
    
    // Display requests (pending by default)
    displayAdminRequests(allRequests, 'pending');
}

function displayAdminRequests(requests, filter) {
    const container = document.getElementById('adminRequestsList');
    if (!container) return;
    
    const filteredRequests = filter === 'all' 
        ? requests 
        : requests.filter(r => r.status === filter);
    
    if (filteredRequests.length === 0) {
        container.innerHTML = '<p style=\"text-align: center; color: #6b7280; padding: 2rem;\">No requests found</p>';
        return;
    }
    
    container.innerHTML = filteredRequests.map(request => `
        <div class=\"request-card\">
            <div class=\"request-header\">
                <div>
                    <div class=\"request-title\">${request.reason}</div>
                    <div class=\"request-id\">
                        ${request.studentName} (${request.rollNumber}) | 
                        ${request.hostelBlock} - Room ${request.roomNumber}
                    </div>
                    <div class=\"request-id\">Request ID: ${request.id}</div>
                </div>
                <span class=\"badge badge-${request.status}\">${request.status.toUpperCase()}</span>
            </div>
            <div class=\"request-details\">
                <div>
                    <div class=\"request-detail-label\">Destination:</div>
                    <div class=\"request-detail-value\">${request.destination}</div>
                </div>
                <div>
                    <div class=\"request-detail-label\">Duration:</div>
                    <div class=\"request-detail-value\">${request.fromDate} to ${request.toDate}</div>
                </div>
                <div>
                    <div class=\"request-detail-label\">Time:</div>
                    <div class=\"request-detail-value\">${request.fromTime} - ${request.toTime}</div>
                </div>
                <div>
                    <div class=\"request-detail-label\">Contact:</div>
                    <div class=\"request-detail-value\">${request.contactNumber}</div>
                </div>
                <div>
                    <div class=\"request-detail-label\">Requested:</div>
                    <div class=\"request-detail-value\">${formatDate(request.requestedAt)}</div>
                </div>
            </div>
            ${request.status === 'pending' ? `
                <div class=\"request-actions\">
                    <button class=\"btn btn-success\" onclick=\"approveRequest('${request.id}')\">
                        Approve
                    </button>
                    <button class=\"btn btn-danger\" onclick=\"openRejectModal('${request.id}')\">
                        Reject
                    </button>
                </div>
            ` : ''}
            ${request.status === 'approved' ? `
                <div class=\"alert-box alert-success mt-4\" style=\"margin-top: 1rem;\">
                    <strong>Approved by:</strong> ${request.approvedBy} on ${formatDate(request.approvedAt)}
                </div>
            ` : ''}
            ${request.status === 'rejected' ? `
                <div class=\"alert-box alert-danger mt-4\" style=\"margin-top: 1rem;\">
                    <strong>Rejected by:</strong> ${request.rejectedBy}<br>
                    <strong>Reason:</strong> ${request.rejectionReason}
                </div>
            ` : ''}
        </div>
    `).join('');
}

function filterAdminRequests(filter) {
    const allRequests = getOutpassRequests();
    
    // Update active tab
    document.querySelectorAll('.tab-button').forEach(btn => {
        btn.classList.remove('active');
        if (btn.getAttribute('data-filter') === filter) {
            btn.classList.add('active');
        }
    });
    
    displayAdminRequests(allRequests, filter);
}

function approveRequest(requestId) {
    const currentUser = getCurrentUser();
    const allRequests = getOutpassRequests();
    
    const updatedRequests = allRequests.map(r => 
        r.id === requestId 
            ? { ...r, status: 'approved', approvedAt: new Date().toISOString(), approvedBy: currentUser.name }
            : r
    );
    
    saveOutpassRequests(updatedRequests);
    showNotification('Outpass approved successfully!', 'success');
    loadAdminRequests();
}

let currentRejectId = null;

function openRejectModal(requestId) {
    currentRejectId = requestId;
    openModal('rejectModal');
}

function handleRejectSubmit(event) {
    event.preventDefault();
    
    const reason = document.getElementById('rejectionReason').value;
    
    if (!reason.trim()) {
        showNotification('Please provide a rejection reason', 'warning');
        return;
    }
    
    const currentUser = getCurrentUser();
    const allRequests = getOutpassRequests();
    
    const updatedRequests = allRequests.map(r => 
        r.id === currentRejectId 
            ? { 
                ...r, 
                status: 'rejected', 
                rejectedAt: new Date().toISOString(), 
                rejectedBy: currentUser.name,
                rejectionReason: reason
              }
            : r
    );
    
    saveOutpassRequests(updatedRequests);
    showNotification('Outpass rejected', 'info');
    closeModal('rejectModal');
    
    // Reset form
    event.target.reset();
    currentRejectId = null;
    
    loadAdminRequests();
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    updateNavbar();
    initTabs();
    initAccordion();
});
