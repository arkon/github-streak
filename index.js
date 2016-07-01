var contribGraph = document.querySelector('.js-calendar-graph-svg > g');
if (contribGraph) {
    var contribs = contribGraph.querySelectorAll('rect.day');
    var contribsLen = contribs.length - 1;

    var totalContribsNum = 0;

    var longestStreakNum = 0;

    var isCurrentStreak = true;
    var currentStreakNum = 0;

    // Count some stuff
    var streak = 0;
    for (var i = contribsLen; i >= 0; i--) {
        var count = parseInt(contribs[i].getAttribute('data-count'), 10);

        // Tally up all contributions
        totalContribsNum += count;

        if (count > 0) {
            // If there's a contribution, add it to the current streak
            streak++;
        } else {
            // End of streak (no contributions for this day)

            // If not the current day and is the first streak, set the current streak
            if (isCurrentStreak && i !== contribsLen) {
                currentStreakNum = streak;
                isCurrentStreak = false;
            }

            // Record if this is the longest streak encountered so far
            if (streak > longestStreakNum) {
                longestStreakNum = streak;
            }

            // Reset streak
            streak = 0;
        }
    }

    // Append information to page
    var contribContainer = document.getElementById('contributions-calendar');

    var contribTotal = document.createElement('div');
    contribTotal.innerHTML = 'Year of contributions: ' + totalContribsNum + ' total';
    contribContainer.appendChild(contribTotal);

    var contribLongestStreak = document.createElement('div');
    contribLongestStreak.innerHTML = 'Longest streak: ' + longestStreakNum + ' days';
    contribContainer.appendChild(contribLongestStreak);

    var contribCurrentStreak = document.createElement('div');
    contribCurrentStreak.innerHTML = 'Current streak: ' + currentStreakNum + ' days';
    contribContainer.appendChild(contribCurrentStreak);

    // Year of contributions
    // 1,073 total
    // Dec 21, 2013 - Dec 21, 2014

    // Longest streak
    // 365 days
    // December 22 - December 21

    // Current streak
    // 365 days
    // December 22 - Decemeber 21
}
