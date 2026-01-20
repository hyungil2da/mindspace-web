# Mindspace 관리자 대시보드

Mindspace 웹 애플리케이션의 사용자 데이터와 서비스 현황을 관리하고 분석하기 위한 관리자용 대시보드입니다. 방문자 통계, 사용자 활동, 데이터 요약 등 핵심 지표를 시각적으로 모니터링할 수 있습니다.

## ✨ 주요 기능 (관리자)

*   **메인 대시보드 (`DashBoard.js`)**: 방문자 현황, 사용자 수, 일일 요약 등 핵심 정보를 종합적으로 보여주는 메인 화면입니다.
*   **방문자 및 사용자 통계 (`Visitor.js`, `UserTotal.js`)**: 일별/기간별 방문자 수와 전체 사용자 현황을 차트로 시각화하여 제공합니다.
*   **데이터 요약 및 분석 (`DailySummary.js`, `Statistics.js`)**: 사용자가 제출한 데이터에 대한 일일 요약 및 심층 통계 분석 기능을 제공합니다.
*   **사용자 관리 (`User.js`, `UserSpotlight.js`)**: 개별 사용자 정보를 조회하고 특정 사용자 활동을 추적할 수 있습니다.
*   **사이트 관리 (`Notice.js`, `Post.js`, `Ask.js`)**: 공지사항, 게시글, 사용자 문의를 관리하는 인터페이스를 제공합니다.

## 🛠️ 기술 스택

*   **Frontend**: React.js
*   **Styling**: CSS
*   **Package Manager**: npm

## 🚀 시작하기

### 요구사항

*   Node.js (v14 이상 권장)
*   npm

### 설치 및 실행

1.  **저장소 복제**
    ```sh
    git clone <your-repository-url>
    cd mindspace/web
    ```

2.  **의존성 설치**
    ```sh
    npm install
    ```

3.  **개발 서버 실행**
    ```sh
    npm start
    ```
    브라우저에서 `http://localhost:3000` 주소로 접속하여 확인할 수 있습니다.

## 📁 프로젝트 구조 (관리자 페이지 중심)

```
src/
├── Menu/         # ⭐️ 관리자 대시보드의 핵심 기능이 모두 여기에 구현되어 있습니다.
│   ├── DashBoard.js      # 메인 대시보드
│   ├── Visitor.js        # 방문자 현황
│   ├── Statistics.js     # 통계 분석
│   ├── User.js           # 사용자 관리
│   ├── DailySummary.js   # 일일 요약
│   ├── Notice.js         # 공지사항 관리
│   └── ...               # 기타 관리자 기능 컴포넌트
│
├── components/   # 범용 UI 컴포넌트
├── pages/        # 메인 랜딩 페이지
└── ...
```

## 📄 라이선스

이 프로젝트는 [라이선스 이름] 라이선스에 따라 배포됩니다. 자세한 내용은 `LICENSE` 파일을 참조하세요.
