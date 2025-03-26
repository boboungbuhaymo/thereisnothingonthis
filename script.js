// DOM Elements
const loginContainer = document.getElementById('login-container');
const appContainer = document.getElementById('app-container');
const subjectDetail = document.getElementById('subject-detail');
const subjectsContainer = document.getElementById('subjects-container');
const announcementsContainer = document.getElementById('announcements-container');
const assignmentsContainer = document.getElementById('assignments-container');
const loginError = document.getElementById('login-error');

// Data structure
let data = {
    subjects: [],
    announcements: [],
    currentSubject: null
};

// Initialize app
function init() {
    loadData();
    checkAuth();
}

// Load data from localStorage
function loadData() {
    const savedData = localStorage.getItem('schoolData');
    if (savedData) {
        data = JSON.parse(savedData);
        renderSubjects();
        renderAnnouncements();
    }
}

// Save data to localStorage
function saveData() {
    localStorage.setItem('schoolData', JSON.stringify(data));
}

// Check authentication state
function checkAuth() {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    if (isLoggedIn) {
        loginContainer.classList.add('hidden');
        appContainer.classList.remove('hidden');
    } else {
        loginContainer.classList.remove('hidden');
        appContainer.classList.add('hidden');
        subjectDetail.classList.add('hidden');
    }
}

// Login function
function login() {
    const VALID_USERNAME = 'mrdev';
    const VALID_PASSWORD = '123'; // Updated password

    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();

    // Simple validation
    if (!username || !password) {
        showError('Please enter both username and password');
        return;
    }

    // Simulate loading
    const loginBtn = document.querySelector('#login-container button');
    loginBtn.innerHTML = '<div class="loading-spinner"></div> Logging in...';
    loginBtn.disabled = true;

    // Check credentials
    setTimeout(() => {
        if (username === VALID_USERNAME && password === VALID_PASSWORD) {
            localStorage.setItem('isLoggedIn', 'true');
            loginContainer.classList.add('hidden');
            appContainer.classList.remove('hidden');
        } else {
            showError('Invalid username or password');
        }

        // Reset button state
        loginBtn.innerHTML = '<i class="fas fa-sign-in-alt mr-2"></i> Login';
        loginBtn.disabled = false;
    }, 1000);
}

// Logout function
function logout() {
    localStorage.removeItem('isLoggedIn');
    checkAuth();
}

// Show error message
function showError(message) {
    loginError.textContent = message;
    loginError.classList.remove('hidden');
    setTimeout(() => {
        loginError.classList.add('hidden');
    }, 3000);
}

// Subject functions
function showAddSubject() {
    document.getElementById('add-subject-section').classList.remove('hidden');
}

function hideAddSubject() {
    document.getElementById('add-subject-section').classList.add('hidden');
    document.getElementById('new-subject').value = '';
}

function addSubject() {
    const subjectName = document.getElementById('new-subject').value;
    if (!subjectName) return;
    
    const newSubject = {
        id: Date.now(),
        name: subjectName,
        assignments: []
    };
    
    data.subjects.push(newSubject);
    saveData();
    renderSubjects();
    hideAddSubject();
}

function renderSubjects() {
    subjectsContainer.innerHTML = '';
    
    data.subjects.forEach(subject => {
        const subjectCard = document.createElement('div');
        subjectCard.className = 'subject-card bg-white p-4 rounded-lg shadow cursor-pointer hover:shadow-md';
        subjectCard.innerHTML = `
            <h3 class="font-semibold text-lg mb-2">${subject.name}</h3>
            <p class="text-gray-600 text-sm">${subject.assignments.length} assignments</p>
        `;
        subjectCard.addEventListener('click', () => showSubjectDetail(subject.id));
        subjectsContainer.appendChild(subjectCard);
    });
}

function showSubjectDetail(subjectId) {
    const subject = data.subjects.find(s => s.id === subjectId);
    if (!subject) return;
    
    data.currentSubject = subject;
    document.getElementById('subject-title').textContent = subject.name;
    appContainer.classList.add('hidden');
    subjectDetail.classList.remove('hidden');
    renderAssignments();
}

function goBack() {
    subjectDetail.classList.add('hidden');
    appContainer.classList.remove('hidden');
}

// Assignment functions
function toggleAssignmentInput() {
    const inputSection = document.getElementById('assignment-input');
    inputSection.classList.toggle('hidden');
    
    if (!inputSection.classList.contains('hidden')) {
        document.getElementById('assignment-title').value = '';
        document.getElementById('assignment-description').value = '';
        document.getElementById('assignment-due-date').value = '';
    }
}

function addAssignment() {
    const title = document.getElementById('assignment-title').value;
    const description = document.getElementById('assignment-description').value;
    const dueDate = document.getElementById('assignment-due-date').value;
    
    if (!title) return;
    
    const newAssignment = {
        id: Date.now(),
        title,
        description,
        dueDate,
        completed: false
    };
    
    if (data.currentSubject) {
        data.currentSubject.assignments.push(newAssignment);
        saveData();
        renderAssignments();
        toggleAssignmentInput();
    }
}

function renderAssignments() {
    assignmentsContainer.innerHTML = '';
    
    if (!data.currentSubject) return;
    
    data.currentSubject.assignments.forEach(assignment => {
        const assignmentItem = document.createElement('div');
        assignmentItem.className = 'assignment-item p-4 hover:bg-gray-50';
        assignmentItem.innerHTML = `
            <div class="flex justify-between items-start">
                <div>
                    <h4 class="font-medium">${assignment.title}</h4>
                    <p class="text-sm text-gray-600 mt-1">${assignment.description}</p>
                    <p class="text-xs text-gray-500 mt-2">
                        <i class="far fa-calendar-alt mr-1"></i>
                        Due: ${assignment.dueDate || 'No due date'}
                    </p>
                </div>
                <div class="flex items-center space-x-2">
                    <input type="checkbox" ${assignment.completed ? 'checked' : ''} 
                        onchange="toggleAssignmentComplete(${assignment.id})" 
                        class="h-4 w-4 text-blue-600 rounded">
                </div>
            </div>
        `;
        assignmentsContainer.appendChild(assignmentItem);
    });
}

function toggleAssignmentComplete(assignmentId) {
    if (!data.currentSubject) return;
    
    const assignment = data.currentSubject.assignments.find(a => a.id === assignmentId);
    if (assignment) {
        assignment.completed = !assignment.completed;
        saveData();
    }
}

// Announcement functions
function toggleAnnouncementInput() {
    const inputSection = document.getElementById('announcement-input');
    inputSection.classList.toggle('hidden');
}

function addAnnouncement() {
    const message = document.getElementById('announcement').value;
    if (!message) return;
    
    const newAnnouncement = {
        id: Date.now(),
        message,
        date: new Date().toLocaleDateString()
    };
    
    data.announcements.unshift(newAnnouncement);
    saveData();
    renderAnnouncements();
    toggleAnnouncementInput();
    document.getElementById('announcement').value = '';
}

function renderAnnouncements() {
    announcementsContainer.innerHTML = '';
    
    data.announcements.forEach(announcement => {
        const announcementItem = document.createElement('div');
        announcementItem.className = 'bg-gray-50 p-3 rounded-lg';
        announcementItem.innerHTML = `
            <p class="text-gray-800">${announcement.message}</p>
            <p class="text-xs text-gray-500 mt-1">${announcement.date}</p>
        `;
        announcementsContainer.appendChild(announcementItem);
    });
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', init);