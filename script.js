function showPage(pageId) {
    var pages = document.getElementsByClassName('page');
    for (var i = 0; i < pages.length; i++) {
        pages[i].classList.remove('active');
    }
    document.getElementById('page-' + pageId).classList.add('active');
    window.scrollTo(0, 0);
}
 
function calculateBudget() {
 
    var income = parseFloat(document.getElementById('income').value);
 
    if (isNaN(income) || income <= 0) {
        alert('Please enter your monthly income.');
        return;
    }
 
    var rent      = parseFloat(document.getElementById('rent').value) || 0;
    var food      = parseFloat(document.getElementById('food').value) || 0;
    var transport = parseFloat(document.getElementById('transport').value) || 0;
    var utilities = parseFloat(document.getElementById('utilities').value) || 0;
    var other     = parseFloat(document.getElementById('other').value) || 0;
 
    var totalExpenses = rent + food + transport + utilities + other;
    var leftover = income - totalExpenses;
 
    var categories = [
        { name: 'Rent / Mortgage', amount: rent },
        { name: 'Groceries', amount: food },
        { name: 'Transportation', amount: transport },
        { name: 'Utilities', amount: utilities },
        { name: 'Other', amount: other }
    ];
 
    var tableBody = document.getElementById('breakdown-body');
    tableBody.innerHTML = '';
 
    for (var i = 0; i < categories.length; i++) {
        var cat = categories[i];
        if (cat.amount === 0) continue;
 
        var percent = ((cat.amount / income) * 100).toFixed(1);
 
        var row = document.createElement('tr');
        row.innerHTML =
            '<td>' + cat.name + '</td>' +
            '<td>$' + cat.amount.toFixed(2) + '</td>' +
            '<td>' + percent + '%</td>';
 
        tableBody.appendChild(row);
    }
 
    document.getElementById('total-expenses-display').textContent = '$' + totalExpenses.toFixed(2);
 
    var leftoverEl = document.getElementById('leftover-display');
    leftoverEl.textContent = (leftover >= 0 ? '+$' : '-$') + Math.abs(leftover).toFixed(2);
    leftoverEl.className = leftover >= 0 ? 'positive' : 'negative';
 
    if (leftover < 0) {
        document.getElementById('warning-box').style.display = 'block';
    } else {
        document.getElementById('warning-box').style.display = 'none';
    }
 
    document.getElementById('results-box').style.display = 'block';
}
 
function calculateSavings() {
 
    var goal    = parseFloat(document.getElementById('savings-goal').value);
    var current = parseFloat(document.getElementById('current-savings').value) || 0;
    var monthly = parseFloat(document.getElementById('monthly-contribution').value);
    var rate    = parseFloat(document.getElementById('interest-rate').value) || 0;
 
    if (isNaN(goal) || goal <= 0) {
        alert('Please enter a savings goal amount.');
        return;
    }
 
    if (isNaN(monthly) || monthly <= 0) {
        alert('Please enter a monthly contribution greater than zero.');
        return;
    }
 
    if (current >= goal) {
        alert('You have already reached your savings goal!');
        return;
    }
 
    var monthlyRate = (rate / 100) / 12;
 
    var balance = current;
    var months = 0;
    var totalContributions = current;
    var totalInterest = 0;
    var yearlyBreakdown = [];
 
    while (balance < goal && months < 1200) {
        months++;
 
        var interestThisMonth = balance * monthlyRate;
 
        balance = balance + monthly + interestThisMonth;
        totalContributions = totalContributions + monthly;
        totalInterest = totalInterest + interestThisMonth;
 
        if (months % 12 === 0) {
            yearlyBreakdown.push({
                year: months / 12,
                balance: Math.min(balance, goal),
                contributions: totalContributions,
                interest: totalInterest
            });
        }
    }
 
    if (months % 12 !== 0) {
        yearlyBreakdown.push({
            year: Math.ceil(months / 12),
            balance: Math.min(balance, goal),
            contributions: totalContributions,
            interest: totalInterest
        });
    }
 
    var years = Math.floor(months / 12);
    var remainingMonths = months % 12;
    var timeText = '';
 
    if (years > 0) {
        timeText = timeText + years + (years === 1 ? ' year' : ' years');
    }
    if (remainingMonths > 0) {
        if (years > 0) {
            timeText = timeText + ' and ';
        }
        timeText = timeText + remainingMonths + (remainingMonths === 1 ? ' month' : ' months');
    }
    if (months >= 1200) {
        timeText = 'Over 100 years - consider increasing your contribution';
    }
 
    document.getElementById('time-to-goal').textContent = timeText;
    document.getElementById('total-contributed').textContent = '$' + totalContributions.toFixed(2);
    document.getElementById('total-interest-earned').textContent = '$' + totalInterest.toFixed(2);
    document.getElementById('final-balance').textContent = '$' + Math.min(balance, goal).toFixed(2);
 
    var tableBody = document.getElementById('savings-breakdown-body');
    tableBody.innerHTML = '';
 
    for (var i = 0; i < yearlyBreakdown.length; i++) {
        var entry = yearlyBreakdown[i];
        var row = document.createElement('tr');
        row.innerHTML =
            '<td>Year ' + entry.year + '</td>' +
            '<td>$' + entry.contributions.toFixed(2) + '</td>' +
            '<td>$' + entry.interest.toFixed(2) + '</td>' +
            '<td>$' + entry.balance.toFixed(2) + '</td>';
        tableBody.appendChild(row);
    }
 
    document.getElementById('savings-results-box').style.display = 'block';
}
 
