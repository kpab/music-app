import { useEffect, useRef, useState } from "react";
import { SongList } from "./conponents/SongList";
import spotyfy from "./lib/spotyfy";
import { Player } from "./conponents/Player";
import { SearchInput } from "./conponents/SearchInput";
import { Pagenation } from "./conponents/Pagenation";

const LIMIT = 20;

export default function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [popularSongs, setPopularSongs] = useState([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedSong, setSelectedSong] = useState();
  const [isAudioReady, setIsAudioReady] = useState(false);
  const [keyword, setKeyword] = useState("");
  const [searchedSongs, setSearchedSongs] = useState();
  const [isSearching, setIsSearching] = useState(false);
  const [page, setPage] = useState(1);
  const audioRef = useRef(null);
  const isSearchedResult = searchedSongs != null;
  const [hasNext, setHasNext] = useState(false);
  const [hasPrev, setHasPrev] = useState(false);

  useEffect(() => {
    document.title = "J-Hiphop Music Player";
    fetchPopularSongs();
  }, []);

  const fetchPopularSongs = async () => {
    setIsLoading(true);
    try {
      const result = await spotyfy.getPopularSongs();
      const popularSongs = result.items.map((item) => item.track);
      setPopularSongs(popularSongs);
    } catch (error) {
      console.error("人気の曲の取得に失敗しました:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSongSelected = (song) => {
    setSelectedSong(song);
    if (song.preview_url != null) {
      setIsAudioReady(false);
      setIsPlaying(false);
      if (audioRef.current) {
        audioRef.current.src = song.preview_url;
        audioRef.current.load();
      }
    } else {
      pauseSong();
    }
  };
  const handleInputChange = (e) => {
    setKeyword(e.target.value);
  };

  const playSong = () => {
    if (audioRef.current && audioRef.current.readyState >= 2) {
      audioRef.current.play().catch((error) => {
        console.error("再生エラー:", error);
        setIsPlaying(false);
      });
      setIsPlaying(true);
    }
  };

  const pauseSong = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  const toggleSong = () => {
    if (isPlaying) {
      pauseSong();
    } else {
      playSong();
    }
  };

  const handleAudioLoaded = () => {
    setIsAudioReady(true);
    playSong(); // 読み込みが完了したら自動的に再生を開始
  };

  const searchSongs = async (page) => {
    setIsLoading(true);
    const offset = parseInt(page) ? parseInt(page) * LIMIT : 0;
    if (keyword) {
      const result = await spotyfy.searchSongs(keyword, LIMIT, offset);
      setSearchedSongs(result.items);
      setHasNext(result.next != null);
      setHasPrev(result.previous != null);
    }
    setIsLoading(false);
  };

  const moveToNext = async () => {
    setPage(page + 1);
    await searchSongs(page + 1);
    setPage(page + 1);
  };
  const moveToPrev = async () => {
    setPage(page - 1);
    await searchSongs(page - 1);
    setPage(page - 1);
  };

  return (
    <html lang="ja">
      <head>
        <link
          rel="icon"
          href="https://img.icons8.com/?size=100&id=mpeojql23sni&format=png&color=000000"
        />
      </head>
      <body>
        <div className="flex flex-col min-h-screen bg-gray-900 text-white">
          <main className="flex-1 p-8 mb-20">
            <header
              onClick={() => {
                setKeyword("");
                setSearchedSongs(null);
                setPage(1);
              }}
              className="flex items-center mb-10 cursor-pointer"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="currentColor"
                className="mr-2 cursor-pointer"
                viewBox="0 0 16 16"
                onClick={() => {
                  setKeyword("");
                  setSearchedSongs(null);
                  setPage(1);
                }}
              >
                <path d="M12 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2zm-.5 4.11v1.8l-2.5.5v5.09c0 .495-.301.883-.662 1.123C7.974 12.866 7.499 13 7 13c-.5 0-.974-.134-1.338-.377-.36-.24-.662-.628-.662-1.123s.301-.883.662-1.123C6.026 10.134 6.501 10 7 10c.356 0 .7.068 1 .196V4.41a1 1 0 0 1 .804-.98l1.5-.3a1 1 0 0 1 1.196.98z" />
              </svg>
              <h1 className="text-4xl font-bold">J-Hiphop Music Player</h1>
            </header>
            <SearchInput
              id="search-input"
              onInputChange={handleInputChange}
              onSubmit={searchSongs}
            />
            <section>
              <h2 className="text-2xl font-semibold mb-5">
                {isSearchedResult ? `Search Results` : "Hot Hits"}
              </h2>
              <SongList
                songs={isSearchedResult ? searchedSongs : popularSongs}
                isLoading={isLoading}
                onSongSelected={handleSongSelected}
              />
              {isSearchedResult && (
                <Pagenation
                  onPrev={hasPrev ? moveToPrev : null}
                  onNext={hasNext ? moveToNext : null}
                />
              )}
            </section>
          </main>
          {selectedSong && (
            <Player
              song={selectedSong}
              isPlaying={isPlaying}
              onButtonClick={toggleSong}
              isAudioReady={isAudioReady}
            />
          )}
          <audio
            ref={audioRef}
            onCanPlayThrough={handleAudioLoaded}
            onError={(e) => console.error("オーディオの読み込みエラー", e)}
          />
        </div>
      </body>
    </html>
  );
}
