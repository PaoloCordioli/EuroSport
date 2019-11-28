const button = document.getElementById("button");
const url = "http://api.football-api.com/2.0/matches?comp_id=1269"; //api per partite
const urlClassifica = "http://api.football-api.com/2.0/standings/1204?"; // api per classifica
const key = "&Authorization=565ec012251f932ea4000001fa542ae9d994470e73fdb314a8a56d76";
const data = "&match_date=25.11.2019";
let resultMatchs = [];
let rank = [];
cosnt 

//id 1269 serieA
//id 1204 premier
//id 1229 bundesliga
//id 1221 ligue 1
//id 1265 serieB
//id 1399 liga


const loadMatchs = async () => {
    let body = await fetch(url + data + key).then(response => response.json())
    if(body.status === "error"){
        console.log("ERRORE")
    }
    else createObjectMatch(body)
};

const loadRank = async () => {
    let body = await fetch(urlClassifica + key).then(response => response.json())
    if(body.status === "error"){
        console.log("ERRORE")
    }
    else createObjectRank(body);
}

const createObjectRank = (body) => {
    body.forEach(e => {
        team = {
            name : e.team_name,
            position : e.position,
            points : e.points
        }
        rank.push(team)
    });
    rank.sort(function(a,b){
        return a.position - b.position
    })
    console.log(rank)
}

const createObjectMatch = (body) => {
    body.forEach(e => {   
        match = {
            localTeam: e.localteam_name,
            visitorTeam: e.visitorteam_name,
            score : createScore(e),
            date: e.formatted_date,
            events: createEvents(e.events),
            time: createTime(e.time)
        }
        resultMatchs.push(match)
    });
    console.log(resultMatchs)
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

button.onclick = loadMatchs



