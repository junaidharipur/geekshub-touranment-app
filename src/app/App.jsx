import StyleSheet from "./styles.module.css";

import * as React from "react";

import classNames from "classnames";
import shuffle from "lodash.shuffle";
import useWindowSize from "react-use/lib/useWindowSize";
import Confetti from "react-confetti";

import data from "./data.json";
import { restructorArray } from "../lib/reStructureArray";

const LOCAL_STORAGE_KEYS = {
  TEAM_A: "TEAM_A",
  TEAM_B: "TEAM_B",
  A_FOOTBALL_WINNERS: "A_FOOTBALL_WINNERS",
  B_FOOTBALL_WINNERS: "B_FOOTBALL_WINNERS",
  A_TAKEN_WINNERS: "A_TAKEN_WINNERS",
  B_TAKEN_WINNERS: "B_TAKEN_WINNERS",
  A_SCORES: "A_SCORES",
  B_SCORES: "B_SCORES",
  SCHEDULED: "SCHEDULED",
};

function Avatar({ name: currentName, picture: currentPicture }) {
  const name = currentName || "Guest";
  const picture = currentPicture || "/default-avatar.png";

  return (
    <div className={StyleSheet.avatar}>
      <img className={StyleSheet.avatar_img} src={picture} alt={name} />
      <p className={StyleSheet.avatar_name_text}>{name}</p>
    </div>
  );
}

function Badge({ type = "winner" }) {
  const charArray = type.split("");

  return (
    <div
      className={classNames({
        [StyleSheet.badge]: true,
        [StyleSheet.success]: type === "winner",
      })}
    >
      {charArray.map((item, index) => (
        <span key={index} className={StyleSheet.badge_char}>
          {item}
        </span>
      ))}
    </div>
  );
}

function WinnerBoard({ winningTeam, scores, isDraw, loosingTeamScores }) {
  const { width, height } = useWindowSize();

  if (isDraw) return alert("Touranment is ending up in a draw!");

  const resetTouranment = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  return (
    <React.Fragment>
      <div className={StyleSheet.winner_reset}>
        <span onClick={resetTouranment} className={StyleSheet.winner_reset_btn}>
          <img
            className={StyleSheet.winner_reset_img}
            src="/reset-icon.svg"
            alt="reset"
          />
        </span>{" "}
        Reset
      </div>
      <Confetti width={width - 30} height={height} />
      <div className={StyleSheet.winner_board}>
        <div className={StyleSheet.winner_heading}>
          <img className={StyleSheet.win_img} alt="win" src="/win.png" />
          <h2
            className={classNames(
              StyleSheet.heading_inner,
              StyleSheet.heading_text
            )}
          >
            Congradulations!
          </h2>
        </div>
        <div className={StyleSheet.winning_team}>
          {winningTeam.map((player) => (
            <div key={JSON.stringify(player)}>
              <Avatar name={player.name} picture={player.picture} />
            </div>
          ))}
        </div>
        <div
          className={classNames(
            StyleSheet.tertionary_heading,
            StyleSheet.center
          )}
        >
          You've won the Touranment!
        </div>
        <div className={StyleSheet.winning_team_scores}>
          <h3 className={StyleSheet.heading_secondary}>
            Your Team Scores:{" "}
            <span className={StyleSheet.success_text}>{scores}</span>
          </h3>
          <h3 className={StyleSheet.heading_secondary}>
            Other Team Scores:{" "}
            <span className={StyleSheet.danger_text}>{loosingTeamScores}</span>
          </h3>
        </div>
      </div>
    </React.Fragment>
  );
}

