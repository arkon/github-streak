var contribGraph = document.querySelector('.js-calendar-graph-svg > g');
if (contribGraph) {
  // HELPER FUNCTIONS
  // ==========================================================================

  var resetStreak = function () {
    return {
      amount : 0,
      start  : null,
      end    : null
    };
  };

  var getDate = function (contribNode) {
    return contribNode.getAttribute('data-date');
  };

  var MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  var createDateString = function (date) {
    var parsedDate = new Date(date);

    return `${MONTHS[parsedDate.getUTCMonth()]} ${parsedDate.getUTCDate()}, ${parsedDate.getUTCFullYear()}`;
  };

  var createStatDiv = function (header, type, data) {
    var el = document.createElement('div');
    el.className = 'gh-streak-box';

    var elHeader = document.createElement('p');
    elHeader.className = 'gh-streak-box-header text-muted';
    elHeader.textContent = header;

    var elStat = document.createElement('h1');
    elStat.textContent = data.amount + ' ' + type;

    var elFooter = document.createElement('p');
    elFooter.className = 'text-muted';
    elFooter.textContent = createDateString(data.start)} + ' – ' + createDateString(data.end);

    el.appendChild(elHeader);
    el.appendChild(elStat);
    el.appendChild(elFooter);

    return el;
  };


  // DATA
  // ==========================================================================

  var contribContainer = document.getElementById('contributions-calendar');

  var contribs    = contribGraph.querySelectorAll('rect.day');
  var contribsLen = contribs.length - 1;

  // Total contributions
  var totalContribs   = resetStreak();
  totalContribs.start = getDate(contribs[0]);
  totalContribs.end   = getDate(contribs[contribsLen]);

  // Longest streak
  var longestStreak = resetStreak();

  // Current streak
  var isCurrentStreak = true;
  var currentStreak   = resetStreak();


  // TALLY UP THE STATS
  // ==========================================================================

  var streak = resetStreak();
  var newStreak = true;

  // Start counting from the end up
  for (var i = contribsLen; i >= 0; i--) {
    var count = parseInt(contribs[i].getAttribute('data-count'), 10);

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
