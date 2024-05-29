import React, { Component, ChangeEvent } from "react";
import { Root } from "react-dom/client";
import "./CustomPlaylist.css";
import home_button from "./home-button.png";
import back_button from "./back-button.png";

type Page = {kind: "genres"} | {kind: "basic_sliders"} | {kind: "all_sliders"} | {kind: "result"};

type CustomPlaylistState = {
  root: Root;
  page: Page;
  attributes: Map<string, number>;
  genres: Set<string>;
  access_token: string | null;
  tracks: Array<any>;
  playlist_url: string;
};

type CustomPlaylistProps = {
  root: Root;
}

const all_attributes : Array<string> = ["tempo", "energy", "popularity", "loudness", "acousticness", "danceability", "duration", "instrumentalness", "key", "liveness", "mode", "speechiness", "time signature", "valence"];

const all_genres : Array<string> = ["acoustic", "afrobeat", "alt-rock", "alternative", "ambient", "anime", "black-metal", "bluegrass", "blues", "bossanova", "brazil", "breakbeat", "british", "cantopop", "chicago-house", "children", "chill", "classical", "club", "comedy", "country", "dance", "dancehall", "death-metal", "deep-house", "detroit-techno", "disco", "disney", "drum-and-bass", "dub", "dubstep", "edm", "electro", "electronic", "emo", "folk", "forro", "french", "funk", "garage", "german", "gospel", "goth", "grindcore", "groove", "grunge", "guitar", "happy", "hard-rock", "hardcore", "hardstyle", "heavy-metal", "hip-hop", "holidays", "honky-tonk", "house", "idm", "indian", "indie", "indie-pop", "industrial", "iranian", "j-dance", "j-idol", "j-pop", "j-rock", "jazz", "k-pop", "kids", "latin", "latino", "malay", "mandopop", "metal", "metal-misc", "metalcore", "minimal-techno", "movies", "mpb", "new-age", "new-release", "opera", "pagode", "party", "philippines-opm", "piano", "pop", "pop-film", "post-dubstep", "power-pop", "progressive-house", "psych-rock", "punk", "punk-rock", "r-n-b", "rainy-day", "reggae", "reggaeton", "road-trip", "rock", "rock-n-roll", "rockabilly", "romance", "sad", "salsa", "samba", "sertanejo", "show-tunes", "singer-songwriter", "ska", "sleep", "songwriter", "soul", "soundtracks", "spanish", "study", "summer", "swedish", "synth-pop", "tango", "techno", "trance", "trip-hop", "turkish", "work-out", "world-music"];

const playlist_size : bigint = 25n;

export class CustomPlaylist extends Component<CustomPlaylistProps, CustomPlaylistState> {
  constructor(props: CustomPlaylistProps) {
    super(props);
    this.state = {root: props.root, page: {kind: "genres"}, attributes: new Map<string, number>(), genres: new Set<string>(), access_token: null, tracks: [], playlist_url: ""};
    for (let i = 0; i < all_attributes.length; i++) {
      this.state.attributes.set(all_attributes[i], 1);
    }
  };

  render = () : JSX.Element => {
    if (this.state.page.kind === "genres") {
      return <div className="CPG-base">
        <h1 className="CPG-header">custom playlist</h1>
        <div className="CPG-background">
          {this.renderGenres()}
          <button className="next-button" type="button" onClick={this.doBasicSlidersClick}>next</button>
        </div>
        <button className="home-button" type="button" onClick={this.doHomeClick}><img className="button-image" alt="home" src={home_button} /></button>
      </div>;
    }
    if (this.state.page.kind === "basic_sliders") {
      return <div className="CPG-base">
        <h1 className="CPG-header">custom playlist</h1>
        <div className="CPG-background">
          <div className="slider-background">
            {this.renderSliders()}
          </div>
          <button className="create-playlist-button" type="button" onClick={this.doSpotifyFetchClick}>create playlist</button>
          <div className="more-options-background">
            <button className="more-options-button" type="button" onClick={this.doAllSlidersClick}>see all</button>
          </div>
        </div>
        <button className="back-button" type="button" onClick={this.doBackClick}><img className="button-image" alt="back" src={back_button} /></button>
        <button className="home-button" type="button" onClick={this.doHomeClick}><img className="button-image" alt="home" src={home_button} /></button>
      </div>;
    } else if (this.state.page.kind === "all_sliders") {
      return <div className="CPG-base">
          <div className="all-slider-container">
            {this.renderSliders()}
          </div>
        <button className="back-button" type="button" onClick={this.doBasicSlidersClick}><img className="button-image" alt="back" src={back_button} /></button>
        <button className="home-button" type="button" onClick={this.doHomeClick}><img className="button-image" alt="home" src={home_button} /></button>
      </div>;
    } else {
      console.log(this.state.playlist_url)
      return <div className="CPG-base">
        <h1 className="CPG-header">your custom playlist</h1>
        <div className="CPG-background">
          <iframe className="embed-playlist" title="CPG-result" src={this.state.playlist_url}
            width="100%"
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" 
            loading="lazy">
          </iframe>
        </div>
        <button className="home-button" type="button" onClick={this.doHomeClick}><img className="button-image" alt="home" src={home_button} /></button>
      </div>;
    }
  };

