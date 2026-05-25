// --- 1. Real-Time UTC Clock ---
function updateClock() {
    const now = new Date();
    const timeString = now.toISOString().substring(11, 19) + ' UTC';
    document.getElementById('clock').innerText = timeString;
}
setInterval(updateClock, 1000);
updateClock();

// --- 2. Live Chart.js Network Simulation ---
const ctx = document.getElementById('networkChart').getContext('2d');

// Initial empty data arrays
const labels = Array.from({length: 20}, (_, i) => i);
const ingressData = Array(20).fill(2);
const egressData = Array(20).fill(1.5);

const networkChart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: labels,
        datasets: [
            {
                label: 'Ingress (Gbps)',
                data: ingressData,
                borderColor: '#3b82f6', // Info Blue
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                borderWidth: 2,
                fill: true,
                tension: 0.4,
                pointRadius: 0
            },
            {
                label: 'Egress (Gbps)',
                data: egressData,
                borderColor: '#22c55e', // Success Green
                backgroundColor: 'rgba(34, 197, 94, 0.1)',
                borderWidth: 2,
                fill: true,
                tension: 0.4,
                pointRadius: 0
            }
        ]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: { duration: 0 }, // Disable animation for smooth continuous flow
        plugins: { legend: { labels: { color: '#a1a1aa' } } },
        scales: {
            y: { 
                min: 0, max: 10, 
                grid: { color: '#27272a' }, 
                ticks: { color: '#a1a1aa' } 
            },
            x: { 
                display: false // Hide x-axis labels to simulate continuous stream
            }
        }
    }
});

// Function to update chart data every second
setInterval(() => {
    // Generate random traffic spikes
    const newIngress = Math.max(1, Math.min(9, ingressData[19] + (Math.random() - 0.5) * 3));
    const newEgress = Math.max(1, Math.min(8, egressData[19] + (Math.random() - 0.5) * 2));

    // Update Bandwidth Display
    document.getElementById('bandwidth-val').innerText = `${newIngress.toFixed(1)} Gbps`;

    // Shift data arrays
    ingressData.shift();
    ingressData.push(newIngress);
    
    egressData.shift();
    egressData.push(newEgress);

    networkChart.update();
}, 1500);


// --- 3. Mock Ticketing System (Jira/FS3 Simulation) ---
const ticketFeed = document.getElementById('ticket-feed');
const activeTicketsDisplay = document.getElementById('active-tickets-count');
let activeTickets = 0;

// Mock Data Banks
const servers = ['SRV-CORE-01', 'DB-CLUSTER-B', 'EDGE-NODE-04', 'AUTH-SERVER', 'PAYMENT-API'];
const issues = [
    { type: 'warning', text: 'High CPU Utilization (> 85%)' },
    { type: 'critical', text: 'Connection Timeout - Node Unreachable' },
    { type: 'warning', text: 'Disk Space Running Low (< 10%)' },
    { type: 'critical', text: 'BGP Route Flapping Detected' }
];

// Generate a random ticket
function generateTicket() {
    const server = servers[Math.floor(Math.random() * servers.length)];
    const issue = issues[Math.floor(Math.random() * issues.length)];
    const ticketID = `INC-${Math.floor(10000 + Math.random() * 90000)}`;
    const time = new Date().toISOString().substring(11, 19);

    const ticket = document.createElement('div');
    ticket.className = `ticket ${issue.type}`;
    ticket.innerHTML = `
        <div class="ticket-info">
            <h4>${server}</h4>
            <p>[${ticketID}] ${time}</p>
            <p style="color: ${issue.type === 'critical' ? '#ef4444' : '#eab308'}; margin-top: 5px;">
                Alert: ${issue.text}
            </p>
        </div>
        <button class="ack-btn" onclick="resolveTicket(this)">Acknowledge</button>
    `;

    // Add to top of feed
    ticketFeed.prepend(ticket);
    activeTickets++;
    activeTicketsDisplay.innerText = activeTickets;

    // Keep feed clean (max 8 tickets)
    if (ticketFeed.children.length > 8) {
        ticketFeed.lastElementChild.remove();
        activeTickets--;
        activeTicketsDisplay.innerText = activeTickets;
    }
}

// Resolve (Delete) Ticket
window.resolveTicket = function(button) {
    const ticket = button.parentElement;
    ticket.style.opacity = '0';
    setTimeout(() => {
        ticket.remove();
        activeTickets--;
        activeTicketsDisplay.innerText = activeTickets;
    }, 200);
}

// Generate a new ticket randomly every 5 to 12 seconds
(function loop() {
    const randomTime = Math.random() * (12000 - 5000) + 5000;
    setTimeout(() => {
        generateTicket();
        loop();
    }, randomTime);
})();
