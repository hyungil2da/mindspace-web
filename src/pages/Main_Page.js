import React from 'react'
import Header from '../components/Header'
import HeroSection from '../components/HeroSection'
import VideoSection from '../components/VideoSection'
import FeatureSection from '../components/FeatureSection'
import TeamSection from '../components/TeamSection'
import '../styles/Main_Page.css'
import FaqSection from '../components/FaqSection'
import NewsSection from '../components/NewsSection'
import ScrollToTop from '../components/ScrollToTop'
import SystemFlow from '../components/SystemFlow'

const MainPage = () => {
  return (
      <div className="main-page">
     <Header/>
     <HeroSection/>
     <VideoSection/>
     <SystemFlow />
     <FeatureSection/>
     <FaqSection />
     <NewsSection />
     <TeamSection />
     <ScrollToTop />
      </div>
  )
}

export default MainPage