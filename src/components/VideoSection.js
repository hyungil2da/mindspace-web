import '../styles/VideoSection.css';
import '../styles/color.css';
import gifResearch from './gifResearch.gif';
import gifGameplay from './gifGameplay.gif';

function VideoSection() {
  return (
    <section className="video-section" id="video">
      <h2 className="video-title">시연 모습</h2>
      <div className="video-container">
        <div className="video-box">
          <img
            src={gifResearch}
            title="감정 검사"
            alt="감정 검사"
            className="video-gif"
          />
        </div>
        <div className="video-box">
          <img
            src={gifGameplay}
            title="게임 플레이 모습"
            alt="게임 플레이 모습"
            className="video-gif"
          />
        </div>
      </div>
    </section>
  );
}

export default VideoSection;