function App() {
  const [isCompleted, setIsCompleted] = React.useState(false);
  const [isScheduled, setIsScheduled] = React.useState(
    () => localStorage.getItem(LOCAL_STORAGE_KEYS.SCHEDULED) || false
  );
  const [teamA, setTeamA] = React.useState(
    () => JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEYS.TEAM_A)) || null
  );
  const [teamB, setTeamB] = React.useState(() =>
    JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEYS.TEAM_B) || null)
  );
  const [teamAScores, setTeamAScores] = React.useState(
    () => JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEYS.A_SCORES)) || 0
  );
  const [teamBScores, setTeamBScores] = React.useState(
    () => JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEYS.B_SCORES)) || 0
  );
  const [teamAFootballWinners, setTeamAFootballWinners] = React.useState(
    () =>
      JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEYS.A_FOOTBALL_WINNERS)) ||
      []
  );
  const [teamBFootballWinners, setTeamBFootballWinners] = React.useState(
    () =>
      JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEYS.B_FOOTBALL_WINNERS)) ||
      []
  );
  const [teamATakenWinners, setTeamATakenWinners] = React.useState(
    () =>
      JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEYS.A_TAKEN_WINNERS)) || []
  );
  const [teamBTakenWinners, setTeamBTakenWinners] = React.useState(
    () =>
      JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEYS.B_TAKEN_WINNERS)) || []
  );

  const makeTeams = () => {
    if (isScheduled) {
      if (
        window.confirm(
          "Current Touranment is not finished yet, Do you really wan't to create a new Touranment?"
        )
      ) {
        localStorage.clear();
        window.location.href = "/";
      }
    }

    setIsScheduled(() => {
      localStorage.setItem(LOCAL_STORAGE_KEYS.SCHEDULED, true);
      return true;
    });
    const shuffledPlayers = shuffle(data.players);

    const half = Math.floor(shuffledPlayers.length / 2);
    const _teamA = shuffledPlayers.slice(0, half);
    const _teamB = shuffledPlayers.slice(_teamA.length);

    setTeamA(() => {
      localStorage.setItem(LOCAL_STORAGE_KEYS.TEAM_A, JSON.stringify(_teamA));
      return _teamA;
    });
    setTeamB(() => {
      localStorage.setItem(LOCAL_STORAGE_KEYS.TEAM_B, JSON.stringify(_teamB));
      return _teamB;
    });
  };

  React.useEffect(() => {
    const teamAScores =
      teamAFootballWinners.length * 2 + teamATakenWinners.length;
    const teamBScores =
      teamBFootballWinners.length * 2 + teamBTakenWinners.length;

    setTeamAScores(() => {
      localStorage.setItem(
        LOCAL_STORAGE_KEYS.A_SCORES,
        JSON.stringify(teamAScores)
      );
      return teamAScores;
    });
    setTeamBScores(() => {
      localStorage.setItem(
        LOCAL_STORAGE_KEYS.B_SCORES,
        JSON.stringify(teamBScores)
      );
      return teamBScores;
    });
  }, [
    teamAFootballWinners,
    teamBFootballWinners,
    teamATakenWinners,
    teamBTakenWinners,
  ]);

  React.useEffect(() => {
    if (teamA?.length && teamB?.length) {
      const isTakenCompleted =
        teamATakenWinners.length + teamBTakenWinners.length >= teamA.length;

      const _formable_teams = restructorArray(teamB, 2).filter((item) => {
        return item.length === 2 ? true : false;
      });
      const isFootballCompleted =
        teamAFootballWinners.length + teamBFootballWinners.length ===
        _formable_teams.length;

      if (isTakenCompleted && isFootballCompleted) {
        setIsCompleted(true);
      }
    }
  }, [
    teamB,
    teamA,
    teamAFootballWinners,
    teamBFootballWinners,
    teamATakenWinners,
    teamBTakenWinners,
  ]);

  const { players } = data;

  const winningTeam = teamAScores > teamBScores ? teamA : teamB;
  const winningTeamScores =
    teamAScores > teamBScores ? teamAScores : teamBScores;
  const loosingTeamScores =
    teamAScores > teamBScores ? teamBScores : teamAScores;

  if (isCompleted)
    return (
      <WinnerBoard
        isDraw={teamAScores === teamBScores}
        winningTeam={winningTeam}
        scores={winningTeamScores}
        loosingTeamScores={loosingTeamScores}
      />
    );

  return (
    <div className={StyleSheet.container}>
      <div className={StyleSheet.title}>
        <img className={StyleSheet.logo_img} src="/app-logo.png" alt="logo" />
        <h1 className={StyleSheet.heading}>
          Welcome to{" "}
          <span className={StyleSheet.heading_inner}>
            "GeeksHub Friday Touranment"{" "}
          </span>
          App
        </h1>
      </div>
      <div className={StyleSheet.player_list}>
        <h3 className={StyleSheet.tertionary_heading}>Our Talented Players</h3>
        <div className={StyleSheet.player_list_items}>
          {players.map((player) => (
            <Avatar
              key={JSON.stringify(player)}
              name={player.name}
              picture={player.picture}
            />
          ))}
        </div>
        <button className={StyleSheet.btn} onClick={makeTeams}>
          Start Touranment
        </button>
      </div>
      {isScheduled && (
        <div
          className={classNames(
            StyleSheet.container,
            StyleSheet.two_sections_view
          )}
        >
          <div>
            <h2 className={StyleSheet.heading_secondary}>
              <span>Team A</span>
              <span>Score: {teamAScores}</span>
            </h2>
            <div
              className={classNames(
                StyleSheet.player_list_items,
                StyleSheet.player_list_items_left
              )}
            >
              {teamA.map((player) => (
                <Avatar
                  key={JSON.stringify(player)}
                  name={player.name}
                  picture={player.picture}
                />
              ))}
            </div>
          </div>
          <div>
            <h2 className={StyleSheet.heading_secondary}>
              {" "}
              <span>Team B</span>
              <span>Score: {teamBScores}</span>
            </h2>
            <div
              className={classNames(
                StyleSheet.player_list_items,
                StyleSheet.player_list_items_left
              )}
            >
              {teamB.map((player) => (
                <Avatar
                  key={JSON.stringify(player)}
                  name={player.name}
                  picture={player.picture}
                />
              ))}
            </div>
          </div>
        </div>
      )}
      {isScheduled && (
        <div>
          <h2 className={StyleSheet.tertionary_heading}>scheduled matches</h2>
          <div
            className={classNames(
              StyleSheet.container,
              StyleSheet.two_sections_view
            )}
          >
            <div>
              <h2 className={StyleSheet.heading_secondary}>Football Matches</h2>
              <ul>
                {restructorArray(teamA, 2).map((players, index) => {
                  const teamBPlayers = restructorArray(teamB, 2);
                  return (
                    players.length === 2 && (
                      <li key={index}>
                        <h5>Match {index + 1}</h5>
                        <div className={StyleSheet.row_sections_view}>
                          <div className={StyleSheet.scheduled_item}>
                            {teamAFootballWinners.includes(index) && (
                              <Badge type="winner" />
                            )}
                            <div className={StyleSheet.scheduled_player}>
                              {players.map((player) => (
                                <div key={JSON.stringify(player)}>
                                  <Avatar
                                    name={player.name}
                                    picture={player.picture}
                                  />
                                </div>
                              ))}
                            </div>
                            {!teamAFootballWinners.includes(index) &&
                              !teamBFootballWinners.includes(index) && (
                                <button
                                  onClick={() =>
                                    setTeamAFootballWinners((prev) => {
                                      const _new = [...prev, index];
                                      localStorage.setItem(
                                        LOCAL_STORAGE_KEYS.A_FOOTBALL_WINNERS,
                                        JSON.stringify(_new)
                                      );
                                      return _new;
                                    })
                                  }
                                  className={StyleSheet.btn}
                                >
                                  Winner
                                </button>
                              )}
                          </div>
                          <span>
                            <img
                              className={StyleSheet.vs_logo_img}
                              alt="V/S"
                              src="/vs.png"
                            />
                          </span>
                          <div>
                            <div className={StyleSheet.scheduled_item}>
                              {teamBFootballWinners.includes(index) && (
                                <Badge type="winner" />
                              )}
                              <div className={StyleSheet.scheduled_player}>
                                {teamBPlayers[index].map((player) => (
                                  <div key={JSON.stringify(player)}>
                                    <Avatar
                                      name={player.name}
                                      picture={player.picture}
                                    />
                                  </div>
                                ))}
                              </div>
                              {!teamBFootballWinners.includes(index) &&
                                !teamAFootballWinners.includes(index) && (
                                  <button
                                    onClick={() =>
                                      setTeamBFootballWinners((prev) => {
                                        const _new = [...prev, index];

                                        localStorage.setItem(
                                          LOCAL_STORAGE_KEYS.B_FOOTBALL_WINNERS,
                                          JSON.stringify(_new)
                                        );
                                        return _new;
                                      })
                                    }
                                    className={StyleSheet.btn}
                                  >
                                    Winner
                                  </button>
                                )}
                            </div>
                          </div>
                        </div>
                      </li>
                    )
                  );
                })}
              </ul>
            </div>
            {isScheduled && (
              <div>
                <h2 className={StyleSheet.heading_secondary}>Taken Matches</h2>
                <ul className={StyleSheet.taken_section}>
                  {teamA.map((player, index) => (
                    <li key={JSON.stringify(player)}>
                      <h5>Match {index + 1}</h5>
                      <div className={StyleSheet.taken_items}>
                        <div className={StyleSheet.taken_item}>
                          <div className={StyleSheet.taken_player}>
                            {teamATakenWinners.includes(index) && (
                              <Badge type="winner" />
                            )}
                            <Avatar
                              name={player.name}
                              picture={player.picture}
                            />
                          </div>
                          {!teamATakenWinners.includes(index) &&
                            !teamBTakenWinners.includes(index) && (
                              <button
                                onClick={() =>
                                  setTeamATakenWinners((prev) => {
                                    const _new = [...prev, index];

                                    localStorage.setItem(
                                      LOCAL_STORAGE_KEYS.A_TAKEN_WINNERS,
                                      JSON.stringify(_new)
                                    );
                                    return _new;
                                  })
                                }
                                className={StyleSheet.btn}
                              >
                                Winner
                              </button>
                            )}
                        </div>
                        <span>
                          <img
                            className={StyleSheet.vs_logo_img}
                            alt="V/S"
                            src="/vs.png"
                          />
                        </span>
                        <div className={StyleSheet.taken_item}>
                          <div className={StyleSheet.taken_player}>
                            {teamBTakenWinners.includes(index) && (
                              <Badge type="winner" />
                            )}
                            <Avatar
                              name={teamB[index].name}
                              picture={teamB[index].picture}
                            />
                          </div>
                          {!teamATakenWinners.includes(index) &&
                            !teamBTakenWinners.includes(index) && (
                              <button
                                onClick={() =>
                                  setTeamBTakenWinners((prev) => {
                                    const _new = [...prev, index];

                                    localStorage.setItem(
                                      LOCAL_STORAGE_KEYS.B_TAKEN_WINNERS,
                                      JSON.stringify(_new)
                                    );
                                    return _new;
                                  })
                                }
                                className={StyleSheet.btn}
                              >
                                Winner
                              </button>
                            )}
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
