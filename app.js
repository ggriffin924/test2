document.addEventListener('DOMContentLoaded', () => {
    // Activity Chart Initialization
    const ctx = document.getElementById('activityChart').getContext('2d');
    
    // Create gradient for the chart
    const gradient = ctx.createLinearGradient(0, 0, 0, 400);
    gradient.addColorStop(0, 'rgba(56, 189, 248, 0.4)');
    gradient.addColorStop(1, 'rgba(56, 189, 248, 0)');

    const activityChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['10:00', '10:10', '10:20', '10:30', '10:40', '10:50', '11:00'],
            datasets: [{
                label: 'Gemini CLI Commands',
                data: [12, 19, 15, 25, 22, 30, 45],
                borderColor: '#38bdf8',
                borderWidth: 3,
                tension: 0.4,
                fill: true,
                backgroundColor: gradient,
                pointBackgroundColor: '#38bdf8',
                pointBorderColor: '#fff',
                pointHoverRadius: 6
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(255, 255, 255, 0.05)'
                    },
                    ticks: {
                        color: '#94a3b8'
                    }
                },
                x: {
                    grid: {
                        display: false
                    },
                    ticks: {
                        color: '#94a3b8'
                    }
                }
            }
        }
    });

    // Simulated "Live" Updates
    setInterval(() => {
        // Update Students Count
        const students = document.getElementById('students-count');
        const currentCount = parseInt(students.innerText);
        if (Math.random() > 0.5) {
            students.innerText = currentCount + Math.floor(Math.random() * 3);
        }

        // Update AI Commands
        const commands = document.getElementById('ai-commands');
        commands.innerText = parseInt(commands.innerText) + 1;

        // Add new point to chart
        const newData = Math.floor(Math.random() * 20) + 30;
        activityChart.data.datasets[0].data.shift();
        activityChart.data.datasets[0].data.push(newData);
        activityChart.update('none');
    }, 3000);
});
