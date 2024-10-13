import axios from "axios";

class SpotifyClient {
  static async initialize() {
    const response = await axios.post(
      "https://accounts.spotify.com/api/token",
      {
        grant_type: "client_credentials",
        client_id: process.env.REACT_APP_SPOTIFY_CLIENT_ID,
        client_secret: process.env.REACT_APP_SPOTIFY_CLIENT_SECRET,
      },
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    let spotify = new SpotifyClient();
    spotify.accessToken = response.data.access_token;
    return spotify;
  }

  async getPopularSongs() {
    const response = await axios.get(
      "https://api.spotify.com/v1/playlists/37i9dQZF1DX0Eftsfm2dbT/tracks",
      {
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
        },
      }
    );
    return response.data;
  }

  async searchSongs(keyword, limit, offset) {
    const response = await axios.get(`https://api.spotify.com/v1/search`, {
      headers: { Authorization: `Bearer ${this.accessToken}` },
      params: {
        q: `${keyword} genre:hip-hop year:1980-2028`,
        type: "track",
        market: "JP",
        limit: limit,
        offset: offset,
      },
    });
    return response.data.tracks;
  }
}

const spotyfy = await SpotifyClient.initialize();

export default spotyfy;
