import '../styles/VideoSection.css';

function VideoSection() {
  return (
    <section className="video-section" id="video">
      <h2 className="video-title">시연 영상</h2>
      <div className="video-container">
        <div className="video-box">
          <img src="https://i.pinimg.com/originals/88/14/9b/88149b0400750578f4d07d9bc3fb0fee.gif" title='시현영상1'/>
        </div>

        <div className="video-box">
          <img src="https://i.pinimg.com/originals/88/14/9b/88149b0400750578f4d07d9bc3fb0fee.gif" title='시현영상2'/>
        </div>
      </div>
    </section>
  );
}

export default VideoSection;
