const contribGraph = document.querySelector('.js-calendar-graph-svg > g');
if (contribGraph) {
  // HELPER FUNCTIONS
  // ==========================================================================

  const getDate = function (contribNode) {
    return contribNode.getAttribute('data-date');
  };

  const resetStreak = function () {
    return {
      amount : 0,
      start  : null,
      end    : null
    };
  };

  const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  const createDateString = function (date) {
    const parsedDate = new Date(date);

    return `${MONTHS[parsedDate.getUTCMonth()].slice(0, 3)} ${parsedDate.getUTCDate()}, ${parsedDate.getUTCFullYear()}`;
  };

  const createStatDiv = function (header, type, data) {
    const el = document.createElement('div');

    const elHeader = document.createElement('p');
    elHeader.className = 'text-muted';
    elHeader.textContent = header;

    const elStat = document.createElement('h1');
    elStat.textContent = `${data.amount} ${type}`;

    const elFooter = document.createElement('p');
    elHeader.className = 'text-muted';
    elFooter.textContent = `${createDateString(data.start)} – ${createDateString(data.end)}`;

    el.appendChild(elHeader);
    el.appendChild(elStat);
    el.appendChild(elFooter);

    return el;
  };

  // DATA HOLDERS
  // ==========================================================================

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
  // ==========================================================================

  let streak = resetStreak();
  let newStreak = true;

  // Start counting from the end up
  for (let i = contribsLen; i >= 0; i--) {
    let count = parseInt(contribs[i].getAttribute('data-count'), 10);

    // Tally up all contributions
    totalContribs.amount += count;

    if (count > 0) {
      // If there's a contribution, add it to the current streak
      streak.amount++;

      // Record the end date for a new streak
      if (newStreak) {
        streak.end = getDate(contribs[i]);
        newStreak = false;
      }
    } else {
      // End of streak (no contributions for this day)
      streak.start = getDate(contribs[i + 1]);

      // If not the current day and is the first streak, set the current streak
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

  // Append information to page
  contribContainer.appendChild(createStatDiv('Year of contributions', 'total', totalContribs));
  contribContainer.appendChild(createStatDiv('Longest streak', 'days', longestStreak));
  contribContainer.appendChild(createStatDiv('Current streak', 'days', currentStreak));
}
