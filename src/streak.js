'use strict';

// Check if we're on a profile page
if (document.body.classList.contains('page-profile')) {

  // HELPER FUNCTIONS
  // ========================================================================

  const resetStreak = function () {
    return {
      amount : 0,
      start  : null,
      end    : null
    };
  };

  const getDate = function (contribNode) {
    return contribNode.getAttribute('data-date');
  };

  const MONTHS = [
    'January', 'February', 'March', 'April',
    'May', 'June', 'July', 'August',
    'September', 'October', 'November', 'December'
  ];

  const dateWithoutYear = function (date) {
    return MONTHS[date.getUTCMonth()] + ' ' + date.getUTCDate();
  };

  const dateWithYear = function (date) {
    return MONTHS[date.getUTCMonth()].slice(0, 3) + ' ' +
      date.getUTCDate() + ', ' +
      date.getUTCFullYear();
  };

  const createDateString = function (startDate, endDate) {
    const start = new Date(startDate);
    const end   = new Date(endDate);

    if (start.valueOf() === end.valueOf()) {
      // Same day
      return 'Rock – Hard Place';
    } else if (start.getUTCFullYear() === end.getUTCFullYear()) {
      // Same year
      return dateWithoutYear(start) + ' – ' + dateWithoutYear(end);
    } else {
      // Different year
      return dateWithYear(start) + ' – ' + dateWithYear(end);
    }
  };

  const createStatDiv = function (header, type, data) {
    const el = document.createElement('div');
    el.className = 'gh-streak-box';

    const elHeader = document.createElement('p');
    elHeader.className = 'gh-streak-box-header text-muted';
    elHeader.textContent = header;

    const elStat = document.createElement('h1');
    if (type === 'days' && data.amount === 1) {
      type = 'day';
    }
    elStat.textContent = data.amount.toLocaleString() + ' ' + type;

    const elFooter = document.createElement('p');
    elFooter.className = 'text-muted';
    elFooter.textContent = createDateString(data.start, data.end);

    el.appendChild(elHeader);
    el.appendChild(elStat);
    el.appendChild(elFooter);

    return el;
  };


  // FUNCTION TO CREATE STATS
  // ===========================================================================

  const initStats = function () {
    const contribGraph = document.querySelector('.js-calendar-graph-svg > g');
    if (!contribGraph) {
      return;
    }

    const contribContainer = document.getElementById('contributions-calendar');

    const contribs    = contribGraph.querySelectorAll('rect.day');
    const contribsLen = contribs.length - 1;

    // Total contributions
    let totalContribs   = resetStreak();
    totalContribs.start = getDate(contribs[0]);
    totalContribs.end   = getDate(contribs[contribsLen]);

    // Longest streak
    let longestStreak = resetStreak();

    // Current streak
    let isCurrentStreak = true;
    let currentStreak   = resetStreak();


    // TALLY UP THE STATS
    // =======================================================================

    let streak = resetStreak();
    let newStreak = true;

    // Start counting from the end up
    for (let i = contribsLen; i >= 0; i--) {
      let count = parseInt(contribs[i].getAttribute('data-count'), 10);

      // Tally up all contributions
      totalContribs.amount += count;

      // If there's a contribution, add it to the current streak
      if (count > 0) {
        streak.amount++;

        // Record the end date for a new streak
        if (newStreak) {
          streak.end = getDate(contribs[i]);
          newStreak = false;
        }
      }

      // End of streak (no contributions for this day) or first day
      if (count === 0 || i === 0) {
        const startDate = i === contribsLen ? contribsLen : i + 1;
        streak.start = getDate(contribs[startDate]);

        if (streak.amount === 0) {
          streak.end = streak.start;
        }

        // If not current day and is the first streak, set the current streak
        if (isCurrentStreak && i !== contribsLen) {
          currentStreak = streak;
          isCurrentStreak = false;
        }

        // Record if this is the longest streak encountered so far
        if (streak.amount > longestStreak.amount) {
          longestStreak = streak;
        }

        // Reset streak
        streak = resetStreak();
        newStreak = true;
      }
    }


    // APPEND STATS TO PAGE
    // =======================================================================

    // Remove existing stats, if present
    const existingStats = Array.from(contribContainer.getElementsByClassName('gh-streak-box'));
    for (let i = 0; i < existingStats.length; i++) {
      contribContainer.removeChild(existingStats[i]);
    }

    // Create/add stats to page
    contribContainer.appendChild(
      createStatDiv('Contributions in the last year', 'total', totalContribs));

    contribContainer.appendChild(
      createStatDiv('Longest streak', 'days', longestStreak));

    contribContainer.appendChild(
      createStatDiv('Current streak', 'days', currentStreak));
  };


  // WATCH FOR PAGE CHANGES
  // ===========================================================================

  // Attempt to init on page load
  initStats();

  // Create a MutationObserver (in case of XHR)
  // https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver
  const profileContent = document.getElementById('js-pjax-container');

  const observer = new MutationObserver((mutations) => {
    // TODO: make check better
    if (document.querySelector('.js-calendar-graph-svg > g')) {
      initStats();
    }
  });

  observer.observe(profileContent, { childList: true });

  // observer.disconnect();
}
