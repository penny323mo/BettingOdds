
async function filterEuro() {
  const res = await fetch("euro_odds.json");
  const data = await res.json();

  const open_home_min = parseFloat(document.getElementById("open_home_min").value) || -Infinity;
  const open_home_max = parseFloat(document.getElementById("open_home_max").value) || Infinity;
  const open_draw_min = parseFloat(document.getElementById("open_draw_min").value) || -Infinity;
  const open_draw_max = parseFloat(document.getElementById("open_draw_max").value) || Infinity;
  const open_away_min = parseFloat(document.getElementById("open_away_min").value) || -Infinity;
  const open_away_max = parseFloat(document.getElementById("open_away_max").value) || Infinity;
  const close_home_min = parseFloat(document.getElementById("close_home_min").value) || -Infinity;
  const close_home_max = parseFloat(document.getElementById("close_home_max").value) || Infinity;
  const close_draw_min = parseFloat(document.getElementById("close_draw_min").value) || -Infinity;
  const close_draw_max = parseFloat(document.getElementById("close_draw_max").value) || Infinity;
  const close_away_min = parseFloat(document.getElementById("close_away_min").value) || -Infinity;
  const close_away_max = parseFloat(document.getElementById("close_away_max").value) || Infinity;

  const filtered = data.filter(d =>
    d.odds_open_home >= open_home_min && d.odds_open_home <= open_home_max &&
    d.odds_open_draw >= open_draw_min && d.odds_open_draw <= open_draw_max &&
    d.odds_open_away >= open_away_min && d.odds_open_away <= open_away_max &&
    d.odds_close_home >= close_home_min && d.odds_close_home <= close_home_max &&
    d.odds_close_draw >= close_draw_min && d.odds_close_draw <= close_draw_max &&
    d.odds_close_away >= close_away_min && d.odds_close_away <= close_away_max
  );

  let homeWin = 0, draw = 0, awayWin = 0;
  let win1 = 0, win2 = 0, win3plus = 0;

  filtered.forEach(d => {
    if (d.ft_result === "H") {
      homeWin++;
      const margin = d.home_goals - d.away_goals;
      if (margin === 1) win1++;
      else if (margin === 2) win2++;
      else if (margin >= 3) win3plus++;
    } else if (d.ft_result === "D") {
      draw++;
    } else if (d.ft_result === "A") {
      awayWin++;
      const margin = d.away_goals - d.home_goals;
      if (margin === 1) win1++;
      else if (margin === 2) win2++;
      else if (margin >= 3) win3plus++;
    }
  });

  const total = filtered.length || 1;
  document.getElementById("summary").innerHTML = `
    <p>符合比賽場數：${filtered.length}</p>
    <p>主勝：${(homeWin / total * 100).toFixed(1)}%　
       和局：${(draw / total * 100).toFixed(1)}%　
       客勝：${(awayWin / total * 100).toFixed(1)}%</p>
    <p>正勝 1 球：${(win1 / total * 100).toFixed(1)}%　
       正勝 2 球：${(win2 / total * 100).toFixed(1)}%　
       正勝 3+ 球：${(win3plus / total * 100).toFixed(1)}%</p>
  `;

  const tbody = document.querySelector("#results tbody");
  tbody.innerHTML = "";
  filtered.forEach(d => {
    const row = `<tr>
      <td>${d.match_date}</td>
      <td>${d.home_team}</td>
      <td>${d.away_team}</td>
      <td>${d.home_goals}-${d.away_goals}</td>
      <td>${d.ft_result}</td>
      <td>${d.odds_open_home} / ${d.odds_close_home}</td>
      <td>${d.odds_open_draw} / ${d.odds_close_draw}</td>
      <td>${d.odds_open_away} / ${d.odds_close_away}</td>
    </tr>`;
    tbody.insertAdjacentHTML("beforeend", row);
  });
}
