import '../styles/VideoSection.css';
import gifResearch from './gifResearch.gif';
import gifGameplay from './gifGameplay.gif';

function VideoSection() {
  return (
    <section className="video-section" id="video">
      <h2 className="video-title">시연 영상</h2>
      <div className="video-container">
        <div className="video-box">
          <img src={gifResearch} title='시현영상1' alt="시현영상1"/>
        </div>

        <div className="video-box">
          <img src={gifGameplay} title='시현영상2' alt="시현영상2"/>
        </div>
      </div>
    </section>
  );
}

export default VideoSection;
