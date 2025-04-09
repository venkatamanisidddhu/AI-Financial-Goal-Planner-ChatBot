document.addEventListener('DOMContentLoaded', function() {
    // Navigation
    const navItems = document.querySelectorAll('nav ul li');
    const sections = document.querySelectorAll('.section');
    
    navItems.forEach(item => {
        item.addEventListener('click', function() {
            const sectionId = this.getAttribute('data-section');
            
            // Update active nav item
            navItems.forEach(navItem => navItem.classList.remove('active'));
            this.classList.add('active');
            
            // Show corresponding section
            sections.forEach(section => {
                section.classList.remove('active');
                if (section.id === `${sectionId}-section`) {
                    section.classList.add('active');
                }
            });
            
            // Render charts when insights section is shown
            if (sectionId === 'insights') {
                renderCharts();
            }
        });
    });
    
    // Sample data for goals
    let goals = [
        {
            id: 1,
            name: "Emergency Fund",
            target: 10000,
            saved: 6500,
            deadline: "2023-12-31",
            priority: "high",
            category: "emergency",
            status: "active"
        },
        {
            id: 2,
            name: "Vacation to Japan",
            target: 5000,
            saved: 1200,
            deadline: "2024-06-15",
            priority: "medium",
            category: "travel",
            status: "active"
        },
        {
            id: 3,
            name: "Retirement Fund",
            target: 500000,
            saved: 45000,
            deadline: "2045-01-01",
            priority: "high",
            category: "retirement",
            status: "active"
        },
        {
            id: 4,
            name: "New Laptop",
            target: 1500,
            saved: 1500,
            deadline: "2023-03-15",
            priority: "low",
            category: "other",
            status: "completed"
        },
        {
            id: 5,
            name: "Car Down Payment",
            target: 8000,
            saved: 8000,
            deadline: "2023-01-30",
            priority: "medium",
            category: "other",
            status: "completed"
        }
    ];
    
    // Render goals
    function renderGoals(filter = 'all') {
        const upcomingGoalsList = document.getElementById('upcoming-goals-list');
        const allGoalsList = document.getElementById('all-goals-list');
        
        // Clear existing lists
        upcomingGoalsList.innerHTML = '';
        allGoalsList.innerHTML = '';
        
        // Filter goals
        let filteredGoals = [...goals];
        if (filter === 'active') {
            filteredGoals = goals.filter(goal => goal.status === 'active');
        } else if (filter === 'completed') {
            filteredGoals = goals.filter(goal => goal.status === 'completed');
        } else if (filter === 'behind') {
            filteredGoals = goals.filter(goal => {
                if (goal.status !== 'active') return false;
                const today = new Date();
                const deadline = new Date(goal.deadline);
                const progress = (goal.saved / goal.target) * 100;
                const timeLeft = deadline - today;
                const totalTime = deadline - new Date(today.getFullYear(), today.getMonth(), 1);
                const expectedProgress = (1 - (timeLeft / totalTime)) * 100;
                return progress < expectedProgress;
            });
        }
        
        // Sort by deadline (closest first)
        filteredGoals.sort((a, b) => new Date(a.deadline) - new Date(b.deadline));
        
        // Render upcoming goals (active only, limit to 3)
        const upcomingGoals = goals
            .filter(goal => goal.status === 'active')
            .sort((a, b) => new Date(a.deadline) - new Date(b.deadline))
            .slice(0, 3);
        
        upcomingGoals.forEach(goal => {
            const progress = (goal.saved / goal.target) * 100;
            const progressColor = progress >= 100 ? 'var(--success-color)' : 
                                progress >= 75 ? 'var(--accent-color)' : 
                                progress >= 50 ? 'var(--warning-color)' : 'var(--danger-color)';
            
            const goalItem = document.createElement('div');
            goalItem.className = 'goal-item';
            goalItem.innerHTML = `
                <div class="goal-info">
                    <h4>${goal.name}</h4>
                    <p>Target: $${goal.target.toLocaleString()} by ${formatDate(goal.deadline)}</p>
                </div>
                <div class="goal-progress">
                    <div class="progress-info">
                        <span>$${goal.saved.toLocaleString()} saved</span>
                        <span>${progress.toFixed(1)}%</span>
                    </div>
                    <div class="progress-bar">
                        <div class="progress" style="width: ${progress}%; background-color: ${progressColor};"></div>
                    </div>
                </div>
            `;
            upcomingGoalsList.appendChild(goalItem);
        });
        
        // Render all goals based on filter
        filteredGoals.forEach(goal => {
            const progress = (goal.saved / goal.target) * 100;
            const progressColor = progress >= 100 ? 'var(--success-color)' : 
                                progress >= 75 ? 'var(--accent-color)' : 
                                progress >= 50 ? 'var(--warning-color)' : 'var(--danger-color)';
            
            const goalItem = document.createElement('div');
            goalItem.className = 'goal-item';
            goalItem.innerHTML = `
                <div class="goal-info">
                    <h4>${goal.name} <span class="goal-status">${goal.status === 'completed' ? '✅' : ''}</span></h4>
                    <p>Target: $${goal.target.toLocaleString()} by ${formatDate(goal.deadline)} | Priority: ${goal.priority}</p>
                </div>
                <div class="goal-progress">
                    <div class="progress-info">
                        <span>$${goal.saved.toLocaleString()} saved</span>
                        <span>${progress.toFixed(1)}%</span>
                    </div>
                    <div class="progress-bar">
                        <div class="progress" style="width: ${progress}%; background-color: ${progressColor};"></div>
                    </div>
                </div>
            `;
            allGoalsList.appendChild(goalItem);
        });
        
        // Update stats
        updateStats();
    }
    
    // Format date
    function formatDate(dateString) {
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    }
    
    // Update dashboard stats
    function updateStats() {
        const activeGoals = goals.filter(goal => goal.status === 'active').length;
        const completedGoals = goals.filter(goal => goal.status === 'completed').length;
        const totalSaved = goals.reduce((sum, goal) => sum + goal.saved, 0);
        
        // Find next deadline
        const activeGoalsWithDeadlines = goals.filter(goal => goal.status === 'active');
        let nextDeadline = 'No upcoming deadlines';
        if (activeGoalsWithDeadlines.length > 0) {
            const sorted = [...activeGoalsWithDeadlines].sort((a, b) => new Date(a.deadline) - new Date(b.deadline));
            nextDeadline = formatDate(sorted[0].deadline);
        }
        
        document.getElementById('active-goals').textContent = activeGoals;
        document.getElementById('completed-goals').textContent = completedGoals;
        document.getElementById('total-saved').textContent = `$${totalSaved.toLocaleString()}`;
        document.getElementById('next-deadline').textContent = nextDeadline;
        
        // Calculate overall progress
        const totalTarget = goals.reduce((sum, goal) => sum + goal.target, 0);
        const overallProgress = totalTarget > 0 ? (totalSaved / totalTarget) * 100 : 0;
        document.getElementById('overall-progress').style.width = `${overallProgress}%`;
        document.querySelector('.progress-summary p').textContent = `${overallProgress.toFixed(1)}% of goals on track`;
    }
    
    // Handle new goal form submission
    const goalForm = document.getElementById('goal-form');
    goalForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const newGoal = {
            id: goals.length + 1,
            name: document.getElementById('goal-name').value,
            target: parseFloat(document.getElementById('goal-amount').value),
            saved: parseFloat(document.getElementById('saved-amount').value) || 0,
            deadline: document.getElementById('goal-deadline').value,
            priority: document.getElementById('goal-priority').value,
            category: document.getElementById('goal-category').value,
            status: "active"
        };
        
        goals.push(newGoal);
        renderGoals();
        
        // Reset form
        goalForm.reset();
        
        // Show success message
        alert('Goal created successfully!');
    });
    
    // Goal filter
    document.getElementById('goal-filter').addEventListener('change', function() {
        renderGoals(this.value);
    });
    
    // Sort goals
    document.getElementById('sort-goals').addEventListener('click', function() {
        goals.sort((a, b) => new Date(a.deadline) - new Date(b.deadline));
        renderGoals(document.getElementById('goal-filter').value);
    });
    
    // Render charts
    function renderCharts() {
        // Category distribution chart
        const categoryData = {
            'housing': 0,
            'retirement': 0,
            'education': 0,
            'travel': 0,
            'emergency': 0,
            'other': 0
        };
        
        goals.forEach(goal => {
            categoryData[goal.category] += goal.target;
        });
        
        const categoryCtx = document.getElementById('category-chart').getContext('2d');
        new Chart(categoryCtx, {
            type: 'doughnut',
            data: {
                labels: Object.keys(categoryData),
                datasets: [{
                    data: Object.values(categoryData),
                    backgroundColor: [
                        '#6c5ce7',
                        '#00b894',
                        '#fd79a8',
                        '#fdcb6e',
                        '#e17055',
                        '#636e72'
                    ],
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'right',
                        labels: {
                            color: '#f5f6fa'
                        }
                    }
                }
            }
        });
        
        // Timeline chart
        const timelineCtx = document.getElementById('timeline-chart').getContext('2d');
        new Chart(timelineCtx, {
            type: 'line',
            data: {
                labels: goals.map(goal => goal.name),
                datasets: [{
                    label: 'Target Amount',
                    data: goals.map(goal => goal.target),
                    borderColor: '#6c5ce7',
                    backgroundColor: 'rgba(108, 92, 231, 0.1)',
                    fill: true,
                    tension: 0.4
                }, {
                    label: 'Saved Amount',
                    data: goals.map(goal => goal.saved),
                    borderColor: '#00cec9',
                    backgroundColor: 'rgba(0, 206, 201, 0.1)',
                    fill: true,
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            color: '#f5f6fa'
                        },
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)'
                        }
                    },
                    x: {
                        ticks: {
                            color: '#f5f6fa'
                        },
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)'
                        }
                    }
                },
                plugins: {
                    legend: {
                        labels: {
                            color: '#f5f6fa'
                        }
                    }
                }
            }
        });
    }
    
    // Chat functionality
    const chatMessages = document.getElementById('chat-messages');
    const userInput = document.getElementById('user-input');
    const sendButton = document.getElementById('send-button');
    const quickQuestions = document.querySelectorAll('.quick-question');
    
    function addMessage(content, isUser = false) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${isUser ? 'user-message' : 'bot-message'}`;
        messageDiv.innerHTML = `
            <div class="message-content">
                <p>${content}</p>
            </div>
        `;
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
    
    async function sendMessage() {
        const message = userInput.value.trim();
        if (!message) return;
        
        addMessage(message, true);
        userInput.value = '';
        
        // Show typing indicator
        const typingIndicator = document.createElement('div');
        typingIndicator.className = 'message bot-message';
        typingIndicator.innerHTML = `
            <div class="message-content">
                <p><i>AI is typing...</i></p>
            </div>
        `;
        chatMessages.appendChild(typingIndicator);
        chatMessages.scrollTop = chatMessages.scrollHeight;
        
        try {
            // Remove typing indicator
            chatMessages.removeChild(typingIndicator);
            
            // Get response from backend
            const response = await fetch('http://localhost:5000/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ message })
            });
            
            const data = await response.json();
            addMessage(data.response);
        } catch (error) {
            console.error('Error:', error);
            addMessage("Sorry, I'm having trouble connecting to the server. Please try again later.");
        }
    }
    
    sendButton.addEventListener('click', sendMessage);
    userInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });
    
    quickQuestions.forEach(button => {
        button.addEventListener('click', function() {
            userInput.value = this.textContent;
            sendMessage();
        });
    });
    
    // Initialize
    renderGoals();
});