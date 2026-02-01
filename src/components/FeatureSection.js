import '../styles/FeatureSection.css';
import FishingMain from '../assets/FishingMain.png';
import MoleMain from '../assets/MoleMain.jpg'
import FireMain from '../assets/FireMain.png';
import AnimalMain from '../assets/AnimalMain.png';
import '../styles/color.css';
function FeatureSection() {
  return (
    <section className="feature-section" id="feature">
      <h2 className="feature-title">심리치료 게임 소개</h2>
      <div className="feature-list">
        <div className="game-card">
          <img className="game-image" src={FireMain} alt="멍하니, 불처럼" />
          <h3 className="game-name">멍하니, 불처럼</h3>
          <p className="game-desc">
            불빛을 바라보다 보면, 마음도 조용해져요.<br />
            아무 생각 없이 쉬어가는 멍타임.
          </p>
        </div>
        <div className="game-card">
          <img className="game-image" src={MoleMain} alt="화풀고 가실게요" />
          <h3 className="game-name">화풀고 가실게요</h3>
          <p className="game-desc">
            쌓인 감정, 망치로 다독여보세요.<br />
            두더지를 톡톡 치며 스트레스를 날려보세요.
          </p>
        </div>

        <div className="game-card">
          <img className="game-image" src={FishingMain} alt="세월을 낚아라" />
          <h3 className="game-name">세월을 낚아라</h3>
          <p className="game-desc">
            고요한 물가에서 낚시하며 마음을 가라앉혀보세요.<br />
            평화로운 힐링의 시간입니다.
          </p>
        </div>

        <div className="game-card">
          <img className="game-image" src={AnimalMain} alt="동물 키우기" />
          <h3 className="game-name">동물 키우기</h3>
          <p className="game-desc">
            작은 생명과의 교감 속에서<br />
            조용히 함께하는 따뜻한 하루를 만나보세요.
          </p>
        </div>

      </div>
    </section>
  );
}

export default FeatureSection;
