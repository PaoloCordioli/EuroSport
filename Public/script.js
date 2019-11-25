area = document.getElementById("area");
button = document.getElementById("button");
url = "http://api.football-api.com/2.0/matches?comp_id=1269&match_date=24.11.2019";
url2 ="http://api.football-api.com/2.0/matches?comp_id=1269&from_date=23.11.2019&to_date=25.11.2019";
key = "&Authorization=565ec012251f932ea4000001fa542ae9d994470e73fdb314a8a56d76";


const loadData = async () => {
    area.innerHTML = "";
    let body = await fetch(url2 + key).then(response => response.json())
    console.log(body)
    body.forEach(e => {
        li = document.createElement("li");
        li.innerHTML = e.localteam_name + "-" + e.visitorteam_name + " = " + e.localteam_score + ":" + e.visitorteam_score
        area.appendChild(li);
    });
};

button.onclick = loadData;