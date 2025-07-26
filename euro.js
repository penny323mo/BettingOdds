
let data = [];

fetch('compiled_odds_euro.json')
  .then(response => response.json())
  .then(json => data = json);

function searchMatches() {
  const openHomeMin = parseFloat(document.getElementById('openHomeMin').value) || -Infinity;
  const openHomeMax = parseFloat(document.getElementById('openHomeMax').value) || Infinity;
  const openDrawMin = parseFloat(document.getElementById('openDrawMin').value) || -Infinity;
  const openDrawMax = parseFloat(document.getElementById('openDrawMax').value) || Infinity;
  const openAwayMin = parseFloat(document.getElementById('openAwayMin').value) || -Infinity;
  const openAwayMax = parseFloat(document.getElementById('openAwayMax').value) || Infinity;

  const closeHomeMin = parseFloat(document.getElementById('closeHomeMin').value) || -Infinity;
  const closeHomeMax = parseFloat(document.getElementById('closeHomeMax').value) || Infinity;
  const closeDrawMin = parseFloat(document.getElementById('closeDrawMin').value) || -Infinity;
  const closeDrawMax = parseFloat(document.getElementById('closeDrawMax').value) || Infinity;
  const closeAwayMin = parseFloat(document.getElementById('closeAwayMin').value) || -Infinity;
  const closeAwayMax = parseFloat(document.getElementById('closeAwayMax').value) || Infinity;

  const filtered = data.filter(row =>
    row.odds_open_home >= openHomeMin && row.odds_open_home <= openHomeMax &&
    row.odds_open_draw >= openDrawMin && row.odds_open_draw <= openDrawMax &&
    row.odds_open_away >= openAwayMin && row.odds_open_away <= openAwayMax &&
    row.odds_close_home >= closeHomeMin && row.odds_close_home <= closeHomeMax &&
    row.odds_close_draw >= closeDrawMin && row.odds_close_draw <= closeDrawMax &&
    row.odds_close_away >= closeAwayMin && row.odds_close_away <= closeAwayMax
  );

  let win = 0, draw = 0, loss = 0;
  let win1 = 0, win2 = 0, win3p = 0;

  const tableBody = document.getElementById("resultTable").querySelector("tbody");
  tableBody.innerHTML = "";

  filtered.forEach(row => {
    const home = row.full_home_goals;
    const away = row.full_away_goals;
    const result = home > away ? '主勝' : home === away ? '和局' : '客勝';
    if (result === '主勝') {
      win++;
      const margin = home - away;
      if (margin === 1) win1++;
      else if (margin === 2) win2++;
      else if (margin >= 3) win3p++;
    } else if (result === '和局') {
      draw++;
    } else {
      loss++;
    }

    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${row.date}</td>
      <td>${row.home_team}</td>
      <td>${row.away_team}</td>
      <td>${home}-${away}</td>
      <td>${row.odds_open_home}/${row.odds_open_draw}/${row.odds_open_away}</td>
      <td>${row.odds_close_home}/${row.odds_close_draw}/${row.odds_close_away}</td>
    `;
    tableBody.appendChild(tr);
  });

  const total = win + draw + loss;
  const scoreText = win > 0
    ? `主勝場數中，正勝1球：${(win1 / win * 100).toFixed(1)}%，正勝2球：${(win2 / win * 100).toFixed(1)}%，正勝3球或以上：${(win3p / win * 100).toFixed(1)}%`
    : `無主勝比賽`;

  document.getElementById("winRate").textContent = `主勝：${(win / total * 100).toFixed(1)}%，和局：${(draw / total * 100).toFixed(1)}%，客勝：${(loss / total * 100).toFixed(1)}%`;
  document.getElementById("scoreDist").textContent = scoreText;
}
