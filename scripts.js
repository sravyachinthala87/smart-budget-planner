let transactions = [];
let totalIncome = 0;
let totalExpenses = 0;
let remainingBalance = 0;
let chartInstance = null;

document.getElementById('budgetForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const amount = parseFloat(document.getElementById('amount').value);
    const category = document.getElementById('category').value;
    const type = document.getElementById('type').value;

    const transaction = { amount, category, type };
    transactions.push(transaction);

    updateDisplay();
    updateChart();

    document.getElementById('budgetForm').reset();
});

function updateDisplay() {
    totalIncome = 0;
    totalExpenses = 0;

    transactions.forEach(transaction => {
        if (transaction.type === 'Income') {
            totalIncome += transaction.amount;
        } else if (transaction.type === 'Expense') {
            totalExpenses += transaction.amount;
        }
    });

    remainingBalance = totalIncome - totalExpenses;

    document.getElementById('totalIncome').textContent = `Total Income: $${totalIncome.toFixed(2)}`;
    document.getElementById('totalExpenses').textContent = `Total Expenses: $${totalExpenses.toFixed(2)}`;
    document.getElementById('remainingBalance').textContent = `Remaining Balance: $${remainingBalance.toFixed(2)}`;
}

function updateChart() {
    const categoryData = {};

    transactions.forEach(transaction => {
        if (transaction.type === 'Expense') {
            if (categoryData[transaction.category]) {
                categoryData[transaction.category] += transaction.amount;
            } else {
                categoryData[transaction.category] = transaction.amount;
            }
        }
    });

    const chartData = {
        labels: Object.keys(categoryData),
        datasets: [{
            label: 'Expenses Breakdown',
            data: Object.values(categoryData),
            backgroundColor: ['#FF5733', '#33FF57', '#3357FF', '#FF33A6', '#FFA500'],
            hoverOffset: 4
        }]
    };

    const ctx = document.getElementById('budgetChart').getContext('2d');

    if (chartInstance) {
        chartInstance.destroy();
    }

    chartInstance = new Chart(ctx, {
        type: 'pie',
        data: chartData,
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top',
                },
                tooltip: {
                    callbacks: {
                        label: function(tooltipItem) {
                            return `${tooltipItem.label}: $${tooltipItem.raw.toFixed(2)}`;
                        }
                    }
                }
            }
        }
    });
}

document.getElementById('generateReport').addEventListener('click', function() {
    const report = `
        <strong>Monthly Summary:</strong><br>
        Total Income: $${totalIncome.toFixed(2)}<br>
        Total Expenses: $${totalExpenses.toFixed(2)}<br>
        Savings: $${remainingBalance.toFixed(2)}
    `;
    document.getElementById('monthlyReport').innerHTML = report;
});
