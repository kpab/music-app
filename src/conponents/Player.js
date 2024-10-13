import {
  faPauseCircle,
  faPlayCircle,
  faSpinner,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export function Player({ song, isPlaying, onButtonClick, isAudioReady }) {
  return (
    <footer className="fixed bottom-0 w-full bg-gray-800 p-5">
      <div className="grid grid-cols-3">
        <div className="flex items-center">
          <img
            src={song.album.images[0].url}
            alt={song.name}
            className="rounded-full mr-3 h-[50px] w-[50px]"
          />
          <div>
            <p className="text-sm font-semibold">{song.name}</p>
            <p className="text-xs text-gray-400">{song.artists[0].name}</p>
          </div>
        </div>
        <div className="flex items-center justify-center">
          {isAudioReady ? (
            <FontAwesomeIcon
              onClick={onButtonClick}
              icon={isPlaying ? faPauseCircle : faPlayCircle}
              className={`text-white text-3xl mx-2 h-[40px] w-[40px] ${
                song.preview_url ? "cursor-pointer" : "pointer-events-none"
              }`}
            />
          ) : (
            <FontAwesomeIcon
              icon={faSpinner}
              spin
              className={`text-white text-3xl mx-2 h-[40px] w-[40px]`}
            />
          )}
        </div>
      </div>
    </footer>
  );
}
