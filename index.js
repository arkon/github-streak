var contribGraph = document.querySelector('.js-calendar-graph-svg > g');
if (contribGraph) {
    var contribs = contribGraph.querySelectorAll('rect.day');

    var streak = 0;

    for (let i = contribs.length - 1; i >= 0; i--) {
        if (contribs[i].getAttribute('data-count') !== '0') {
            streak++;
        } else {
            break;
        }
    }

    var contribContainer = document.getElementById('contributions-calendar');

    var contribStreakCount = document.createElement('div');
    contribStreakCount.innerHTML = streak;
    contribContainer.appendChild(contribStreakCount)

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
