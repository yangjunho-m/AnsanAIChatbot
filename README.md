# 안산대학교 AI 챗봇


## Problem

학교 홈페이지는 정보가 여러 페이지에 분산되어 있어  
학생들이 원하는 정보를 찾기 어렵다는 문제가 있었습니다.

이를 해결하기 위해 간단한 질문만으로 학사 정보, 셔틀버스, 학교 안내 등을   
확인할 수 있는 AI 챗봇 시스템을 개발하였습니다.


## Overview

**Live Service (현재)**
https://infognu.ansan.ac.kr/

**Initial Deployment (졸업작품 버전)**  
https://infognu.ansan.ac.kr/~i2251014/yang/

안산대학교 AI 챗봇은 '안이'와 '산이'라는 두 마스코트를 활용하여 차별화된 이중 응답 로직을 구현하였고 <br>
학교 공모전에서 우수상을 수상하였으며 실제 컴퓨터공학부 실습 서버에 배포하여 사용되고 있습니다.<br><br>
<img src="https://github.com/user-attachments/assets/efc15160-d224-4202-88b7-c1f708c7c50c" width="50%" /><br><br>

정적인 데이터 (셔틀버스, 학사일정 등의 정형 질문)은 키워드 및 규칙 기반으로 빠르게 '안이'가 답변하며,  <br>
비정적인 데이터 (데이터에 없는 비정형 질문)은 Gemini API 기반의 AI가 처리하여 정확하고 유연한 답변을 '산이'가 제공합니다.<br>
이를 통해 사용자는 AI 답변인지 아닌지 구분할 수 있고 간편한 질문만으로 학교 정보를 쉽게 얻을 수 있습니다.<br><br>

<img width="326" height="501" alt="image" src="https://github.com/user-attachments/assets/8e7e42f0-7541-4118-a3c2-be4b306db42d" />
<img width="346" height="501" alt="image" src="https://github.com/user-attachments/assets/7092d2fe-43ef-45bc-a3e4-0f7398e72507" /> <br>

<img width="500" height="370" alt="image" src="https://github.com/user-attachments/assets/a183700c-17b7-48ba-8138-123b7094cfa4" /><br><br><br>


## 팀 구성 및 역할
개발기간: 25.11.06 ~ 25.11.23 <br><br>
양준호 | PM & Lead <br>
 - AI 추론 파이프라인 단독 설계, Node.js 백엔드 서버 구축 및 배포/운영 총괄, 최종 기술 발표 <br>

민태민 | Data Specialist <br>
 - AI 응답 정확도 향상을 위한 데이터 키워드 추출 및 삽입 <br>

강영교 | Creative Designer <br>
 -  프론트엔드 UI 구현 및 시연 영상 제작, 기획 발표 보조 <br>

황순호 | Support <br>
 - 서비스 소개 PPT 제작, 프로젝트 초기 리서치 및 기술 스택 조사 <br>

## Key Features

- **Dual Response System**
  - 규칙 기반 응답(안이) + AI 기반 응답(산이)

- **Keyword Matching Engine**
  - 셔틀버스, 학사일정 등 정형 질문 빠른 응답

- **AI Fallback System**
  - 데이터에 없는 질문은 Gemini API를 통해 처리

- **AI Response Identification**
  - 사용자가 AI 응답 여부를 구분할 수 있도록 표시


## Technical Decision

초기에는 자체 AI 모델을 학습시키는 방식으로 개발하려 했으나  
모델 학습 및 운영 비용 문제로 인해 Gemini API 기반 구조로 전환하였습니다.

또한 학교 실습 서버는 정적 파일만 업로드 가능한 환경이었기 때문에  
초기에는 정적 웹 기반으로 개발하여 API 키가 노출되고 있었습니다.

이후 실제 학생들이 사용할 수 있도록 하기 위해  
수상 이후 Node.js 기반 백엔드를 추가 구현하여 API 키 노출 문제를 해결하였습니다.

또한 백엔드를 통해 Gemini API 연동 구조를 개선하였으며  
현재 안산대학교 컴퓨터공학부 실습 서버에 배포되어 운영되고 있습니다.