  renderSliders = () : JSX.Element[] => {
    let num_sliders : bigint = 0n;
    if (this.state.page.kind === "basic_sliders") {
      num_sliders = 4n;
    } else {
      num_sliders = BigInt(all_attributes.length);
    }

    const slider_render : JSX.Element[] = [];
    for (let i = 0; i < num_sliders; i++) {
      const curr_attribute = all_attributes[i];

      if (curr_attribute === "time signature" || curr_attribute === "key") {
        slider_render.push(
          <div className="slider-container">
            <label htmlFor={curr_attribute} className="slider-label">{curr_attribute}</label><br />
            <input type="range" min="1" max="11" id={curr_attribute} onChange={this.doAttributeChange} defaultValue={this.state.attributes.get(curr_attribute)}></input>
          </div>
        )
      } else if (curr_attribute === "popularity") {
        slider_render.push(
          <div className="slider-container">
            <label htmlFor={curr_attribute} className="slider-label">{curr_attribute}</label><br />
            <input type="range" min="1" max="100" id={curr_attribute} onChange={this.doAttributeChange} defaultValue={this.state.attributes.get(curr_attribute)}></input>
          </div>
        )
      } else {
        slider_render.push(
          <div className="slider-container">
            <label htmlFor={curr_attribute} className="slider-label">{curr_attribute}</label><br />
            <input type="range" min="0" max="1" step="0.01" id={curr_attribute} onChange={this.doAttributeChange} defaultValue={this.state.attributes.get(curr_attribute)}></input>
          </div>
        )
      }
    }

    return slider_render;
  }

  renderGenres = () : JSX.Element[] => {
    // Fix duration slider
    const genre_render : JSX.Element[] = [];
    for (let i = 0; i < all_genres.length; i += 7) {
      genre_render.push(
        <React.Fragment>
          <div className="genres">
            <tr>
              <td>
                <input className="checkboxes" type="checkbox" onChange={this.doGenreClick} id={all_genres[i]} name={all_genres[i]} value={all_genres[i]} />
                <label htmlFor={all_genres[i]}>{all_genres[i]}</label>
              </td>
              <td>
                <input className="checkboxes" type="checkbox" onChange={this.doGenreClick} id={all_genres[i + 1]} name={all_genres[i + 1]} value={all_genres[i + 1]} />
                <label htmlFor={all_genres[i + 1]}>{all_genres[i + 1]}</label>
              </td>
              <td>
                <input className="checkboxes" type="checkbox" onChange={this.doGenreClick} id={all_genres[i + 2]} name={all_genres[i + 2]} value={all_genres[i + 2]} />
                <label htmlFor={all_genres[i + 2]}>{all_genres[i + 2]}</label>
              </td>
              <td>
                <input className="checkboxes" type="checkbox" onChange={this.doGenreClick} id={all_genres[i + 3]} name={all_genres[i + 3]} value={all_genres[i + 3]} />
                <label htmlFor={all_genres[i + 3]}>{all_genres[i + 3]}</label>
              </td>
              <td>
                <input className="checkboxes" type="checkbox" onChange={this.doGenreClick} id={all_genres[i + 4]} name={all_genres[i + 4]} value={all_genres[i + 4]} />
                <label htmlFor={all_genres[i + 4]}>{all_genres[i + 4]}</label>
              </td>
              <td>
                <input className="checkboxes" type="checkbox" onChange={this.doGenreClick} id={all_genres[i + 5]} name={all_genres[i + 5]} value={all_genres[i + 5]} />
                <label htmlFor={all_genres[i + 5]}>{all_genres[i + 5]}</label>
              </td>
              <td>
                <input className="checkboxes" type="checkbox" onChange={this.doGenreClick} id={all_genres[i + 6]} name={all_genres[i + 6]} value={all_genres[i + 6]} />
                <label htmlFor={all_genres[i + 6]}>{all_genres[i + 6]}</label>
              </td>
            </tr>
          </div>
        </ React.Fragment>
      );
    }
    return genre_render;
  }

  doGenreClick = (evt: ChangeEvent<HTMLInputElement>) : void => {
    if (this.state.genres.has(evt.target.id)) {
      this.state.genres.delete(evt.target.id);
    } else {
      if (this.state.genres.size >= 5) {
        alert("Cannot select more than 5 seed genres");
        const checkbox = document.getElementById(evt.target.id) as HTMLInputElement;
        checkbox.checked = false;        
      } else {
        this.state.genres.add(evt.target.id);
      }
    }
  }

  doHomeClick = () : void => {
    this.state.root.unmount();
  };

  doBackClick = () : void => {
    this.setState({page: {kind: "genres"}});
  }

  doAllSlidersClick = () : void => {
    this.setState({page: {kind: "all_sliders"}});
  }

