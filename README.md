# Winkel Games

Elf Browsergames mit Übersichtsseite. Läuft mit Docker auf dem Mac (Mac-Winkel), erreichbar unter https://games.spielmann.it.

## Aufbau

| Teil | Aufgabe |
| --- | --- |
| `index.html` | Übersichtsseite mit allen Spielen |
| `<Spiel>/` | Je ein Ordner pro Spiel (HTML Datei und Icon) |
| `nginx.conf` | Liefert die Seiten aus und leitet `/api/<spiel>` an die Bestenlisten weiter |
| `api/` | Kleiner Dienst (json-server) für die Bestenlisten |
| `docker-compose.yml` | Startet beide Container und hängt den Webserver ans Netzwerk `proxy` (Caddy) |

## Einrichtung auf Mac-Winkel (einmalig)

1. **DNS bei Metanet:** Für `games.spielmann.it` einen A Record auf die WAN IP des Routers anlegen (gleich wie bei `grafana` und `freundebuch`). Das zuerst machen, sonst scheitert Caddy bei der Zertifikatsausstellung.
2. **Stack starten:**

        cd ~/docker
        git clone https://github.com/JanickSpielmann/html-games.git
        cd html-games
        docker compose up -d --build

3. **Caddy:** In `~/docker/caddy/Caddyfile` diesen Block ergänzen und Caddy neu laden:

        games.spielmann.it {
            reverse_proxy winkel-games:80
        }

4. `https://games.spielmann.it` im Browser öffnen.

Zum Testen auf dem Mac selbst gibt es `http://localhost:8088`. Anderer Port: `GAMES_PORT=9090 docker compose up -d`.

## Aktualisieren

    git pull
    docker compose up -d --build

Änderungen an Spielen und der Übersichtsseite sind nach dem `git pull` sofort sichtbar. Der Befehl `docker compose up -d --build` ist nur nötig, wenn sich `api/` oder `docker-compose.yml` geändert haben.

Hat sich `nginx.conf` geändert, den Container neu erstellen:

    docker compose up -d --build --force-recreate

Grund: `nginx.conf` ist als einzelne Datei eingebunden. Nach `git pull` ist das eine neue Datei, der laufende Container sieht aber weiter die alte. Ein `nginx -s reload` oder ein normales `docker compose up` genügt deshalb nicht.

## Neues Spiel hinzufügen

1. Ordner mit der HTML Datei und dem Icon anlegen.
2. In `index.html` oben in der Liste `games` einen Eintrag ergänzen.
3. Hat das Spiel eine Bestenliste, den Namen in `api/db.seed.json` eintragen und die API mit `/api/<name>` ansprechen. Beim nächsten Start legt der Dienst die Liste selbst an, bestehende Bestenlisten bleiben erhalten.

## Bestenlisten

Die Bestenlisten liegen im Docker Volume `games-data` und nicht im Repo. Sicherung:

    docker run --rm -v winkel-games_games-data:/data -v "$PWD":/backup alpine cp /data/db.json /backup/bestenlisten-backup.json

Die API ist bewusst einfach gehalten: Wer die Seite erreicht, kann Einträge schreiben und überschreiben. Für den Prototyp im Heimnetz ist das gewollt.
