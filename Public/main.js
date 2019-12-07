const urlMatch = "http://api.football-api.com/2.0/matches?comp_id="; //api per partite
const urlClassifica = "http://api.football-api.com/2.0/standings/"; // api per classifica
const key = "&Authorization=565ec012251f932ea4000001fa542ae9d994470e73fdb314a8a56d76"; //chiave di autorizzazione

let idCampionato = ""; // id del campionato con cui lavorare
let matchs = []; // oggetto contenente le partite di una certa data di un campionato
let rank = []; // oggetto contenente la classifica di un campionato
let date = ""; // oggetto per la data


const tableRank = document.getElementById("tableRank"); //spazio per visualizzare classifica
const tableMatchs = document.getElementById("tableMatchs"); //spazio per visualizzare le partite
const inputDate = document.getElementById("date"); //oggetto dell'input date
const page = document.getElementById("window"); //oggetto del body
const title = document.getElementById("title"); // nome del campionato

const serieA = document.getElementById("serieA"); //id 1269 serieA
const serieB = document.getElementById("serieB"); //id 1265 serieB
const ligueOne = document.getElementById("ligueOne"); //id 1221 ligue 1
const bundesliga = document.getElementById("bundesliga"); //id 1229 bundesliga
const liga = document.getElementById("liga"); //id 1399 liga
const premierLeague = document.getElementById("premierLeague"); //id 1204 premier

//funzioni per le partite
const loadMatchs = async () => { // funzione per caricare le partite
    let body = await fetch(urlMatch + idCampionato + "&match_date=" + date + key).then(response => response.json())
    matchs = []
    if (body.status === "error") {
        console.log("ERRORE")
    }
    else createObjectMatch(body)
};