  doBasicSlidersClick = () : void => {
    if (this.state.genres.size === 0) {
      alert("Must select at least 1 seed genre.");
    } else {
      this.setState({page: {kind: "basic_sliders"}});
    }
  }

  doAttributeChange = (evt: ChangeEvent<HTMLInputElement>): void => {
    //Creates new map so react recognizes change
    const newAttributes = new Map(this.state.attributes);
    newAttributes.set(evt.target.id, parseFloat(evt.target.value));
    this.setState({ attributes: newAttributes });
  };


  doSpotifyFetchClick = () : void => {
    const access_token = localStorage.getItem('spotifyAccessToken');
    // Ideally don't send all the attributes to spotify
    if (access_token === undefined || access_token === null) {
      alert("Please login to use Custom Playlist Generator!");
      this.state.root.unmount();
    } else {
      var fetch_url = "https://api.spotify.com/v1/recommendations?seed_genres=";
      // Append seed genres
      for (var genre of this.state.genres.values()) {
        fetch_url = fetch_url.concat(genre, "%2C");
      }
      // Remove trailing %2C
      fetch_url = fetch_url.slice(0, fetch_url.length - 3);
      // Append attributes
      fetch_url = fetch_url.concat("&limit=", playlist_size.toString());
      for (var i = 0; i < all_attributes.length; i++) {
       if (all_attributes[i] === "duration") {
          fetch_url = fetch_url.concat("&target_", all_attributes[i], "_ms=", this.state.attributes.get(all_attributes[i]).toString())
        } else {
          fetch_url = fetch_url.concat("&target_", all_attributes[i].replace(" ", "_"), "=", this.state.attributes.get(all_attributes[i]).toString())
        }        
      }
      const auth = "Bearer " + access_token;
      fetch(fetch_url, {
        method: "GET",
        headers: {
          Authorization: auth,
        }
      }).then(this.doSpotifyFetch)
        .catch(() => this.doGeneralError("Failed to connect to server on doSpotifyFetch"));
    }
  }

  doSpotifyFetch = (res: Response) : void => {
    if (res.status === 200) {
      res.json().then(this.doSpotifyFetchJson)
              .catch((error) => this.doGeneralError(error));
    } else if (res.status === 401) {
      alert("Please login to use Custom Playlist Generator!");
      this.state.root.unmount();
    } else if (res.status === 403) {
      res.text().then(this.doGeneralError)
              .catch(() => this.doGeneralError(res.status + " response is not text"));
    } else {
      this.doGeneralError("Bad status code: " + res.status);
    }
  };

  doSpotifyFetchJson = (obj: any) : void => {
    const tracks = obj.tracks;
    this.setState({tracks: tracks});
    // Get user Spotify ID
    const access_token = localStorage.getItem('spotifyAccessToken');
    const auth = "Bearer " + access_token;
    fetch("https://api.spotify.com/v1/me", {
      method: "GET",
        headers: {
          Authorization: auth,
        }
    }).then(this.doGetId)
      .catch((error) => this.doGeneralError(error));
  }

  doGetId = (res: any) : void => {
    res.json().then(this.doCreateNewPlaylist);
  }

  doCreateNewPlaylist = (res: any) : void => {
    const user_id = res.id;
    if (user_id === undefined) {
      this.doGeneralError("No user ID");
    }
    // Create empty playlist
    const playlist_endpoint = "https://api.spotify.com/v1/users/" + user_id + "/playlists";
    const access_token = localStorage.getItem('spotifyAccessToken');
    const auth = "Bearer " + access_token;

    const payload = {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
        'Authorization': auth,
      },
      body: JSON.stringify({
        'name': "Your New Custom Playlist",
      }),
    };
    fetch(playlist_endpoint, payload).then(this.doGetPlaylistId);
  }

  doGetPlaylistId = (res: any) : void => {
    res.json().then(this.doAddTracks);
  }

  doAddTracks = (playlist_res: any) : void => {
    const playlist_id = playlist_res.id;
    this.setState({playlist_url: "https://open.spotify.com/embed/playlist/" + playlist_id});
    const track_uris : string[] = [];
    for (var track of this.state.tracks) {
      track_uris.push(track.uri);
    }
    const add_endpoint = "https://api.spotify.com/v1/playlists/" + playlist_id + "/tracks";
    const access_token = localStorage.getItem('spotifyAccessToken');
    const auth = "Bearer " + access_token;

    const payload = {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
        'Authorization': auth,
      },
      body: JSON.stringify({
        'uris': track_uris,
      }),
    };

    fetch(add_endpoint, payload).then(this.doAddResult);
  }

  doAddResult = (res: any) : void => {
    res.json().then(this.doShowPlaylist);
  }

  doShowPlaylist = (playlist_json: any) : void => {
    const snapshot_id = playlist_json.snapshot_id;
    this.setState({page: {kind: "result"}});
  }

  doGeneralError = (msg: string) : void => {
    alert(msg);
  }

  /**
   * FUNCTIONS:
   * - preserve slider states between more/fewer sliders
   *
   */
}