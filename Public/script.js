const button = document.getElementById("button");
const url = "http://api.football-api.com/2.0/matches?comp_id=1269";
const urlClassifica = "http://api.football-api.com/2.0/standings/1269?";
const key = "&Authorization=565ec012251f932ea4000001fa542ae9d994470e73fdb314a8a56d76";
let result = [];


const loadMatchs = async () => {
    let body = await fetch(url + "&match_date=24.11.2019" + key).then(response => response.json())
    getData(body)
};

const getData = (body) => {
    body.forEach(e => {   
        match = {
            localTeam: e.localteam_name,
            visitorTeam: e.visitorteam_name,
            score : createScore(e),
            date: e.formatted_date,
            events: createEvents(e.events),
            time: createTime(e.time)
        }
        result.push(match)
    });
    console.log(result)
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