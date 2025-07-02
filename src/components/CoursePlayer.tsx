
import React, { useState, useEffect } from 'react';
import { Play, Pause, Volume2, Maximize } from 'lucide-react';

interface CoursePlayerProps {
  videoUrl: string;
  onTimeUpdate: (time: number) => void;
  onDurationChange: (duration: number) => void;
  onPlayStateChange: (isPlaying: boolean) => void;
}

const CoursePlayer: React.FC<CoursePlayerProps> = ({
  videoUrl,
  onTimeUpdate,
  onDurationChange,
  onPlayStateChange
}) => {
  return (
    <div className="bg-black relative">
      <div className="aspect-video relative">
        <video
          className="w-full h-full"
          src={videoUrl}
          poster="/placeholder.svg"
          onTimeUpdate={(e) => onTimeUpdate(e.currentTarget.currentTime)}
          onLoadedMetadata={(e) => onDurationChange(e.currentTarget.duration)}
          onPlay={() => onPlayStateChange(true)}
          onPause={() => onPlayStateChange(false)}
          controls
        />
      </div>
    </div>
  );
};

export default CoursePlayer;