function calculateDebt() {
 
    var balance    = parseFloat(document.getElementById('debt-balance').value);
    var annualRate = parseFloat(document.getElementById('debt-rate').value);
    var payment    = parseFloat(document.getElementById('debt-minimum').value);
    var extra      = parseFloat(document.getElementById('debt-extra').value) || 0;
 
    if (isNaN(balance) || balance <= 0) {
        alert('Please enter your current balance.');
        return;
    }
 
    if (isNaN(annualRate) || annualRate < 0) {
        alert('Please enter a valid annual interest rate.');
        return;
    }
 
    if (isNaN(payment) || payment <= 0) {
        alert('Please enter a monthly payment amount.');
        return;
    }
 
    var monthlyRate = (annualRate / 100) / 12;
    var totalMonthlyPayment = payment + extra;
 
    if (monthlyRate > 0 && totalMonthlyPayment <= balance * monthlyRate) {
        alert('Your monthly payment is too low to cover the interest. Please increase your payment.');
        return;
    }
 
    var currentBalance = balance;
    var months = 0;
    var totalInterestPaid = 0;
    var totalAmountPaid = 0;
    var yearlyBreakdown = [];
 
    var yearPrincipal = 0;
    var yearInterest  = 0;
 
    while (currentBalance > 0 && months < 1200) {
        months++;
 
        var interestCharge = currentBalance * monthlyRate;
        var actualPayment  = Math.min(totalMonthlyPayment, currentBalance + interestCharge);
        var principalPaid  = actualPayment - interestCharge;
 
        currentBalance    = currentBalance - principalPaid;
        totalInterestPaid = totalInterestPaid + interestCharge;
        totalAmountPaid   = totalAmountPaid + actualPayment;
        yearPrincipal     = yearPrincipal + principalPaid;
        yearInterest      = yearInterest + interestCharge;
 
        if (months % 12 === 0 || currentBalance <= 0) {
            yearlyBreakdown.push({
                year: Math.ceil(months / 12),
                principal: yearPrincipal,
                interest: yearInterest,
                remaining: Math.max(currentBalance, 0)
            });
            yearPrincipal = 0;
            yearInterest  = 0;
        }
    }
 
    var years = Math.floor(months / 12);
    var remMonths = months % 12;
    var timeText = '';
 
    if (years > 0) {
        timeText = timeText + years + (years === 1 ? ' year' : ' years');
    }
    if (remMonths > 0) {
        if (years > 0) {
            timeText = timeText + ' and ';
        }
        timeText = timeText + remMonths + (remMonths === 1 ? ' month' : ' months');
    }
    if (months >= 1200) {
        timeText = 'Over 100 years';
    }
 
    document.getElementById('debt-time').textContent = timeText;
    document.getElementById('debt-interest').textContent = '$' + totalInterestPaid.toFixed(2);
    document.getElementById('debt-total-paid').textContent = '$' + totalAmountPaid.toFixed(2);
    document.getElementById('debt-monthly-payment').textContent = '$' + totalMonthlyPayment.toFixed(2);
 
    var noteEl = document.getElementById('debt-savings-note');
    if (extra > 0) {
 
        var bal2 = balance;
        var months2 = 0;
        var interest2Total = 0;
 
        while (bal2 > 0 && months2 < 1200) {
            months2++;
            var interest2 = bal2 * monthlyRate;
            var pay2 = Math.min(payment, bal2 + interest2);
            bal2 = bal2 - (pay2 - interest2);
            interest2Total = interest2Total + interest2;
        }
 
        var interestSaved = interest2Total - totalInterestPaid;
        var monthsSaved   = months2 - months;
        var ySaved = Math.floor(monthsSaved / 12);
        var mSaved = monthsSaved % 12;
 
        var savedTimeText = '';
        if (ySaved > 0) {
            savedTimeText = savedTimeText + ySaved + (ySaved === 1 ? ' year' : ' years');
        }
        if (mSaved > 0) {
            if (ySaved > 0) {
                savedTimeText = savedTimeText + ' and ';
            }
            savedTimeText = savedTimeText + mSaved + (mSaved === 1 ? ' month' : ' months');
        }
 
        noteEl.textContent = 'By paying an extra $' + extra.toFixed(2) + ' per month, you save $' +
            interestSaved.toFixed(2) + ' in interest and pay off your debt ' + savedTimeText + ' sooner.';
        noteEl.style.display = 'block';
 
    } else {
        noteEl.style.display = 'none';
    }
 
    var tableBody = document.getElementById('debt-breakdown-body');
    tableBody.innerHTML = '';
 
    for (var i = 0; i < yearlyBreakdown.length; i++) {
        var entry = yearlyBreakdown[i];
        var row = document.createElement('tr');
        row.innerHTML =
            '<td>Year ' + entry.year + '</td>' +
            '<td>$' + entry.principal.toFixed(2) + '</td>' +
            '<td>$' + entry.interest.toFixed(2) + '</td>' +
            '<td>$' + entry.remaining.toFixed(2) + '</td>';
        tableBody.appendChild(row);
    }
 
    document.getElementById('debt-results-box').style.display = 'block';
}