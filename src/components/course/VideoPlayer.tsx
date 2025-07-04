
import React, { useState } from 'react';
import { Play, Pause } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface VideoPlayerProps {
  lesson: {
    id: string;
    title: string;
    duration: string | null;
    video_url: string | null;
  };
  onComplete: () => void;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({ lesson, onComplete }) => {
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  return (
    <Card>
      <CardContent className="p-0">
        <div className="aspect-video bg-black rounded-lg overflow-hidden relative">
          {lesson.video_url ? (
            <video
              className="w-full h-full"
              controls
              onEnded={onComplete}
              poster="/placeholder.svg"
            >
              <source src={lesson.video_url} type="video/mp4" />
              Seu navegador não suporta o elemento de vídeo.
            </video>
          ) : (
            <>
              {/* Simulação de player de vídeo para demonstração */}
              <div className="w-full h-full flex items-center justify-center">
                <div className="text-center text-white">
                  <div className="w-20 h-20 bg-white bg-opacity-20 rounded-full flex items-center justify-center mb-4 mx-auto">
                    {isPlaying ? (
                      <Pause className="w-8 h-8" />
                    ) : (
                      <Play className="w-8 h-8" />
                    )}
                  </div>
                  <p className="text-lg font-medium">{lesson.title}</p>
                  <p className="text-sm opacity-75">{lesson.duration}</p>
                </div>
              </div>
              
              {/* Controles do player */}
              <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-75 p-4">
                <div className="flex items-center space-x-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handlePlayPause}
                    className="text-white hover:bg-white hover:bg-opacity-20"
                  >
                    {isPlaying ? (
                      <Pause className="w-5 h-5" />
                    ) : (
                      <Play className="w-5 h-5" />
                    )}
                  </Button>
                  <div className="flex-1 bg-gray-600 h-1 rounded">
                    <div className="bg-blue-600 h-1 rounded w-1/3"></div>
                  </div>
                  <span className="text-white text-sm">{lesson.duration}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onComplete}
                    className="text-white hover:bg-white hover:bg-opacity-20"
                  >
                    Concluir
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
