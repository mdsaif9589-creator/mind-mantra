import { useEffect, useRef } from 'react';
import { useAppStore } from '../../store/useAppStore';
import YouTube, { YouTubeProps, YouTubePlayer } from 'react-youtube';

export function AudioSystem() {
  const { audio, updateAudio } = useAppStore();
  const playerRef = useRef<YouTubePlayer | null>(null);

  const onReady: YouTubeProps['onReady'] = (event) => {
    playerRef.current = event.target;
    
    // Set initial volume and mute state
    event.target.setVolume(audio.volume);
    if (audio.muted) {
      event.target.mute();
    } else {
      event.target.unMute();
    }

    updateAudio({ playerReady: true });
    
    // Process pending track
    if (audio.pendingTrack) {
      event.target.loadVideoById(audio.pendingTrack);
      updateAudio({ currentTrack: audio.pendingTrack, pendingTrack: null });
      if (audio.isPlaying) {
        event.target.playVideo();
      }
    }
  };

  const onStateChange: YouTubeProps['onStateChange'] = (event) => {
    // YT.PlayerState.PLAYING = 1
    // YT.PlayerState.PAUSED = 2
    // YT.PlayerState.ENDED = 0
    if (event.data === 1) {
      updateAudio({ isPlaying: true, hasError: false, errorMessage: null });
    } else if (event.data === 2) {
      updateAudio({ isPlaying: false });
    }
  };

  const onError: YouTubeProps['onError'] = (event) => {
    console.warn("YouTube Player Error:", event.data);
    updateAudio({ hasError: true, errorMessage: 'Unable to play this sound.', isPlaying: false });
  };

  // Sync volume & mute changes from store to player
  useEffect(() => {
    if (playerRef.current && audio.playerReady) {
      const currentVolume = playerRef.current.getVolume();
      if (currentVolume !== audio.volume) {
        playerRef.current.setVolume(audio.volume);
      }
      
      const isMuted = playerRef.current.isMuted();
      if (audio.muted && !isMuted) {
        playerRef.current.mute();
      } else if (!audio.muted && isMuted) {
        playerRef.current.unMute();
      }
    }
  }, [audio.volume, audio.muted, audio.playerReady]);

  // Sync play/pause from store to player
  useEffect(() => {
    if (playerRef.current && audio.playerReady && audio.currentTrack) {
      const playerState = playerRef.current.getPlayerState();
      // 1 = playing, 2 = paused
      if (audio.isPlaying && playerState !== 1) {
        playerRef.current.playVideo();
      } else if (!audio.isPlaying && playerState === 1) {
        playerRef.current.pauseVideo();
      }
    }
  }, [audio.isPlaying, audio.currentTrack, audio.playerReady]);

  const opts: YouTubeProps['opts'] = {
    height: '10',
    width: '10',
    playerVars: {
      autoplay: 0,
      controls: 0,
      disablekb: 1,
      fs: 0,
      rel: 0,
      playsinline: 1,
    },
  };

  return (
    <div style={{ position: 'absolute', opacity: 0, pointerEvents: 'none', width: '1px', height: '1px', overflow: 'hidden', zIndex: -999 }}>
      <YouTube 
        videoId={audio.currentTrack || audio.pendingTrack || 'lXGvNdV02aQ'}
        opts={opts} 
        onReady={onReady}
        onStateChange={onStateChange}
        onError={onError}
      />
    </div>
  );
}