const createObjectMatch = (body) => { // creo oggetto contenente le partite
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

const createTime = (time) => { // creo oggetto che ne indica l'ora della singola partita
    time = time.split(":")
    let hours = parseInt(time[0]) + 1
    time[0] = hours.toString()
    time = time[0] + ":" + time[1]
    return time;
}

const createEvents = (event) => { // creo oggetto contenente i goal e assist
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

const createScore = (match) => { // creo oggetto contenente il risultato
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


//funzioni per la classifica
const loadRank = async () => { // funzione per caricare la classifica
    let body = await fetch(urlClassifica + idCampionato + "?" + key).then(response => response.json())
    rank = []
    createObjectRank(body);
}

const createObjectRank = (body) => { // creo oggetto contenente la classifica
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



//funzione per la grafica
const createGraphicForRank = () => { // visualizzo la classifica
    tableMatchs.innerText = ""
    tableRank.innerText = ""
    body = document.createElement("tbody")
    tableRank.appendChild(body)

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

const createGraphicForMatchs = async () => { // visualizzo le partite
    tableMatchs.innerHTML = "<div class='spinner-border' role='status'>" + "<span class='sr-only'>Loading...</span>" + "</div>"
    await loadMatchs();
    if (matchs.length === 0) {
        tableMatchs.innerHTML = "<p style='margin-left: 125px;'> Nessuna partita per la data selezionata </p>"
    }
    else {
        tableMatchs.innerText = ""
        matchs.forEach(e => {
            table = document.createElement("table")
            table.setAttribute('class', 'table table-bordered table-sm table-borderless')
            body = document.createElement("tbody")
            table.appendChild(body)

            tr = document.createElement("tr")

            tdLocal = document.createElement("td")
            if (e.score.localTeam === "-") {
                tdLocal.innerHTML = e.localTeam + "<br>"
            }
            else tdLocal.innerHTML = e.localTeam + "<br>" + "<hr>"
            e.events.forEach(e => {
                if (e.team === "localteam") {
                    if (e.assist !== "") {
                        tdLocal.innerHTML += "<img src='img/iconGoal.jpg'>" + e.goal + " " + e.time + "'" + "<br>" + "<img src='img/iconAssist.jpg'>" + e.assist + "<br>"
                    }
                    else tdLocal.innerHTML += "<img src='img/iconGoal.jpg'>" + e.goal + " " + e.time + "'" + "<br>"
                }
            });
            tr.appendChild(tdLocal)

            tdVisitor = document.createElement("td")
            if (e.score.localTeam === "-") {
                tdVisitor.innerHTML = e.visitorTeam + "<br>"
            }
            else tdVisitor.innerHTML = e.visitorTeam + "<br>" + "<hr>"
            e.events.forEach(e => {
                if (e.team === "visitorteam") {
                    if (e.assist !== "") {
                        tdVisitor.innerHTML += "<img src='img/iconGoal.jpg'>" + e.goal + " " + e.time + "'" + "<br>" + "<img src='img/iconAssist.jpg'>" + e.assist + "<br>"
                    }
                    else tdVisitor.innerHTML += "<img src='img/iconGoal.jpg'>" + e.goal + " " + e.time + "'" + "<br>"
                }
            });
            tr.appendChild(tdVisitor)


            tdPoints = document.createElement("td")
            if (e.score.localTeam === "-") {
                tdPoints.innerText = "0 - 0"
            }
            else {
                tdPoints.innerText = e.score.localTeam + "-" + e.score.visitorTeam
            }
            tr.appendChild(tdPoints)

            tdTime = document.createElement("td")
            tdTime.innerText = e.time
            tr.appendChild(tdTime)

            body.appendChild(tr)
            tableMatchs.appendChild(table)
            br = document.createElement("br")
            tableMatchs.appendChild(br)
        });
    }
}



//funzioni assegnate ai bottoni
serieA.onclick = async () => { // carico la classifica della serieA
    idCampionato = "1269"
    title.innerHTML =  "Serie A"  + " " + "<img src='img/SerieA.jpg'>" 
    tableRank.innerHTML = "<div class='spinner-border' role='status'>" + "<span class='sr-only'>Loading...</span>" + "</div>"
    await loadRank();
    createGraphicForRank();
}

serieB.onclick = async () => { // carico la classifica della serieB
    idCampionato = "1265"
    title.innerHTML =  "Serie B"  + " " + "<img src='img/SerieB.jpg'>" 
    tableRank.innerHTML = "<div class='spinner-border' role='status'>" + "<span class='sr-only'>Loading...</span>" + "</div>"
    await loadRank();
    createGraphicForRank();
}

ligueOne.onclick = async () => { // carico la classifica della ligueOne
    idCampionato = "1221"
    title.innerHTML =  "Ligue 1"  + " " + "<img src='img/Ligue1.jpg'>" 
    tableRank.innerHTML = "<div class='spinner-border' role='status'>" + "<span class='sr-only'>Loading...</span>" + "</div>"
    await loadRank();
    createGraphicForRank();
}

bundesliga.onclick = async () => {// carico la classifica della Bundesliga
    idCampionato = "1229"
    title.innerHTML =  "Bundesliga"  + " " + "<img src='img/Bundesliga.jpg'>" 
    tableRank.innerHTML = "<div class='spinner-border' role='status'>" + "<span class='sr-only'>Loading...</span>" + "</div>"
    await loadRank();
    createGraphicForRank();
}

liga.onclick = async () => { // carico la classifica della Liga spagnola
    idCampionato = "1399"
    title.innerHTML =  "Liga"  + " " + "<img src='img/LaLiga.jpg'>" 
    tableRank.innerHTML = "<div class='spinner-border' role='status'>" + "<span class='sr-only'>Loading...</span>" + "</div>"
    await loadRank();
    createGraphicForRank();
}

premierLeague.onclick = async () => { // carico la classifica della Premier League
    idCampionato = "1204"
    title.innerHTML =  "Premier League"  + " " + "<img src='img/PremierLeague.jpg'>" 
    tableRank.innerHTML = "<div class='spinner-border' role='status'>" + "<span class='sr-only'>Loading...</span>" + "</div>"
    await loadRank();
    createGraphicForRank();
}



// funzioni varie
const getDate = () => { // ottengo la data dall'input
    year = inputDate.value.substring(0, 4)
    month = inputDate.value.substring(5, 7)
    day = inputDate.value.substring(8, 10)
    date = day + "." + month + "." + year
    createGraphicForMatchs()
}

const avvio = async () => { // funzione da chiamare all'avvio
    idCampionato = "1269"
    title.innerHTML =  "Serie A"  + " " + "<img src='img/SerieA.jpg'>" 
    tableRank.innerHTML = "<div class='spinner-border' role='status'>" + "<span class='sr-only'>Loading...</span>" + "</div>"
    await loadRank();
    createGraphicForRank()
}



//assegnamento di funzioni agli id dell'html
page.onload = avvio; // caricata la pagina chiamo la funzione
inputDate.onchange = getDate; // quando cambia valore chiamo la funzione 


