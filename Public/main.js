const url = "http://api.football-api.com/2.0/matches?comp_id="; //api per partite
const urlClassifica = "http://api.football-api.com/2.0/standings/"; // api per classifica
const key = "&Authorization=565ec012251f932ea4000001fa542ae9d994470e73fdb314a8a56d76"; //chiave di autorizzazione
const data = "&match_date=25.11.2019";

const button = document.getElementById("button");
let idCampionato = "";
let matchs = [];
let rank = [];

//import createGraphicForRank from "graphic.js";
const table = document.getElementById("table");

const serieA = document.getElementById("serieA"); //id 1269 serieA
const serieB = document.getElementById("serieB"); //id 1265 serieB
const ligueOne = document.getElementById("ligueOne"); //id 1221 ligue 1
const bundesliga = document.getElementById("bundesliga"); //id 1229 bundesliga
const liga = document.getElementById("liga"); //id 1399 liga
const premierLeague = document.getElementById("premierLeague"); //id 1204 premier

const loadMatchs = async () => {
    let body = await fetch(url + idCampionato + data + key).then(response => response.json())
    matchs = []
    if (body.status === "error") {
        console.log("ERRORE")
    }
    else createObjectMatch(body)
};

const createObjectMatch = (body) => {
    body.forEach(e => {
        match = {
            localTeam: e.localteam_name,
            visitorTeam: e.visitorteam_name,
            score: createScore(e),
            date: e.formatted_date,
            events: createEvents(e.events),
            time: createTime(e.time)
        }
        matchs.push(match)
    });
}

const createTime = (time) => {
    time = time.split(":")
    let hours = parseInt(time[0]) + 1
    time[0] = hours.toString()
    time = time[0] + ":" + time[1]
    return time;
}

const createEvents = (event) => {
    let events = []
    event.forEach(e => {
        if (e.type === "goal") {
            score = {
                team: e.team,
                goal: e.player,
                assist: e.assist,
                time: e.minute
            }
            events.push(score)
        }
    }
    );
    return events
}

const createScore = (match) => {
    if (match.ft_score === "[-]") {
        score = {
            localTeam: "-",
            visitorTeam: "-"
        }
    }
    else {
        score = {
            localTeam: match.localteam_score,
            visitorTeam: match.visitorteam_score
        }
    }
    return score
}

const loadRank = async () => {
    let body = await fetch(urlClassifica + idCampionato + "?" + key).then(response => response.json())
    rank = []
    createObjectRank(body);
}

const createObjectRank = (body) => {
    body.forEach(e => {
        team = {
            name: e.team_name,
            position: e.position,
            points: e.points
        }
        rank.push(team)
    });
    rank.sort(function (a, b) {
        return a.position - b.position
    })
}

const createGraphicForRank = () => {
    console.log(rank)
    table.innerHTML = "";
    const body = document.createElement("tbody");
    table.appendChild(body)
    
    tr = document.createElement("tr")
    th = document.createElement("th")
    th.innerHTML = "Posizione"
    tr.appendChild(th)
    body.appendChild(tr)

    th = document.createElement("th")
    th.innerHTML = "Squadra"
    tr.appendChild(th)
    body.appendChild(tr)

    th = document.createElement("th")
    th.innerHTML = "Punti"
    tr.appendChild(th)
    body.appendChild(tr)


    for (let i = 0; i < rank.length; i++) {
        tr = document.createElement("tr")
        tdPos = document.createElement("td")
        tdPos.innerText = rank[i].position
        tr.appendChild(tdPos)
        tdName = document.createElement("td")
        tdName.innerText = rank[i].name
        tr.appendChild(tdName)
        tdPoints = document.createElement("td")
        tdPoints.innerText = rank[i].points
        tr.appendChild(tdPoints)
        body.appendChild(tr);
    }

};


serieA.onclick = async () => {
    idCampionato = "1269"
    await loadRank();
    createGraphicForRank();
}

serieB.onclick = async () => {
    idCampionato = "1265"
    await loadRank();
    createGraphicForRank();
}

ligueOne.onclick = async () => {
    idCampionato = "1221"
    await loadRank();
    createGraphicForRank();
}

bundesliga.onclick = async () => {
    idCampionato = "1229"
    await loadRank();
    createGraphicForRank();
}

liga.onclick = async () => {
    idCampionato = "1399"
    await loadRank();
    createGraphicForRank();
}

premierLeague.onclick = async () => {
    idCampionato = "1204"
    await loadRank();
    createGraphicForRank();
}


